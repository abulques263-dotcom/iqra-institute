import { GoogleGenAI } from '@google/genai';

const subjects = ['Mathematics', 'Science', 'English', 'General Knowledge', 'Reasoning'];
const defaultCount = 10;

function sendJson(res: any, status: number, body: unknown) {
  return res.status(status).json(body);
}

function getApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || '';
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return sendJson(res, 200, { ok: true, geminiConfigured: Boolean(getApiKey()), route: '/api/ai/generate-questions' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body ?? {});
  const studentClass = String(body.studentClass || 'Class 1');
  const subject = String(body.subject || 'Mathematics');
  const topic = String(body.topic || 'Mixed topics');
  const difficulty = String(body.difficulty || 'Medium');
  const track = String(body.track || 'school');
  const count = Math.min(Math.max(Number(body.count) || defaultCount, 1), 20);
  const language = String(body.language || 'English/Hinglish');

  if (!subjects.includes(subject)) return sendJson(res, 400, { error: 'Unsupported subject.' });
  const apiKey = getApiKey();
  if (!apiKey) return sendJson(res, 503, { error: 'Gemini API key is not configured.', code: 'GEMINI_NOT_CONFIGURED' });

  const trackInstruction = track === 'entrance'
    ? 'Use the reasoning, speed, accuracy and foundational pattern typical of Indian school entrance preparation such as AMU/CHS. These must be original practice questions, not copied previous-year papers.'
    : track === 'olympiad'
      ? 'Prefer higher-order thinking, pattern recognition and multi-step reasoning while staying appropriate for the class.'
      : 'Focus on NCERT-aligned concepts, classroom learning, revision and exam readiness. Do not reproduce textbook questions verbatim.';

  try {
    const gemini = new GoogleGenAI({ apiKey });
    const prompt = `Create exactly ${count} original multiple-choice practice questions for a school student in India.

Student class: ${studentClass}
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Track: ${track}
Language style: ${language}

${trackInstruction}

Rules:
- Suitable for the stated class level.
- Child-safe and academically focused.
- No unsafe, discriminatory, sexual or political persuasion content.
- Exactly 4 concise answer options per question.
- Exactly one correct option.
- Include a short, accurate explanation.
- Avoid duplicate questions, repeated examples and ambiguous wording.
- For Maths, verify every calculation.
- For Science/GK, use stable school-level facts rather than uncertain current events.
- For English, use age-appropriate grammar, vocabulary and reading skills.
- Return ONLY valid JSON in this shape:
{"questions":[{"question":"...","options":["...","...","...","..."],"correctAnswer":0,"explanation":"...","topic":"...","difficulty":"${difficulty}"}]}`;

    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    let parsed: any;
    try { parsed = JSON.parse(response.text || '{}'); }
    catch { return sendJson(res, 502, { error: 'AI returned invalid question data.', code: 'BAD_AI_JSON' }); }

    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    const valid = questions.filter((q: any) =>
      q && typeof q.question === 'string' && q.question.trim() && Array.isArray(q.options) && q.options.length === 4 &&
      q.options.every((v: any) => typeof v === 'string' && v.trim()) && Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < 4
    ).slice(0, count);

    if (!valid.length) return sendJson(res, 502, { error: 'No valid questions were generated.', code: 'EMPTY_AI_QUESTIONS' });

    return sendJson(res, 200, {
      success: true,
      questions: valid.map((q: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        studentClass, subject,
        topic: String(q.topic || topic),
        difficulty: String(q.difficulty || difficulty),
        question: q.question.trim(),
        options: q.options.map((v: any) => String(v).trim()),
        answer: String(q.options[q.correctAnswer]).trim(),
        correctAnswer: q.correctAnswer,
        explanation: String(q.explanation || 'Let us solve it step by step.').trim(),
        hint: ''
      }))
    });
  } catch (error: any) {
    console.error('AI question generation error:', error);
    const raw = String(error?.message || error || 'Unknown error').toLowerCase();
    const code = raw.includes('quota') || raw.includes('rate limit') ? 'GEMINI_QUOTA_ERROR' : raw.includes('api key') || raw.includes('permission') || raw.includes('unauthorized') ? 'GEMINI_AUTH_ERROR' : 'GEMINI_REQUEST_ERROR';
    return sendJson(res, 500, { error: 'AI questions generate nahi ho paye.', code });
  }
}
