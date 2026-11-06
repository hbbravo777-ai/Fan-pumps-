# FanPump launch roadmap — target 1 January 2027

This roadmap is for a limited, public, online MVP and Android sideload beta. It is not a claim that the product is currently production-ready. Dates are targets, not guarantees.

## Current repository assessment (6 November 2026)

The repository currently contains a Next.js 15 / React 19 web scaffold and a small Express API scaffold. The API has a health route, but stream quote and entitlement verification are disabled (501). The README and API status document explicitly identify authentication, database persistence, wallet verification, media delivery, moderation, age assurance and observability as not implemented. There is no Android project or APK build pipeline visible in the repository root.

## Launch scope: what must work on day one

### P0 — required for a usable public beta
- Responsive web app, HTTPS, custom domain, installable PWA experience, clear navigation and onboarding.
- Account registration, email verification, login/logout, password reset, session expiry/revocation, MFA for administrators.
- PostgreSQL persistence and migrations; backups and tested restore procedure.
- User profiles, creator profiles, creator onboarding, creator identity/age/consent verification appropriate to content and jurisdiction.
- Content creation, upload, processing, feed/profile display, deletion and access controls.
- Private object storage; signed, short-lived media URLs; CDN authorization; no public bucket for paid content.
- Livestream provider integration, stream creation/scheduling, health monitoring, viewer authorization and reconnect behavior.
- Admin/moderator console: user reports, block/ban, takedown, appeals, creator verification, audit history and emergency controls.
- Terms, privacy notice, community/content rules, copyright process, support contact, data deletion/export process and incident response contact.
- Rate limits, input validation, CSRF/CORS protections as applicable, secure headers, dependency scanning, error monitoring and audit logs.
- End-to-end tests on real Android devices and desktop/mobile browsers; accessibility and performance checks.

### P1 — required if creator-token viewing passes are part of the January launch
- Solana wallet connection using a supported wallet adapter; users sign transactions in their own wallet. Never collect seed phrases or private keys.
- Devnet end-to-end implementation first, then mainnet only after legal review and independent security review.
- Creator token registry and verified mint metadata; quote calculation; clear amount, token mint, recipient, fees, price impact and expiry shown before signing.
- Server-side transaction verifier checks the correct cluster, successful/finalized transaction, wallet, stream, creator mint, destination, exact amount, transaction age and replay uniqueness.
- Server-authoritative 60-second preview and timed viewing entitlement; no client-side timer or claimed wallet balance may unlock a stream.
- Entitlements tied to account and stream; reconnects do not reset preview; purchased pass terms cannot be changed retroactively.
- Payment failure, duplicate transaction, expired quote, insufficient token, refund/dispute and support workflows.
- Treasury controls: multisig, spending limits, monitoring, emergency pause and documented reconciliation. No private key in GitHub or app code.
- Disclose fees and token risks; no promises of token appreciation, earnings or liquidity.

### P2 — defer unless P0/P1 are complete and tested
- Open creator-token trading and swaps, official platform token launch, advanced discovery/recommendations, complex creator analytics, native push notifications, referral rewards and multi-chain support.
- Do not launch a custom exchange/AMM as part of this deadline. Use a reputable supported route only after legal and security review.

## Android distribution decision

- Fastest route: launch the responsive web app first, then produce a signed Android APK for direct download and controlled beta testing. Host the APK on the official HTTPS domain, publish checksums and version notes, and document Android's install-from-this-source prompt.
- Keep the signing keystore and passwords offline/in a secure secrets manager; back them up securely. Never commit them.
- If submitting to Google Play, prepare an Android App Bundle (AAB), Play App Signing, store listing, privacy/data-safety declarations, content rating, test track and policy review. New Play submissions must target Android 16 / API 36 or higher as of 31 August 2026.
- Important: Google Play does not allow apps that contain/promote pornography or sexually gratifying content. A creator platform whose main purpose is explicit adult UGC is not a suitable Play Store release. If a Play listing is desired, it needs a genuinely compliant non-adult product and moderation model; do not hide adult functionality behind a webview or link.
- Direct APK distribution avoids Play review, but does not remove local law, hosting, payment-provider, privacy, age-verification, content-safety or security obligations.

## Hosting and services to select

- Web: managed Next.js hosting with production and preview environments, custom domain, TLS and WAF.
- API: managed Node hosting with health checks, autoscaling appropriate to beta load and private network access to data services.
- Data: managed PostgreSQL with automated backups and point-in-time recovery; Redis only where needed.
- Media: private object storage plus video transcoding/streaming/CDN provider that explicitly accepts the planned content category and regions.
- Identity: established authentication provider or carefully implemented server-side auth; email delivery and abuse prevention.
- Solana: reputable RPC provider with Devnet and Mainnet endpoints, monitoring and rate limits.
- Operations: error tracking, uptime alerts, centralized logs, secret manager, backups, restore drill and on-call owner.
- Before choosing any vendor, obtain written confirmation that its acceptable-use policy permits the intended creator content and monetization model.

