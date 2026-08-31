import React, { useState, useEffect } from 'react';
import {
  WebsiteSettings,
  ClassFeeItem,
  Teacher,
  DailyQuestion,
  NewsUpdate,
  AdmissionLead,
  GalleryItem,
  Testimonial,
  FAQItem
} from '../../types.js';
import { api } from '../../api.js';
import { ParentNotificationSystem } from './ParentNotificationSystem.js';
import { QuestionBankManager } from './QuestionBankManager.js';
import {
  Lock,
  LogOut,
  Settings as SettingsIcon,
  Layers,
  Users,
  Brain,
  Bell,
  UserCheck,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Phone,
  MessageCircle,
  Download,
  ExternalLink,
  Eye,
  Mail,
  UserPlus,
  MapPin
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onDataUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onDataUpdated
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'notifications' | 'leads' | 'settings' | 'classes' | 'teachers' | 'questions' | 'news' | 'gallery' | 'testimonials' | 'faqs'
  >('notifications');


  // Data states
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [classes, setClasses] = useState<ClassFeeItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [news, setNews] = useState<NewsUpdate[]>([]);
  const [leads, setLeads] = useState<AdmissionLead[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // AI Question Generation States
  const [aiSubject, setAiSubject] = useState('Mathematics');
  const [aiClass, setAiClass] = useState('Class 1 – 4');
  const [aiTopic, setAiTopic] = useState('Multiplication patterns');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Check initial token
  useEffect(() => {
    const token = localStorage.getItem('iqra_admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadAllAdminData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.adminLogin(password);
      if (res.token) {
        setIsAuthenticated(true);
        loadAllAdminData();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid password. (Default: iqra2026)');
    }
  };

  const handleLogout = () => {
    api.adminLogout();
    setIsAuthenticated(false);
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [
        sData,
        cData,
        tData,
        qData,
        nData,
        lData,
        gData,
        tmData,
        fData
      ] = await Promise.all([
        api.getSettings(),
        api.getClasses(),
        api.getTeachers(),
        api.getDailyQuestions(),
        api.getNews(),
        api.getLeads(),
        api.getGallery(),
        api.getTestimonials(),
        api.getFaqs()
      ]);

      setSettings(sData);
      setClasses(cData);
      setTeachers(tData);
      setQuestions(qData);
      setNews(nData);
      setLeads(lData);
      setGallery(gData);
      setTestimonials(tmData);
      setFaqs(fData);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
    onDataUpdated();
  };

  // Lead conversion to enrolled parent
  const handleConvertLeadToParent = async (lead: AdmissionLead) => {
    const parentEmail = prompt(
      `Enter Parent Email to enroll ${lead.studentName} into the Parent Directory:`,
      `${lead.parentName.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`
    );
    if (!parentEmail) return;

    try {
      await api.convertLeadToParent(lead.id, parentEmail);
      showNotification(`Successfully enrolled ${lead.studentName} into Parent Directory!`);
      loadAllAdminData();
    } catch (err: any) {
      alert('Failed to enroll student: ' + err.message);
    }
  };

  // 1. Settings Save

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.saveSettings(settings);
      showNotification('Institute Settings successfully saved!');
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    }
  };

  // 2. Class actions
  const handleSaveClasses = async () => {
    try {
      await api.saveClasses(classes);
      showNotification('Classes & Fees successfully saved!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const addClassRow = () => {
    const newClass: ClassFeeItem = {
      id: 'class-' + Date.now(),
      name: 'New Class Batch',
      gradeRange: 'Class X',
      monthlyFee: 350,
      description: 'Daily conceptual learning and guided practice.',
      features: ['Daily 1.5 Hour Class', 'Concept Worksheets', 'Weekly Tests'],
      order: classes.length + 1
    };
    setClasses([...classes, newClass]);
  };

  const removeClassRow = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  // 3. Teachers actions
  const handleSaveTeachers = async () => {
    try {
      await api.saveTeachers(teachers);
      showNotification('Teachers profile successfully saved!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const addTeacherRow = () => {
    const newT: Teacher = {
      id: 'teacher-' + Date.now(),
      name: 'Faculty Name',
      qualification: 'Graduation from University of Delhi (DU)',
      role: 'Faculty Member',
      teachingPhilosophy: 'Patience and strong foundation conceptual clarity.',
      order: teachers.length + 1
    };
    setTeachers([...teachers, newT]);
  };

  // 4. Questions actions
  const handleSaveQuestions = async () => {
    try {
      await api.saveDailyQuestions(questions);
      showNotification('Daily questions updated!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const addQuestionRow = () => {
    const newQ: DailyQuestion = {
      id: 'q-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      subject: 'Mathematics',
      studentClass: 'Class 1 – 4',
      question: 'New question text goes here...',
      difficulty: 'Easy',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 'Option A',
      hint: 'Think step by step.',
      explanation: 'Explanation of the solution.',
      isPublished: true,
      createdAt: new Date().toISOString()
    };
    setQuestions([newQ, ...questions]);
  };

  const handleAiGenerate = async () => {
    setIsGeneratingAi(true);
    try {
      const generated = await api.generateAiQuestion({
        subject: aiSubject,
        targetClass: aiClass,
        topic: aiTopic
      });
      setQuestions([generated, ...questions]);
      showNotification('AI Question generated and added to list!');
    } catch (err: any) {
      alert('AI Generation error: ' + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // 5. News actions
  const handleSaveNews = async () => {
    try {
      await api.saveNews(news);
      showNotification('News & updates saved!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const addNewsRow = () => {
    const newN: NewsUpdate = {
      id: 'news-' + Date.now(),
      title: 'New Announcement Notice',
      description: 'Details regarding the schedule or announcement.',
      date: new Date().toISOString().split('T')[0],
      category: 'Admission',
      isImportant: false,
      isPublished: true
    };
    setNews([newN, ...news]);
  };

  // 6. Leads actions
  const updateLeadStatus = async (leadId: string, status: AdmissionLead['status'], notes?: string) => {
    try {
      await api.updateLeadStatus(leadId, status, notes);
      setLeads(leads.map(l => l.id === leadId ? { ...l, status, notes: notes !== undefined ? notes : l.notes } : l));
      showNotification('Lead status updated!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this admission inquiry?')) return;
    try {
      await api.deleteLead(leadId);
      setLeads(leads.filter(l => l.id !== leadId));
      showNotification('Lead deleted.');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const exportLeadsCsv = () => {
    const headers = ['Student Name', 'Parent Name', 'Class', 'Age', 'Phone', 'WhatsApp', 'Time Slot', 'Message', 'Status', 'Submitted Date'];
    const rows = leads.map(l => [
      `"${l.studentName}"`,
      `"${l.parentName}"`,
      `"${l.studentClass}"`,
      `"${l.age || ''}"`,
      `"${l.phone}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.preferredTime || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `iqra_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 7. Gallery actions
  const handleSaveGallery = async () => {
    try {
      await api.saveGallery(gallery);
      showNotification('Gallery images updated!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const addGalleryRow = () => {
    const newG: GalleryItem = {
      id: 'gallery-' + Date.now(),
      title: 'Classroom Activity',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      category: 'Classroom',
      caption: 'Focused learning atmosphere at IQRA INSTITUTE',
      order: gallery.length + 1
    };
    setGallery([...gallery, newG]);
  };

  // 8. Testimonials
  const handleSaveTestimonials = async () => {
    try {
      await api.saveTestimonials(testimonials);
      showNotification('Testimonials updated!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const addTestimonialRow = () => {
    const newTm: Testimonial = {
      id: 'testim-' + Date.now(),
      parentName: 'Parent Name',
      studentClass: 'Class 3',
      quote: 'Teachers explain concepts in a simple way and my child has become more regular with studies.',
      rating: 5,
      isPublished: true
    };
    setTestimonials([...testimonials, newTm]);
  };

  // 9. FAQs
  const handleSaveFaqs = async () => {
    try {
      await api.saveFaqs(faqs);
      showNotification('FAQs updated!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const addFaqRow = () => {
    const newF: FAQItem = {
      id: 'faq-' + Date.now(),
      question: 'New question for parents?',
      answer: 'Answer explaining details clearly.',
      order: faqs.length + 1
    };
    setFaqs([...faqs, newF]);
  };

  // --- RENDER LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black font-['Outfit'] text-slate-900">
              IQRA Institute Admin
            </h2>
            <p className="text-xs text-slate-500">
              Enter the administrator password to manage website content, fees, and trial requests.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: iqra2026)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400">Default password: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">iqra2026</code></p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs"
              >
                Back to Site
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER AUTHENTICATED DASHBOARD ---
  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-stone-50 rounded-2xl border border-stone-300 shadow-2xl w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-white px-6 py-3.5 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              IQ
            </div>
            <div>
              <h1 className="text-lg font-black font-['Outfit'] text-slate-900">
                IQRA INSTITUTE — Admin Control Panel
              </h1>
              <p className="text-xs text-slate-500">
                Live content editor & trial lead management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccessMsg && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View Live Site
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white px-6 border-b border-stone-200 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
          {[
            { id: 'notifications', name: 'Parent Notifications', icon: Mail, highlight: true },
            { id: 'leads', name: `Trial Leads (${leads.length})`, icon: UserCheck },
            { id: 'settings', name: 'General Settings', icon: SettingsIcon },
            { id: 'classes', name: 'Classes & Fees', icon: Layers },
            { id: 'teachers', name: 'Teachers', icon: Users },
            { id: 'questions', name: '1,000+ Question Bank & AI', icon: Brain, highlight: true },
            { id: 'news', name: 'Updates & Notices', icon: Bell },
            { id: 'gallery', name: 'Gallery', icon: ImageIcon },
            { id: 'testimonials', name: 'Testimonials', icon: MessageSquareQuote },
            { id: 'faqs', name: 'FAQs', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : tab.highlight
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                    : 'text-slate-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-100/50">

          {/* TAB 0: PARENT NOTIFICATIONS & ROSTER */}
          {activeTab === 'notifications' && settings && (
            <ParentNotificationSystem
              settings={settings}
              onRefreshStats={loadAllAdminData}
            />
          )}
          
          {/* TAB 1: TRIAL ADMISSION LEADS */}
          {activeTab === 'leads' && (

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Student Trial Requests & Inquiries
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total {leads.length} leads received via 3-Day Trial form and contact widget.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportLeadsCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export to CSV
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300">
                  <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No trial inquiries yet</p>
                  <p className="text-xs text-slate-400">When visitors fill the 3-day trial form, their details appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-base text-slate-900 font-['Outfit']">
                              {lead.studentName}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                              {lead.studentClass}
                            </span>
                            {lead.age && (
                              <span className="text-xs text-slate-500">({lead.age})</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Parent/Guardian: <span className="font-bold text-slate-800">{lead.parentName}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleConvertLeadToParent(lead)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Enroll and add to Parent Notification Roster"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Enroll Parent</span>
                          </button>

                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none"
                          >

                            <option value="New">New Request</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Trial Active">Trial Active</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Archived">Archived</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => deleteLead(lead.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact Channels */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 space-y-1">
                          <span className="text-slate-400 font-medium">Direct Phone:</span>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{lead.phone}</span>
                            <a href={`tel:${lead.phone}`} className="text-amber-700 font-bold hover:underline">Call</a>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 space-y-1">
                          <span className="text-emerald-700 font-medium">WhatsApp:</span>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-950">{lead.whatsapp || lead.phone}</span>
                            <a
                              href={`https://wa.me/91${lead.whatsapp || lead.phone}?text=${encodeURIComponent(`Assalamualaikum, regarding the 3-day trial class for ${lead.studentName} at IQRA INSTITUTE...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-bold hover:underline"
                            >
                              Message
                            </a>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 space-y-1">
                          <span className="text-slate-400 font-medium">Preferred Timing:</span>
                          <p className="font-bold text-slate-800 truncate">{lead.preferredTime || 'Anytime'}</p>
                        </div>
                      </div>

                      {lead.message && (
                        <div className="text-xs text-slate-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                          <span className="font-bold text-slate-700">Note/Goal:</span> {lead.message}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-400">
                        Received on: {new Date(lead.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GENERAL SETTINGS */}
          {activeTab === 'settings' && settings && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl bg-white p-6 rounded-2xl border border-stone-200">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Institute Brand & Contact Settings</h3>
                  <p className="text-xs text-slate-500">Edit core contact numbers, address, and banner notices</p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 mb-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Institute Information & Official Location
                </h4>
                <p className="text-xs text-amber-800">
                  Update the institute name, contact phone numbers, class timings, and official campus address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Institute Name</label>
                  <input
                    type="text"
                    value={settings.instituteName}
                    onChange={(e) => setSettings({ ...settings, instituteName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Primary Calling Phone (e.g. 8882257389)</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">WhatsApp Number (e.g. 7678365870)</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>Official Institute Address</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        address: '25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque'
                      })}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline"
                    >
                      Fill Official Address
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    placeholder="e.g. 25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium bg-stone-50/50 resize-none"
                  />
                  <p className="text-[11px] text-slate-500">
                    📍 Road / Street: 25 Futa Road • Area: Budh Vihar, Sector 63, Noida • Landmark: Near Gulshan-e-Tayyaba Mosque (Gali No. 23A)
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Class Timings Note</label>
                  <input
                    type="text"
                    value={settings.timing}
                    onChange={(e) => setSettings({ ...settings, timing: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Top Announcement Banner</label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={settings.announcementActive}
                      onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                      className="rounded text-amber-600"
                    />
                    <span>Active Banner</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  placeholder="e.g. New batches starting next Monday! 3-Day Free Trial open for Nursery – Class 8."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium"
                />
              </div>

              {/* Custom Logo URL */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Custom Logo Image URL (Optional)</label>
                <input
                  type="text"
                  value={settings.logoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="Paste URL of uploaded image or leave blank for default geometric logo"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>
            </form>
          )}

          {/* TAB 3: CLASSES & FEES */}
          {activeTab === 'classes' && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Classes & Monthly Fee Management</h3>
                  <p className="text-xs text-slate-500">Edit fee rates, grade ranges, and feature points.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addClassRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Class
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveClasses}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Classes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((cls, idx) => (
                  <div key={cls.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-400 font-['Outfit']">Batch #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeClassRow(cls.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block">Class Name</label>
                        <input
                          type="text"
                          value={cls.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setClasses(classes.map(c => c.id === cls.id ? { ...c, name: val } : c));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block">Monthly Fee (₹)</label>
                        <input
                          type="number"
                          value={cls.monthlyFee}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setClasses(classes.map(c => c.id === cls.id ? { ...c, monthlyFee: val } : c));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-amber-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block">Description</label>
                      <input
                        type="text"
                        value={cls.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setClasses(classes.map(c => c.id === cls.id ? { ...c, description: val } : c));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Teachers Profile Manager</h3>
                  <p className="text-xs text-slate-500">Edit teacher names, DU degree descriptions, and philosophies.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addTeacherRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Teacher
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTeachers}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Teachers
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {teachers.map((t) => (
                  <div key={t.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-bold text-sm text-slate-800">{t.name}</span>
                      <button
                        type="button"
                        onClick={() => setTeachers(teachers.filter(x => x.id !== t.id))}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block">Full Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTeachers(teachers.map(item => item.id === t.id ? { ...item, name: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block">Qualification (e.g. DU Graduate)</label>
                        <input
                          type="text"
                          value={t.qualification}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTeachers(teachers.map(item => item.id === t.id ? { ...item, qualification: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 block">Teaching Philosophy / Bio</label>
                        <input
                          type="text"
                          value={t.teachingPhilosophy || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTeachers(teachers.map(item => item.id === t.id ? { ...item, teachingPhilosophy: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 1,000+ QUESTION BANK & AI GENERATOR */}
          {activeTab === 'questions' && (
            <div className="max-w-5xl">
              <QuestionBankManager
                onDataUpdated={() => {
                  loadAllAdminData();
                  onDataUpdated();
                }}
              />
            </div>
          )}

          {/* TAB 6: UPDATES & NOTICES */}
          {activeTab === 'news' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Notices & Short Updates</h3>
                  <p className="text-xs text-slate-500">Publish holiday notices, batch starts, test announcements.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addNewsRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Update
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNews}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save All Updates
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {news.map((n) => (
                  <div key={n.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-bold text-xs text-slate-500">{n.category}</span>
                      <button
                        type="button"
                        onClick={() => setNews(news.filter(x => x.id !== n.id))}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block">Title</label>
                        <input
                          type="text"
                          value={n.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNews(news.map(item => item.id === n.id ? { ...item, title: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block">Category</label>
                        <select
                          value={n.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNews(news.map(item => item.id === n.id ? { ...item, category: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                        >
                          <option value="Admission">Admission</option>
                          <option value="Test Notice">Test Notice</option>
                          <option value="Holiday">Holiday</option>
                          <option value="Timing">Timing</option>
                          <option value="Institute Activity">Institute Activity</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 block">Description</label>
                        <textarea
                          rows={2}
                          value={n.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNews(news.map(item => item.id === n.id ? { ...item, description: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Gallery Photos</h3>
                  <p className="text-xs text-slate-500">Add or manage classroom and activity photos.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addGalleryRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Image
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveGallery}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Gallery
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
                    <div className="aspect-[16/9] rounded-lg overflow-hidden bg-stone-100">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                    </div>

                    <input
                      type="text"
                      value={g.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGallery(gallery.map(item => item.id === g.id ? { ...item, title: val } : item));
                      }}
                      placeholder="Title"
                      className="w-full px-2.5 py-1 rounded border border-stone-300 text-xs font-bold"
                    />

                    <input
                      type="text"
                      value={g.imageUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGallery(gallery.map(item => item.id === g.id ? { ...item, imageUrl: val } : item));
                      }}
                      placeholder="Image URL"
                      className="w-full px-2.5 py-1 rounded border border-stone-300 text-xs"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={g.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGallery(gallery.map(item => item.id === g.id ? { ...item, category: val } : item));
                        }}
                        className="text-xs px-2 py-1 border border-stone-300 rounded"
                      >
                        <option value="Classroom">Classroom</option>
                        <option value="Students">Students</option>
                        <option value="Activities">Activities</option>
                        <option value="Books">Books</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setGallery(gallery.filter(x => x.id !== g.id))}
                        className="text-rose-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Testimonials Manager</h3>
                  <p className="text-xs text-slate-500">Edit quotes from parents and students.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addTestimonialRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Testimonial
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTestimonials}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Testimonials
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {testimonials.map((tm) => (
                  <div key={tm.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700">{tm.parentName} ({tm.studentClass})</span>
                      <button
                        type="button"
                        onClick={() => setTestimonials(testimonials.filter(x => x.id !== tm.id))}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={tm.parentName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTestimonials(testimonials.map(item => item.id === tm.id ? { ...item, parentName: val } : item));
                        }}
                        placeholder="Parent Name"
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                      />

                      <input
                        type="text"
                        value={tm.studentClass}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTestimonials(testimonials.map(item => item.id === tm.id ? { ...item, studentClass: val } : item));
                        }}
                        placeholder="Class (e.g. Class 4)"
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={tm.quote}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTestimonials(testimonials.map(item => item.id === tm.id ? { ...item, quote: val } : item));
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-500">Edit or add questions for parents and visitors.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addFaqRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add FAQ
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFaqs}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save FAQs
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={f.question}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFaqs(faqs.map(item => item.id === f.id ? { ...item, question: val } : item));
                        }}
                        className="w-full mr-3 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setFaqs(faqs.filter(x => x.id !== f.id))}
                        className="text-stone-400 hover:text-rose-600 p-1 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={f.answer}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFaqs(faqs.map(item => item.id === f.id ? { ...item, answer: val } : item));
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
