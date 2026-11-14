# EXTREME PUMPS — Separate Non-Adult Android Edition

**Decision:** Android is a distinct, strictly non-adult product. The adult web experience is not included in the Android app.

## Product separation

The Android application is a native Expo / React Native app in apps/android. It must not embed the adult website, link to adult pages, show adult creator discovery, or expose adult upload, livestream, subscription or payment routes. Server-side API authorization and moderation must enforce the same separation; client-side hiding is insufficient.

Allowed initial categories include music, gaming, art, education, sports, lifestyle and general entertainment, provided the actual content is non-explicit and appropriately moderated.

## A. Wallets and payments

- Keep wallet connection and all token payments disabled in the first Android scaffold.
- Do not collect seed phrases or private keys.
- Any later Solana wallet connection must use a supported external-wallet signing flow; the app must never custody user keys.
- Use Devnet only during development.
- Verify transactions on the server against the configured cluster, successful/finalized status, expected sender, mint, recipient, amount, quote expiry and unique transaction signature.
- Add replay protection, idempotency, price/fee disclosure, failure handling, refund/support procedures and audit events.
- Before enabling token purchases or creator-token payments for digital content in the Play build, obtain a policy determination and implement Google Play Billing wherever required. A blockchain transfer is not assumed to be a substitute for Play Billing.
- Never use offline state or a client-reported wallet balance as proof of payment or entitlement.

## B. Offline capability

- Cache only public, non-sensitive creator profile summaries and user-selected metadata.
- Persist saved creator IDs locally with a versioned cache key.
- Show cached data as stale/offline and refresh on reconnect.
- Queue only idempotent, low-risk actions such as follow/save preferences; reconcile with server state after reconnect.
- Never cache seed phrases, private keys, payment credentials, private media, or long-lived session tokens in ordinary local storage.
- Paid streams, wallet signing, purchases, account changes and entitlement checks require a live authenticated server connection.
- Provide clear offline/error/retry states.

## C. Google Play readiness

- Keep the product genuinely non-adult throughout discovery, user-generated content, livestreams, creator profiles, notifications, search, deep links and external navigation.
- Implement effective UGC terms, ongoing moderation, in-app reporting, user blocking, takedown, appeals and creator enforcement.
- Complete privacy policy, Data safety form, target audience/content rating, account deletion, permissions justification and support contact.
- Minimize Android permissions; request media/microphone access only when a reviewed feature genuinely requires them.
- Configure signing, Play App Signing, versioning, Android App Bundle output and internal/closed test tracks.
- Complete policy review for wallet, blockchain and digital-content payments before enabling those features.
- Run automated tests and physical-device tests for supported Android versions, offline behavior, crash recovery and updates.

## Current implementation snapshot

The initial native app shell contains Discover, Saved, Wallet and Settings tabs. It displays demo non-adult creator cards and locally saves their IDs. Wallet and payment actions are disabled. It has no backend integration, account system, streaming, content upload, production moderation or signed release artifact yet.

## Release rule

Do not publish to Google Play until non-adult separation is enforced server-side, UGC safeguards and privacy disclosures are complete, payment policy is resolved, the signed AAB passes testing, and the Play Console review is complete.