export type SubjectCategory = 'Mathematics' | 'Science' | 'English' | 'General Knowledge' | 'Reasoning' | 'Basic Concepts';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Challenging';

export type LeadStatus = 'new' | 'contacted' | 'trial_scheduled' | 'trial_active' | 'enrolled' | 'closed';

export interface WebsiteSettings {
  instituteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  announcement: string;
  announcementActive: boolean;
  email: string;
  timing: string;
  logoUrl?: string;
  heroBadge?: string;
  heroDescription?: string;
}

export interface ClassFeeItem {
  id: string;
  name: string;
  gradeRange: string;
  monthlyFee: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  order: number;
}

export interface Teacher {
  id: string;
  name: string;
  qualification: string;
  role: string;
  subjects?: string[];
  photoUrl?: string;
  teachingPhilosophy?: string;
  order: number;
}

export type TrialRequest = {
  id: string;
  studentName: string;
  parentName: string;
  studentClass: string;
  age: string;
  phone: string;
  whatsapp: string;
  preferredTime: string;
  message?: string;
  status: LeadStatus | string;
  createdAt: string;
  notes?: string;
};

export type AdmissionLead = TrialRequest;

export interface DailyQuestion {
  id: string;
  date: string; // YYYY-MM-DD
  subject: SubjectCategory;
  studentClass: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  hint?: string;
  difficulty: DifficultyLevel;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  description: string;
  category: 'Holiday' | 'Test Notice' | 'Batch Update' | 'Timing' | 'Admission' | 'Institute Activity';
  date: string;
  imageUrl?: string;
  isPublished: boolean;
  isImportant?: boolean;
}

export interface Testimonial {
  id: string;
  parentName: string;
  studentName?: string;
  studentClass: string;
  quote: string;
  rating: number;
  photoUrl?: string;
  isPublished: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Classroom' | 'Students' | 'Activities' | 'Books' | 'Learning Environment';
  imageUrl: string;
  caption: string;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface ParentContact {
  id: string;
  parentName: string;
  studentName: string;
  studentClass: string;
  email: string;
  phone: string;
  whatsapp?: string;
  batchTiming?: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  lastNotifiedAt?: string;
}

export type NotificationCategory =
  | 'Holiday'
  | 'Test Schedule'
  | 'Progress Update'
  | 'Fee Notice'
  | 'General Announcement'
  | 'Emergency';

export interface NotificationTemplate {
  id: string;
  name: string;
  category: NotificationCategory;
  subject: string;
  body: string;
  isDefault?: boolean;
}

export interface NotificationRecipientLog {
  parentId?: string;
  parentName: string;
  studentName: string;
  studentClass: string;
  email: string;
  status: 'sent' | 'simulated' | 'failed';
  deliveredAt: string;
  error?: string;
}

export interface NotificationLog {
  id: string;
  subject: string;
  category: NotificationCategory;
  messageBody: string;
  targetGroup: 'all' | 'class' | 'selected';
  targetClassName?: string;
  recipientCount: number;
  recipients: NotificationRecipientLog[];
  sentAt: string;
  sentBy: string;
  emailMode: 'smtp' | 'simulated' | 'sandbox';
  status: 'success' | 'partial' | 'failed';
  smtpSummary?: string;
}

export interface SendNotificationPayload {
  subject: string;
  category: NotificationCategory;
  messageBody: string;
  targetGroup: 'all' | 'class' | 'selected';
  targetClassName?: string;
  selectedParentIds?: string[];
  testEmail?: string;
  sendTestOnly?: boolean;
}

export interface AdminStats {
  totalLeads: number;
  newLeads: number;
  dailyQuestionsCount: number;
  newsCount: number;
  galleryCount: number;
  testimonialsCount: number;
  totalParents?: number;
  activeParents?: number;
  notificationsSentCount?: number;
}

export interface AIQuestionPrompt {
  studentClass: string;
  subject: string;
  topic?: string;
  difficulty: DifficultyLevel;
}

export interface QuestionBankItem extends DailyQuestion {
  topic?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface AIStudyChatPayload {
  message: string;
  history?: { role: string; content: string }[];
  studentClass?: string;
  subject?: string;
}

export interface AIExplainQuestionPayload {
  question: string;
  options?: string[];
  selectedAnswer?: string;
  correctAnswer: string;
  explanation: string;
  studentClass?: string;
}

export interface PracticeSessionConfig {
  studentClass: string;
  subject: string;
  topic?: string;
  difficulty?: string;
  count: number;
}

export interface PracticeQuestionAttempt {
  questionId: string;
  question: string;
  subject: string;
  studentClass: string;
  options?: string[];
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  hint?: string;
}

export interface PracticeSessionResult {
  sessionId: string;
  config: PracticeSessionConfig;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  attempts: PracticeQuestionAttempt[];
  completedAt: string;
}

export interface QuestionBankStats {
  totalCount: number;
  bySubject: Record<string, number>;
  byClass: Record<string, number>;
  byDifficulty: Record<string, number>;
}

export interface AINotificationPrompt {
  category: NotificationCategory;
  targetClass?: string;
  topicOrKeyPoints: string;
  tone?: 'polite' | 'urgent' | 'encouraging' | 'formal';
}

