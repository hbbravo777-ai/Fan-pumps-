# EXTREME PUMPS Android — Non-Adult Edition

This is a separate Android application scaffold for the strictly non-adult edition. Adult content, adult creator discovery, explicit uploads and adult-content links are not part of this app.

## Current scope

- Native Expo / React Native Android shell.
- Discover, Saved, Wallet and Settings tabs.
- Local persistence for the small demo creator-card list using AsyncStorage.
- Demo categories: music, gaming, art, education and other non-explicit creator content.
- Wallet and payment UI is deliberately disabled.
- No backend, authentication, live content, uploads, playback or real wallet connection is wired yet.

## Run locally

1. Install Node.js 20 or newer.
2. From this directory run npm install.
3. Run npm run typecheck.
4. Run npx expo start and open the project with Expo Go, or configure an Android development build.
5. For a Play-compatible release, configure EAS Build or a reproducible Gradle release pipeline and produce a signed Android App Bundle (AAB).

This scaffold has not yet been built, installed or tested on a physical Android device. No APK/AAB is included.

## Non-adult product boundary

The Android app must not surface pornography, sexually explicit content, adult creator profiles, adult livestreams, adult-content links or services whose primary purpose is sexual gratification. Enforce this in backend APIs and moderation, not only by hiding UI elements. Keep the web adult product technically and operationally separate.

## Offline behavior

Only non-sensitive demo creator-card IDs are persisted locally. Do not store private media, seed phrases, private keys, payment credentials or long-lived authentication tokens in this cache. Offline mode must never grant paid access or authorize a blockchain transaction.

## Wallet and payments

Wallet connection and token purchases are disabled in this scaffold. Before enabling any wallet or payment feature, complete a Google Play policy review for blockchain-based content payments and digital goods. Where Play Billing is required, implement it. Do not assume a Solana token transfer can replace Play Billing for digital content.

## Google Play release gates

- Confirm target audience, age rating and content rating.
- Publish privacy policy and accurate Data safety declarations.
- Implement account creation/deletion disclosures and in-app account deletion where applicable.
- Complete UGC moderation: report, block, takedown, appeals and timely review.
- Confirm all creators and content meet the non-adult policy.
- Implement secure authentication, API authorization, abuse prevention and privacy controls.
- Review Play Billing and blockchain/token policy before enabling monetized digital content.
- Produce signed AAB, configure Play App Signing and complete internal/closed testing.
- Test installation, updates, offline behavior, network loss and accessibility on real devices.

## Status

Development scaffold only. No production deployment, security audit, Play approval, live wallet, payment processing or device test is claimed.