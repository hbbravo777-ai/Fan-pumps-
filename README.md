# FanPump

FanPump is a creator-community and Solana creator-token streaming starter. This repository is an early development scaffold, not a production financial application.

## Current status
- Next.js web interface scaffold.
- API and database integration are planned separately; on-chain payment verification is not yet implemented.
- The 60-second preview and timed token pass are product requirements, not a live paywall yet.
- No real wallet transfers, token swaps, livestream delivery, age verification, identity verification, or admin console are enabled.

## Run locally
Use Node.js 20+. Run `npm install` and `npm run dev` from the repository root.

## Deploy a preview
Import this GitHub repository into Vercel. It will detect Next.js from the root `package.json`. Keep all secrets in Vercel Environment Variables, never in Git. Preview deployments should be used before production.

## Security
Never commit `.env` files, private keys, seed phrases, passwords, passcodes, RPC credentials, or user data. Wallets must remain non-custodial. Admin access must use MFA and audited recovery; no hidden backdoor.

## Production blockers
Before real users or money: implement authentication, age/identity and consent controls, moderation, secure media delivery, Solana transaction verification, replay protection, multisig treasury, legal review, smart-contract audit, application penetration test, monitoring, backups, incident response, and provider policy review. Adult content requires a web-only compliant distribution strategy; do not assume mobile app stores permit it.