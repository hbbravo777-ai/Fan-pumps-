# FanPump API scaffold

Install dependencies with `npm install` in this directory, then run `npm run dev`.

`GET /health` reports service availability. Payment quote and entitlement verification routes deliberately return HTTP 501 and `accessGranted: false` until a real server-side Solana transaction verifier and trusted quote service are implemented. Do not treat this scaffold as a payment processor or use it to grant livestream access.