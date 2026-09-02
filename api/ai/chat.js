const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

export default async function handler(req, res) {
  // GitHub Pages frontend calls this Vercel function cross-origin.
  const allowedOrigin = 'https://abulques263-dotcom.github.io';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history, studentClass, subject } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'Gemini API key is missing. Add GEMINI_API_KEY to Vercel Environment Variables and redeploy.'
    });
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

    let lastError = null;

    for (const model of MODELS) {
      for (const useJsonMode of [true, false]) {
        try {
          const body = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: useJsonMode
              ? { responseMimeType: 'application/json', temperature: 0.2 }
              : { temperature: 0.2 }
          };

          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            }
          );

          const data = await geminiResponse.json().catch(() => ({}));

          if (!geminiResponse.ok) {
            lastError = data?.error?.message || `Gemini request failed (${geminiResponse.status})`;
            console.error('Gemini API error:', geminiResponse.status, lastError, { model, useJsonMode });
            continue;
          }

          const raw = data?.candidates?.[0]?.content?.parts
            ?.map((part) => part?.text || '')
            .join('')
            .trim() || '';

          if (!raw) {
            lastError = 'Gemini returned an empty response.';
            console.error('Gemini returned no text:', JSON.stringify(data));
            continue;
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
            isAiGenerated: true,
            model
          });
        } catch (error) {
          lastError = error instanceof Error ? error.message : 'Gemini request failed.';
          console.error('Gemini network/runtime error:', lastError, { model, useJsonMode });
        }
      }
    }

    return res.status(502).json({
      error: lastError || 'Gemini AI could not answer right now. Please try again.'
    });
  } catch (error) {
    console.error('Vercel AI chat error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'AI could not answer right now. Please try again.'
    });
  }
}
