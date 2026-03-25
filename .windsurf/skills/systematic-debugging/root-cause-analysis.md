# Root Cause Analysis

## Evidence Rules

- Prefer logs, payloads, code paths, and observed behavior over assumptions.
- Check route paths, API prefixes, DTO/shape mismatches, auth expectations, and media URL resolution.
- For multi-surface bugs, trace the data flow across frontend, backend, and stored data.

## Anti-Patterns

- Random speculative fixes
- Stopping at symptoms
- Assuming the latest edited file is always the root cause
