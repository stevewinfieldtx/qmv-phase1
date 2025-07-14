import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY ?? '' });
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { promptContext } = req.body;
  if (!promptContext) return res.status(400).json({ error: 'promptContext required' });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative assistant that generates imaginative, vivid yet concise image prompts for AI image generation systems like Midjourney or Stable Diffusion.'
        },
        {
          role: 'user',
          content: `Based on the following song and media description, propose three distinct high-quality image prompts that would make sense as frames in a music video. Each prompt should be ~25 words.\n\n${JSON.stringify(promptContext, null, 2)}`
        }
      ],
      max_tokens: 300,
      temperature: 0.9,
    });

    const text = completion.data.choices?.[0]?.message?.content ?? '';
    const suggestions = text
      .split(/\n|\d+\. /)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 3);

    res.status(200).json({ suggestions });
  } catch (err) {
    console.error('ai-suggest error', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
}