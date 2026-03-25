# Auth and Validation

## Auth Rules

- Preserve existing auth flows for Faculty admin and Chiang Rai admin.
- Verify related auth endpoints under `/api/auth/*` when changing protected features.

## Validation Rules

- Respect existing validation and DTO patterns.
- Keep admin forms aligned with backend required fields, enums, and validation assumptions.
- Avoid silent contract drift between frontend payloads and backend DTOs.
