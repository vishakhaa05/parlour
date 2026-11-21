import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Trash2, Loader2, Sparkles, X, Eye, Tag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export interface GalleryImage {
  _id: string;
  base64String: string;
  title?: string;
  category?: string;
  tags?: string[];
  description?: string;
  uploadDate?: string;
  isPublished?: boolean;
  createdAt?: string;
}

const CURATED_DEFAULT_PORTFOLIO: GalleryImage[] = [
  {
    _id: 'gal_init_1',
    title: 'Royal HD Bridal Transformation',
    category: 'Bridal Makeup',
    tags: ['Bridal', 'HD Makeup', 'Traditional', 'Wedding Glow'],
    description: 'Flawless camera-ready bridal makeup featuring waterproof HD base, customized lip contouring, and traditional jewelry & dupatta styling.',
    base64String: '/hero.png',
    isPublished: true,
    uploadDate: '2026-10-18',
    createdAt: '2026-10-18T10:00:00.000Z'
  },
  {
    _id: 'gal_init_2',
    title: 'Botanical Fruit Glow Facial',
    category: 'Facials & Skincare',
    tags: ['Facials', 'Organic', 'Fruit Glow', 'Barrier Repair'],
    description: 'Deep pore vacuum extraction followed by organic fruit collagen infusion, leaving the skin visibly dewy and refreshed.',
    base64String: '/image1.png',
    isPublished: true,
    uploadDate: '2026-10-19',
    createdAt: '2026-10-19T11:00:00.000Z'
  },
  {
    _id: 'gal_init_3',
    title: 'Hollywood Waves & Keratin Glaze',
    category: 'Hair Styling & Spa',
    tags: ['Hair Styling', 'Keratin', 'Waves', 'Blowout'],
    description: 'Ultra-glossy Hollywood waves crafted with thermal barrier protection and organic argan shine serum.',
    base64String: '/image3.png',
    isPublished: true,
    uploadDate: '2026-10-20',
    createdAt: '2026-10-20T12:00:00.000Z'
  },
  {
    _id: 'gal_init_4',
    title: 'Moroccan Argan Head Spa Ritual',
    category: 'Hair Styling & Spa',
    tags: ['Hair Spa', 'Head Massage', 'Scalp Care', 'Argan Oil'],
    description: 'Deep therapeutic scalp detox with warm Moroccan botanical oils and micro-mist steamer for total hair nourishment.',
    base64String: '/image3.png',
    isPublished: true,
    uploadDate: '2026-10-21',
    createdAt: '2026-10-21T14:30:00.000Z'
  },
  {
    _id: 'gal_init_5',
    title: 'Rose Gold Chrome & Gel Extensions',
    category: 'Nail Art',
    tags: ['Nail Art', 'Chrome', 'Gel Extensions', 'Manicure'],
    description: 'Hand-sculpted gel extensions with delicate mirror rose-gold chrome finish and floral nail art accents.',
    base64String: '/image2.png',
    isPublished: true,
    uploadDate: '2026-10-22',
    createdAt: '2026-10-22T15:00:00.000Z'
  },
  {
    _id: 'gal_init_6',
    title: 'Luxury Salon & Private Spa Suites',
    category: 'Salon Interiors',
    tags: ['Ambiance', 'Salon', 'Sanctuary', 'Luxury'],
    description: 'A glimpse inside our serene, hygienically sanitized parlour stations equipped with state-of-the-art styling chairs and calm lighting.',
    base64String: '/image4.png',
    isPublished: true,
    uploadDate: '2026-10-23',
    createdAt: '2026-10-23T16:00:00.000Z'
  }
];

const CATEGORIES = [
  'All',
  'Bridal Makeup',
  'Facials & Skincare',
  'Hair Styling & Spa',
  'Nail Art',
  'Salon Interiors'
];

