import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const fallbackSuggestions = [
  'Mujhe fractions samjhao',
  'Class 5 Maths ka question do',
  'Photosynthesis easy words me samjhao'
];

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.status(status).json(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const { message, history, studentClass, subject } = req.body ?? {};

  if (!message || typeof message !== 'string') {
    return sendJson(res, 400, { error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'GEMINI_API_KEY is not configured on the server.',
      suggestions: fallbackSuggestions
    });
  }

  try {
    const gemini = new GoogleGenAI({ apiKey });
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => `${h?.role === 'user' ? 'Student' : 'Tutor'}: ${String(h?.content ?? '')}`).join('\n')
      : '';

    const prompt = `You are the "Iqra AI Study Assistant", a supportive school tutor for Nursery to Class 8 students at IQRA INSTITUTE in India.

Rules:
1. Answer in the same language style as the student: simple English, natural Hinglish, or Hindi.
2. Explain concepts step-by-step with age-appropriate real-life examples.
3. Keep answers clear, useful, and child-safe.
4. Never pretend to know something uncertain; say when clarification is needed.
5. End with one short check question.
6. Return exactly valid JSON with keys: reply, suggestions.
7. suggestions must contain exactly 3 short follow-up prompts.

Student class: ${studentClass || 'Class 1 to 8'}
Subject: ${subject || 'General Studies'}

Recent conversation:
${formattedHistory || '(none)'}

Current question:
${message}

Return only JSON.`;

    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch {
      parsed = { reply: response.text || '', suggestions: fallbackSuggestions };
    }

    return sendJson(res, 200, {
      success: true,
      reply: parsed.reply || response.text || 'Sorry, answer generate nahi ho paya.',
      suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length
        ? parsed.suggestions.slice(0, 3)
        : fallbackSuggestions,
      isAiGenerated: true
    });
  } catch (error: any) {
    console.error('Vercel AI chat error:', error);
    return sendJson(res, 500, {
      error: 'AI response generate nahi ho paya. Please try again.',
      details: process.env.NODE_ENV === 'development' ? String(error?.message || error) : undefined
    });
  }
}
