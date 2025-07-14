import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET_NAME ?? '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { filename, contentType } = req.body;

  try {
    if (!BUCKET_NAME) throw new Error('Missing GCS_BUCKET_NAME env var');
    if (!filename) throw new Error('filename required');

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(`uploads/${Date.now()}_${filename}`);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType || 'application/octet-stream',
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;

    res.status(200).json({ url, publicUrl });
  } catch (err) {
    console.error('get-upload-url error', err);
    res.status(500).json({ error: 'Failed to get signed URL' });
  }
}