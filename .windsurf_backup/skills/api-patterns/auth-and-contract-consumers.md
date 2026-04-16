# Auth and Contract Consumers

## Auth-Sensitive APIs

- Review `/api/auth/*` assumptions if login, callback, profile, or protected admin flows are involved.
- Keep token and authorization expectations aligned with existing admin consumers.

## Contract Consumers

- When changing a central API contract, inspect likely consumers in `frontend/` and update them together.
- For admin entities with public pages, verify both admin by-id flows and public slug/detail flows.
