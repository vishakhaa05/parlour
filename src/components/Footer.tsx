import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  CalendarCheck,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E1920] text-[#D8CFD8] pt-16 pb-12 border-t border-[#382F3B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#382F3B] p-1.5 flex items-center justify-center shrink-0 border border-[#4D4151]">
                <img src="/hero.png" alt="Shree Ambika Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-white tracking-wide leading-none">
                  Shree Ambika
                </h3>
                <p className="text-[10px] text-[#E8A0B1] tracking-[0.2em] uppercase font-semibold mt-1">
                  Beauty Parlour & Spa
                </p>
              </div>
            </div>

            <p className="text-sm text-[#A89EAA] leading-relaxed">
              Dedicated to mindful wellness, certified bridal artistry, and pure botanical therapies tailored to nurture your innate radiant glow.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2C2430] hover:bg-[#C65D7B] text-[#E8A0B1] hover:text-white flex items-center justify-center transition border border-[#4D4151]"
                title="WhatsApp Direct Contact"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/shreeambikabeauty"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2C2430] hover:bg-[#C65D7B] text-[#E8A0B1] hover:text-white flex items-center justify-center transition border border-[#4D4151]"
                title="Instagram Profile"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/shreeambikabeauty"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2C2430] hover:bg-[#C65D7B] text-[#E8A0B1] hover:text-white flex items-center justify-center transition border border-[#4D4151]"
                title="Facebook Page"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E8A0B1]" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/content" className="hover:text-white transition">
                  Treatments & Pricing
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition">
                  Beauty Portfolio
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-[#E8A0B1] hover:text-white transition font-semibold inline-flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4" /> Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white transition">
                  My Appointments
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Treatments */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4">
              Signature Services
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A89EAA]">
              <li>
                <Link to="/book?service=Glowing Facial&price=₹2500" className="hover:text-white transition">
                  Glowing Facial Therapy
                </Link>
              </li>
              <li>
                <Link to="/book?service=Royal HD Bridal Transformation&price=₹5000" className="hover:text-white transition">
                  Royal HD Bridal Makeover
                </Link>
              </li>
              <li>
                <Link to="/book?service=Moroccan Argan Hair Spa&price=₹2000" className="hover:text-white transition">
                  Moroccan Argan Hair Spa
                </Link>
              </li>
              <li>
                <Link to="/book?service=Keratin Smoothing Treatment&price=₹8000" className="hover:text-white transition">
                  Keratin Smoothing Treatment
                </Link>
              </li>
              <li>
                <Link to="/book?service=Rose Gold Chrome Nail Extensions&price=₹2200" className="hover:text-white transition">
                  Chrome Nail Art & Extensions
                </Link>
              </li>
              <li>
                <Link to="/book?service=Eucalyptus Detox Spa Pedicure&price=₹1800" className="hover:text-white transition">
                  Detox Spa Pedicure
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Parlour Information & Hours */}
          <div className="space-y-3.5 text-sm">
            <h4 className="font-serif font-bold text-white text-base mb-4">
              Salon Hours & Info
            </h4>
            
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#E8A0B1] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium block">Mon – Sun: 9:00 AM – 8:00 PM</span>
                <span className="text-xs text-[#A89EAA]">Open 7 Days for treatments</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#E8A0B1] shrink-0 mt-0.5" />
              <span className="text-[#A89EAA]">
                Shop No. 12, Ambika Galleria, Main Road, City Center
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#E8A0B1] shrink-0" />
              <a href="tel:+919876543210" className="text-[#D8CFD8] hover:text-white transition">
                +91 98765 43210
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#E8A0B1] shrink-0" />
              <a href="mailto:shreeambika@gmail.com" className="text-[#D8CFD8] hover:text-white transition">
                shreeambika@gmail.com
              </a>
            </div>

            <div className="pt-2">
              <div className="p-3 bg-[#2C2430] rounded-xl border border-[#4D4151] text-xs text-[#E8A0B1] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E8A0B1] shrink-0 mt-0.5" />
                <span>
                  Free cancellation or rescheduling up to 2 hours before your appointment.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#382F3B] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8391]">
          <p>© {new Date().getFullYear()} Shree Ambika Beauty Parlour & Spa. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span>Prices in INR (₹)</span>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition">
              Customer Support
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-[#E8A0B1] transition text-[11px]">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
