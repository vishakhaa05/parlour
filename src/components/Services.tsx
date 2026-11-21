import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, CalendarCheck, ArrowRight, Gift } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { ACTUAL_PARLOUR_SERVICES, getServicePhoto, type PackageItem } from './ContentPage';

const Services: React.FC = () => {
  const [packages, setPackages] = useState<PackageItem[]>(ACTUAL_PARLOUR_SERVICES);

  useEffect(() => {
    apiFetch<PackageItem[]>('/packages')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const hasActualServices = data.some(p => p.name.toLowerCase() === 'facial' || p.name.toLowerCase() === 'hair spa');
          if (hasActualServices) {
            setPackages(data);
          } else {
            setPackages(ACTUAL_PARLOUR_SERVICES);
          }
        }
      })
      .catch((err) => {
        console.error('Error loading packages for services section:', err);
      });
  }, []);

  return (
    <section id="services" className="py-20 md:py-28 bg-white scroll-mt-20 border-b border-[#FCE7F0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF0F5] text-[#FA4D89] text-xs font-semibold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Treatments</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F2937] leading-tight">
              Popular <span className="text-[#FA4D89] italic">Beauty Services</span>
            </h2>
            <p className="text-[#4B5563] text-sm sm:text-base mt-3 leading-relaxed">
              Transparent pricing, certified products, and expert care tailored to rejuvenate your natural glow.
            </p>
          </div>

          <Link to="/content" className="shrink-0">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#FA4D89] hover:text-[#E11D74] transition group">
              <span>View All 8 Treatments & Pricing</span>
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        {/* Services Grid with Consistent Card Heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const cardImg = (pkg.image && !pkg.image.startsWith('/images/')) 
              ? pkg.image 
              : getServicePhoto(pkg.name, pkg.category);
            const isBridal = pkg.name.toLowerCase().includes('bridal');
            const isContactPricing = (pkg.price || '').toLowerCase().includes('contact') || isBridal;
            const specialBenefit = pkg.specialBenefit || (isBridal ? 'One complimentary makeup service with the bridal booking.' : null);

            return (
              <div
                key={pkg._id || index}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-salon transition-all duration-300 border border-[#FCE7F0] flex flex-col justify-between group h-full"
              >
                <div>
                  {/* Image & Price header */}
                  <div className="relative mb-5 overflow-hidden rounded-2xl aspect-[16/10] bg-white border border-[#FCE7F0] flex items-center justify-center p-3">
                    <img
                      src={cardImg}
                      alt={pkg.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getServicePhoto(pkg.name, pkg.category);
                      }}
                    />
                    
                    {/* Price pill */}
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full shadow-xs text-xs font-bold text-[#FA4D89] border border-[#FCE7F0]">
                      {isContactPricing ? 'Contact for Pricing' : pkg.price}
                    </div>

                    {/* Duration pill */}
                    <div className="absolute bottom-3.5 left-3.5 bg-[#1F2937]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#F9A8D4]" />
                      <span>{pkg.duration || '45 mins'}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold tracking-wider text-[#FA4D89] bg-[#FFF0F5] px-3 py-0.5 rounded-full inline-block mb-2.5">
                    {pkg.category || 'Beauty Care'}
                  </span>

                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1F2937] mb-2 leading-snug group-hover:text-[#FA4D89] transition-colors">
                    {pkg.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-4">
                    {pkg.desc}
                  </p>

                  {/* Special bridal benefit */}
                  {specialBenefit && (
                    <div className="mb-4 p-3 bg-[#FFF0F5]/70 border border-[#F9A8D4] rounded-2xl flex items-start gap-2.5">
                      <Gift className="w-4 h-4 text-[#FA4D89] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#1F2937]">
                        <span className="font-bold text-[#FA4D89] block">Special Benefit:</span>
                        <span className="text-[#4B5563] leading-snug">{specialBenefit}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Row */}
                <div className="pt-4 border-t border-[#FCE7F0] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#4B5563] block uppercase tracking-wider">Price</span>
                    <span className="font-serif font-bold text-lg text-[#FA4D89]">
                      {isContactPricing ? 'Contact for Pricing' : pkg.price}
                    </span>
                  </div>

                  <Link 
                    to={`/book?service=${encodeURIComponent(pkg.name)}&price=${encodeURIComponent(isContactPricing ? 'Contact for Pricing' : pkg.price)}`}
                    className="shrink-0"
                  >
                    <button className="bg-[#FA4D89] hover:bg-[#E11D74] text-white font-semibold py-2.5 px-4 sm:px-5 rounded-full transition-all duration-200 text-xs sm:text-sm flex items-center gap-2 shadow-salon hover:shadow-salon-hover hover:-translate-y-0.5">
                      <CalendarCheck className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;
