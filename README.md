# Music Video Webapp

This is a minimal proof-of-concept Next.js application that guides a customer through three steps:

1. Landing page with info, example images/videos, and a **Start** button.
2. Secure Stripe Checkout for payment.
3. A two-step form to collect song details and media preferences, finally persisting all data as JSON in Google Cloud Storage (GCS).

## Local development

```bash
# install deps
npm install

# copy env template and fill in secrets
cp .env.example .env.local

# run dev server
npm run dev
```

Environment variables required:

- `STRIPE_SECRET_KEY` – your Stripe secret key.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – your Stripe publishable key.
- `GCS_BUCKET_NAME` – the name of the bucket to store submitted JSON payloads.
- `GOOGLE_APPLICATION_CREDENTIALS` – path to a Google Service Account credentials JSON with write access to the bucket.
- `GEMINI_API_KEY` – API key for Gemini 1.5 Pro (Google Generative AI).

## Deployment to Railway

1. **Create a new Railway project** and link this repository.
2. **Add Environment Variables** in the Railway dashboard (Settings → Variables):
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `GCS_BUCKET_NAME`
   - `GOOGLE_APPLICATION_CREDENTIALS` (service-account JSON as a secret file)
   - `GEMINI_API_KEY`
3. **Enable Google Cloud credentials**:
   - Upload your service-account JSON as a *secret file* and reference its path in `GOOGLE_APPLICATION_CREDENTIALS`.
4. **Trigger a deploy**. Railway detects the Next.js app, runs `npm install && npm run build`, and serves it via its CDN.
5. **Add your custom domain** (optional) under the Domains tab. Railway provisions TLS automatically.
6. **Production Stripe webhook** (if you add webhooks later): expose a Railway HTTP route like `/api/stripe-webhook` and add that URL in the Stripe dashboard.

### Local development with Railway CLI
```bash
railway run npm run dev
```
This command injects the same env vars locally, mirroring production.

## File structure overview

```
pages/
  ├─ index.js                 Landing page
  ├─ form.js                  Multi-step info form (after payment)
  ├─ thank-you.js             Confirmation page
  └─ api/
      ├─ create-checkout-session.js  → Creates Stripe Checkout session
      └─ save-form.js                → Saves final JSON to GCS
```

Feel free to customise styles, copy, and add functionality (e.g. actual file uploads, AI prompt generation) as you iterate.
