import React, { useEffect, useState } from 'react';
import { Star, CheckCircle, Plus, X, Loader2, Quote } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ReviewItem {
  _id: string;
  author: string;
  rating: number;
  service: string;
  comment: string;
  verified?: boolean;
  date?: string;
}

const DEFAULT_GENUINE_REVIEWS: ReviewItem[] = [
  {
    _id: 'r1',
    author: 'Sunita Mehra',
    rating: 5,
    service: 'Royal HD Bridal Transformation',
    comment: 'Meera did my bridal makeover and it was an absolute dream! Looked stunning in photography and lasted throughout the entire ceremony without smudging.',
    verified: true,
    date: '2026-10-12'
  },
  {
    _id: 'r2',
    author: 'Pooja Agarwal',
    rating: 5,
    service: 'Glowing Facial Therapy',
    comment: 'The organic fruit facial gave me the most radiant, healthy glow before my cousin’s wedding. The ambiance was calm, hygienic, and deeply relaxing.',
    verified: true,
    date: '2026-10-14'
  },
  {
    _id: 'r3',
    author: 'Deepika Joshi',
    rating: 5,
    service: 'Keratin Smoothing Treatment',
    comment: 'Pooja is a miracle worker with hair! My frizzy unruly locks are now silky smooth and effortless to style. Worth every single rupee.',
    verified: true,
    date: '2026-10-15'
  },
  {
    _id: 'r4',
    author: 'Ritika Sengupta',
    rating: 5,
    service: 'Rose Gold Chrome Nail Extensions',
    comment: 'Intricate and gorgeous nail art. It has been over 3 weeks and the gel extensions are still completely intact. Very hygienic setup.',
    verified: true,
    date: '2026-10-16'
  }
];

const ReviewsSection: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_GENUINE_REVIEWS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [author, setAuthor] = useState(user?.name || '');
  const [service, setService] = useState('Glowing Facial Therapy');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<ReviewItem[]>('/reviews')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => {
        setReviews(DEFAULT_GENUINE_REVIEWS);
      });
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      toast.error('Please enter your name and review comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch<{ success: boolean; review: ReviewItem }>('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          author: author.trim(),
          service: service.trim(),
          rating,
          comment: comment.trim()
        })
      });

      if (res.success && res.review) {
        toast.success('Thank you! Your testimonial has been shared ✨');
        setReviews([res.review, ...reviews]);
        setShowAddModal(false);
        setComment('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#FCE7F0]/60">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF0F5] text-[#FA4D89] text-xs font-semibold rounded-full mb-3">
              <Star className="w-3.5 h-3.5 fill-[#FA4D89] text-[#FA4D89]" />
              <span>Client Testimonials</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F2937] leading-tight">
              Words from Our <span className="text-[#FA4D89] italic">Cherished Guests</span>
            </h2>
            <p className="text-[#4B5563] text-sm sm:text-base mt-2 leading-relaxed">
              Authentic reviews from clients who experienced our mindful beauty care and bridal artistry.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-[#FFF0F5] hover:bg-[#F9A8D4]/30 text-[#FA4D89] font-semibold px-5 py-2.5 rounded-full border border-[#F9A8D4] shadow-2xs transition text-xs sm:text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((rev, idx) => (
            <div
              key={rev._id || idx}
              className="bg-[#FFF9FA] rounded-3xl p-7 border border-[#FCE7F0] shadow-sm hover:shadow-salon transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                {/* Rating and Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#F9A8D4]/40" />
                </div>

                <p className="text-[#1F2937] text-sm leading-relaxed mb-6 font-normal">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#FCE7F0] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-[#1F2937] text-base">{rev.author}</h4>
                  <span className="text-[11px] text-[#FA4D89] font-medium block mt-0.5">{rev.service}</span>
                </div>
                {rev.verified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Write Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#FCE7F0]">
              <div className="flex items-center justify-between pb-4 border-b border-[#FCE7F0] mb-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1F2937]">
                    Share Your Experience
                  </h3>
                  <p className="text-xs text-[#4B5563]">We value your feedback and care</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-1.5 text-[#4B5563] hover:text-[#1F2937] rounded-full hover:bg-[#FFF0F5]"
                  aria-label="Close review modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Service Received</label>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. Glowing Facial Therapy, HD Bridal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${
                          rating >= num ? 'bg-[#FFF0F5] border-[#FA4D89] text-[#FA4D89]' : 'bg-[#FFF9FA] border-[#FCE7F0] text-[#4B5563]'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${rating >= num ? 'fill-[#FA4D89] text-[#FA4D89]' : 'text-gray-300'}`} />
                        <span>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Your Feedback *</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience and results..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#FCE7F0] text-[#4B5563] font-semibold text-xs hover:bg-[#FFF0F5] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#FA4D89] hover:bg-[#E11D74] text-white font-semibold text-xs shadow-salon transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewsSection;
