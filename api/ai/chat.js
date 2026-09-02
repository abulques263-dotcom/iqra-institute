import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history, studentClass, subject } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service is not configured.' });
  }

  try {
    const gemini = new GoogleGenAI({ apiKey });
    const recentHistory = Array.isArray(history)
      ? history.slice(-10).map((item) => {
          const role = item?.role === 'user' ? 'Student' : 'Tutor';
          const content = typeof item?.content === 'string' ? item.content.slice(0, 4000) : '';
          return content ? `${role}: ${content}` : '';
        }).filter(Boolean).join('\n')
      : '';

    const prompt = `You are Iqra AI Study Assistant, a patient school tutor for children from Nursery/Class 1 through Class 8 in India.

Actually understand and answer the child's question. Do not merely repeat it or ask them to choose a subject.
- Answer directly and correctly.
- Handle Maths, Science, English, Hindi, GK, Reasoning, Computer basics and normal school-study questions.
- Solve arithmetic and word problems step by step and check calculations.
- Use recent conversation for follow-up questions.
- Match language: English -> simple English; Hindi -> Hindi; Hinglish -> natural Hinglish.
- Adapt difficulty to the child's class.
- If ambiguous, make the most reasonable school-level interpretation and state the assumption briefly.
- Never invent facts; state uncertainty when needed.
- Keep it child-safe and educational.
- Give a concise explanation, example/steps when useful, and one short practice/check question.
- Return ONLY valid JSON: {"reply":"...","suggestions":["...","...","..."]}

Class: ${studentClass || 'Class 1 to 8'}
Subject: ${subject || 'General Studies'}
Recent conversation:
${recentHistory || '(none)'}
Current question:
${message.trim()}`;

    const response = await gemini.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const raw = response.text?.trim() || '';
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { reply: raw, suggestions: [] }; }

    const reply = typeof parsed.reply === 'string' && parsed.reply.trim()
      ? parsed.reply.trim()
      : 'I could not prepare an answer right now. Please ask again.';
    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter((s) => typeof s === 'string' && s.trim()).slice(0, 3)
      : [];

    return res.status(200).json({ success: true, reply, suggestions, isAiGenerated: true });
  } catch (error) {
    console.error('Vercel AI chat error:', error);
    return res.status(500).json({ error: 'AI could not answer right now. Please try again.' });
  }
}
