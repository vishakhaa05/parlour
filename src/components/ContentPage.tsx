import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Trash2, Loader2, Clock, Check, Search, Sparkles, CalendarCheck, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export interface PackageItem {
  _id?: string;
  name: string;
  category: string;
  price: string;
  duration?: string;
  desc: string;
  includes?: string[];
  image?: string;
  status?: string;
  specialBenefit?: string;
}

export const ACTUAL_PARLOUR_SERVICES: PackageItem[] = [
  // 1. SKIN CARE
  {
    _id: 'pkg_skin_01',
    name: 'Facial',
    category: 'Skin Care',
    price: '₹300 – ₹1,250',
    duration: '45–60 mins',
    desc: 'Refresh your skin with relaxing facial treatments designed to cleanse, nourish and enhance your natural glow.',
    includes: ['Deep Pore Cleansing', 'Steam & Exfoliation', 'Nourishing Glow Mask', 'Relaxing Face & Neck Massage'],
    image: '/images/facial-treatment.jpg',
    status: 'Active'
  },

  // 2. HAIR CARE
  {
    _id: 'pkg_hair_01',
    name: 'Hair Spa',
    category: 'Hair Care',
    price: '₹800',
    duration: '60 mins',
    desc: 'Relaxing hair spa treatment to nourish your hair and improve its softness and shine.',
    includes: ['Scalp Detox Massage', 'Deep Conditioning Cream', 'Steam Therapy', 'Gentle Blow Dry'],
    image: '/images/hair-spa.jpg',
    status: 'Active'
  },
  {
    _id: 'pkg_hair_02',
    name: 'Haircut',
    category: 'Hair Care',
    price: '₹250',
    duration: '30 mins',
    desc: 'Professional haircut services to give your hair a fresh and stylish look.',
    includes: ['Hair Texture Consultation', 'Precision Cut & Trimming', 'Styling & Setting'],
    image: '/images/haircut.jpg',
    status: 'Active'
  },

  // 3. BODY CARE
  {
    _id: 'pkg_body_01',
    name: 'Full Body Wax',
    category: 'Body Care',
    price: '₹800',
    duration: '60 mins',
    desc: 'Full body waxing service for smooth and well-groomed skin.',
    includes: ['Skin Pre-Cleanse & Prep', 'Gentle Organic Wax Application', 'Post-Wax Soothing Aloe Gel'],
    image: '/images/body-wax.jpg',
    status: 'Active'
  },
  {
    _id: 'pkg_body_02',
    name: 'Manicure & Pedicure',
    category: 'Body Care',
    price: '₹600',
    duration: '60 mins',
    desc: 'Complete hand and foot care with nail grooming and a relaxing beauty treatment.',
    includes: ['Warm Herbal Soak', 'Nail Shaping & Cuticle Care', 'Exfoliating Scrub', 'Hydrating Hand & Foot Massage'],
    image: '/images/nail-art.jpg',
    status: 'Active'
  },

  // 4. MAKEUP & BRIDAL
  {
    _id: 'pkg_makeup_01',
    name: 'Party Makeup',
    category: 'Makeup & Bridal',
    price: '₹800',
    duration: '60 mins',
    desc: 'Beautiful party makeup to help you look confident and elegant for special occasions.',
    includes: ['Skin Primer & Base Preparation', 'Eye Makeup & Lash Setting', 'Lip Color & Highlight', 'Long-Lasting Setting Mist'],
    image: '/images/party-makeup.jpg',
    status: 'Active'
  },
  {
    _id: 'pkg_makeup_02',
    name: 'Engagement Makeup',
    category: 'Makeup & Bridal',
    price: '₹2,000',
    duration: '90 mins',
    desc: 'Elegant makeup styling for your special engagement celebration.',
    includes: ['HD Flawless Skin Base', 'Contouring & Strobing', 'Dramatic Eye Styling & Lashes', 'Hairstyling Assistance'],
    image: '/images/bridal-makeup.jpg',
    status: 'Active'
  },
  {
    _id: 'pkg_makeup_03',
    name: 'Bridal Makeup',
    category: 'Makeup & Bridal',
    price: 'Contact for Pricing',
    specialBenefit: 'One complimentary makeup service with the bridal booking.',
    duration: '120 mins',
    desc: 'Professional bridal makeup to make your special day memorable.',
    includes: ['Waterproof HD Bridal Base', 'Jewelry, Saree & Dupatta Draping', 'Premium False Lashes', 'Complimentary Guest Makeup Service'],
    image: '/images/bridal-makeup.jpg',
    status: 'Active'
  }
];

