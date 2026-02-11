
import subprocess
import json
import sys
import os

# Path to the executable
MCP_EXEC = r"C:\Users\devil\AppData\Local\Python\pythoncore-3.14-64\Scripts\notebooklm-mcp.exe"

def run_test():
    print(f"Testing MCP server at: {MCP_EXEC}")
    if not os.path.exists(MCP_EXEC):
        print("Error: Executable not found!")
        return

    # Start the process
    process = subprocess.Popen(
        [MCP_EXEC],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=sys.stderr,
        text=True,
        bufsize=0  # Unbuffered
    )

    try:
        # 1. Initialize
        init_req = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "test-client", "version": "1.0"}
            }
        }
        
        print("Sending initialize request...")
        json.dump(init_req, process.stdin)
        process.stdin.write("\n")
        process.stdin.flush()

        # Read response (blocking)
        print("Waiting for initialize response...")
        line = process.stdout.readline()
        if not line:
            print("Error: No response from server (EOF).")
            return
            
        print(f"Received: {line.strip()[:200]}...")
        
        # Check if error
        resp = json.loads(line)
        if "error" in resp:
            print(f"Error in initialize: {resp['error']}")
            return

        # 2. Sent initialized notification
        notify_inited = {
            "jsonrpc": "2.0",
            "method": "notifications/initialized",
            "params": {}
        }
        json.dump(notify_inited, process.stdin)
        process.stdin.write("\n")
        process.stdin.flush()

        # 3. List Resources
        list_req = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "resources/list",
            "params": {}
        }
        print("Sending resources/list request...")
        json.dump(list_req, process.stdin)
        process.stdin.write("\n")
        process.stdin.flush()

        # Read response
        print("Waiting for resources/list response...")
        line = process.stdout.readline()
        if not line:
            print("Error: No response for resources/list.")
            return

        print(f"Received Resources: {line.strip()[:500]}...")
        
        resources_resp = json.loads(line)
        if "result" in resources_resp and "resources" in resources_resp["result"]:
            resources = resources_resp["result"]["resources"]
            print(f"\nSUCCESS! Found {len(resources)} notebooks.")
            for r in resources:
                print(f"- {r.get('name', 'Unknown')} ({r.get('uri', 'No URI')})")
        else:
             print("No resources found or unexpected format.")

    except Exception as e:
        print(f"Exception: {e}")
    finally:
        process.terminate()

if __name__ == "__main__":
    run_test()