## Week-by-week execution plan

### 6–12 November — scope and foundations
- Freeze MVP scope; decide adult-content distribution strategy and launch countries.
- Confirm legal entity/operator, product domain, support email, age/identity verification vendor, content-hosting vendor and payment/RPC providers.
- Add environment separation (local, staging, production), CI build/typecheck/test workflow, database migrations and secure deployment configuration.
- Define database schema and API contracts for accounts, creators, posts/media, streams, reports, entitlements, wallets, transactions and audit events.

### 13–19 November — accounts and data
- Implement registration, email verification, login/logout, password reset, session revocation and account deletion.
- Connect PostgreSQL; migrations, validation, authorization and audit logs.
- Build profile/creator onboarding and basic admin roles.

### 20–26 November — creator content
- Implement creator profiles, content upload, media processing, feed and creator pages.
- Private storage and signed playback/download URLs.
- Add reports, block/mute, moderation queue, takedown and content rules.

### 27 November–3 December — live video and Android path
- Integrate a compliant livestream provider; create/schedule/start/end streams.
- Implement server-controlled preview and viewer session state.
- Choose Android delivery architecture; build first signed internal APK and test installation/update on physical devices.

### 4–10 December — Solana Devnet payments
- Integrate wallet connect and transaction signing.
- Implement Devnet token pass purchase and server-side transaction verification.
- Implement replay protection, timed entitlement issuance, expiry and reconnect tests. No mainnet funds.

### 11–17 December — admin, security and policies
- Finish moderation/admin tools, MFA, audit logs, emergency pause and support workflows.
- Complete privacy, terms, community guidelines, copyright/takedown and age/consent workflows.
- Confirm hosting, streaming and payment vendors accept the intended content and countries.
- Run dependency/security scans and threat-model review.

### 18–24 December — release candidate
- Full regression and end-to-end tests; load test expected beta traffic.
- Test Android APK on multiple devices and Android versions; test weak networks, upload failures, stream reconnects and account recovery.
- Verify backups and restore; test monitoring, alerts, incident response and rollback.
- If legal/security approval is not complete, keep token payments on Devnet and label them clearly as test-only.

### 25–31 December — controlled beta
- Freeze features; fix release-blocking defects only.
- Invite a small cohort; monitor crashes, moderation queue, abuse, stream reliability and support requests.
- Publish signed APK, checksum, version notes and installation instructions only after release checks pass.
- Roll back or pause if payment, content-safety, privacy or security controls fail.

### 1 January 2027 — target
- Open the approved beta scope to users. Expand gradually only after stability and safety metrics are acceptable.

## Release acceptance checklist

- [ ] Production web URL works over HTTPS.
- [ ] New users can register, verify email, sign in, recover accounts and delete accounts.
- [ ] Creator can complete verification/onboarding and publish content.
- [ ] Upload, processing, private playback and takedown work end to end.
- [ ] Livestream creation, preview, authorization and reconnect work under test.
- [ ] Reports, blocks, moderation and admin audit trails work.
- [ ] Database backups and a restore test are complete.
- [ ] Monitoring, alerts, rate limits, WAF and incident response are active.
- [ ] Android APK is release-signed, installable, updateable and tested on real devices.
- [ ] Solana Devnet payment path passes negative, replay, expiry and duplicate-payment tests.
- [ ] Mainnet payments are disabled unless legal approval, provider approval, security review and any required smart-contract audit are complete.
- [ ] Privacy, terms, content rules, age/consent, copyright and support processes are published.
- [ ] No secrets or personal data are committed to this public repository.

## Decisions the owner must supply

1. Countries where the first beta will be available.
2. Whether explicit adult content is included at launch. If yes, confirm web-only/direct APK distribution and obtain vendor/legal approval; Google Play is not an option for an adult-first app.
3. Whether January 1 means a public web + direct APK beta, or a Google Play listing as well.
4. Who will own the domain, hosting, streaming, database, RPC and identity-provider accounts and pay their usage bills.
5. The creator platform fee schedule and exact token-pass pricing rules to display to users.

## Honest status

This repository is a starter scaffold, not a deployable finished product. A focused web + APK beta by 1 January is an aggressive but potentially achievable target with immediate scope decisions, active implementation, paid/approved vendors where needed, and prompt legal/security review. A fully audited, globally available adult creator-token marketplace with all advanced trading features is not a responsible promise for this date.
