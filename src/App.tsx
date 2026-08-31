import React, { useState, useEffect } from 'react';
import {
  WebsiteSettings,
  ClassFeeItem,
  Teacher,
  DailyQuestion,
  NewsUpdate,
  GalleryItem,
  Testimonial,
  FAQItem
} from './types.js';
import { api } from './api.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { DailyQuestionWidget } from './components/DailyQuestionWidget.js';
import { AboutSection } from './components/AboutSection.js';
import { ClassesFeesSection } from './components/ClassesFeesSection.js';
import { TeachersSection } from './components/TeachersSection.js';
import { TrialAdmissionSection } from './components/TrialAdmissionSection.js';
import { WhyChooseUsSection } from './components/WhyChooseUsSection.js';
import { DailyQuestionsArchiveModal } from './components/DailyQuestionsArchiveModal.js';
import { NewsSection } from './components/NewsSection.js';
import { GallerySection } from './components/GallerySection.js';
import { TestimonialsSection } from './components/TestimonialsSection.js';
import { FAQSection } from './components/FAQSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { AdminDashboard } from './components/Admin/AdminDashboard.js';
import { AIStudyAssistant } from './components/AIStudyAssistant.js';
import { PracticeModeModal } from './components/PracticeModeModal.js';
import { Phone, MessageCircle, Sparkles, X, Brain, Bot, HelpCircle } from 'lucide-react';

