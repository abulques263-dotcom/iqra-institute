import React, { useState } from 'react';
import { api } from '../api.js';
import { Sparkles, CheckCircle2, Phone, MessageCircle, Send, User, Calendar, Clock, BookOpen, AlertCircle, MapPin, Navigation } from 'lucide-react';

interface TrialAdmissionProps {
  initialClass?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  address?: string;
}

export const TrialAdmissionSection: React.FC<TrialAdmissionProps> = ({
  initialClass = 'Class 1 – 4',
  whatsappNumber = '7678365870',
  phoneNumber = '8882257389',
  address = '25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque'
}) => {
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [studentClass, setStudentClass] = useState(initialClass);
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferredTime, setPreferredTime] = useState('Evening (4:30 PM - 6:00 PM)');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; studentName: string; studentClass: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentName.trim()) {
      setErrorMsg('Please enter the student\'s name.');
      return;
    }
    if (!parentName.trim()) {
      setErrorMsg('Please enter the parent/guardian\'s name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number so we can reach you.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitTrialRequest({
        studentName,
        parentName,
        studentClass,
        age,
        phone,
        whatsapp: whatsapp || phone,
        preferredTime,
        message
      });

      setSubmittedData({
        id: res.leadId,
        studentName,
        studentClass
      });

      // Clear form
      setStudentName('');
      setParentName('');
      setAge('');
      setPhone('');
      setWhatsapp('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit trial request. Please try again or contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsappConfirmationUrl = (name: string, cls: string) => {
    const text = encodeURIComponent(
      `Assalamualaikum, I have submitted a 3-Day Free Trial request for ${name} (${cls}) on the IQRA INSTITUTE website. Please let me know the upcoming batch schedule.`
    );
    return `https://wa.me/91${whatsappNumber}?text=${text}`;
  };

  return (
    <section id="trial" className="py-20 sm:py-24 bg-gradient-to-b from-white via-amber-50/30 to-stone-100/60 border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Zero Obligation Trial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            “Try Before You Decide”
          </h2>
          <p className="text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Join our classes for 3 days and experience the learning environment. If you and your child feel our classes are right for you, get in touch with us for admission.
          </p>
        </div>

        {/* Grid Layout: Left Benefits & Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Why 3-Day Trial */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
              <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 border-b border-stone-100 pb-3">
                How the 3-Day Trial Works
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Submit the Simple Form</p>
                    <p className="text-slate-600 text-xs mt-0.5">Fill in your child’s details and preferred batch timing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Attend 3 Full Class Sessions</p>
                    <p className="text-slate-600 text-xs mt-0.5">Your child attends classes for 3 consecutive days at no charge.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Decide With Confidence</p>
                    <p className="text-slate-600 text-xs mt-0.5">Confirm regular monthly admission only if you and your child are completely satisfied.</p>
                  </div>
                </div>
              </div>

              {/* Campus Location Card for Trial Classes */}
              <div className="pt-4 border-t border-stone-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Campus Location for Trial Classes</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900 leading-snug">
                    {address}
                  </p>
                  <p className="text-[11px] text-amber-900 font-medium">
                    🕌 Landmark: Near Gulshan-e-Tayyaba Mosque (Gali No. 23A)
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("IQRA INSTITUTE, " + address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 hover:underline pt-0.5"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Direct Call & WhatsApp helper */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <p className="text-xs text-slate-500 font-medium">Prefer to talk directly right now?</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${phoneNumber}`}
                    className="py-2 px-3 rounded-lg bg-stone-100 text-slate-800 text-xs font-semibold text-center hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" /> Call Now
                  </a>
                  <a
                    href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent("Assalamualaikum, I would like to know about the 3-day trial class.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold text-center hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Admission / Trial Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-md">
              
              {/* Success Notification State */}
              {submittedData ? (
                <div className="text-center py-8 space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black font-['Outfit'] text-slate-900">
                      Trial Request Received!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Thank you for choosing IQRA INSTITUTE for <span className="font-bold text-slate-900">{submittedData.studentName}</span> ({submittedData.studentClass}). We will contact you shortly to confirm the batch time.
                    </p>
                  </div>

                  {/* WhatsApp Quick Confirm */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto space-y-3">
                    <p className="text-xs font-bold text-emerald-900">
                      Want instant confirmation on WhatsApp?
                    </p>
                    <a
                      href={getWhatsappConfirmationUrl(submittedData.studentName, submittedData.studentClass)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message Us on WhatsApp Now</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className="text-xs text-amber-700 font-bold hover:underline"
                  >
                    ← Submit another request
                  </button>
                </div>
              ) : (
                /* Form Fields */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="text-xl font-bold font-['Outfit'] text-slate-900">
                      Request 3-Day Trial Class
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      No advance payment required. Experience the teaching first.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Zayd Ahmad"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                      />
                    </div>

                    {/* Parent / Guardian Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. Tariq Ahmad"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Class */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Class / Grade *
                      </label>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Nursery – UKG">Nursery – UKG (₹500/mo)</option>
                        <option value="Class 1">Class 1 (₹300/mo)</option>
                        <option value="Class 2">Class 2 (₹300/mo)</option>
                        <option value="Class 3">Class 3 (₹300/mo)</option>
                        <option value="Class 4">Class 4 (₹300/mo)</option>
                        <option value="Class 5">Class 5 (₹400/mo)</option>
                        <option value="Class 6">Class 6 (₹400/mo)</option>
                        <option value="Class 7">Class 7 (₹600/mo)</option>
                        <option value="Class 8">Class 8 (₹600/mo)</option>
                      </select>
                    </div>

                    {/* Age */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Student Age (Optional)
                      </label>
                      <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 8 years"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Phone Number (for Calling) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Leave blank if same as phone"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                      />
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Morning (8:30 AM - 10:00 AM)">Morning (8:30 AM – 10:00 AM)</option>
                      <option value="Afternoon (3:00 PM - 4:30 PM)">Afternoon (3:00 PM – 4:30 PM)</option>
                      <option value="Evening (4:30 PM - 6:00 PM)">Evening (4:30 PM – 6:00 PM)</option>
                      <option value="Late Evening (6:00 PM - 7:30 PM)">Late Evening (6:00 PM – 7:30 PM)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Any specific subject or learning goal? (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Needs help with basic mathematics multiplication and reading English..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Request 3-Day Trial Class</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500 pt-1">
                    🔒 We respect your privacy. No spam. We only use this information to schedule your child's trial session.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
