import React, { useState } from 'react';
import { WebsiteSettings } from '../types.js';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  Navigation,
  Compass,
  Building2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api.js';

interface ContactSectionProps {
  settings: WebsiteSettings;
  onOpenTrial: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, onOpenTrial }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const officialAddress = settings.address || "25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque";
  const mapSearchQuery = encodeURIComponent(`IQRA INSTITUTE, ${officialAddress}`);
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh")}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const whatsappMessage = encodeURIComponent("Assalamualaikum, I would like to visit IQRA INSTITUTE or inquire about 3-day trial classes.");
  const whatsappUrl = `https://wa.me/91${settings.whatsapp}?text=${whatsappMessage}`;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSending(true);
    try {
      await api.submitTrialRequest({
        studentName: name.trim(),
        parentName: name.trim(),
        studentClass: 'General Inquiry',
        age: '',
        phone: phone.trim(),
        whatsapp: phone.trim(),
        preferredTime: 'Anytime',
        message: message.trim() || 'General contact inquiry from website.'
      });
      setSentSuccess(true);
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      // Direct fallback to WhatsApp
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-stone-100/80 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Visit Us & Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Contact & Institute Location
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Visit our center in Budh Vihar, Sector 63, Noida, or reach out directly for batch timings and trial admissions.
          </p>
        </div>

        {/* 1. DEDICATED LOCATION CARD & DIRECT INQUIRY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Dedicated Location Card & Quick Contacts */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary Location Card */}
            <div id="visit-iqra-location-card" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Official Institute Location</span>
                    <h3 className="text-2xl font-black font-['Outfit'] text-slate-900">
                      Visit IQRA INSTITUTE
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold self-start sm:self-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open for Parents & Students</span>
                </div>
              </div>

              {/* Exact Address Details with Landmark */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</p>
                    <p className="text-base font-bold text-slate-900 leading-snug">
                      {officialAddress}
                    </p>
                    <div className="pt-1.5 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-stone-200 font-semibold text-slate-700">
                        📍 25 Futa Road
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-stone-200 font-semibold text-slate-700">
                        🏘️ Budh Vihar, Sector 63, Noida
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 font-semibold text-amber-900">
                        🕌 Near Gulshan-e-Tayyaba Mosque (Gali No. 23A)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Class Timings & Support Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Timings</p>
                      <p className="text-slate-600 font-medium">{settings.timing || 'Morning & Evening Batches (Mon–Sat)'}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Accessibility</p>
                      <p className="text-slate-600 font-medium">Easily reachable from all Sector 63 & Budh Vihar blocks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Get Directions, Call Now, WhatsApp Us */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  id="contact-get-directions-btn"
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  id="contact-call-now-btn"
                  href={`tel:${settings.phone}`}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Now ({settings.phone})</span>
                </a>

                <a
                  id="contact-whatsapp-us-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

            </div>

            {/* Quick Contact Numbers Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Info */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Phone Hotline</p>
                  <a href={`tel:${settings.phone}`} className="text-base font-bold text-slate-900 hover:text-amber-700 transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp Info */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">WhatsApp Helpdesk</p>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                    {settings.whatsapp}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Inquiry Message Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-xl font-bold font-['Outfit'] text-slate-900">
                    Send a Quick Inquiry
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Have questions about fees, timings, or trial seats? Leave your contact details below.
                  </p>
                </div>

                {sentSuccess ? (
                  <div className="p-6 my-4 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-fadeIn">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="font-bold text-slate-900 text-sm">Message Received!</p>
                    <p className="text-xs text-slate-600">We will call or WhatsApp you promptly.</p>
                    <button
                      type="button"
                      onClick={() => setSentSuccess(false)}
                      className="text-xs text-amber-700 font-bold hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-3.5 pt-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mohammad Aslam"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Message / Questions</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Inquiry regarding Class 3 batch timings and weekend doubt sessions..."
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSending ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                <span>Direct Admission Hotline:</span>
                <a href={`tel:${settings.phone}`} className="font-bold text-amber-700 hover:underline">
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* 2. GOOGLE MAPS INTERACTIVE LOCATION SECTION */}
        <div id="google-maps-location-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>Find Us On Google Maps</span>
              </div>
              <h3 className="text-2xl font-black font-['Outfit'] text-slate-900">
                Location & Navigation Map
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Located on 25 Futa Road, Budh Vihar, Sector 63, Noida, right near Gulshan-e-Tayyaba Mosque (Gali No. 23A).
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
              </a>
            </div>
          </div>

          {/* Embedded Google Maps Container */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-16/9 sm:aspect-21/9 min-h-[320px] shadow-inner">
            <iframe
              title="IQRA INSTITUTE Location Map - 25 Futa Road, Budh Vihar, Sector 63, Noida"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full absolute inset-0"
            />

            {/* Overlay Location Tag Card */}
            <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200 shadow-lg text-xs space-y-2 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <p className="font-extrabold text-slate-900 text-sm font-['Outfit']">IQRA INSTITUTE</p>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                25 Futa Road, Budh Vihar, Sector 63, Noida (Gali No. 23A, Near Gulshan-e-Tayyaba Mosque)
              </p>
              <div className="pt-1 flex items-center justify-between border-t border-stone-100 text-[11px]">
                <a
                  href={`tel:${settings.phone}`}
                  className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> {settings.phone}
                </a>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" /> Directions
                </a>
              </div>
            </div>
          </div>

          {/* Quick Landmark Walking / Driving Directions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
              <p className="text-xs font-bold text-slate-900">🕌 Main Landmark</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Situated in Gali No. 23A, right near the prominent Gulshan-e-Tayyaba Mosque.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
              <p className="text-xs font-bold text-slate-900">🛣️ Street & Roadway</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Easily accessible via 25 Futa Road connecting local neighborhoods in Budh Vihar.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
              <p className="text-xs font-bold text-slate-900">🚶 Local Student Access</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Convenient and safe walking distance for young children and students residing across Sector 63.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

