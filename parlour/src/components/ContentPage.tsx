import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'skin', name: 'Skin Care' },
  { id: 'hair', name: 'Hair Treatments' },
  { id: 'spa', name: 'Spa & Relax' }
];

const treatments = {
  skin: [
    { name: 'Glowing Facial', price: '₹2500', desc: 'Revitalize your skin with our signature facial.' },
    { name: 'Acne Clearing', price: '₹3500', desc: 'Deep cleansing and exfoliation to prevent breakouts.' },
    { name: 'Anti-Aging', price: '₹5000', desc: 'Reduce fine lines and restore youthful glow.' }
  ],
  hair: [
    { name: 'Hair Spa', price: '₹2000', desc: 'Deep conditioning treatment for silky smooth hair.' },
    { name: 'Color & Highlights', price: '₹6000', desc: 'Transform your look with vibrant hair colors.' },
    { name: 'Keratin Treatment', price: '₹8000', desc: 'Frizz-free, shiny hair that lasts for months.' }
  ],
  spa: [
    { name: 'Aroma Massage', price: '₹4000', desc: 'Relaxing full body massage with essential oils.' },
    { name: 'Hot Stone Therapy', price: '₹5000', desc: 'Relieve muscle tension with heated stones.' },
    { name: 'Foot Reflexology', price: '₹2500', desc: 'Targeted pressure points for ultimate relaxation.' }
  ]
};

const faqs = [
  { q: "Do I need to book an appointment in advance?", a: "Yes, we recommend booking at least 24 hours in advance to secure your preferred time slot." },
  { q: "What products do you use?", a: "We only use premium, cruelty-free, and organic products suitable for all skin types." },
  { q: "Do you offer bridal packages?", a: "Absolutely! We have specialized bridal packages that can be customized to your needs." }
];

const ContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('skin');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [treatmentImages, setTreatmentImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/treatment-images')
      .then(res => res.json())
      .then(data => {
        setTreatmentImages(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load treatment images.');
        setIsLoading(false);
      });
  }, []);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleImageUpload = (treatmentName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setUploadingImage(treatmentName);
      try {
        const res = await fetch('http://localhost:5000/api/treatment-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ treatmentName, base64String })
        });
        if (res.ok) {
          setTreatmentImages(prev => ({ ...prev, [treatmentName]: base64String }));
          toast.success(`${treatmentName} image uploaded!`);
        } else {
          toast.error('Failed to upload image.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload image.');
      } finally {
        setUploadingImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async (treatmentName: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/treatment-images/${encodeURIComponent(treatmentName)}`, { method: 'DELETE' });
        if (res.ok) {
          setTreatmentImages(prev => {
            const newImages = { ...prev };
            delete newImages[treatmentName];
            return newImages;
          });
          toast.success(`${treatmentName} image deleted!`);
        } else {
          toast.error('Failed to delete image.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete image.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-20">
      {/* Hero Section */}
      <div className="bg-pink-100 py-16 text-center shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
          Our <span className="text-pink-400">Treatments</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4 mt-4">
          Discover our wide range of premium services designed to enhance your natural beauty and provide ultimate relaxation.
        </p>
      </div>

      {/* Tabs Section */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm ${
                activeTab === cat.id
                  ? 'bg-pink-400 text-white shadow-pink-300 shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:bg-pink-100 hover:text-pink-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Treatment Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-pink-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {treatments[activeTab as keyof typeof treatments].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-50 group flex flex-col"
            >
              {/* Image Section */}
              <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 aspect-video flex items-center justify-center">
                {treatmentImages[item.name] ? (
                  <>
                    <img src={treatmentImages[item.name]} alt={item.name} className="w-full h-full object-cover" />
                    {isAdmin && (
                      <button 
                        onClick={() => handleDeleteImage(item.name)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition shadow-md"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  </div>
                )}
                
                {isAdmin && !treatmentImages[item.name] && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={el => fileInputRefs.current[item.name] = el}
                      onChange={(e) => handleImageUpload(item.name, e)} 
                      className="hidden" 
                    />
                    <button 
                      disabled={uploadingImage === item.name}
                      onClick={() => fileInputRefs.current[item.name]?.click()}
                      className="flex items-center gap-1 bg-white text-gray-800 px-3 py-1.5 rounded-full text-sm hover:bg-pink-50 transition shadow-sm disabled:opacity-70 disabled:transform-none"
                    >
                      {uploadingImage === item.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} 
                      {uploadingImage === item.name ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-400 transition-colors">{item.name}</h3>
                <span className="bg-pink-50 text-pink-400 px-3 py-1 rounded-full text-sm font-bold">{item.price}</span>
              </div>
              <p className="text-gray-500 mb-6 flex-1">{item.desc}</p>
              <Link to={`/book?service=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}`} className="block mt-auto">
                <button className="w-full py-2 border-2 border-pink-400 text-pink-400 font-medium rounded-xl hover:bg-pink-400 hover:text-white transition-all shadow-sm hover:shadow-md">
                  Book Now
                </button>
              </Link>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 mt-24">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-700">{faq.q}</span>
                <span className={`text-pink-400 text-2xl transform transition-transform duration-300 ${openFaq === idx ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div 
                className={`px-6 transition-all duration-500 ease-in-out overflow-hidden ${
                  openFaq === idx ? 'max-h-40 py-4 border-t border-gray-100 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