export function App() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    instituteName: 'IQRA INSTITUTE',
    tagline: 'Foundation Learning for Young Children',
    phone: '8882257389',
    whatsapp: '7678365870',
    address: '25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque',
    timing: 'Morning & Evening batches (Monday to Saturday)',
    announcement: 'Admission open for 3-Day Free Trial classes (Nursery to Class 8). Contact us today!',
    announcementActive: true,
    heroBadge: 'Nursery to Class 8 • Foundation Learning Support',
    heroDescription: 'IQRA INSTITUTE focuses on developing children’s academic foundation, conceptual understanding, discipline, and useful daily study habits from an early age. We believe in understanding concepts rather than rote memorization.'
  });

  const [classes, setClasses] = useState<ClassFeeItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [news, setNews] = useState<NewsUpdate[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Modals & Triggers
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedClassForTrial, setSelectedClassForTrial] = useState<string>('Class 1 – 4');
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [aiTutorInitialPrompt, setAiTutorInitialPrompt] = useState<string | undefined>(undefined);

  // Load data from backend
  const loadData = async () => {
    try {
      const [sData, cData, tData, qData, nData, gData, tmData, fData] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getClasses().catch(() => []),
        api.getTeachers().catch(() => []),
        api.getDailyQuestions().catch(() => []),
        api.getNews().catch(() => []),
        api.getGallery().catch(() => []),
        api.getTestimonials().catch(() => []),
        api.getFaqs().catch(() => [])
      ]);

      if (sData) setSettings(sData);
      if (cData && cData.length > 0) setClasses(cData);
      if (tData && tData.length > 0) setTeachers(tData);
      if (qData && qData.length > 0) setQuestions(qData);
      if (nData && nData.length > 0) setNews(nData);
      if (gData && gData.length > 0) setGallery(gData);
      if (tmData && tmData.length > 0) setTestimonials(tmData);
      if (fData && fData.length > 0) setFaqs(fData);
    } catch (err) {
      console.warn('Backend load note:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openTrialModal = (prefillClass?: string) => {
    if (prefillClass) setSelectedClassForTrial(prefillClass);
    setTrialModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  // Today's question is the first question in list
  const todaysQuestion = questions.length > 0 ? questions[0] : null;

  const whatsappMessage = encodeURIComponent("Assalamualaikum, I would like to know more about IQRA INSTITUTE and the 3-day trial classes.");
  const whatsappUrl = `https://wa.me/91${settings.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-['Plus_Jakarta_Sans'] antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Header & Navigation */}
      <Navbar
        settings={settings}
        onOpenTrialModal={openTrialModal}
        onOpenDailyQuestions={() => setArchiveModalOpen(true)}
        onOpenPractice={() => setPracticeModalOpen(true)}
        onOpenAiTutor={() => {
          setAiTutorInitialPrompt(undefined);
          setAiTutorOpen(true);
        }}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      <main>
        {/* 2. Hero Section */}
        <Hero
          settings={settings}
          onOpenTrialModal={() => openTrialModal()}
          onOpenContact={() => scrollToSection('contact')}
          onExploreClasses={() => scrollToSection('classes')}
        />

        {/* 3. Daily Question Spotlight */}
        <DailyQuestionWidget
          question={todaysQuestion}
          onOpenArchive={() => setArchiveModalOpen(true)}
          onOpenPractice={() => setPracticeModalOpen(true)}
          onAskAiTutor={(prompt) => {
            setAiTutorInitialPrompt(prompt);
            setAiTutorOpen(true);
          }}
        />

        {/* 4. About IQRA Section */}
        <AboutSection />

        {/* 5. Classes & Monthly Fees Section */}
        <ClassesFeesSection
          classes={classes}
          onSelectClassForTrial={(clsName) => openTrialModal(clsName)}
        />

        {/* 6. Teachers Section */}
        <TeachersSection
          teachers={teachers}
          onOpenTrial={() => openTrialModal()}
        />

        {/* 7. 3-Day Trial Admission Section */}
        <TrialAdmissionSection
          initialClass={selectedClassForTrial}
          whatsappNumber={settings.whatsapp}
          phoneNumber={settings.phone}
          address={settings.address}
        />

        {/* 8. Why Choose Us (6 Reason Cards) */}
        <WhyChooseUsSection />

        {/* 9. Short News & Announcements */}
        <NewsSection
          news={news}
          onOpenTrial={() => openTrialModal()}
        />

        {/* 10. Gallery Showcase */}
        <GallerySection
          gallery={gallery}
        />

        {/* 11. Testimonials */}
        <TestimonialsSection
          testimonials={testimonials}
        />

        {/* 12. FAQ Section */}
        <FAQSection
          faqs={faqs}
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />

        {/* 13. Contact & Direct Message Section */}
        <ContactSection
          settings={settings}
          onOpenTrial={() => openTrialModal()}
        />
      </main>

      {/* 14. Footer */}
      <Footer
        settings={settings}
        onOpenTrial={() => openTrialModal()}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Floating Action Buttons for Mobile / Quick Access */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* Iqra AI Study Assistant Floating Pill */}
        <button
          id="floating-ai-tutor-btn"
          type="button"
          onClick={() => {
            setAiTutorInitialPrompt(undefined);
            setAiTutorOpen(true);
          }}
          className="group relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-400/40"
          title="Ask Iqra AI Study Assistant"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 leading-none">24/7 Tutor</span>
            <span className="text-xs font-black tracking-tight leading-tight">Ask Iqra AI</span>
          </div>
        </button>

        {/* Quick Practice Mode Float */}
        <button
          id="floating-practice-btn"
          type="button"
          onClick={() => setPracticeModalOpen(true)}
          className="w-11 h-11 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
          title="Practice 1,000+ Questions"
        >
          <Brain className="w-5 h-5" />
        </button>

        {/* Quick WhatsApp Float */}
        <a
          id="floating-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Quick Call Float */}
        <a
          id="floating-call-btn"
          href={`tel:${settings.phone}`}
          className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
          title="Call Now"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* 3-Day Trial Pop-up Modal */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl overflow-hidden relative">
            <button
              onClick={() => setTrialModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 z-10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <TrialAdmissionSection
                initialClass={selectedClassForTrial}
                whatsappNumber={settings.whatsapp}
                phoneNumber={settings.phone}
                address={settings.address}
              />
            </div>
          </div>
        </div>
      )}

      {/* Daily Questions Archive Modal */}
      <DailyQuestionsArchiveModal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        questions={questions}
      />

      {/* Iqra AI Study Assistant Chatbot Modal */}
      <AIStudyAssistant
        isOpen={aiTutorOpen}
        onClose={() => {
          setAiTutorOpen(false);
          setAiTutorInitialPrompt(undefined);
        }}
        initialPrompt={aiTutorInitialPrompt}
      />

      {/* Practice Mode (1,000+ Question Bank) Modal */}
      <PracticeModeModal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        onOpenAiTutor={(prompt) => {
          setAiTutorInitialPrompt(prompt);
          setAiTutorOpen(true);
        }}
      />

      {/* Admin Portal Modal */}
      {adminOpen && (
        <AdminDashboard
          onClose={() => setAdminOpen(false)}
          onDataUpdated={loadData}
        />
      )}

    </div>
  );
}
export default App;
