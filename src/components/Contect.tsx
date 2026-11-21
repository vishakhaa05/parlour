import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Loader2, 
  ArrowLeft, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  User, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { apiFetch } from '../utils/api';

const SERVICE_TAGS = [
  'Bridal & Party Makeover',
  'Organic Facial & Skincare',
  'Hair Spa & Keratin',
  'Nail Art & Gel Extensions',
  'Manicure & Pedicure',
  'General Inquiry'
];

const FAQS = [
  {
    q: 'Do I need an advance appointment for bridal makeup?',
    a: 'Yes, we recommend booking at least 2 to 3 weeks in advance so our senior makeup artists can prepare a customized trial and pre-bridal skincare routine for your big day.'
  },
  {
    q: 'What payment methods do you accept at the parlour?',
    a: 'We accept Cash, UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and net banking for all services and packages.'
  },
  {
    q: 'Can I customize a package for multiple treatments?',
    a: 'Absolutely! You can choose any combination of hair, skincare, and nail services. Just select your service or note your request in the message form.'
  }
];

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalonePage = location.pathname === '/contact';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceOfInterest, setServiceOfInterest] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validateForm = () => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) return 'Please enter a valid email address.';
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
        return 'Please enter a valid phone number (at least 7 digits).';
      }
    }
    if (!message.trim() || message.trim().length < 5) {
      return 'Please enter a message with at least 5 characters.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validationErr = validateForm();
    if (validationErr) {
      setErrorMsg(validationErr);
      toast.error(validationErr);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>('/contacts', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          serviceOfInterest,
          message: message.trim()
        })
      });

      if (res.success) {
        setIsSubmittedSuccess(true);
        toast.success('Thank you! We received your message and will contact you shortly 💖');
        setName('');
        setEmail('');
        setPhone('');
        setServiceOfInterest('General Inquiry');
        setMessage('');
        setErrorMsg('');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Failed to send message. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#FFF8F6] scroll-mt-20 border-b border-[#F2DCE2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Optional standalone page back button */}
        {isStandalonePage && (
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#29232A] hover:text-[#C65D7B] bg-white px-4 py-2 rounded-full border border-[#F2DCE2] shadow-2xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F7E5E9] text-[#C65D7B] text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect & Visit</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#29232A] leading-tight">
            We Would Love to <span className="text-[#C65D7B] italic">Welcome You</span>
          </h2>
          <p className="text-[#6E6270] text-sm sm:text-base mt-2 leading-relaxed">
            Reach out with any questions, book personalized consultations, or visit our serene parlour and spa sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Business Details & Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Location Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F2DCE2] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7E5E9] flex items-center justify-center shrink-0 text-[#C65D7B]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#29232A]">Salon Address</h4>
                <p className="text-sm text-[#6E6270] mt-1 leading-relaxed">
                  Shop No. 12, Ambika Galleria, Main Road, City Center
                </p>
                <span className="text-[11px] text-[#C65D7B] font-semibold block mt-1.5">
                  Centrally located with convenient parking
                </span>
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F2DCE2] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7E5E9] flex items-center justify-center shrink-0 text-[#C65D7B]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#29232A]">Opening Hours</h4>
                <p className="text-sm text-[#29232A] font-semibold mt-1">
                  Monday – Sunday: 9:00 AM – 8:00 PM
                </p>
                <p className="text-xs text-[#6E6270] mt-0.5">
                  Open all 7 days for your convenience & pre-booked events
                </p>
              </div>
            </div>

            {/* Phone & Direct WhatsApp Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F2DCE2] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7E5E9] flex items-center justify-center shrink-0 text-[#C65D7B]">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-base text-[#29232A]">Telephone & Inquiries</h4>
                <a 
                  href="tel:+919876543210" 
                  className="text-sm font-semibold text-[#29232A] hover:text-[#C65D7B] block mt-1"
                >
                  +91 98765 43210
                </a>
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold hover:bg-emerald-100 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F2DCE2] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7E5E9] flex items-center justify-center shrink-0 text-[#C65D7B]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#29232A]">Email Inquiries</h4>
                <a 
                  href="mailto:shreeambika@gmail.com" 
                  className="text-sm font-semibold text-[#29232A] hover:text-[#C65D7B] block mt-1"
                >
                  shreeambika@gmail.com
                </a>
                <span className="text-[11px] text-[#6E6270] block mt-0.5">
                  Replies typically within 24 hours
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#F2DCE2] shadow-sm relative">
              
              {isSubmittedSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-emerald-900">
                    <p className="font-bold">Message sent successfully!</p>
                    <p className="text-emerald-700 mt-0.5">
                      Thank you for reaching out. A beauty advisor will contact you shortly via phone or email.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-serif font-bold text-2xl text-[#29232A]">
                  Send Us a Message
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6270] mt-1">
                  Fill in your details and we will assist you promptly.
                </p>
              </div>

              {/* Service Selection Tags */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#29232A] uppercase tracking-wider mb-2.5">
                  Service of Interest:
                </label>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_TAGS.map((tag) => {
                    const isSelected = serviceOfInterest === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setServiceOfInterest(tag)}
                        className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#C65D7B] text-white shadow-2xs'
                            : 'bg-[#FFF8F6] text-[#29232A] hover:bg-[#F7E5E9] hover:text-[#C65D7B] border border-[#F2DCE2]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#29232A] mb-1.5">
                    Your Full Name <span className="text-[#C65D7B]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6E6270] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F6] border border-[#F2DCE2] rounded-xl text-sm text-[#29232A] focus:outline-none focus:ring-2 focus:ring-[#C65D7B]/30 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#29232A] mb-1.5">
                      Email Address <span className="text-[#C65D7B]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6E6270] absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F6] border border-[#F2DCE2] rounded-xl text-sm text-[#29232A] focus:outline-none focus:ring-2 focus:ring-[#C65D7B]/30 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#29232A] mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6E6270] absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F6] border border-[#F2DCE2] rounded-xl text-sm text-[#29232A] focus:outline-none focus:ring-2 focus:ring-[#C65D7B]/30 focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29232A] mb-1.5">
                    Your Message <span className="text-[#C65D7B]">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-[#6E6270] absolute left-3.5 top-3.5" />
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about the treatments or appointment details you have in mind..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F6] border border-[#F2DCE2] rounded-xl text-sm text-[#29232A] focus:outline-none focus:ring-2 focus:ring-[#C65D7B]/30 focus:bg-white transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full font-semibold text-white bg-[#C65D7B] hover:bg-[#B24B68] shadow-salon hover:shadow-salon-hover transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 text-sm mt-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Your Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Salon</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-[#6E6270]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C65D7B]" />
                  <span>Your privacy is safeguarded. We never share client contact details.</span>
                </div>
              </form>

            </div>
          </div>

        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mt-20 pt-16 border-t border-[#F2DCE2]">
          <h3 className="font-serif text-2xl font-bold text-[#29232A] text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#F2DCE2] shadow-2xs overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-[#FFF8F6] transition"
                >
                  <span className="text-sm font-semibold text-[#29232A]">
                    {faq.q}
                  </span>
                  <span className={`text-[#C65D7B] text-lg font-bold transition-transform duration-200 ${openFaq === idx ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 pt-1 text-sm text-[#6E6270] border-t border-[#F2DCE2]/50 leading-relaxed bg-[#FFF8F6]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
