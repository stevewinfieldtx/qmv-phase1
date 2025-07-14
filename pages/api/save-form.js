import { Storage } from '@google-cloud/storage';

// Ensure the service account key values are configured in the environment or
// GOOGLE_APPLICATION_CREDENTIALS file path is set.
const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET_NAME ?? '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const payload = req.body;
  const timestamp = new Date().toISOString();
  const filename = `music-video-${timestamp}.json`;

  try {
    if (!BUCKET_NAME) throw new Error('Missing GCS_BUCKET_NAME env var');

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(filename);
    await file.save(JSON.stringify(payload, null, 2), {
      resumable: false,
      contentType: 'application/json',
    });

    return res.status(200).json({ message: 'Saved' });
  } catch (err) {
    console.error('save-form error', err);
    return res.status(500).json({ error: 'Failed to save form data' });
  }
}