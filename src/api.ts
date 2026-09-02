import {
  WebsiteSettings,
  ClassFeeItem,
  Teacher,
  DailyQuestion,
  QuestionBankItem,
  QuestionBankStats,
  AIStudyChatPayload,
  AIExplainQuestionPayload,
  NewsUpdate,
  Testimonial,
  GalleryItem,
  FAQItem,
  TrialRequest,
  AdminStats,
  AIQuestionPrompt,
  ParentContact,
  NotificationTemplate,
  NotificationLog,
  SendNotificationPayload,
  AINotificationPrompt
} from './types.js';


const getAuthHeaders = () => {
  const token = localStorage.getItem('iqra_admin_token') || 'iqra2026';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  // Settings
  async getSettings(): Promise<WebsiteSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to load settings');
      return await res.json();
    } catch {
      return {
        instituteName: 'IQRA INSTITUTE',
        tagline: 'Foundation Learning for Young Children',
        phone: '8882257389',
        whatsapp: '7678365870',
        address: 'Easily accessible center for young learners (Nursery to Class 8)',
        announcement: 'Admissions Open for Nursery to Class 8! Join our 3-Day Free Trial Class today.',
        announcementActive: true,
        email: 'abulques263@gmail.com',
        timing: 'Morning & Evening Batches (Monday to Saturday)',
        heroBadge: 'Nursery to Class 8 • Foundation Learning Support',
        heroDescription: 'IQRA INSTITUTE focuses on developing children’s academic foundation, conceptual understanding, discipline, and useful daily study habits from an early age. We believe in understanding concepts rather than rote memorization.'
      };
    }
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const data = await res.json();
    return data.settings;
  },

  async saveSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    return this.updateSettings(settings);
  },

  // Classes & Fees
  async getClasses(): Promise<ClassFeeItem[]> {
    const res = await fetch('/api/classes');
    if (!res.ok) throw new Error('Failed to load classes');
    return await res.json();
  },

  async saveClasses(classes: ClassFeeItem[]): Promise<ClassFeeItem[]> {
    const res = await fetch('/api/classes', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(classes)
    });
    if (!res.ok) throw new Error('Failed to save classes');
    const data = await res.json();
    return data.classes;
  },

  async updateClass(id: string, item: Partial<ClassFeeItem>): Promise<ClassFeeItem> {
    const res = await fetch(`/api/classes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update class');
    const data = await res.json();
    return data.item;
  },

  async createClass(item: Partial<ClassFeeItem>): Promise<ClassFeeItem> {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to create class');
    const data = await res.json();
    return data.item;
  },

  async deleteClass(id: string): Promise<void> {
    const res = await fetch(`/api/classes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete class');
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    const res = await fetch('/api/teachers');
    if (!res.ok) throw new Error('Failed to load teachers');
    return await res.json();
  },

  async saveTeachers(teachers: Teacher[]): Promise<Teacher[]> {
    const res = await fetch('/api/teachers', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(teachers)
    });
    if (!res.ok) throw new Error('Failed to save teachers');
    const data = await res.json();
    return data.teachers;
  },

  async updateTeacher(id: string, teacher: Partial<Teacher>): Promise<Teacher> {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(teacher)
    });
    if (!res.ok) throw new Error('Failed to update teacher');
    const data = await res.json();
    return data.item;
  },

  async createTeacher(teacher: Partial<Teacher>): Promise<Teacher> {
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(teacher)
    });
    if (!res.ok) throw new Error('Failed to create teacher');
    const data = await res.json();
    return data.item;
  },

  async deleteTeacher(id: string): Promise<void> {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete teacher');
  },

  // Daily Questions
  async getDailyQuestions(subject?: string, studentClass?: string): Promise<DailyQuestion[]> {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (studentClass) params.append('studentClass', studentClass);
    const res = await fetch(`/api/daily-questions?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load daily questions');
    return await res.json();
  },

  async saveDailyQuestions(questions: DailyQuestion[]): Promise<DailyQuestion[]> {
    const res = await fetch('/api/daily-questions', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(questions)
    });
    if (!res.ok) throw new Error('Failed to save questions');
    const data = await res.json();
    return data.dailyQuestions;
  },

  async getAllDailyQuestions(): Promise<DailyQuestion[]> {
    const res = await fetch('/api/daily-questions/all', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load all daily questions');
    return await res.json();
  },

  async getTodayQuestion(): Promise<DailyQuestion | null> {
    const res = await fetch('/api/daily-questions/today');
    if (!res.ok) return null;
    return await res.json();
  },

  async createDailyQuestion(q: Partial<DailyQuestion>): Promise<DailyQuestion> {
    const res = await fetch('/api/daily-questions', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(q)
    });
    if (!res.ok) throw new Error('Failed to create question');
    const data = await res.json();
    return data.item;
  },

  async updateDailyQuestion(id: string, q: Partial<DailyQuestion>): Promise<DailyQuestion> {
    const res = await fetch(`/api/daily-questions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(q)
    });
    if (!res.ok) throw new Error('Failed to update question');
    const data = await res.json();
    return data.item;
  },

  async deleteDailyQuestion(id: string): Promise<void> {
    const res = await fetch(`/api/daily-questions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete question');
  },

  // ----------------------------------------------------
  // 1,000+ QUESTION BANK & PRACTICE API
  // ----------------------------------------------------
  async getQuestionBankStats(): Promise<QuestionBankStats> {
    try {
      const res = await fetch('/api/questions/stats');
      if (!res.ok) throw new Error('Failed to load stats');
      return await res.json();
    } catch {
      return { totalCount: 1000, bySubject: {}, byClass: {}, byDifficulty: {} };
    }
  },

  async getQuestionBank(params?: {
    subject?: string;
    studentClass?: string;
    topic?: string;
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ questions: QuestionBankItem[]; total: number; page: number; totalPages: number; limit: number }> {
    const query = new URLSearchParams();
    if (params?.subject) query.set('subject', params.subject);
    if (params?.studentClass) query.set('studentClass', params.studentClass);
    if (params?.topic) query.set('topic', params.topic);
    if (params?.difficulty) query.set('difficulty', params.difficulty);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const res = await fetch(`/api/questions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load question bank');
    return await res.json();
  },

  async getPracticeQuestions(params: {
    studentClass?: string;
    subject?: string;
    topic?: string;
    difficulty?: string;
    count?: number;
  }): Promise<QuestionBankItem[]> {
    const query = new URLSearchParams();
    if (params.studentClass) query.set('studentClass', params.studentClass);
    if (params.subject) query.set('subject', params.subject);
    if (params.topic) query.set('topic', params.topic);
    if (params.difficulty) query.set('difficulty', params.difficulty);
    if (params.count) query.set('count', String(params.count));

    const res = await fetch(`/api/questions/random-practice?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load practice questions');
    return await res.json();
  },

  async getQuestionTopics(subject?: string, studentClass?: string): Promise<string[]> {
    const query = new URLSearchParams();
    if (subject) query.set('subject', subject);
    if (studentClass) query.set('studentClass', studentClass);

    try {
      const res = await fetch(`/api/questions/topics?${query.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.topics || [];
    } catch {
      return [];
    }
  },

  async createQuestion(item: Partial<QuestionBankItem>): Promise<QuestionBankItem> {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to create question');
    const data = await res.json();
    return data.item;
  },

  async updateQuestion(id: string, item: Partial<QuestionBankItem>): Promise<QuestionBankItem> {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update question');
    const data = await res.json();
    return data.item;
  },

  async deleteQuestion(id: string): Promise<void> {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete question');
  },

  async bulkImportQuestions(questions: any[]): Promise<{ success: boolean; addedCount: number; totalCount: number }> {
    const res = await fetch('/api/questions/bulk-import', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ questions })
    });
    if (!res.ok) throw new Error('Failed to import questions');
    return await res.json();
  },

  async exportAllQuestions(): Promise<{ count: number; questions: QuestionBankItem[] }> {
    const res = await fetch('/api/questions/export/all', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to export questions');
    return await res.json();
  },

  // ----------------------------------------------------
  // AI STUDY ASSISTANT & CHAT
  // ----------------------------------------------------
  async sendStudyChatMessage(payload: AIStudyChatPayload): Promise<{ reply: string; suggestions?: string[] }> {
    const res = await fetch('https://iqra-institute.vercel.app/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to get AI study response');
    }
    return await res.json();
  },

  async explainQuestionWithAi(payload: AIExplainQuestionPayload): Promise<{ explanation: string }> {
    const res = await fetch('https://iqra-institute.vercel.app/api/ai/explain-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate AI explanation');
    }
    return await res.json();
  },

  async generateAiQuestionBatch(params: {
    studentClass: string;
    subject: string;
    topic?: string;
    difficulty: string;
    count?: number;
  }): Promise<QuestionBankItem[]> {
    const res = await fetch('/api/ai/generate-batch', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate question batch');
    }
    const data = await res.json();
    return data.questions || [];
  },

  // AI Question Generator
  async generateAiQuestion(promptData: { subject: string; targetClass?: string; studentClass?: string; topic?: string; difficulty?: string }): Promise<DailyQuestion> {
    const payload: AIQuestionPrompt = {
      subject: promptData.subject,
      studentClass: promptData.studentClass || promptData.targetClass || 'Class 1 – 4',
      topic: promptData.topic || '',
      difficulty: (promptData.difficulty as any) || 'Easy'
    };

    const res = await fetch('/api/ai/generate-question', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate question with AI');
    }
    const data = await res.json();
    const gen = data.generated;
    return {
      id: 'dq-' + Date.now(),
      date: gen.date || new Date().toISOString().split('T')[0],
      subject: gen.subject,
      studentClass: gen.studentClass,
      question: gen.question,
      options: gen.options,
      answer: gen.answer,
      explanation: gen.explanation,
      hint: gen.hint,
      difficulty: gen.difficulty,
      isPublished: true,
      createdAt: new Date().toISOString()
    };
  },

  // News Updates
  async getNews(): Promise<NewsUpdate[]> {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error('Failed to load news');
    return await res.json();
  },

  async saveNews(news: NewsUpdate[]): Promise<NewsUpdate[]> {
    const res = await fetch('/api/news', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(news)
    });
    if (!res.ok) throw new Error('Failed to save news');
    const data = await res.json();
    return data.news;
  },

  async getAllNews(): Promise<NewsUpdate[]> {
    const res = await fetch('/api/news/all', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load news list');
    return await res.json();
  },

  async createNews(item: Partial<NewsUpdate>): Promise<NewsUpdate> {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to create news');
    const data = await res.json();
    return data.item;
  },

  async updateNews(id: string, item: Partial<NewsUpdate>): Promise<NewsUpdate> {
    const res = await fetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update news');
    const data = await res.json();
    return data.item;
  },

  async deleteNews(id: string): Promise<void> {
    const res = await fetch(`/api/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete news');
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to load testimonials');
    return await res.json();
  },

  async saveTestimonials(testimonials: Testimonial[]): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(testimonials)
    });
    if (!res.ok) throw new Error('Failed to save testimonials');
    const data = await res.json();
    return data.testimonials;
  },

  async getAllTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials/all', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load all testimonials');
    return await res.json();
  },

  async createTestimonial(item: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to create testimonial');
    const data = await res.json();
    return data.item;
  },

  async updateTestimonial(id: string, item: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update testimonial');
    const data = await res.json();
    return data.item;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch('/api/gallery');
    if (!res.ok) throw new Error('Failed to load gallery');
    return await res.json();
  },

  async saveGallery(gallery: GalleryItem[]): Promise<GalleryItem[]> {
    const res = await fetch('/api/gallery', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(gallery)
    });
    if (!res.ok) throw new Error('Failed to save gallery');
    const data = await res.json();
    return data.gallery;
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add gallery image');
    const data = await res.json();
    return data.item;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  // FAQs
  async getFAQs(): Promise<FAQItem[]> {
    const res = await fetch('/api/faqs');
    if (!res.ok) throw new Error('Failed to load FAQs');
    return await res.json();
  },

  async getFaqs(): Promise<FAQItem[]> {
    return this.getFAQs();
  },

  async saveFaqs(faqs: FAQItem[]): Promise<FAQItem[]> {
    const res = await fetch('/api/faqs', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(faqs)
    });
    if (!res.ok) throw new Error('Failed to save FAQs');
    const data = await res.json();
    return data.faqs;
  },

  async createFAQ(item: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to create FAQ');
    const data = await res.json();
    return data.item;
  },

  async updateFAQ(id: string, item: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update FAQ');
    const data = await res.json();
    return data.item;
  },

  async deleteFAQ(id: string): Promise<void> {
    const res = await fetch(`/api/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete FAQ');
  },

  // Trial Requests / Admissions
  async submitTrialRequest(lead: Omit<TrialRequest, 'id' | 'status' | 'createdAt' | 'notes'>): Promise<{ success: boolean; message: string; leadId: string }> {
    const res = await fetch('/api/trial-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit trial request');
    }
    return await res.json();
  },

  async getTrialRequests(): Promise<TrialRequest[]> {
    const res = await fetch('/api/trial-requests', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load trial requests');
    return await res.json();
  },

  async getLeads(): Promise<TrialRequest[]> {
    return this.getTrialRequests();
  },

  async updateTrialRequest(id: string, lead: Partial<TrialRequest>): Promise<TrialRequest> {
    const res = await fetch(`/api/trial-requests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(lead)
    });
    if (!res.ok) throw new Error('Failed to update lead');
    const data = await res.json();
    return data.item;
  },

  async updateLeadStatus(id: string, status: string, notes?: string): Promise<TrialRequest> {
    return this.updateTrialRequest(id, { status: status as any, notes });
  },

  async deleteTrialRequest(id: string): Promise<void> {
    const res = await fetch(`/api/trial-requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete lead');
  },

  async deleteLead(id: string): Promise<void> {
    return this.deleteTrialRequest(id);
  },

  // Admin Stats
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load stats');
    return await res.json();
  },

  // ----------------------------------------------------
  // PARENT CONTACT DIRECTORY
  // ----------------------------------------------------
  async getParents(params?: { studentClass?: string; status?: string; search?: string }): Promise<ParentContact[]> {
    const q = new URLSearchParams();
    if (params?.studentClass) q.append('studentClass', params.studentClass);
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);

    const res = await fetch(`/api/parents?${q.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load parent contacts');
    return await res.json();
  },

  async createParent(parent: Partial<ParentContact>): Promise<ParentContact> {
    const res = await fetch('/api/parents', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(parent)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create parent contact');
    }
    const data = await res.json();
    return data.item;
  },

  async bulkImportParents(parents: Partial<ParentContact>[]): Promise<{ success: boolean; addedCount: number; totalParents: number }> {
    const res = await fetch('/api/parents/bulk', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ parents })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to import parent contacts');
    }
    return await res.json();
  },

  async updateParent(id: string, parent: Partial<ParentContact>): Promise<ParentContact> {
    const res = await fetch(`/api/parents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(parent)
    });
    if (!res.ok) throw new Error('Failed to update parent contact');
    const data = await res.json();
    return data.item;
  },

  async deleteParent(id: string): Promise<void> {
    const res = await fetch(`/api/parents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete parent contact');
  },

  async convertLeadToParent(leadId: string, email?: string): Promise<ParentContact> {
    const res = await fetch(`/api/parents/convert-from-lead/${leadId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to convert lead to parent contact');
    }
    const data = await res.json();
    return data.item;
  },

  // ----------------------------------------------------
  // NOTIFICATION TEMPLATES
  // ----------------------------------------------------
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    const res = await fetch('/api/notification-templates', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load notification templates');
    return await res.json();
  },

  async createNotificationTemplate(item: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const res = await fetch('/api/notification-templates', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create template');
    }
    const data = await res.json();
    return data.item;
  },

  async updateNotificationTemplate(id: string, item: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const res = await fetch(`/api/notification-templates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update template');
    const data = await res.json();
    return data.item;
  },

  async deleteNotificationTemplate(id: string): Promise<void> {
    const res = await fetch(`/api/notification-templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete template');
  },

  // ----------------------------------------------------
  // NOTIFICATION LOGS & EMAIL DISPATCH
  // ----------------------------------------------------
  async getNotificationLogs(): Promise<NotificationLog[]> {
    const res = await fetch('/api/notification-logs', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load notification logs');
    return await res.json();
  },

  async deleteNotificationLog(id: string): Promise<void> {
    const res = await fetch(`/api/notification-logs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete notification log');
  },

  async getSmtpStatus(): Promise<{ isConfigured: boolean; host: string; port: number; fromAddress: string; activeParentCount: number; totalParentCount: number }> {
    const res = await fetch('/api/notifications/smtp-status', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load SMTP status');
    return await res.json();
  },

  async testSmtp(payload: { testEmail: string; subject?: string; messageBody?: string; category?: string }): Promise<{ success: boolean; mode: string; message: string; previewHtml?: string }> {
    const res = await fetch('/api/notifications/test-smtp', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send test email');
    }
    return await res.json();
  },

  async sendNotification(payload: SendNotificationPayload): Promise<{ success: boolean; log: NotificationLog; successCount: number; failCount: number; isSimulated: boolean; message: string }> {
    const res = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to dispatch notifications');
    }
    return await res.json();
  },

  async generateAiNotificationDraft(prompt: AINotificationPrompt): Promise<{ success: boolean; subject: string; body: string }> {
    const res = await fetch('/api/notifications/ai-draft', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(prompt)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate AI notice draft');
    }
    return await res.json();
  },

  // Auth
  async loginAdmin(password: string): Promise<{ success: boolean; token: string }> {

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid credentials');
    }
    const data = await res.json();
    localStorage.setItem('iqra_admin_token', data.token);
    return data;
  },

  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    return this.loginAdmin(password);
  },

  async changePassword(newPassword: string): Promise<void> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to change password');
    }
  },

  logoutAdmin(): void {
    localStorage.removeItem('iqra_admin_token');
  },

  adminLogout(): void {
    this.logoutAdmin();
  },

  isAdminLoggedIn(): boolean {
    return Boolean(localStorage.getItem('iqra_admin_token'));
  }
};
