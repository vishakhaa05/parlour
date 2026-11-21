import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HeartHandshake, Award, Leaf } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#FFF9FA] scroll-mt-20 border-b border-[#FCE7F0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Salon Image */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] bg-[#FFF0F5]">
                <img
                  src="/image4.png"
                  alt="Inside Shree Ambika Beauty Parlour & Spa"
                  className="w-full h-full object-cover object-right"
                />
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-white p-4 rounded-2xl shadow-salon border border-[#FCE7F0] flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#FA4D89] font-serif font-bold text-lg">
                  8+
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1F2937]">Years of Care</p>
                  <p className="text-[11px] text-[#4B5563]">Trusted by 1,500+ clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Introduction Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F5] text-[#FA4D89] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About Shree Ambika</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F2937] leading-tight">
              A Serene Haven Dedicated to Your <span className="text-[#FA4D89] italic">Radiant Glow</span>
            </h2>

            <p className="text-base text-[#4B5563] leading-relaxed">
              At Shree Ambika Beauty Parlour & Spa, we believe true beauty begins with thoughtful self-care and genuine comfort. Founded with the mission to provide an uncompromised, luxurious salon experience, we blend certified dermatological skincare, ancient botanical rituals, and contemporary beauty styling.
            </p>

            <p className="text-base text-[#4B5563] leading-relaxed">
              Whether you are preparing for your royal bridal day, revitalizing damaged locks with intense hair spa treatments, or enjoying a restorative afternoon facial, our dedicated team of senior stylists and certified aestheticians ensures every visit leaves you feeling confident, renewed, and cherished.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-left">
              <div className="p-4 rounded-2xl bg-white border border-[#FCE7F0] shadow-2xs">
                <Leaf className="w-5 h-5 text-[#FA4D89] mb-2" />
                <h4 className="font-bold text-sm text-[#1F2937]">Pure Botanicals</h4>
                <p className="text-xs text-[#4B5563] mt-1">100% skin-safe, certified organic and cruelty-free formulas.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#FCE7F0] shadow-2xs">
                <Award className="w-5 h-5 text-[#FA4D89] mb-2" />
                <h4 className="font-bold text-sm text-[#1F2937]">Certified Artists</h4>
                <p className="text-xs text-[#4B5563] mt-1">Senior specialists with recognized bridal and cosmetic diplomas.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#FCE7F0] shadow-2xs">
                <HeartHandshake className="w-5 h-5 text-[#FA4D89] mb-2" />
                <h4 className="font-bold text-sm text-[#1F2937]">Hygienic Space</h4>
                <p className="text-xs text-[#4B5563] mt-1">Strict sterilization, hospital-grade sanitization, and comfort.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-center lg:justify-start">
              <Link to="/content">
                <button className="bg-white hover:bg-[#FFF0F5]/50 text-[#FA4D89] font-semibold px-6 py-3 rounded-full border border-[#F9A8D4] transition shadow-2xs text-sm">
                  Discover Our Treatment Philosophy
                </button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
