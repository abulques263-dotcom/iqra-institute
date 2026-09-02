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
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({ error: 'AI service is not configured. Add GEMINI_API_KEY in Vercel Environment Variables and redeploy.' });
  }

  try {
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
- Return ONLY valid JSON with this shape: {"reply":"...","suggestions":["...","...","..."]}

Class: ${studentClass || 'Class 1 to 8'}
Subject: ${subject || 'General Studies'}
Recent conversation:
${recentHistory || '(none)'}
Current question:
${message.trim()}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    const data = await geminiResponse.json().catch(() => ({}));

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status, data);
      const message = data?.error?.message || 'Gemini API request failed.';
      return res.status(502).json({ error: message });
    }

    const raw = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('')
      .trim() || '';

    if (!raw) {
      console.error('Gemini returned no text:', JSON.stringify(data));
      return res.status(502).json({ error: 'AI returned an empty response. Please try again.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: raw, suggestions: [] };
    }

    const reply = typeof parsed.reply === 'string' && parsed.reply.trim()
      ? parsed.reply.trim()
      : raw;
    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter((s) => typeof s === 'string' && s.trim()).slice(0, 3)
      : [];

    return res.status(200).json({
      success: true,
      reply,
      suggestions,
      isAiGenerated: true
    });
  } catch (error) {
    console.error('Vercel AI chat error:', error);
    return res.status(500).json({ error: 'AI could not answer right now. Please try again.' });
  }
}