const Gallery: React.FC = () => {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>(CURATED_DEFAULT_PORTFOLIO);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);

  // Upload modal state for Admin / Owner
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Bridal Makeup');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [previewBase64, setPreviewBase64] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = () => {
    setIsLoading(true);
    apiFetch<GalleryImage[]>('/gallery')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Format backend images: replace broken or placeholder paths if needed
          const backendImages = data.map((img, idx) => {
            let src = img.base64String;
            if (src === '/image1.png') src = '/image1.png';
            if (src === '/image2.png') src = '/image3.png';
            if (src === '/image3.png') src = '/hero.png';
            return {
              ...img,
              base64String: src || CURATED_DEFAULT_PORTFOLIO[idx % CURATED_DEFAULT_PORTFOLIO.length].base64String
            };
          });

          // Merge backend uploads with our curated images so "All" is always rich and complete
          const mergedIds = new Set(backendImages.map(b => b._id));
          const combined = [
            ...backendImages,
            ...CURATED_DEFAULT_PORTFOLIO.filter(c => !mergedIds.has(c._id))
          ];
          setImages(combined);
        } else {
          setImages(CURATED_DEFAULT_PORTFOLIO);
        }
      })
      .catch(err => {
        console.error('Gallery fetch error, using curated portfolio:', err);
        setImages(CURATED_DEFAULT_PORTFOLIO);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewBase64(reader.result as string);
      setShowUploadModal(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewBase64) return;

    setIsUploading(true);
    try {
      const res = await apiFetch<{ success: boolean; image: GalleryImage }>('/gallery', {
        method: 'POST',
        body: JSON.stringify({
          base64String: previewBase64,
          title: uploadTitle.trim() || 'Parlour Treatment Work',
          category: uploadCategory,
          tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean),
          description: uploadDescription.trim(),
          isPublished: true
        })
      });

      if (res.image) {
        setImages(prev => [res.image, ...prev]);
        toast.success('Genuine parlour work published to gallery! ✨');
        setShowUploadModal(false);
        setPreviewBase64(null);
        setUploadTitle('');
        setUploadTags('');
        setUploadDescription('');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this image from the gallery?')) {
      try {
        await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
        setImages(prev => prev.filter((img) => img._id !== id));
        toast.success('Image removed from gallery.');
        if (lightboxImg?._id === id) setLightboxImg(null);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to delete image.');
      }
    }
  };

  // Smart, flexible category & tag filter
  const matchesSelectedCategory = (img: GalleryImage, catButton: string): boolean => {
    if (catButton === 'All') return true;

    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = clean(catButton);
    const cat = clean(img.category || '');
    const title = clean(img.title || '');

    // Direct substring or reverse substring match
    if (cat.includes(target) || target.includes(cat)) return true;
    if (title.includes(target)) return true;

    // Check tags
    if (Array.isArray(img.tags)) {
      if (img.tags.some(t => {
        const tagClean = clean(t);
        return tagClean.includes(target) || target.includes(tagClean);
      })) {
        return true;
      }
    }

    // Specific category semantic aliases
    if (catButton === 'Bridal Makeup') {
      return cat.includes('bridal') || cat.includes('party') || cat.includes('makeover');
    }
    if (catButton === 'Facials & Skincare') {
      return cat.includes('skin') || cat.includes('facial') || cat.includes('fruit') || cat.includes('gold') || cat.includes('acne');
    }
    if (catButton === 'Hair Styling & Spa') {
      return cat.includes('hair') || cat.includes('keratin') || cat.includes('spa') || cat.includes('scalp') || cat.includes('waves');
    }
    if (catButton === 'Nail Art') {
      return cat.includes('nail') || cat.includes('mani') || cat.includes('pedi') || cat.includes('chrome');
    }
    if (catButton === 'Salon Interiors') {
      return cat.includes('salon') || cat.includes('interior') || cat.includes('ambiance') || cat.includes('suite');
    }

    return false;
  };

  const filteredImages = images.filter(img => {
    const categoryMatch = matchesSelectedCategory(img, selectedCategory);
    
    let tagMatch = true;
    if (activeTag) {
      const cleanTag = activeTag.toLowerCase().trim();
      tagMatch = Array.isArray(img.tags) && img.tags.some(t => t.toLowerCase().trim() === cleanTag);
    }

    return categoryMatch && tagMatch;
  });

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#FFF9FA] scroll-mt-20 border-b border-[#FCE7F0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Owner Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF0F5] text-[#FA4D89] text-xs font-semibold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Client Transformations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F2937] leading-tight">
              Beauty Portfolio & <span className="text-[#FA4D89] italic">Gallery</span>
            </h2>
            <p className="text-[#4B5563] text-sm sm:text-base mt-2 leading-relaxed">
              Explore authentic bridal transformations, hair art, and skincare therapies completed with care at Shree Ambika.
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              <button 
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 bg-[#FA4D89] hover:bg-[#E11D74] text-white px-5 py-2.5 rounded-full transition shadow-salon hover:shadow-salon-hover disabled:opacity-70 text-xs sm:text-sm font-semibold"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Client Photo</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveTag(null);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FA4D89] text-white shadow-salon'
                    : 'bg-white text-[#1F2937] hover:bg-[#FFF0F5] hover:text-[#FA4D89] border border-[#FCE7F0]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Tag Filter Indicator */}
        {activeTag && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-xs text-[#4B5563]">Filtered by tag:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F5] text-[#FA4D89] text-xs rounded-full font-semibold border border-[#F9A8D4]/40">
              #{activeTag}
              <button 
                onClick={() => setActiveTag(null)} 
                className="hover:text-[#1F2937] ml-1"
                aria-label="Clear tag filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 text-[#FA4D89]">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-[#4B5563] text-sm">Loading salon portfolio...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#FCE7F0] p-8 shadow-xs">
            <Sparkles className="w-10 h-10 text-[#FA4D89] mx-auto mb-3 opacity-60" />
            <p className="font-serif font-bold text-lg text-[#1F2937]">No portfolio items found in "{selectedCategory}".</p>
            <p className="text-[#4B5563] text-xs mt-1 max-w-md mx-auto">
              Please choose another category or check back soon as new client makeovers are added.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-4 py-1.5 bg-[#FFF0F5] text-[#FA4D89] rounded-full text-xs font-semibold hover:bg-[#F9A8D4]/30 transition"
            >
              View All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredImages.map((img) => (
              <div
                key={img._id}
                onClick={() => setLightboxImg(img)}
                className="overflow-hidden rounded-3xl shadow-sm hover:shadow-salon transition-all duration-300 group bg-white cursor-pointer border border-[#FCE7F0] flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF0F5]">
                    <img
                      src={img.base64String}
                      alt={img.title || 'Client Transformation'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/hero.png';
                      }}
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4 text-white">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Eye className="w-4 h-4 text-[#F9A8D4]" />
                        <span>Click to view details</span>
                      </div>
                    </div>

                    {/* Category badge */}
                    {img.category && (
                      <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#FA4D89] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-[#FCE7F0]">
                        {img.category}
                      </span>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteImage(img._id, e)}
                        className="absolute top-3.5 right-3.5 p-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-600 rounded-full shadow-xs transition"
                        title="Delete Image"
                        aria-label="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-[#1F2937] mb-1.5 group-hover:text-[#FA4D89] transition-colors leading-snug">
                      {img.title || 'Parlour Treatment Work'}
                    </h3>
                    <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                      {img.description || 'Custom tailored parlour service completed with organic formulas.'}
                    </p>

                    {/* Tag list */}
                    {Array.isArray(img.tags) && img.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#FCE7F0]/80">
                        {img.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTag(tag);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] text-[#4B5563] hover:text-[#FA4D89] bg-[#FFF9FA] px-2 py-0.5 rounded-full border border-[#FCE7F0] transition"
                          >
                            <Tag className="w-2.5 h-2.5 text-[#FA4D89]" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-4 pt-1 flex items-center justify-between text-[11px] text-[#4B5563]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#F9A8D4]" />
                    <span>{img.uploadDate || 'Recent Work'}</span>
                  </span>
                  <span className="text-[#FA4D89] font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                    View &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#FCE7F0] max-h-[90vh] flex flex-col"
          >
            <div className="relative aspect-video sm:aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
              <img
                src={lightboxImg.base64String}
                alt={lightboxImg.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-[#FA4D89] bg-[#FFF0F5] px-3 py-1 rounded-full border border-[#F9A8D4]/40">
                  {lightboxImg.category || 'Beauty Care'}
                </span>
                {lightboxImg.uploadDate && (
                  <span className="text-xs text-[#4B5563] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#F9A8D4]" />
                    {lightboxImg.uploadDate}
                  </span>
                )}
              </div>

              <h3 className="font-serif font-bold text-2xl text-[#1F2937] mb-2">
                {lightboxImg.title || 'Client Transformation'}
              </h3>

              <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                {lightboxImg.description || 'Custom tailored parlour service completed with organic formulas.'}
              </p>

              {Array.isArray(lightboxImg.tags) && lightboxImg.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[#FCE7F0]">
                  {lightboxImg.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-[#4B5563] bg-[#FFF9FA] border border-[#FCE7F0] px-2.5 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#FCE7F0] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold text-xl text-[#1F2937]">Upload Treatment Photo</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#4B5563] hover:text-[#1F2937]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewBase64 && (
              <div className="mb-4 rounded-2xl overflow-hidden aspect-video bg-[#FFF0F5]">
                <img src={previewBase64} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Glam Transformation"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Bridal, HD Makeup, Traditional"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief note about the products and styling used..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#4B5563] hover:bg-[#FFF0F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-[#FA4D89] hover:bg-[#E11D74] text-white text-sm font-semibold shadow-salon disabled:opacity-50"
                >
                  {isUploading ? 'Publishing...' : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
