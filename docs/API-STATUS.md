# API status

The Express API scaffold is under `apps/api`.

- `GET /health`: implemented as a basic process health response.
- `POST /v1/streams/:streamId/quote`: request validation exists; quote generation is intentionally disabled (501).
- `POST /v1/streams/:streamId/entitlements/verify`: intentionally disabled (501); it must fail closed.

Not implemented: authentication, PostgreSQL persistence, Redis, rate limiting, creator pricing, wallet signature validation, Solana RPC verification, transaction finality/replay protection, entitlement issuance, CDN playback authorization, moderation, age assurance, and production observability.