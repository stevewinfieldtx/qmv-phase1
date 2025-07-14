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

## Deploying to Railway

Railway’s Next.js template works out-of-the-box. After importing this repo:

1. Add the same environment variables in the Railway dashboard.
2. Attach Google Cloud credentials as a secret file or use a workload identity.
3. Deploy — Railway will build and host the app; the `/pages/api/*` routes run as serverless functions.

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
