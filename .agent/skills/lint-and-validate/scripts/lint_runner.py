#!/usr/bin/env python3
"""
Lint Runner - Unified linting and type checking
Runs appropriate linters based on project type.

Usage:
    python lint_runner.py <project_path>

Supports:
    - Node.js: npm run lint, npx tsc --noEmit
    - Python: ruff check, mypy
"""

import subprocess
import sys
import json
import platform
import shutil
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except:
    pass


def _add_node_linters(dir_path: Path, linters: list, prefix: str = ""):
    """Helper to detect Node.js linters in a given directory."""
    package_json = dir_path / "package.json"
    if not package_json.exists():
        return
    try:
        pkg = json.loads(package_json.read_text(encoding='utf-8'))
        scripts = pkg.get("scripts", {})
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        
        # Check for lint script
        if "lint" in scripts:
            linters.append({"name": f"{prefix}npm lint", "cmd": ["npm", "run", "lint"], "cwd": dir_path})
        elif "eslint" in deps:
            linters.append({"name": f"{prefix}eslint", "cmd": ["npx", "eslint", "."], "cwd": dir_path})
        
        # Check for TypeScript
        if "typescript" in deps or (dir_path / "tsconfig.json").exists():
            linters.append({"name": f"{prefix}tsc", "cmd": ["npx", "tsc", "--noEmit"], "cwd": dir_path})
    except Exception:
        pass


def detect_project_type(project_path: Path) -> dict:
    """Detect project type and available linters."""
    result = {
        "type": "unknown",
        "linters": []
    }
    
    # Direct Node.js project
    package_json = project_path / "package.json"
    if package_json.exists():
        result["type"] = "node"
        _add_node_linters(project_path, result["linters"], prefix="")
    else:
        # Check common subdirectories for monorepo / multi-app (e.g., frontend, backend)
        try:
            subdirs = [
                d for d in project_path.iterdir()
                if d.is_dir() and not d.name.startswith(('.', 'node_modules', 'dist'))
            ]
            node_subdirs = [d for d in subdirs if (d / "package.json").exists()]
            if node_subdirs:
                result["type"] = "node (monorepo)"
                for subdir in node_subdirs:
                    _add_node_linters(subdir, result["linters"], prefix=f"{subdir.name}: ")
        except Exception:
            pass
    
    # Python project
    if (project_path / "pyproject.toml").exists() or (project_path / "requirements.txt").exists():
        if result["type"] == "unknown":
            result["type"] = "python"
        
        # Check for ruff
        result["linters"].append({"name": "ruff", "cmd": ["ruff", "check", "."], "cwd": project_path})
        
        # Check for mypy
        if (project_path / "mypy.ini").exists() or (project_path / "pyproject.toml").exists():
            result["linters"].append({"name": "mypy", "cmd": ["mypy", "."], "cwd": project_path})
    
    return result


def run_linter(linter: dict, cwd: Path) -> dict:
    """Run a single linter and return results."""
    result = {
        "name": linter["name"],
        "passed": False,
        "output": "",
        "error": ""
    }
    
    try:
        cmd = list(linter["cmd"])
        run_cwd = linter.get("cwd", cwd)
        
        # Windows compatibility for npm/npx
        if platform.system() == "Windows":
            if cmd[0] in ["npm", "npx"]:
                # Force .cmd extension on Windows
                if not cmd[0].lower().endswith(".cmd"):
                    cmd[0] = f"{cmd[0]}.cmd"
        
        proc = subprocess.run(
            cmd,
            cwd=str(run_cwd),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=120,
            shell=platform.system() == "Windows" # Shell=True often helps with path resolution on Windows
        )
        
        result["output"] = proc.stdout[:2000] if proc.stdout else ""
        result["error"] = proc.stderr[:500] if proc.stderr else ""
        result["passed"] = proc.returncode == 0
        
    except FileNotFoundError:
        result["error"] = f"Command not found: {linter['cmd'][0]}"
    except subprocess.TimeoutExpired:
        result["error"] = "Timeout after 120s"
    except Exception as e:
        result["error"] = str(e)
    
    return result


def main():
    project_path = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    
    print(f"\n{'='*60}")
    print(f"[LINT RUNNER] Unified Linting")
    print(f"{'='*60}")
    print(f"Project: {project_path}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Detect project type
    project_info = detect_project_type(project_path)
    print(f"Type: {project_info['type']}")
    print(f"Linters: {len(project_info['linters'])}")
    print("-"*60)
    
    if not project_info["linters"]:
        print("No linters found for this project type.")
        output = {
            "script": "lint_runner",
            "project": str(project_path),
            "type": project_info["type"],
            "checks": [],
            "passed": True,
            "message": "No linters configured"
        }
        print(json.dumps(output, indent=2))
        sys.exit(0)
    
    # Run each linter
    results = []
    all_passed = True
    
    for linter in project_info["linters"]:
        print(f"\nRunning: {linter['name']}...")
        result = run_linter(linter, project_path)
        results.append(result)
        
        if result["passed"]:
            print(f"  [PASS] {linter['name']}")
        else:
            print(f"  [FAIL] {linter['name']}")
            if result["error"]:
                print(f"  Error: {result['error'][:200]}")
            all_passed = False
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    for r in results:
        icon = "[PASS]" if r["passed"] else "[FAIL]"
        print(f"{icon} {r['name']}")
    
    output = {
        "script": "lint_runner",
        "project": str(project_path),
        "type": project_info["type"],
        "checks": results,
        "passed": all_passed
    }
    
    print("\n" + json.dumps(output, indent=2))
    
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
