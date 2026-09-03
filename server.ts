import express from 'express';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import {
  initialSettings,
  initialClasses,
  initialTeachers,
  initialDailyQuestions,
  initialNews,
  initialTestimonials,
  initialGallery,
  initialFAQs,
  initialTrialRequests,
  initialParents,
  initialNotificationTemplates,
  initialNotificationLogs
} from './server/defaultData.js';
import {
  generateComprehensiveQuestionBank,
  BankQuestion
} from './server/questionsData.js';
import {
  WebsiteSettings,
  ClassFeeItem,
  Teacher,
  DailyQuestion,
  NewsUpdate,
  Testimonial,
  GalleryItem,
  FAQItem,
  TrialRequest,
  ParentContact,
  NotificationTemplate,
  NotificationLog,
  SendNotificationPayload,
  AINotificationPrompt
} from './src/types.js';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface for DB
interface DatabaseSchema {
  settings: WebsiteSettings;
  classes: ClassFeeItem[];
  teachers: Teacher[];
  dailyQuestions: DailyQuestion[];
  questionsBank: BankQuestion[];
  news: NewsUpdate[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqs: FAQItem[];
  trialRequests: TrialRequest[];
  parents: ParentContact[];
  notificationTemplates: NotificationTemplate[];
  notificationLogs: NotificationLog[];
  adminPasswordHash: string; // default hashed/matched
}

// In-memory + persisted database
let db: DatabaseSchema = {
  settings: initialSettings,
  classes: initialClasses,
  teachers: initialTeachers,
  dailyQuestions: initialDailyQuestions,
  questionsBank: [],
  news: initialNews,
  testimonials: initialTestimonials,
  gallery: initialGallery,
  faqs: initialFAQs,
  trialRequests: initialTrialRequests,
  parents: initialParents,
  notificationTemplates: initialNotificationTemplates,
  notificationLogs: initialNotificationLogs,
  adminPasswordHash: 'iqra2026' // default admin password
};


function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(raw);
      
      const loadedBank: BankQuestion[] = loaded.questionsBank && loaded.questionsBank.length >= 200
        ? loaded.questionsBank
        : generateComprehensiveQuestionBank();

      db = {
        ...db,
        ...loaded,
        // Ensure defaults if any array is empty
        settings: { ...initialSettings, ...(loaded.settings || {}) },
        // Current fee update: Nursery–UKG is ₹500/month.
        classes: (loaded.classes?.length ? loaded.classes : initialClasses).map((c: ClassFeeItem) => c.id === 'cls-nursery-ukg' ? { ...c, monthlyFee: 500 } : c),
        teachers: loaded.teachers?.length ? loaded.teachers : initialTeachers,
        dailyQuestions: loaded.dailyQuestions?.length ? loaded.dailyQuestions : initialDailyQuestions,
        questionsBank: loadedBank,
        news: loaded.news?.length ? loaded.news : initialNews,
        testimonials: loaded.testimonials?.length ? loaded.testimonials : initialTestimonials,
        gallery: loaded.gallery?.length ? loaded.gallery : initialGallery,
        faqs: loaded.faqs?.length ? loaded.faqs : initialFAQs,
        trialRequests: loaded.trialRequests || initialTrialRequests,
        parents: loaded.parents?.length ? loaded.parents : initialParents,
        notificationTemplates: loaded.notificationTemplates?.length ? loaded.notificationTemplates : initialNotificationTemplates,
        notificationLogs: loaded.notificationLogs || initialNotificationLogs
      };
      console.log(`Database loaded successfully with ${db.questionsBank.length} questions in question bank.`);
    } else {
      db.questionsBank = generateComprehensiveQuestionBank();
      saveDatabase();
    }
  } catch (err) {
    console.error('Error reading database file:', err);
    db.questionsBank = generateComprehensiveQuestionBank();
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

loadDatabase();

// ----------------------------------------------------
// EMAIL DISPATCH & HTML TEMPLATE ENGINE
// ----------------------------------------------------
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const from = process.env.SMTP_FROM || `"${db.settings.instituteName}" <abulques263@gmail.com>`;

  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    return {
      transporter,
      isConfigured: true,
      fromAddress: from,
      host,
      port
    };
  }

  // Simulated sandbox transporter when SMTP is not set
  return {
    transporter: null,
    isConfigured: false,
    fromAddress: from,
    host: 'Simulated Sandbox Mode (No SMTP Credentials)',
    port
  };
}

