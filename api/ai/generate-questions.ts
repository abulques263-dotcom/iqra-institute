import { GoogleGenAI } from '@google/genai';

const subjects = ['Mathematics', 'Science', 'English', 'General Knowledge', 'Reasoning'];
const defaultCount = 10;

function sendJson(res: any, status: number, body: unknown) {
  return res.status(status).json(body);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? (() => {
    try { return JSON.parse(req.body); } catch { return {}; }
  })() : (req.body ?? {});

  const studentClass = String(body.studentClass || 'Class 1');
  const subject = String(body.subject || 'Mathematics');
  const topic = String(body.topic || 'Mixed topics');
  const difficulty = String(body.difficulty || 'Medium');
  const count = Math.min(Math.max(Number(body.count) || defaultCount, 1), 20);
  const language = String(body.language || 'English/Hinglish');

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'Gemini API key is not configured.',
      code: 'GEMINI_NOT_CONFIGURED'
    });
  }

  if (!subjects.includes(subject) && subject !== 'All Subjects') {
    return sendJson(res, 400, { error: 'Unsupported subject.' });
  }

  try {
    const gemini = new GoogleGenAI({ apiKey });
    const prompt = `Create exactly ${count} original multiple-choice practice questions for a school student.

Student class: ${studentClass}
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Language style: ${language}

Rules:
- Suitable for the stated class level in India.
- No unsafe, discriminatory, sexual, political persuasion, or age-inappropriate content.
- Each question must have exactly 4 concise answer options.
- Exactly one option must be correct.
- Include a short, accurate explanation suitable for a child.
- Avoid duplicate questions and avoid repeating the same numbers/examples.
- For Maths, ensure calculations are correct.
- For English, use age-appropriate grammar/vocabulary.
- Return ONLY valid JSON in this exact shape:
{"questions":[{"question":"...","options":["...","...","...","..."],"correctAnswer":0,"explanation":"...","topic":"...","difficulty":"${difficulty}"}]}`;

    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    let parsed: any;
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch {
      return sendJson(res, 502, { error: 'AI returned invalid question data.', code: 'BAD_AI_JSON' });
    }

    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    const valid = questions.filter((q: any) =>
      q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length === 4 &&
      Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < 4
    ).slice(0, count);

    if (!valid.length) {
      return sendJson(res, 502, { error: 'No valid questions were generated.', code: 'EMPTY_AI_QUESTIONS' });
    }

    return sendJson(res, 200, {
      success: true,
      questions: valid.map((q: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        studentClass,
        subject,
        topic: String(q.topic || topic),
        difficulty: String(q.difficulty || difficulty),
        question: q.question,
        options: q.options.map((v: any) => String(v)),
        answer: String(q.options[q.correctAnswer]),
        correctAnswer: q.correctAnswer,
        explanation: String(q.explanation || 'Let us solve it step by step.'),
        hint: ''
      }))
    });
  } catch (error: any) {
    console.error('AI question generation error:', error);
    const raw = String(error?.message || error || 'Unknown error').toLowerCase();
    const code = raw.includes('quota') || raw.includes('rate limit') ? 'GEMINI_QUOTA_ERROR' :
      raw.includes('api key') || raw.includes('permission') || raw.includes('unauthorized') ? 'GEMINI_AUTH_ERROR' :
      'GEMINI_REQUEST_ERROR';
    return sendJson(res, 500, { error: 'AI questions generate nahi ho paye.', code });
  }
}
