# Module and Controller Rules

## Structure

- Backend source changes belong under `backend/src/`.
- Keep NestJS modules, controllers, and services clearly separated.
- Avoid introducing new architectural patterns unless the task truly requires it.

## API Rules

- Assume the backend uses a global `/api` prefix.
- If endpoint paths change, update affected frontend callers and admin pages together.
- Preserve current namespace conventions such as `chiang-rai` in both frontend and backend.