export const CATEGORIES_LIST = [
  { id: 'All Services', label: 'All Services' },
  { id: 'Skin Care', label: 'Skin Care' },
  { id: 'Hair Care', label: 'Hair Care' },
  { id: 'Body Care', label: 'Body Care' },
  { id: 'Makeup & Bridal', label: 'Makeup & Bridal' }
];

export const getServicePhoto = (name: string, category: string): string => {
  const n = (name || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (n === 'facial' || c.includes('skin')) return '/images/facial-treatment.jpg';
  if (n === 'hair spa') return '/images/hair-spa.jpg';
  if (n === 'haircut' || c.includes('hair')) return '/images/haircut.jpg';
  if (n === 'full body wax' || (c.includes('body') && n.includes('wax'))) return '/images/body-wax.jpg';
  if (n.includes('manicure') || n.includes('pedicure') || n.includes('nail')) return '/images/nail-art.jpg';
  if (n === 'party makeup') return '/images/party-makeup.jpg';
  if (n.includes('bridal') || n.includes('engagement') || c.includes('makeup')) return '/images/bridal-makeup.jpg';
  return '/images/facial-treatment.jpg';
};

const faqs = [
  { q: "Do I need to book an appointment in advance?", a: "Yes, we recommend booking in advance to secure your preferred date and time slot." },
  { q: "What is the special benefit with Bridal Makeup?", a: "Every Bridal Makeup booking includes one complimentary makeup service for a family member or friend on your wedding day!" },
  { q: "What products do you use for facials and skin care?", a: "We use certified gentle, skin-friendly, and nourishing products suitable for all skin types." },
  { q: "Can I customize a package with multiple treatments?", a: "Yes, you can book multiple services such as Hair Spa + Manicure & Pedicure together. Contact us or note your request when booking." }
];

const ContentPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Services');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [packages, setPackages] = useState<PackageItem[]>(ACTUAL_PARLOUR_SERVICES);
  const [treatmentImages, setTreatmentImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiFetch<PackageItem[]>('/packages'),
      apiFetch<Record<string, string>>('/treatment-images').catch(() => ({}))
    ])
      .then(([pkgsData, imagesData]) => {
        if (Array.isArray(pkgsData) && pkgsData.length > 0) {
          // Map backend items; if empty or legacy data, ensure actual services are present
          const hasActualServices = pkgsData.some(p => p.name.toLowerCase() === 'facial' || p.name.toLowerCase() === 'hair spa');
          if (hasActualServices) {
            setPackages(pkgsData);
          } else {
            // Merge actual services with any custom ones owner added
            setPackages(ACTUAL_PARLOUR_SERVICES);
          }
        } else {
          setPackages(ACTUAL_PARLOUR_SERVICES);
        }
        if (imagesData && typeof imagesData === 'object') {
          setTreatmentImages(imagesData as Record<string, string>);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading treatments from API:', err);
        setPackages(ACTUAL_PARLOUR_SERVICES);
        setIsLoading(false);
      });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  // Normalize category matching
  const matchesCategory = (pkg: PackageItem, cat: string): boolean => {
    if (cat === 'All Services') return true;

    const target = cat.toLowerCase().replace(/[^a-z]/g, '');
    const pkgCat = (pkg.category || '').toLowerCase().replace(/[^a-z]/g, '');
    const pkgName = (pkg.name || '').toLowerCase();

    if (pkgCat === target) return true;
    if (pkgCat.includes(target) || target.includes(pkgCat)) return true;

    if (cat === 'Skin Care') {
      return pkgCat.includes('skin') || pkgName.includes('facial');
    }
    if (cat === 'Hair Care') {
      return pkgCat.includes('hair') || pkgName.includes('hair') || pkgName.includes('haircut') || pkgName.includes('hair spa');
    }
    if (cat === 'Body Care') {
      return pkgCat.includes('body') || pkgCat.includes('spa') || pkgName.includes('wax') || pkgName.includes('manicure') || pkgName.includes('pedicure');
    }
    if (cat === 'Makeup & Bridal') {
      return pkgCat.includes('makeup') || pkgCat.includes('bridal') || pkgName.includes('makeup') || pkgName.includes('bridal') || pkgName.includes('engagement');
    }

    return false;
  };

  // Filter packages for active category and search query
  const filteredTreatments = packages.filter(p => {
    const isCategoryMatch = matchesCategory(p, selectedCategory);
    const q = searchQuery.toLowerCase().trim();
    const isSearchMatch = !q || (
      p.name.toLowerCase().includes(q) ||
      (p.desc && p.desc.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
    return isCategoryMatch && isSearchMatch;
  });

  const handleImageUpload = (treatmentName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setUploadingImage(treatmentName);
      try {
        await apiFetch('/treatment-images', {
          method: 'POST',
          body: JSON.stringify({ treatmentName, base64String })
        });
        setTreatmentImages(prev => ({ ...prev, [treatmentName]: base64String }));
        toast.success(`${treatmentName} photo updated! ✨`);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to upload photo.');
      } finally {
        setUploadingImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async (treatmentName: string) => {
    if (window.confirm(`Are you sure you want to delete the image for ${treatmentName}?`)) {
      try {
        await apiFetch(`/treatment-images/${encodeURIComponent(treatmentName)}`, { 
          method: 'DELETE' 
        });
        setTreatmentImages(prev => {
          const newImages = { ...prev };
          delete newImages[treatmentName];
          return newImages;
        });
        toast.success(`${treatmentName} image deleted.`);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to delete image.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] pb-24">
      {/* Header Banner */}
      <div className="bg-[#FFF8F6] border-b border-[#F2DCE2] py-14 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F7E5E9] text-[#C65D7B] text-xs font-semibold rounded-full mb-3.5 border border-[#E8A0B1]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon Menu & Transparent Pricing</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29232A] mb-3.5 leading-tight">
            Our <span className="text-[#C65D7B] italic">Services & Pricing</span>
          </h1>
          <p className="text-[#6E6270] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Explore our complete range of certified skincare, relaxing hair therapies, grooming, and bespoke bridal makeovers designed to enhance your natural beauty.
          </p>
        </div>
      </div>

      {/* Tabs & Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="w-4 h-4 text-[#6E6270] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search service (e.g. Facial, Hair Spa, Bridal)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-[#F2DCE2] text-sm text-[#29232A] shadow-2xs focus:ring-2 focus:ring-[#C65D7B]/30 outline-none"
          />
        </div>

        {/* Category Filter Pills (Exact 5 Categories) */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-12">
          {CATEGORIES_LIST.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-200 text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-[#C65D7B] text-white shadow-salon'
                    : 'bg-white text-[#29232A] hover:bg-[#F7E5E9] hover:text-[#C65D7B] border border-[#F2DCE2]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Treatment Cards Grid: 3 on desktop, 2 on tablets, 1 on mobile */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 text-[#C65D7B]">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-[#6E6270] text-sm font-medium">Loading parlour services...</p>
          </div>
        ) : filteredTreatments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-[#F2DCE2] max-w-lg mx-auto shadow-2xs">
            <p className="font-serif font-bold text-lg text-[#29232A]">No services found in this category.</p>
            <p className="text-[#6E6270] text-xs mt-1">Try another search keyword or click "All Services" above.</p>
            <button
              onClick={() => { setSelectedCategory('All Services'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#F7E5E9] text-[#C65D7B] text-xs font-semibold rounded-full hover:bg-[#E8A0B1]/30 transition"
            >
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTreatments.map((item, idx) => {
              const displayImage = treatmentImages[item.name] || (item.image && item.image.startsWith('/images/') ? item.image : getServicePhoto(item.name, item.category));
              const isBridal = item.name.toLowerCase().includes('bridal');
              const isContactPricing = item.price.toLowerCase().includes('contact') || isBridal;
              const specialBenefit = item.specialBenefit || (isBridal ? 'One complimentary makeup service with the bridal booking.' : null);

              return (
                <div 
                  key={item._id || idx} 
                  className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm hover:shadow-salon transition-all duration-300 border border-[#F2DCE2] flex flex-col justify-between group h-full"
                >
                  <div>
                    {/* Image Header with Aspect Ratio & Object-fit */}
                    <div className="relative mb-5 rounded-2xl overflow-hidden bg-[#F7E5E9] aspect-[16/10] flex items-center justify-center">
                      <img 
                        src={displayImage} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getServicePhoto(item.name, item.category);
                        }}
                      />
                      
                      {/* Price Tag Pill */}
                      <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full shadow-xs text-xs font-bold text-[#C65D7B] border border-[#F2DCE2]">
                        {isContactPricing ? 'Contact for Pricing' : item.price}
                      </div>

                      {/* Duration Tag */}
                      <div className="absolute bottom-3.5 left-3.5 bg-[#29232A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#E8A0B1]" />
                        <span>{item.duration || '45 mins'}</span>
                      </div>

                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteImage(item.name)}
                          className="absolute top-3.5 left-3.5 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition shadow-md"
                          title="Delete Custom Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      {isAdmin && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <input 
                            type="file" 
                            accept="image/*" 
                            ref={el => { fileInputRefs.current[item.name] = el; }} 
                            onChange={(e) => handleImageUpload(item.name, e)} 
                            className="hidden" 
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[item.name]?.click()}
                            disabled={uploadingImage === item.name}
                            className="bg-white/90 hover:bg-white text-[#29232A] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5"
                          >
                            <UploadCloud className="w-3.5 h-3.5 text-[#C65D7B]" />
                            <span>{uploadingImage === item.name ? 'Uploading...' : 'Replace Photo'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Category Label */}
                    <span className="text-[11px] font-semibold tracking-wider text-[#C65D7B] bg-[#F7E5E9] px-3 py-0.5 rounded-full inline-block mb-2.5">
                      {item.category || 'Beauty Care'}
                    </span>

                    {/* Service Name */}
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#29232A] mb-2 leading-snug group-hover:text-[#C65D7B] transition-colors">
                      {item.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-[#6E6270] leading-relaxed mb-4">
                      {item.desc}
                    </p>

                    {/* Special Benefit Highlight (Crucial for Bridal Makeup) */}
                    {specialBenefit && (
                      <div className="mb-4 p-3 bg-[#F7E5E9]/70 border border-[#E8A0B1] rounded-2xl flex items-start gap-2.5">
                        <Gift className="w-4 h-4 text-[#C65D7B] shrink-0 mt-0.5" />
                        <div className="text-xs text-[#29232A]">
                          <span className="font-bold text-[#C65D7B] block">Special Bridal Benefit:</span>
                          <span className="text-[#6E6270] leading-snug">{specialBenefit}</span>
                        </div>
                      </div>
                    )}

                    {/* Features checklist if present */}
                    {Array.isArray(item.includes) && item.includes.length > 0 && !specialBenefit && (
                      <div className="space-y-1.5 mb-5 pt-3 border-t border-[#F2DCE2]/80">
                        {item.includes.slice(0, 3).map((inc, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#29232A]">
                            <Check className="w-3.5 h-3.5 text-[#C65D7B] shrink-0" />
                            <span className="truncate">{inc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 border-t border-[#F2DCE2] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-[#6E6270] block uppercase tracking-wider">Price</span>
                      <span className="font-serif font-bold text-lg text-[#C65D7B]">
                        {isContactPricing ? 'Contact for Pricing' : item.price}
                      </span>
                    </div>

                    <Link 
                      to={`/book?service=${encodeURIComponent(item.name)}&price=${encodeURIComponent(isContactPricing ? 'Contact for Pricing' : item.price)}`}
                      className="shrink-0"
                    >
                      <button className="bg-[#C65D7B] hover:bg-[#B24B68] text-white font-semibold py-2.5 px-5 rounded-full transition-all duration-200 text-xs sm:text-sm flex items-center gap-2 shadow-salon hover:shadow-salon-hover hover:-translate-y-0.5">
                        <CalendarCheck className="w-4 h-4" />
                        <span>Book Appointment</span>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQs Section */}
        <div className="mt-24 max-w-3xl mx-auto pt-16 border-t border-[#F2DCE2]">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#29232A]">
              Frequently Asked Questions
            </h2>
            <p className="text-[#6E6270] text-xs sm:text-sm mt-1">
              Have questions about booking or treatments? We're here to help.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-[#F2DCE2] shadow-2xs overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-[#FFF8F6] transition"
                >
                  <span className="text-sm font-semibold text-[#29232A]">{faq.q}</span>
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
    </div>
  );
};

export default ContentPage;
