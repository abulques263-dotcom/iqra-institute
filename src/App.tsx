import React, { useState, useEffect } from 'react';
import { WebsiteSettings, ClassFeeItem, Teacher, DailyQuestion, NewsUpdate, GalleryItem, Testimonial, FAQItem } from './types.js';
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
import { PracticeModeModal } from './components/PracticeModeModal.js';
import { Phone, MessageCircle, X, Brain } from 'lucide-react';

export function App() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    instituteName: 'IQRA INSTITUTE', tagline: 'Foundation Learning for Young Children', phone: '8882257389', whatsapp: '7678365870',
    address: '25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque',
    timing: 'Morning & Evening batches (Monday to Saturday)', announcement: 'Admission open for 3-Day Free Trial classes (Nursery to Class 8). Contact us today!', announcementActive: true,
    heroBadge: 'Nursery to Class 8 • Foundation Learning Support', heroDescription: 'IQRA INSTITUTE focuses on developing children’s academic foundation, conceptual understanding, discipline, and useful daily study habits from an early age. We believe in understanding concepts rather than rote memorization.'
  });
  const [classes, setClasses] = useState<ClassFeeItem[]>([]); const [teachers, setTeachers] = useState<Teacher[]>([]); const [questions, setQuestions] = useState<DailyQuestion[]>([]); const [news, setNews] = useState<NewsUpdate[]>([]); const [gallery, setGallery] = useState<GalleryItem[]>([]); const [testimonials, setTestimonials] = useState<Testimonial[]>([]); const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [trialModalOpen, setTrialModalOpen] = useState(false); const [selectedClassForTrial, setSelectedClassForTrial] = useState<string>('Class 1 – 4'); const [archiveModalOpen, setArchiveModalOpen] = useState(false); const [adminOpen, setAdminOpen] = useState(false); const [practiceModalOpen, setPracticeModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [sData, cData, tData, qData, nData, gData, tmData, fData] = await Promise.all([api.getSettings().catch(() => null), api.getClasses().catch(() => []), api.getTeachers().catch(() => []), api.getDailyQuestions().catch(() => []), api.getNews().catch(() => []), api.getGallery().catch(() => []), api.getTestimonials().catch(() => []), api.getFaqs().catch(() => [])]);
      if (sData) setSettings(sData);
      const staticClasses: ClassFeeItem[] = [
        { id: 'cls-nursery-ukg', name: 'Nursery – UKG', gradeRange: 'Pre-Primary (Nursery, LKG, UKG)', monthlyFee: 500, description: 'Early childhood foundation focusing on phonics, letter formation, basic counting, motor skills and joyful learning habits.', features: ['Alphabet, Phonics & Sound recognition', 'Number sense & Basic counting', 'Pencil grip, coloring & motor development', 'Friendly, patient and caring atmosphere', 'Daily 1.5 hours interactive session'], order: 1 },
        { id: 'cls-1-4', name: 'Class 1 – 4', gradeRange: 'Primary School (Grades 1 to 4)', monthlyFee: 300, description: 'Strong foundation in core subjects — Arithmetic, Reading, Writing, Science concepts, and good study discipline.', features: ['Basic Mathematics (Addition, Subtraction, Multiplication, Division)', 'English reading comprehension & handwriting', 'Basic Science & Environmental understanding', 'Daily homework check & practice worksheets', 'Encouraging curiosity and self-confidence'], isPopular: true, order: 2 },
        { id: 'cls-5-6', name: 'Class 5 – 6', gradeRange: 'Upper Primary (Grades 5 & 6)', monthlyFee: 400, description: 'Transition to structured conceptual learning, problem-solving, English grammar, and systematic subject mastery.', features: ['Conceptual Mathematics & Word problems', 'General Science (Physics, Chemistry, Biology basics)', 'Social Studies & Map concepts', 'Grammar, Vocabulary & Sentence construction', 'Weekly concept tests & revision notes'], order: 3 },
        { id: 'cls-7-8', name: 'Class 7 – 8', gradeRange: 'Middle School (Grades 7 & 8)', monthlyFee: 600, description: 'Pre-secondary preparation to build deep fundamentals before high school academic pressure begins.', features: ['Advanced Mathematics (Algebra, Geometry, Arithmetic)', 'In-depth Science with practical examples', 'English Language skills & Creative writing', 'Logical reasoning & Analytical thinking', 'Individual doubt clearing & progress tracking'], order: 4 }
      ];
      setClasses(cData && cData.length > 0 ? cData : staticClasses); if (tData?.length) setTeachers(tData); if (qData?.length) setQuestions(qData); if (nData?.length) setNews(nData); if (gData?.length) setGallery(gData); if (tmData?.length) setTestimonials(tmData); if (fData?.length) setFaqs(fData);
    } catch (err) { console.warn('Backend load note:', err); }
  };
  useEffect(() => { loadData(); }, []);
  const openTrialModal = (prefillClass?: string) => { if (prefillClass) setSelectedClassForTrial(prefillClass); setTrialModalOpen(true); };
  const scrollToSection = (id: string) => { const el = document.getElementById(id); if (el) { const pos = el.getBoundingClientRect().top + window.pageYOffset - 80; window.scrollTo({ top: pos, behavior: 'smooth' }); } };
  const todaysQuestion = questions.length > 0 ? questions[0] : null;
  const whatsappMessage = encodeURIComponent("Assalamualaikum, I would like to know more about IQRA INSTITUTE and the 3-day trial classes."); const whatsappUrl = `https://wa.me/91${settings.whatsapp}?text=${whatsappMessage}`;

  return <div className="min-h-screen bg-stone-50 text-slate-900 font-['Plus_Jakarta_Sans'] antialiased selection:bg-amber-100 selection:text-amber-900">
    <Navbar settings={settings} onOpenTrialModal={openTrialModal} onOpenDailyQuestions={() => setArchiveModalOpen(true)} onOpenPractice={() => setPracticeModalOpen(true)} onOpenAdmin={() => setAdminOpen(true)} />
    <main><Hero settings={settings} onOpenTrialModal={() => openTrialModal()} onOpenContact={() => scrollToSection('contact')} onExploreClasses={() => scrollToSection('classes')} /><DailyQuestionWidget question={todaysQuestion} onOpenArchive={() => setArchiveModalOpen(true)} onOpenPractice={() => setPracticeModalOpen(true)} /><AboutSection /><ClassesFeesSection classes={classes} onSelectClassForTrial={(clsName) => openTrialModal(clsName)} /><TeachersSection teachers={teachers} onOpenTrial={() => openTrialModal()} /><TrialAdmissionSection initialClass={selectedClassForTrial} whatsappNumber={settings.whatsapp} phoneNumber={settings.phone} address={settings.address} /><WhyChooseUsSection /><NewsSection news={news} onOpenTrial={() => openTrialModal()} /><GallerySection gallery={gallery} /><TestimonialsSection testimonials={testimonials} /><FAQSection faqs={faqs} phone={settings.phone} whatsapp={settings.whatsapp} /><ContactSection settings={settings} onOpenTrial={() => openTrialModal()} /></main>
    <Footer settings={settings} onOpenTrial={() => openTrialModal()} onOpenAdmin={() => setAdminOpen(true)} />
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5"><button id="floating-practice-btn" type="button" onClick={() => setPracticeModalOpen(true)} className="w-11 h-11 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105" title="Practice 1,000+ Questions"><Brain className="w-5 h-5" /></button><a id="floating-whatsapp-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105" title="Chat on WhatsApp"><MessageCircle className="w-6 h-6" /></a><a id="floating-call-btn" href={`tel:${settings.phone}`} className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105" title="Call Now"><Phone className="w-5 h-5" /></a></div>
    {trialModalOpen && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"><div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl overflow-hidden relative"><button onClick={() => setTrialModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 z-10 transition-colors" aria-label="Close modal"><X className="w-5 h-5" /></button><div className="p-6 sm:p-8"><TrialAdmissionSection initialClass={selectedClassForTrial} whatsappNumber={settings.whatsapp} phoneNumber={settings.phone} address={settings.address} /></div></div></div>}
    <DailyQuestionsArchiveModal isOpen={archiveModalOpen} onClose={() => setArchiveModalOpen(false)} questions={questions} />
    <PracticeModeModal isOpen={practiceModalOpen} onClose={() => setPracticeModalOpen(false)} />
    {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} onDataUpdated={loadData} />}
  </div>;
}
export default App;
