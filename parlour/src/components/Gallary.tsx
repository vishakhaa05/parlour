import React, { useState, useRef } from 'react';
import { UploadCloud, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface GalleryImage {
  _id: string;
  base64String: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load gallery images.');
        setIsLoading(false);
      });
  }, []);
  const [isAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setIsUploading(true);
      try {
        const res = await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64String })
        });
        const newImage = await res.json();
        setImages(prev => [newImage, ...prev]);
        toast.success('Image uploaded successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload image.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await fetch(`http://localhost:5000/api/gallery/${id}`, { method: 'DELETE' });
        setImages(prev => prev.filter((img) => img._id !== id));
        toast.success('Image deleted successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete image.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="bg-gray-50 py-20 flex-1">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Heading & Upload */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200 pb-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 md:mb-0">
              Our <span className="text-pink-400">Gallery</span>
            </h2>
            
            {isAdmin && (
              <div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button 
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            )}
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-pink-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No images found in the gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition group relative bg-white"
                >
                  <img
                    src={img.base64String}
                    alt={`Gallery Image`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteImage(img._id)}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition shadow-md"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Gallery;