import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const port = Number(process.env.PORT ?? 4000);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000' }));
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'fanpump-api', mode: 'scaffold' }));

const quoteSchema = z.object({
  viewerId: z.string().min(1).max(128),
  streamId: z.string().min(1).max(128),
  passMinutes: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(30), z.literal(60)]),
});

app.post('/v1/streams/:streamId/quote', (req, res) => {
  const parsed = quoteSchema.safeParse({ ...req.body, streamId: req.params.streamId });
  if (!parsed.success) return res.status(400).json({ error: 'Invalid quote request' });
  // Placeholder only. A production quote must load creator-configured token price,
  // mint, recipient and fee policy from trusted storage and expire quickly.
  return res.status(501).json({
    error: 'PAYMENT_QUOTING_NOT_CONFIGURED',
    message: 'No payment quote or wallet transaction is created by this scaffold.',
    accessGranted: false,
  });
});

app.post('/v1/streams/:streamId/entitlements/verify', (_req, res) => {
  // Fail closed until a server-side Solana verifier checks finalized transactions,
  // token mint, amount, recipient, viewer binding and replay uniqueness.
  return res.status(501).json({ error: 'ONCHAIN_VERIFIER_NOT_CONFIGURED', accessGranted: false });
});

app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND' }));
app.listen(port, () => console.log(`FanPump API scaffold listening on ${port}`));
