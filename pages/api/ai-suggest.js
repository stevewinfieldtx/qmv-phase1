import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { promptContext } = req.body;
  if (!promptContext) return res.status(400).json({ error: 'promptContext required' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Given the following music video project details, propose three distinct, vivid and imaginative image prompts (each about 25 words) that would work as frames in the video.\nReturn each prompt on its own line.\n\n${JSON.stringify(promptContext, null, 2)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const suggestions = text
      .split(/\n|\d+\. /)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 3);

    res.status(200).json({ suggestions });
  } catch (err) {
    let message = 'Failed to generate suggestions';
    if (err instanceof Error) message = err.message;
    // Gemini error wrapper may have .code and .message
    if (typeof err === 'object' && err) {
      // @ts-ignore
      if (err.code) message = `${err.code}: ${err.message}`;
      // @ts-ignore
      if (err.status) message = `${err.status}: ${err.message}`;
    }
    console.error('ai-suggest error', err);
    res.status(500).json({ error: message });
  }
}