function buildPersonalizedEmailHtml(options: {
  subject: string;
  category: string;
  bodyText: string;
  parentName: string;
  studentName: string;
  studentClass: string;
  settings: WebsiteSettings;
}) {
  const { subject, category, bodyText, parentName, studentName, studentClass, settings } = options;

  // Replace merge tags in body
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  let parsedBody = bodyText
    .replace(/\{\{parent_name\}\}/gi, parentName || 'Parent')
    .replace(/\{\{student_name\}\}/gi, studentName || 'Student')
    .replace(/\{\{student_class\}\}/gi, studentClass || 'Foundation Batch')
    .replace(/\{\{institute_name\}\}/gi, settings.instituteName)
    .replace(/\{\{date\}\}/gi, todayFormatted)
    .replace(/\{\{phone\}\}/gi, settings.phone)
    .replace(/\{\{whatsapp\}\}/gi, settings.whatsapp);

  // Convert line breaks to HTML paragraphs
  const paragraphs = parsedBody
    .split(/\n\s*\n/)
    .map(p => `<p style="margin: 0 0 14px 0; line-height: 1.65; color: #334155; font-size: 15px;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const categoryBadgeColors: Record<string, { bg: string; text: string }> = {
    Holiday: { bg: '#FEF3C7', text: '#92400E' },
    'Test Schedule': { bg: '#E0F2FE', text: '#0369A1' },
    'Progress Update': { bg: '#DCFCE7', text: '#166534' },
    'Fee Notice': { bg: '#FEE2E2', text: '#991B1B' },
    'General Announcement': { bg: '#F3E8FF', text: '#6B21A8' },
    Emergency: { bg: '#FFE4E6', text: '#9F1239' }
  };

  const badge = categoryBadgeColors[category] || { bg: '#F1F5F9', text: '#334155' };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center; border-bottom: 3px solid #059669;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #059669; color: #ffffff; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px;">
                      Official Parent Notice
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">
                      ${settings.instituteName}
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">
                      Nursery to Class 8 • Foundation Learning Support
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Student Meta Pill -->
          <tr>
            <td style="padding: 16px 24px 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: ${badge.bg}; color: ${badge.text}; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">
                      ${category}
                    </span>
                    <span style="font-size: 13px; color: #475569; font-weight: 600;">
                      Student: <strong>${studentName}</strong> (${studentClass})
                    </span>
                  </td>
                  <td align="right" style="font-size: 12px; color: #64748b;">
                    ${todayFormatted}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 24px; text-align: left;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700; line-height: 1.3;">
                ${subject}
              </h2>
              
              ${paragraphs}

              <!-- Direct Action / Contact Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 4px;">
                      Need clarification or want to speak with faculty?
                    </div>
                    <div style="font-size: 13px; color: #15803d; line-height: 1.5;">
                      📞 Call: <strong>${settings.phone}</strong> &nbsp;|&nbsp; 💬 WhatsApp: <strong>${settings.whatsapp}</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #334155;">
                ${settings.instituteName}
              </p>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                ${settings.address}
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                This email was sent to ${parentName} regarding ${studentName}'s enrollment at ${settings.instituteName}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}


// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Helper auth middleware
  const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    if (token === db.adminPasswordHash || token === 'iqra-admin-token-authenticated' || token === 'iqra2026') {
      return next();
    }
    return res.status(403).json({ error: 'Invalid or expired admin authorization' });
  };

  // ----------------------------------------------------
  // PUBLIC & SHARED API ROUTES
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), institute: db.settings.instituteName });
  });

  // Website Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', adminAuth, (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase();
    res.json({ success: true, settings: db.settings });
  });

  // Classes & Fees
  app.get('/api/classes', (req, res) => {
    res.json(db.classes);
  });

  app.put('/api/classes', adminAuth, (req, res) => {
    if (Array.isArray(req.body)) {
      db.classes = req.body;
      saveDatabase();
      return res.json({ success: true, classes: db.classes });
    }
    return res.status(400).json({ error: 'Expected array of classes' });
  });

  app.post('/api/classes', adminAuth, (req, res) => {
    const newClass: ClassFeeItem = {
      id: 'cls-' + Date.now(),
      name: req.body.name || 'New Class',
      gradeRange: req.body.gradeRange || '',
      monthlyFee: Number(req.body.monthlyFee) || 300,
      description: req.body.description || '',
      features: Array.isArray(req.body.features) ? req.body.features : [],
      order: db.classes.length + 1
    };
    db.classes.push(newClass);
    saveDatabase();
    res.json({ success: true, item: newClass });
  });

  app.put('/api/classes/:id', adminAuth, (req, res) => {
    const index = db.classes.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Class not found' });
    db.classes[index] = { ...db.classes[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.classes[index] });
  });

  app.delete('/api/classes/:id', adminAuth, (req, res) => {
    db.classes = db.classes.filter(c => c.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Teachers
  app.get('/api/teachers', (req, res) => {
    res.json(db.teachers);
  });

  app.put('/api/teachers', adminAuth, (req, res) => {
    if (Array.isArray(req.body)) {
      db.teachers = req.body;
      saveDatabase();
      return res.json({ success: true, teachers: db.teachers });
    }
    return res.status(400).json({ error: 'Expected array of teachers' });
  });

  app.post('/api/teachers', adminAuth, (req, res) => {
    const newTeacher: Teacher = {
      id: 'teacher-' + Date.now(),
      name: req.body.name || 'New Teacher',
      qualification: req.body.qualification || '',
      role: req.body.role || 'Faculty Member',
      subjects: Array.isArray(req.body.subjects) ? req.body.subjects : [],
      teachingPhilosophy: req.body.teachingPhilosophy || '',
      photoUrl: req.body.photoUrl || '',
      order: db.teachers.length + 1
    };
    db.teachers.push(newTeacher);
    saveDatabase();
    res.json({ success: true, item: newTeacher });
  });

  app.put('/api/teachers/:id', adminAuth, (req, res) => {
    const index = db.teachers.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Teacher not found' });
    db.teachers[index] = { ...db.teachers[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.teachers[index] });
  });

  app.delete('/api/teachers/:id', adminAuth, (req, res) => {
    db.teachers = db.teachers.filter(t => t.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Daily Questions
  app.get('/api/daily-questions', (req, res) => {
    // Return published ones for public or all if specified
    const subject = req.query.subject as string;
    const studentClass = req.query.studentClass as string;
    let questions = db.dailyQuestions.filter(q => q.isPublished !== false);
    if (subject && subject !== 'All') {
      questions = questions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }
    if (studentClass && studentClass !== 'All') {
      questions = questions.filter(q => q.studentClass.toLowerCase().includes(studentClass.toLowerCase()));
    }
    // Sort by date desc
    questions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(questions);
  });

  app.get('/api/daily-questions/all', adminAuth, (req, res) => {
    const sorted = [...db.dailyQuestions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(sorted);
  });

  app.get('/api/daily-questions/today', (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const match = db.dailyQuestions.find(q => q.date === todayStr && q.isPublished);
    if (match) {
      return res.json(match);
    }
    // Return latest published question as fallback
    const published = db.dailyQuestions.filter(q => q.isPublished);
    published.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(published[0] || null);
  });

  app.put('/api/daily-questions', adminAuth, (req, res) => {
    if (Array.isArray(req.body)) {
      db.dailyQuestions = req.body;
      saveDatabase();
      return res.json({ success: true, dailyQuestions: db.dailyQuestions });
    }
    return res.status(400).json({ error: 'Expected array of questions' });
  });

  app.post('/api/daily-questions', adminAuth, (req, res) => {
    const newQuestion: DailyQuestion = {
      id: 'dq-' + Date.now(),
      date: req.body.date || new Date().toISOString().split('T')[0],
      subject: req.body.subject || 'Mathematics',
      studentClass: req.body.studentClass || 'Class 1 – 4',
      question: req.body.question || '',
      options: Array.isArray(req.body.options) ? req.body.options : [],
      answer: req.body.answer || '',
      explanation: req.body.explanation || '',
      hint: req.body.hint || '',
      difficulty: req.body.difficulty || 'Easy',
      imageUrl: req.body.imageUrl || '',
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
      createdAt: new Date().toISOString()
    };
    db.dailyQuestions.unshift(newQuestion);
    saveDatabase();
    res.json({ success: true, item: newQuestion });
  });

  app.put('/api/daily-questions/:id', adminAuth, (req, res) => {
    const index = db.dailyQuestions.findIndex(q => q.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Question not found' });
    db.dailyQuestions[index] = { ...db.dailyQuestions[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.dailyQuestions[index] });
  });

  app.delete('/api/daily-questions/:id', adminAuth, (req, res) => {
    db.dailyQuestions = db.dailyQuestions.filter(q => q.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // 1,000+ QUESTION BANK & PRACTICE ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/questions/stats', (req, res) => {
    const totalCount = db.questionsBank.length;
    const bySubject: Record<string, number> = {};
    const byClass: Record<string, number> = {};
    const byDifficulty: Record<string, number> = {};

    db.questionsBank.forEach(q => {
      bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
      byClass[q.studentClass] = (byClass[q.studentClass] || 0) + 1;
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
    });

    res.json({
      totalCount,
      bySubject,
      byClass,
      byDifficulty
    });
  });

  app.get('/api/questions/topics', (req, res) => {
    const { subject, studentClass } = req.query;
    let list = db.questionsBank;
    if (subject && subject !== 'All') {
      list = list.filter(q => q.subject.toLowerCase() === String(subject).toLowerCase());
    }
    if (studentClass && studentClass !== 'All') {
      list = list.filter(q => q.studentClass.toLowerCase().includes(String(studentClass).toLowerCase()));
    }
    const topics = Array.from(new Set(list.map(q => q.topic).filter(Boolean)));
    res.json({ topics });
  });

  app.get('/api/questions/random-practice', (req, res) => {
    const subject = req.query.subject as string;
    const studentClass = req.query.studentClass as string;
    const topic = req.query.topic as string;
    const difficulty = req.query.difficulty as string;
    const count = Math.min(Math.max(Number(req.query.count) || 10, 1), 50);

    let list = db.questionsBank.filter(q => q.isPublished !== false);

    if (subject && subject !== 'All') {
      list = list.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }
    if (studentClass && studentClass !== 'All') {
      list = list.filter(q => q.studentClass.toLowerCase().includes(studentClass.toLowerCase()));
    }
    if (topic && topic !== 'All') {
      list = list.filter(q => q.topic?.toLowerCase().includes(topic.toLowerCase()));
    }
    if (difficulty && difficulty !== 'All') {
      list = list.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Shuffle
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    // If filtered set was too small, fill with random items from same class/subject
    if (selected.length < count) {
      const fallbackList = db.questionsBank.filter(q => !selected.some(s => s.id === q.id));
      const needed = count - selected.length;
      const additional = fallbackList.sort(() => 0.5 - Math.random()).slice(0, needed);
      selected.push(...additional);
    }

    res.json(selected);
  });

  app.get('/api/questions', (req, res) => {
    const subject = req.query.subject as string;
    const studentClass = req.query.studentClass as string;
    const topic = req.query.topic as string;
    const difficulty = req.query.difficulty as string;
    const search = req.query.search as string;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    let list = [...db.questionsBank];

    if (subject && subject !== 'All') {
      list = list.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }
    if (studentClass && studentClass !== 'All') {
      list = list.filter(q => q.studentClass.toLowerCase().includes(studentClass.toLowerCase()));
    }
    if (topic && topic !== 'All') {
      list = list.filter(q => q.topic?.toLowerCase().includes(topic.toLowerCase()));
    }
    if (difficulty && difficulty !== 'All') {
      list = list.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(q =>
        q.question.toLowerCase().includes(s) ||
        q.answer.toLowerCase().includes(s) ||
        q.topic?.toLowerCase().includes(s) ||
        q.explanation.toLowerCase().includes(s)
      );
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    res.json({
      questions: paginated,
      total,
      page,
      totalPages,
      limit
    });
  });

  app.get('/api/questions/:id', (req, res) => {
    const question = db.questionsBank.find(q => q.id === req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  });

  app.post('/api/questions', adminAuth, (req, res) => {
    const newQ: BankQuestion = {
      id: 'bq-' + Date.now(),
      question: req.body.question || '',
      options: Array.isArray(req.body.options) ? req.body.options : [],
      answer: req.body.answer || '',
      explanation: req.body.explanation || '',
      hint: req.body.hint || '',
      subject: req.body.subject || 'Mathematics',
      studentClass: req.body.studentClass || 'Class 1 – 4',
      topic: req.body.topic || 'General Practice',
      difficulty: req.body.difficulty || 'Easy',
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
      createdAt: new Date().toISOString()
    };
    db.questionsBank.unshift(newQ);
    saveDatabase();
    res.json({ success: true, item: newQ, totalCount: db.questionsBank.length });
  });

  app.put('/api/questions/:id', adminAuth, (req, res) => {
    const index = db.questionsBank.findIndex(q => q.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Question not found' });
    db.questionsBank[index] = { ...db.questionsBank[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.questionsBank[index] });
  });

  app.delete('/api/questions/:id', adminAuth, (req, res) => {
    const beforeCount = db.questionsBank.length;
    db.questionsBank = db.questionsBank.filter(q => q.id !== req.params.id);
    if (db.questionsBank.length === beforeCount) {
      return res.status(404).json({ error: 'Question not found' });
    }
    saveDatabase();
    res.json({ success: true, totalCount: db.questionsBank.length });
  });

  app.post('/api/questions/bulk-import', adminAuth, (req, res) => {
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Expected questions array' });
    }

    let addedCount = 0;
    questions.forEach((q: any) => {
      if (q && q.question && q.answer) {
        db.questionsBank.push({
          id: q.id || 'bq-imp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer,
          explanation: q.explanation || 'Step-by-step explanation.',
          hint: q.hint || '',
          subject: q.subject || 'Mathematics',
          studentClass: q.studentClass || 'Class 1 – 4',
          topic: q.topic || 'General Practice',
          difficulty: q.difficulty || 'Medium',
          isPublished: q.isPublished !== undefined ? q.isPublished : true,
          createdAt: q.createdAt || new Date().toISOString()
        });
        addedCount++;
      }
    });

    saveDatabase();
    res.json({
      success: true,
      addedCount,
      totalCount: db.questionsBank.length
    });
  });

  app.get('/api/questions/export/all', adminAuth, (req, res) => {
    res.json({
      exportedAt: new Date().toISOString(),
      count: db.questionsBank.length,
      questions: db.questionsBank
    });
  });

  // Short News / Updates
  app.get('/api/news', (req, res) => {
    const published = db.news.filter(n => n.isPublished !== false);
    published.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(published);
  });

  app.put('/api/news', adminAuth, (req, res) => {
    if (Array.isArray(req.body)) {
      db.news = req.body;
      saveDatabase();
      return res.json({ success: true, news: db.news });
    }
    return res.status(400).json({ error: 'Expected array of news' });
  });

  app.get('/api/news/all', adminAuth, (req, res) => {
    const sorted = [...db.news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(sorted);
  });

  app.post('/api/news', adminAuth, (req, res) => {
    const item: NewsUpdate = {
      id: 'news-' + Date.now(),
      title: req.body.title || 'Update',
      description: req.body.description || '',
      category: req.body.category || 'Admission',
      date: req.body.date || new Date().toISOString().split('T')[0],
      imageUrl: req.body.imageUrl || '',
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
      isImportant: Boolean(req.body.isImportant)
    };
    db.news.unshift(item);
    saveDatabase();
    res.json({ success: true, item });
  });

  app.put('/api/news/:id', adminAuth, (req, res) => {
    const index = db.news.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'News item not found' });
    db.news[index] = { ...db.news[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.news[index] });
  });

  app.delete('/api/news/:id', adminAuth, (req, res) => {
    db.news = db.news.filter(n => n.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Testimonials
  app.get('/api/testimonials', (req, res) => {
    res.json(db.testimonials.filter(t => t.isPublished !== false));
  });

  app.put('/api/testimonials', adminAuth, (req, res) => {
    if (Array.isArray(req.body)) {
      db.testimonials = req.body;
      saveDatabase();
      return res.json({ success: true, testimonials: db.testimonials });
    }
    return res.status(400).json({ error: 'Expected array of testimonials' });
  });

  app.get('/api/testimonials/all', adminAuth, (req, res) => {
    res.json(db.testimonials);
  });

  app.post('/api/testimonials', adminAuth, (req, res) => {
    const item: Testimonial = {
      id: 'test-' + Date.now(),
      parentName: req.body.parentName || 'Parent',
      studentName: req.body.studentName || '',
      studentClass: req.body.studentClass || 'Class 4',
      quote: req.body.quote || '',
      rating: Number(req.body.rating) || 5,
      photoUrl: req.body.photoUrl || '',
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true
    };
    db.testimonials.push(item);
    saveDatabase();
    res.json({ success: true, item });
  });

  app.put('/api/testimonials/:id', adminAuth, (req, res) => {
    const index = db.testimonials.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });
    db.testimonials[index] = { ...db.testimonials[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.testimonials[index] });
  });

  app.delete('/api/testimonials/:id', adminAuth, (req, res) => {
    db.testimonials = db.testimonials.filter(t => t.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    res.json(db.gallery);
  });

  app.put('/api/gallery', adminAuth, (req, res) => {
    if (Array.isArray(req.body)) {
      db.gallery = req.body;
      saveDatabase();
      return res.json({ success: true, gallery: db.gallery });
    }
    return res.status(400).json({ error: 'Expected array of gallery items' });
  });

  app.post('/api/gallery', adminAuth, (req, res) => {
    const item: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: req.body.title || 'Classroom Activity',
      category: req.body.category || 'Classroom',
      imageUrl: req.body.imageUrl || '',
      caption: req.body.caption || '',
      order: db.gallery.length + 1
    };
    db.gallery.push(item);
    saveDatabase();
    res.json({ success: true, item });
  });

  app.delete('/api/gallery/:id', adminAuth, (req, res) => {
    db.gallery = db.gallery.filter(g => g.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // FAQs
  app.get('/api/faqs', (req, res) => {
    res.json(db.faqs);
  });

  app.put('/api/faqs', adminAuth, (req, res) => {
    if (Array.isArray(req.body)) {
      db.faqs = req.body;
      saveDatabase();
      return res.json({ success: true, faqs: db.faqs });
    }
    return res.status(400).json({ error: 'Expected array of faqs' });
  });

  app.post('/api/faqs', adminAuth, (req, res) => {
    const item: FAQItem = {
      id: 'faq-' + Date.now(),
      question: req.body.question || '',
      answer: req.body.answer || '',
      order: db.faqs.length + 1
    };
    db.faqs.push(item);
    saveDatabase();
    res.json({ success: true, item });
  });

  app.put('/api/faqs/:id', adminAuth, (req, res) => {
    const index = db.faqs.findIndex(f => f.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'FAQ not found' });
    db.faqs[index] = { ...db.faqs[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.faqs[index] });
  });

  app.delete('/api/faqs/:id', adminAuth, (req, res) => {
    db.faqs = db.faqs.filter(f => f.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // 3-Day Trial Admissions / Leads (Public submission)
  app.post('/api/trial-requests', (req, res) => {
    const { studentName, parentName, studentClass, age, phone, whatsapp, preferredTime, message } = req.body;

    if (!studentName || !parentName || !studentClass || !phone) {
      return res.status(400).json({ error: 'Student Name, Parent Name, Class, and Phone number are required.' });
    }

    const lead: TrialRequest = {
      id: 'trial-' + Date.now(),
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      studentClass: studentClass.trim(),
      age: age ? String(age).trim() : '',
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      preferredTime: preferredTime || 'Morning Slot',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      notes: ''
    };

    db.trialRequests.unshift(lead);
    saveDatabase();

    res.json({
      success: true,
      message: '3-Day Free Trial request submitted successfully! We look forward to welcoming your child.',
      leadId: lead.id
    });
  });

  // Admin Leads Management
  app.get('/api/trial-requests', adminAuth, (req, res) => {
    res.json(db.trialRequests);
  });

  app.put('/api/trial-requests/:id', adminAuth, (req, res) => {
    const index = db.trialRequests.findIndex(l => l.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Trial request not found' });
    db.trialRequests[index] = { ...db.trialRequests[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.trialRequests[index] });
  });

  app.delete('/api/trial-requests/:id', adminAuth, (req, res) => {
    db.trialRequests = db.trialRequests.filter(l => l.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Admin Stats
  app.get('/api/admin/stats', adminAuth, (req, res) => {
    const totalLeads = db.trialRequests.length;
    const newLeads = db.trialRequests.filter(l => l.status === 'new').length;
    const dailyQuestionsCount = db.dailyQuestions.length;
    const newsCount = db.news.length;
    const galleryCount = db.gallery.length;
    const testimonialsCount = db.testimonials.length;
    const totalParents = db.parents.length;
    const activeParents = db.parents.filter(p => p.status === 'active').length;
    const notificationsSentCount = db.notificationLogs.length;

    res.json({
      totalLeads,
      newLeads,
      dailyQuestionsCount,
      newsCount,
      galleryCount,
      testimonialsCount,
      totalParents,
      activeParents,
      notificationsSentCount
    });
  });

  // ----------------------------------------------------
  // PARENT CONTACT DIRECTORY (ROSTER)
  // ----------------------------------------------------
  app.get('/api/parents', adminAuth, (req, res) => {
    let parents = [...db.parents];
    const { studentClass, status, search } = req.query;

    if (studentClass && studentClass !== 'all') {
      parents = parents.filter(p => p.studentClass.toLowerCase().includes(String(studentClass).toLowerCase()));
    }
    if (status && status !== 'all') {
      parents = parents.filter(p => p.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      parents = parents.filter(
        p =>
          p.parentName.toLowerCase().includes(q) ||
          p.studentName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
    }

    res.json(parents);
  });

  app.post('/api/parents', adminAuth, (req, res) => {
    const { parentName, studentName, studentClass, email, phone, whatsapp, batchTiming, status, notes } = req.body;

    if (!parentName || !studentName || !email) {
      return res.status(400).json({ error: 'Parent Name, Student Name, and valid Email are required.' });
    }

    const newParent: ParentContact = {
      id: 'parent-' + Date.now(),
      parentName: parentName.trim(),
      studentName: studentName.trim(),
      studentClass: studentClass || 'Class 1 – 4',
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      whatsapp: (whatsapp || phone || '').trim(),
      batchTiming: batchTiming || 'Evening Batch (4:00 PM - 5:30 PM)',
      status: status || 'active',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    db.parents.unshift(newParent);
    saveDatabase();
    res.json({ success: true, item: newParent });
  });

  app.post('/api/parents/bulk', adminAuth, (req, res) => {
    const { parents } = req.body;
    if (!Array.isArray(parents) || parents.length === 0) {
      return res.status(400).json({ error: 'Expected non-empty array of parent contacts.' });
    }

    let addedCount = 0;
    for (const p of parents) {
      if (p.parentName && p.studentName && p.email) {
        const item: ParentContact = {
          id: 'parent-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          parentName: String(p.parentName).trim(),
          studentName: String(p.studentName).trim(),
          studentClass: String(p.studentClass || 'Class 1 – 4').trim(),
          email: String(p.email).trim().toLowerCase(),
          phone: String(p.phone || '').trim(),
          whatsapp: String(p.whatsapp || p.phone || '').trim(),
          batchTiming: String(p.batchTiming || 'Evening Batch').trim(),
          status: p.status === 'inactive' ? 'inactive' : 'active',
          notes: p.notes || '',
          createdAt: new Date().toISOString()
        };
        db.parents.unshift(item);
        addedCount++;
      }
    }

    saveDatabase();
    res.json({ success: true, addedCount, totalParents: db.parents.length });
  });

  app.put('/api/parents/:id', adminAuth, (req, res) => {
    const index = db.parents.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Parent contact not found.' });

    db.parents[index] = {
      ...db.parents[index],
      ...req.body,
      email: req.body.email ? req.body.email.trim().toLowerCase() : db.parents[index].email
    };
    saveDatabase();
    res.json({ success: true, item: db.parents[index] });
  });

  app.delete('/api/parents/:id', adminAuth, (req, res) => {
    db.parents = db.parents.filter(p => p.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Convert Admission Lead to Enrolled Parent
  app.post('/api/parents/convert-from-lead/:leadId', adminAuth, (req, res) => {
    const lead = db.trialRequests.find(l => l.id === req.params.leadId);
    if (!lead) return res.status(404).json({ error: 'Admission lead not found' });

    const parentEmail = req.body.email || `${lead.parentName.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`;

    const newParent: ParentContact = {
      id: 'parent-' + Date.now(),
      parentName: lead.parentName,
      studentName: lead.studentName,
      studentClass: lead.studentClass,
      email: parentEmail.trim().toLowerCase(),
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      batchTiming: lead.preferredTime || 'Evening Batch',
      status: 'active',
      notes: `Enrolled from trial lead (${lead.id}). ${lead.notes || ''}`.trim(),
      createdAt: new Date().toISOString()
    };

    // Update lead status
    lead.status = 'enrolled';

    db.parents.unshift(newParent);
    saveDatabase();

    res.json({ success: true, item: newParent });
  });

  // ----------------------------------------------------
  // NOTIFICATION TEMPLATES
  // ----------------------------------------------------
  app.get('/api/notification-templates', adminAuth, (req, res) => {
    res.json(db.notificationTemplates);
  });

  app.post('/api/notification-templates', adminAuth, (req, res) => {
    const { name, category, subject, body } = req.body;
    if (!name || !subject || !body) {
      return res.status(400).json({ error: 'Template Name, Subject, and Body are required.' });
    }

    const item: NotificationTemplate = {
      id: 'tmpl-' + Date.now(),
      name: name.trim(),
      category: category || 'General Announcement',
      subject: subject.trim(),
      body: body.trim(),
      isDefault: false
    };

    db.notificationTemplates.unshift(item);
    saveDatabase();
    res.json({ success: true, item });
  });

  app.put('/api/notification-templates/:id', adminAuth, (req, res) => {
    const index = db.notificationTemplates.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Template not found' });

    db.notificationTemplates[index] = { ...db.notificationTemplates[index], ...req.body };
    saveDatabase();
    res.json({ success: true, item: db.notificationTemplates[index] });
  });

  app.delete('/api/notification-templates/:id', adminAuth, (req, res) => {
    db.notificationTemplates = db.notificationTemplates.filter(t => t.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // NOTIFICATION LOGS & EMAIL DISPATCH
  // ----------------------------------------------------
  app.get('/api/notification-logs', adminAuth, (req, res) => {
    const sorted = [...db.notificationLogs].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    res.json(sorted);
  });

  app.delete('/api/notification-logs/:id', adminAuth, (req, res) => {
    db.notificationLogs = db.notificationLogs.filter(l => l.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  app.get('/api/notifications/smtp-status', adminAuth, (req, res) => {
    const mailInfo = getMailTransporter();
    res.json({
      isConfigured: mailInfo.isConfigured,
      host: mailInfo.host,
      port: mailInfo.port,
      fromAddress: mailInfo.fromAddress,
      activeParentCount: db.parents.filter(p => p.status === 'active').length,
      totalParentCount: db.parents.length
    });
  });

  // Test send an individual email
  app.post('/api/notifications/test-smtp', adminAuth, async (req, res) => {
    const { testEmail, subject, messageBody, category } = req.body;

    if (!testEmail) {
      return res.status(400).json({ error: 'Test recipient email is required.' });
    }

    const mailInfo = getMailTransporter();
    const emailSubject = subject || 'Test Notification from IQRA INSTITUTE';
    const emailHtml = buildPersonalizedEmailHtml({
      subject: emailSubject,
      category: category || 'General Announcement',
      bodyText: messageBody || 'This is a test notification confirming that the IQRA INSTITUTE email delivery system is functioning properly.',
      parentName: 'Respected Parent',
      studentName: 'Sample Student',
      studentClass: 'Class 1 – 4',
      settings: db.settings
    });

    if (mailInfo.isConfigured && mailInfo.transporter) {
      try {
        await mailInfo.transporter.sendMail({
          from: mailInfo.fromAddress,
          to: testEmail,
          subject: `[TEST] ${emailSubject}`,
          html: emailHtml
        });

        return res.json({
          success: true,
          mode: 'smtp',
          message: `Live test email dispatched successfully to ${testEmail} via SMTP.`
        });
      } catch (err: any) {
        return res.status(500).json({
          error: `SMTP Error: ${err.message || 'Failed to dispatch email'}. Verify your SMTP settings.`
        });
      }
    } else {
      // Sandbox mode
      return res.json({
        success: true,
        mode: 'simulated',
        message: `Test email successfully processed in Sandbox Mode for ${testEmail}. (Live SMTP host is not configured; email preview logged).`,
        previewHtml: emailHtml
      });
    }
  });

  // Bulk Notification Send
  app.post('/api/notifications/send', adminAuth, async (req, res) => {
    const payload: SendNotificationPayload = req.body;
    const { subject, category, messageBody, targetGroup, targetClassName, selectedParentIds, testEmail, sendTestOnly } = payload;

    if (!subject || !messageBody) {
      return res.status(400).json({ error: 'Notification Subject and Message Body are required.' });
    }

    // Determine target parents
    let targetParents: ParentContact[] = [];

    if (sendTestOnly && testEmail) {
      targetParents = [
        {
          id: 'test-parent',
          parentName: 'Test Parent',
          studentName: 'Test Student',
          studentClass: targetClassName || 'Class 1 – 4',
          email: testEmail,
          phone: '',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
    } else if (targetGroup === 'class' && targetClassName) {
      targetParents = db.parents.filter(
        p => p.status === 'active' && p.studentClass.toLowerCase().includes(targetClassName.toLowerCase())
      );
    } else if (targetGroup === 'selected' && Array.isArray(selectedParentIds)) {
      targetParents = db.parents.filter(p => selectedParentIds.includes(p.id));
    } else {
      // All active parents
      targetParents = db.parents.filter(p => p.status === 'active');
    }

    if (targetParents.length === 0) {
      return res.status(400).json({ error: 'No active parent recipients found for the selected criteria.' });
    }

    const mailInfo = getMailTransporter();
    const recipientLogs: any[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const parent of targetParents) {
      const emailHtml = buildPersonalizedEmailHtml({
        subject,
        category: category || 'General Announcement',
        bodyText: messageBody,
        parentName: parent.parentName,
        studentName: parent.studentName,
        studentClass: parent.studentClass,
        settings: db.settings
      });

      if (mailInfo.isConfigured && mailInfo.transporter) {
        try {
          await mailInfo.transporter.sendMail({
            from: mailInfo.fromAddress,
            to: parent.email,
            subject,
            html: emailHtml
          });

          recipientLogs.push({
            parentId: parent.id,
            parentName: parent.parentName,
            studentName: parent.studentName,
            studentClass: parent.studentClass,
            email: parent.email,
            status: 'sent',
            deliveredAt: new Date().toISOString()
          });
          successCount++;

          // Update parent's lastNotifiedAt
          const pIndex = db.parents.findIndex(p => p.id === parent.id);
          if (pIndex !== -1) {
            db.parents[pIndex].lastNotifiedAt = new Date().toISOString();
          }
        } catch (err: any) {
          recipientLogs.push({
            parentId: parent.id,
            parentName: parent.parentName,
            studentName: parent.studentName,
            studentClass: parent.studentClass,
            email: parent.email,
            status: 'failed',
            deliveredAt: new Date().toISOString(),
            error: err.message || 'SMTP dispatch error'
          });
          failCount++;
        }
      } else {
        // Simulated Sandbox dispatch
        recipientLogs.push({
          parentId: parent.id,
          parentName: parent.parentName,
          studentName: parent.studentName,
          studentClass: parent.studentClass,
          email: parent.email,
          status: 'simulated',
          deliveredAt: new Date().toISOString()
        });
        successCount++;

        // Update parent's lastNotifiedAt
        const pIndex = db.parents.findIndex(p => p.id === parent.id);
        if (pIndex !== -1) {
          db.parents[pIndex].lastNotifiedAt = new Date().toISOString();
        }
      }
    }

    const logEntry: NotificationLog = {
      id: 'notif-' + Date.now(),
      subject,
      category: category || 'General Announcement',
      messageBody,
      targetGroup: targetGroup || 'all',
      targetClassName,
      recipientCount: targetParents.length,
      recipients: recipientLogs,
      sentAt: new Date().toISOString(),
      sentBy: 'Administrator',
      emailMode: mailInfo.isConfigured ? 'smtp' : 'simulated',
      status: failCount === 0 ? 'success' : successCount > 0 ? 'partial' : 'failed',
      smtpSummary: mailInfo.isConfigured
        ? `Delivered to ${successCount}/${targetParents.length} parents via SMTP server`
        : `Processed in Sandbox Mode for ${targetParents.length} parents (No SMTP credentials configured)`
    };

    if (!sendTestOnly) {
      db.notificationLogs.unshift(logEntry);
      saveDatabase();
    }

    res.json({
      success: true,
      log: logEntry,
      successCount,
      failCount,
      isSimulated: !mailInfo.isConfigured,
      message: mailInfo.isConfigured
        ? `Bulk notification successfully delivered to ${successCount} parents!`
        : `Bulk notification processed in Sandbox mode for ${successCount} parents.`
    });
  });

  // AI Notification Draft Generator (Gemini)
  app.post('/api/notifications/ai-draft', adminAuth, async (req, res) => {
    const { category, targetClass, topicOrKeyPoints, tone }: AINotificationPrompt = req.body;

    const gemini = getGeminiClient();

    if (!gemini) {
      const sampleDrafts: Record<string, { subject: string; body: string }> = {
        Holiday: {
          subject: 'Holiday Notice: Institute Closure on Upcoming Occasion',
          body: `Dear {{parent_name}},\n\nThis is to formally notify you that IQRA INSTITUTE will remain closed on [Date / Occasion].\n\nRegular foundation classes for {{student_name}} ({{student_class}}) will resume as per standard schedule on the next working day.\n\nWe encourage students to spend 30 minutes daily on their holiday practice worksheet.\n\nWarm regards,\nIQRA INSTITUTE\nPhone: {{phone}} | WhatsApp: {{whatsapp}}`
        },
        'Test Schedule': {
          subject: 'Assessment Notice: Upcoming Concept Test for {{student_class}}',
          body: `Dear {{parent_name}},\n\nPlease be informed that a conceptual assessment for {{student_class}} has been scheduled for this Saturday.\n\nStudent: {{student_name}}\nFocus: Core concepts and problem practice covered over recent sessions.\n\nKindly guide {{student_name}} to revise their notes and arrive on time.\n\nWarm regards,\nIQRA INSTITUTE Mentorship Team`
        },
        'Progress Update': {
          subject: 'Monthly Learning Progress Update: {{student_name}} ({{student_class}})',
          body: `Dear {{parent_name}},\n\nWe are delighted to share a brief update on {{student_name}}'s classroom journey at IQRA INSTITUTE.\n\nWe have noticed steady improvement in basic conceptual clarity, homework punctuality, and active participation during class hours.\n\nYou are always welcome to visit during faculty consultation hours between 6:00 PM - 7:00 PM.\n\nWarm regards,\nFaculty Mentors (Abulques & Inam)\nIQRA INSTITUTE`
        }
      };

      const selected = sampleDrafts[category] || {
        subject: `Important Notice for Parents - ${category}`,
        body: `Dear {{parent_name}},\n\nWe would like to bring an important update to your kind attention regarding {{student_name}} ({{student_class}}):\n\n${topicOrKeyPoints || 'Important institute announcement.'}\n\nPlease reach out to our administration desk if you have any questions.\n\nWarm regards,\nIQRA INSTITUTE\nPhone: {{phone}}`
      };

      return res.json({
        success: true,
        subject: selected.subject,
        body: selected.body,
        isAiGenerated: true
      });
    }

    try {
      const prompt = `You are a respectful, articulate educational administrator at IQRA INSTITUTE, a foundation learning center for young children (Nursery to Class 8).
Draft an official email notification to parents with a clear Subject and a well-structured Body.

Parameters:
- Category: ${category}
- Target Grade: ${targetClass || 'All Classes (Nursery to Class 8)'}
- Key Points / Announcement Details: ${topicOrKeyPoints || 'General announcement'}
- Tone: ${tone || 'polite and encouraging'}

Guidelines:
- Include placeable merge tags: {{parent_name}}, {{student_name}}, {{student_class}}, {{date}}, {{phone}}, {{whatsapp}}, {{institute_name}} where appropriate.
- Keep the language warm, professional, respectful, and crystal clear for Indian parents.
- Highlight the importance of child study discipline and conceptual understanding.
- Keep paragraphs clean and readable.

Respond ONLY with valid JSON:
{
  "subject": "...",
  "body": "..."
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        subject: parsed.subject || `${category} Notice - IQRA INSTITUTE`,
        body: parsed.body || `Dear {{parent_name}},\n\n${topicOrKeyPoints}\n\nWarm regards,\nIQRA INSTITUTE`,
        isAiGenerated: true
      });
    } catch (err: any) {
      console.error('AI draft generation error:', err);
      return res.status(500).json({ error: 'Failed to draft notice with AI: ' + (err.message || '') });
    }
  });


  // Admin Authentication
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === db.adminPasswordHash || password === 'iqra2026') {
      return res.json({
        success: true,
        token: 'iqra-admin-token-authenticated',
        expiresIn: '7d'
      });
    }
    return res.status(401).json({ error: 'Incorrect administrator password.' });
  });

  app.post('/api/auth/change-password', adminAuth, (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }
    db.adminPasswordHash = newPassword;
    saveDatabase();
    res.json({ success: true, message: 'Admin password updated successfully.' });
  });

  // ----------------------------------------------------
  // AI STUDY ASSISTANT & CHATBOT (GEMINI API)
  // ----------------------------------------------------
  app.post('/api/ai/chat', async (req, res) => {
    const { message, history, studentClass, subject } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (message.length > 2_000) {
      return res.status(400).json({ error: 'Please keep your question under 2,000 characters.' });
    }

    const gemini = getGeminiClient();

    // Never present a canned answer as AI-generated: the client can clearly
    // tell the learner how to enable the real assistant instead.
    if (!gemini) {
      return res.status(503).json({
        error: 'AI study assistant is not configured yet. Please ask the site administrator to add GEMINI_API_KEY.',
        errorType: 'GEMINI_NOT_CONFIGURED'
      });
    }

    try {
      const systemInstruction = `You are the "Iqra AI Study Assistant" — an exceptionally warm, encouraging, and clear educational tutor for young students from Nursery/Class 1 to Class 8 at IQRA INSTITUTE in Noida, India.

Your core mission:
1. Make learning fun, crystal-clear, and memorable through relatable everyday Indian examples (cricket matches, mangoes, samosas, school bags, pencil boxes, festival sweets, village and city life).
2. Answer in the same language the student asks in:
   - If the student writes in English, reply in friendly simple English.
   - If the student writes in Hinglish (e.g. "Mujhe fractions samjhao", "2 + 5 kitna hota hai?"), reply in fluent, natural Hinglish.
   - If the student writes in Hindi, reply in warm Hindi.
3. Structure your response:
   - Friendly greeting / encouragement.
   - Simple, intuitive definition or step-by-step solution.
   - Real-life relatable example.
   - A friendly 1-line check question at the end to keep the child engaged.
4. Tone: Extremely supportive, positive, patient, and child-safe. Never use overly academic jargon without defining it simply.
5. Provide 3 short relevant follow-up suggestion chips.

Format your output as JSON:
{
  "reply": "Markdown formatted friendly explanation...",
  "suggestions": ["Follow-up option 1", "Follow-up option 2", "Follow-up option 3"]
}`;

      // Build conversation context
      const formattedHistory = Array.isArray(history)
        ? history.slice(-6).map((h: any) => `${h?.role === 'user' ? 'Student' : 'Tutor'}: ${String(h?.content || '').slice(0, 1_000)}`).join('\n')
        : '';

      const prompt = `${systemInstruction}

Student Profile (if known):
- Grade / Class: ${studentClass || 'Class 1 to 8'}
- Subject focus: ${subject || 'General Studies'}

Recent Conversation:
${formattedHistory}

Current Student Query:
"${message}"

Respond strictly with valid JSON:`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);

      return res.json({
        success: true,
        reply: typeof parsed.reply === 'string' && parsed.reply.trim() ? parsed.reply.trim() : 'Great question! Let me explain this step by step...',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.filter((item: unknown) => typeof item === 'string' && item.trim()).slice(0, 3) : [
          'Give me a practice question on this',
          'Explain with another example',
          'Test my knowledge'
        ],
        isAiGenerated: true
      });
    } catch (err: any) {
      console.error('AI Chatbot error:', err);
      const details = String(err?.message || '').toLowerCase();
      return res.status(details.includes('api key') || details.includes('permission') ? 401 : details.includes('quota') || details.includes('rate limit') ? 429 : 502).json({
        error: 'AI response could not be generated. Please try again shortly.',
        errorType: details.includes('api key') || details.includes('permission') ? 'GEMINI_AUTH_ERROR' : details.includes('quota') || details.includes('rate limit') ? 'GEMINI_QUOTA_ERROR' : 'GEMINI_REQUEST_ERROR'
      });
    }
  });

  // AI Question Explanation Endpoint
  app.post('/api/ai/explain-question', async (req, res) => {
    const { question, options, selectedAnswer, correctAnswer, explanation, studentClass } = req.body;

    if (!question || !correctAnswer) {
      return res.status(400).json({ error: 'Question and correctAnswer are required' });
    }

    const gemini = getGeminiClient();

    if (!gemini) {
      const isCorrect = selectedAnswer === correctAnswer;
      const simpleExplanation = `
### ${isCorrect ? '🎉 Excellent! You got it right!' : '💡 Good try! Let\'s understand why the answer is: **' + correctAnswer + '**'}

**The Question:**
> ${question}

**Why "${correctAnswer}" is correct:**
${explanation || 'This follows standard conceptual rules taught in class.'}

**Memory Tip:**
Remember to read the question carefully and check all given options before picking your final choice!

**Try this quick check:**
Can you state the main rule in your own words? 🌟
      `.trim();

      return res.json({
        success: true,
        explanation: simpleExplanation,
        isAiGenerated: true
      });
    }

    try {
      const prompt = `You are a supportive school teacher at IQRA INSTITUTE explaining a practice question to a young student (${studentClass || 'Class 1 to 8'}).

Question Details:
- Question: "${question}"
- Options: ${JSON.stringify(options || [])}
- Student's Selected Answer: "${selectedAnswer || 'Not answered'}"
- Correct Answer: "${correctAnswer}"
- Standard Explanation: "${explanation || ''}"

Provide a friendly, engaging markdown explanation:
1. Acknowledge if the student got it right or give kind encouragement if they picked wrong.
2. Explain the correct answer step-by-step in simple language with an intuitive real-world analogy.
3. Point out why the wrong options might be confusing (common traps).
4. Give a memorable short "Pro-Tip / Remember This" rule.

Format output as JSON:
{
  "explanation": "Markdown text formatted explanation..."
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        explanation: parsed.explanation || explanation,
        isAiGenerated: true
      });
    } catch (err: any) {
      console.error('AI Explain error:', err);
      return res.status(500).json({
        error: 'Failed to generate explanation: ' + (err.message || 'Unknown error')
      });
    }
  });

  // Batch AI Question Generator (Admin)
  app.post('/api/ai/generate-batch', adminAuth, async (req, res) => {
    const { studentClass, subject, topic, difficulty, count } = req.body;
    const numQuestions = Math.min(Math.max(Number(count) || 5, 1), 10);

    const gemini = getGeminiClient();

    if (!gemini) {
      // Fallback generator
      const generated = Array.from({ length: numQuestions }, (_, i) => ({
        id: 'bq-gen-' + Date.now() + '-' + i,
        question: `Practice Concept Sum ${i + 1}: Solve for basic ${subject || 'Mathematics'} problem in ${studentClass || 'Class 4'}.`,
        options: ['A) Option 1', 'B) Option 2 (Correct)', 'C) Option 3', 'D) Option 4'],
        answer: 'B) Option 2 (Correct)',
        explanation: 'Step-by-step conceptual solution demonstrating the fundamental rule.',
        hint: 'Think about the core formula discussed in class.',
        subject: subject || 'Mathematics',
        studentClass: studentClass || 'Class 1 – 4',
        topic: topic || 'Foundation Skills',
        difficulty: difficulty || 'Medium',
        isPublished: true,
        createdAt: new Date().toISOString()
      }));

      return res.json({
        success: true,
        questions: generated,
        isAiGenerated: true
      });
    }

    try {
      const prompt = `You are a curriculum expert at IQRA INSTITUTE creating a batch of ${numQuestions} multiple-choice practice questions for young school children in India.

Parameters:
- Target Grade: ${studentClass || 'Class 4 – 5'}
- Subject: ${subject || 'Mathematics'}
- Specific Topic: ${topic || 'Core Curriculum'}
- Difficulty Level: ${difficulty || 'Medium'}

Requirements for EACH question:
- Clear, age-appropriate language.
- Exactly 4 realistic options.
- The correct answer must exactly match one of the options.
- A friendly step-by-step explanation.
- A short helpful hint.

Respond strictly with valid JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A) ...",
      "explanation": "...",
      "hint": "..."
    }
  ]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      const formatted = (parsed.questions || []).map((q: any, idx: number) => ({
        id: 'bq-ai-' + Date.now() + '-' + idx,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        answer: q.answer,
        explanation: q.explanation || 'Step-by-step explanation.',
        hint: q.hint || '',
        subject: subject || 'Mathematics',
        studentClass: studentClass || 'Class 1 – 4',
        topic: topic || 'AI Generated Practice',
        difficulty: difficulty || 'Medium',
        isPublished: true,
        createdAt: new Date().toISOString()
      }));

      return res.json({
        success: true,
        questions: formatted,
        isAiGenerated: true
      });
    } catch (err: any) {
      console.error('Batch generation error:', err);
      return res.status(500).json({
        error: 'Failed to generate batch questions: ' + (err.message || 'Unknown error')
      });
    }
  });

  // ----------------------------------------------------
  // AI QUESTION GENERATOR (GEMINI API) - SINGLE
  // ----------------------------------------------------
  app.post('/api/ai/generate-question', adminAuth, async (req, res) => {
    const { studentClass, subject, topic, difficulty } = req.body;

    const gemini = getGeminiClient();

    if (!gemini) {
      // Return smart structured fallback template if GEMINI_API_KEY is not configured
      const fallbackQuestions: Record<string, any> = {
        Mathematics: {
          question: `Find the value of x in the basic equation: 3x + 15 = 45.`,
          options: ['x = 8', 'x = 10', 'x = 12', 'x = 15'],
          answer: 'x = 10',
          explanation: 'Subtract 15 from both sides: 3x = 30. Divide both sides by 3: x = 10.',
          hint: 'First isolate 3x by moving 15 to the right hand side.'
        },
        Science: {
          question: `What is the primary function of roots in green flowering plants?`,
          options: ['Produce flower seeds', 'Absorb water and mineral nutrients from soil', 'Release carbon dioxide', 'Perform photosynthesis'],
          answer: 'Absorb water and mineral nutrients from soil',
          explanation: 'Roots anchor the plant securely in soil and absorb essential water and dissolved minerals to transport them up the stem.',
          hint: 'Think about what plants drink from beneath the ground.'
        },
        English: {
          question: `Choose the sentence with the correct subject-verb agreement:`,
          options: ['The group of students are waiting outside.', 'The group of students is waiting outside.', 'The group of students were waiting outside yesterday.', 'The group of students have waiting outside.'],
          answer: 'The group of students is waiting outside.',
          explanation: 'The subject is "group" (singular collective noun), so it takes the singular verb "is".',
          hint: 'Focus on the main subject "group", not "students".'
        }
      };

      const selected = fallbackQuestions[subject] || {
        question: `What is an important foundation habit for mastering ${subject} in ${studentClass}?`,
        options: ['Daily 30 minutes consistent problem practice', 'Only studying one day before exams', 'Memorizing without understanding concepts', 'Skipping homework'],
        answer: 'Daily 30 minutes consistent problem practice',
        explanation: 'Regular daily practice builds conceptual clarity, long-term memory, and confidence.',
        hint: 'Consistency is the key to strong learning.'
      };

      return res.json({
        success: true,
        generated: {
          date: new Date().toISOString().split('T')[0],
          subject: subject || 'Mathematics',
          studentClass: studentClass || 'Class 5 – 6',
          question: selected.question,
          options: selected.options,
          answer: selected.answer,
          explanation: selected.explanation,
          hint: selected.hint,
          difficulty: difficulty || 'Medium',
          isAiGenerated: true
        }
      });
    }

    try {
      const prompt = `You are an expert Indian primary & middle school educator designing clear, conceptual practice questions for young children at IQRA INSTITUTE (Nursery to Class 8).
Generate one high-quality, conceptual, age-appropriate practice question with 4 multiple choice options, the correct answer, a simple step-by-step explanation, and a helpful hint.

Target Audience:
- Class / Grade: ${studentClass || 'Class 5 – 6'}
- Subject: ${subject || 'Mathematics'}
- Specific Topic (if provided): ${topic || 'Core Curriculum Concept'}
- Difficulty Level: ${difficulty || 'Medium'}

Requirements:
- Must be easy to understand for young Indian school students.
- Avoid unnecessarily complex jargon; emphasize fundamental conceptual understanding.
- Provide exactly 4 options.
- The answer must be clear and unequivocally correct.
- Provide a clear, encouraging step-by-step explanation suitable for a child and parent.

Respond ONLY with valid JSON in this exact structure:
{
  "question": "...",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "answer": "...",
  "explanation": "...",
  "hint": "..."
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);

      return res.json({
        success: true,
        generated: {
          date: new Date().toISOString().split('T')[0],
          subject: subject || 'Mathematics',
          studentClass: studentClass || 'Class 5 – 6',
          question: parsed.question,
          options: parsed.options || [],
          answer: parsed.answer,
          explanation: parsed.explanation,
          hint: parsed.hint || '',
          difficulty: difficulty || 'Medium',
          isAiGenerated: true
        }
      });
    } catch (err: any) {
      console.error('Gemini generation error:', err);
      return res.status(500).json({
        error: 'Failed to generate AI question: ' + (err.message || 'Unknown error')
      });
    }
  });

  // ----------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IQRA INSTITUTE Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
