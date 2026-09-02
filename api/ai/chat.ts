import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash';

function sendError(res: VercelResponse, status: number, message: string) {
  return res.status(status).json({ error: message });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 405, 'Method not allowed');
  }

  const { message, history, studentClass, subject } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return sendError(res, 400, 'Message is required');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendError(res, 503, 'AI service is not configured yet. Please add GEMINI_API_KEY in the hosting environment.');
  }

  try {
    const gemini = new GoogleGenAI({ apiKey });
    const recentHistory = Array.isArray(history)
      ? history.slice(-10).map((item: any) => {
          const role = item?.role === 'user' ? 'Student' : 'Tutor';
          const content = typeof item?.content === 'string' ? item.content.slice(0, 4000) : '';
          return `${role}: ${content}`;
        }).filter(Boolean).join('\n')
      : '';

    const prompt = `You are Iqra AI Study Assistant, a patient school tutor for children from Nursery/Class 1 through Class 8 in India.

Your job is to actually understand and answer the child's question, not merely repeat it or ask them to choose a subject.

Rules:
- Answer the current question directly and correctly.
- Handle Maths, Science, English, Hindi, GK, Reasoning, Computer basics and normal school-study questions.
- Solve arithmetic and word problems step by step. Check calculations before answering.
- If the child asks a follow-up, use the recent conversation to understand what they mean.
- Match the child's language: English -> simple English; Hindi -> Hindi; Hinglish -> natural Hinglish.
- Adapt the explanation to the supplied class. For younger children, use very simple words and examples.
- If the question is ambiguous, make the most reasonable school-level interpretation and state the assumption briefly instead of refusing to answer.
- Never invent facts. If something is uncertain, say so clearly.
- Be child-safe and educational. Do not provide unsafe instructions.
- Keep answers concise but complete: explanation, example/steps when useful, then one short check/practice question.
- Do not use emojis unless they genuinely help a very young child.
- Return ONLY valid JSON with this exact shape:
{"reply":"...","suggestions":["...","...","..."]}

Student profile:
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
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: raw, suggestions: [] };
    }

    const reply = typeof parsed.reply === 'string' && parsed.reply.trim()
      ? parsed.reply.trim()
      : 'I could not prepare an answer right now. Please ask the question again.';

    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter((s: unknown) => typeof s === 'string' && s.trim()).slice(0, 3)
      : [];

    return res.status(200).json({
      success: true,
      reply,
      suggestions,
      isAiGenerated: true
    });
  } catch (error: any) {
    console.error('Vercel AI chat error:', error);
    return sendError(res, 500, 'AI could not answer right now. Please try again.');
  }
}
