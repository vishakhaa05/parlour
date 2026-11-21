import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Star, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFF8F6] pt-8 pb-16 md:py-20 lg:py-24 border-b border-[#F2DCE2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7E5E9] border border-[#E8A0B1]/50 text-[#C65D7B] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#C65D7B]" />
              <span>Premium Salon & Spa Experience</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#29232A] leading-[1.12] tracking-tight">
              Where Timeless Beauty Meets <span className="text-[#C65D7B] italic">Mindful Care</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E6270] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Step into a serene sanctuary designed for your wellness. From signature organic skincare and HD bridal transformations to rejuvenating hair therapies, every treatment is tailored to nurture your natural radiance.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/book" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#C65D7B] hover:bg-[#B24B68] text-white font-semibold px-8 py-3.5 rounded-full shadow-salon hover:shadow-salon-hover hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm sm:text-base">
                  <CalendarCheck className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
              </Link>

              <Link to="/content" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white hover:bg-[#F7E5E9]/50 text-[#29232A] font-semibold px-7 py-3.5 rounded-full border border-[#F2DCE2] transition hover:border-[#E8A0B1] flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span>Explore Treatments</span>
                  <ArrowRight className="w-4 h-4 text-[#C65D7B]" />
                </button>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="pt-8 border-t border-[#F2DCE2] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F7E5E9] flex items-center justify-center shrink-0 text-[#C65D7B]">
                  <Star className="w-4 h-4 fill-[#C65D7B]" />
                </div>
                <div>
                  <span className="block font-bold text-[#29232A] text-sm">4.9 / 5.0</span>
                  <span className="text-xs text-[#6E6270]">1,500+ Reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F7E5E9] flex items-center justify-center shrink-0 text-[#C65D7B]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[#29232A] text-sm">100% Organic</span>
                  <span className="text-xs text-[#6E6270]">Cruelty-Free</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F7E5E9] flex items-center justify-center shrink-0 text-[#C65D7B]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[#29232A] text-sm">Open 7 Days</span>
                  <span className="text-xs text-[#6E6270]">9 AM – 8 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-[#F7E5E9]">
                <img
                  src="/images/hero-salon.jpg"
                  alt="Shree Ambika Salon Ambiance"
                  className="w-full h-full object-cover"
                />

                {/* Subtle gradient vignette at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                {/* Bottom luxury card overlay */}
                <div className="absolute bottom-5 inset-x-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#F2DCE2] flex items-center justify-between">
                  <div>
                    <p className="font-serif font-bold text-sm text-[#29232A]">Signature Bridal & Skincare</p>
                    <p className="text-[11px] text-[#6E6270]">Certified Master Stylists & Aestheticians</p>
                  </div>
                  <div className="flex text-amber-500 text-xs">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
