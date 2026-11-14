# EXTREME PUMPS Android non-adult beta

## Integration status
The Android client now contains Supabase email/password sign-in and registration, SecureStore-backed auth sessions, a live stream catalog, and signed Mux HLS playback. This is an integration scaffold, **not a provisioned production service**. It requires your own Supabase and Mux projects and secrets. It currently supports authenticated playback, not broadcasting from the phone camera.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/migrations/202611140001_initial.sql` in SQL Editor.
3. Enable email/password auth and email confirmation.
4. Deploy `supabase/functions/get-live-playback`.
5. Configure function secrets `SUPABASE_SERVICE_ROLE_KEY`, `MUX_SIGNING_KEY_ID`, `MUX_SIGNING_KEY_PRIVATE_KEY`. Supabase supplies its URL and anon key. Keep all service and signing keys server-side.

## Android build configuration
Add GitHub Actions repository variables `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. These are public client config values; RLS is the security boundary. Never place service-role credentials or Mux private keys in the app. Run the Android APK workflow and download its artifact ZIP after a successful run.

## Mux live stream connection
Create live streams in Mux using a trusted server-side creator provisioning process. Store the Mux live-stream ID and playback ID in `public.live_streams` from an admin/server process only; set status to live when broadcasting begins. Creators can send RTMP from OBS. Configure signed playback and webhook signature verification to update stream status. The app requests a five-minute playback JWT from the Edge Function. Never expose ingest stream keys or signing private keys to clients.

## Security controls
Supabase Auth; device SecureStore; Postgres RLS; least-privilege stream column grants; no client writes to stream rows; server-side playback signing; short-lived tokens; no-store responses; no secrets committed to Git.

## Still required before production
Provision services and secrets; implement creator/admin provisioning and signed webhook handling; moderation, report/block, rate limits, audit logs, abuse detection, privacy/export/deletion, backups and monitoring; native camera broadcaster if needed; video uploads/VOD and scanning; age/consent controls; penetration test and legal review; Play signing, privacy disclosures and store review. Keep this Android app strictly non-adult.