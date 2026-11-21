import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Star, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFF9FA] pt-8 pb-16 md:py-20 lg:py-24 border-b border-[#FCE7F0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F5] border border-[#F9A8D4]/50 text-[#FA4D89] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#FA4D89]" />
              <span>Premium Salon & Spa Experience</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1F2937] leading-[1.12] tracking-tight">
              Where Timeless Beauty Meets <span className="text-[#FA4D89] italic">Mindful Care</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4B5563] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Step into a serene sanctuary designed for your wellness. From signature organic skincare and HD bridal transformations to rejuvenating hair therapies, every treatment is tailored to nurture your natural radiance.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/book" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#FA4D89] hover:bg-[#E11D74] text-white font-semibold px-8 py-3.5 rounded-full shadow-salon hover:shadow-salon-hover hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm sm:text-base">
                  <CalendarCheck className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
              </Link>

              <Link to="/content" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white hover:bg-[#FFF0F5]/50 text-[#1F2937] font-semibold px-7 py-3.5 rounded-full border border-[#FCE7F0] transition hover:border-[#F9A8D4] flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span>Explore Treatments</span>
                  <ArrowRight className="w-4 h-4 text-[#FA4D89]" />
                </button>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="pt-8 border-t border-[#FCE7F0] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] flex items-center justify-center shrink-0 text-[#FA4D89]">
                  <Star className="w-4 h-4 fill-[#FA4D89]" />
                </div>
                <div>
                  <span className="block font-bold text-[#1F2937] text-sm">4.9 / 5.0</span>
                  <span className="text-xs text-[#4B5563]">1,500+ Reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] flex items-center justify-center shrink-0 text-[#FA4D89]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[#1F2937] text-sm">100% Organic</span>
                  <span className="text-xs text-[#4B5563]">Cruelty-Free</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] flex items-center justify-center shrink-0 text-[#FA4D89]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-[#1F2937] text-sm">Open 7 Days</span>
                  <span className="text-xs text-[#4B5563]">9 AM – 8 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-white flex flex-col justify-between p-6">
                <div className="w-full flex-1 flex items-center justify-center p-2">
                  <img
                    src="/hero.png"
                    alt="Sri Ambeeka Beauty Parlour & Spa Zone"
                    className="w-full h-auto max-h-[90%] object-contain drop-shadow-sm"
                  />
                </div>

                {/* Bottom luxury badge */}
                <div className="w-full bg-[#FFF0F5] backdrop-blur-md p-4 rounded-2xl shadow-sm border border-[#FCE7F0] flex items-center justify-between">
                  <div>
                    <p className="font-serif font-bold text-sm text-[#1F2937]">Sri Ambeeka Salon & Spa</p>
                    <p className="text-[11px] text-[#4B5563]">Beauty That Glows Naturally</p>
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
