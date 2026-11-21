import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, CalendarCheck } from 'lucide-react';
import { apiFetch } from '../utils/api';

interface StaffItem {
  _id: string;
  name: string;
  role: string;
  specialization: string[];
  experience: string;
  image?: string;
  workingHours?: string;
}

const defaultStaff: StaffItem[] = [
  {
    _id: 's1',
    name: 'Pooja Sharma',
    role: 'Master Hair Stylist & Keratin Expert',
    specialization: ['Hair Styling', 'Balayage & Highlights', 'Keratin Smoothing'],
    experience: '8+ years',
    image: '/image2.png'
  },
  {
    _id: 's2',
    name: 'Meera Sen',
    role: 'Senior Bridal & HD Makeup Artist',
    specialization: ['HD Bridal Makeup', 'Party Glam', 'Traditional Makeover'],
    experience: '6+ years',
    image: '/image3.png'
  },
  {
    _id: 's3',
    name: 'Ananya Verma',
    role: 'Skincare Specialist & Aesthetician',
    specialization: ['24K Gold Facial', 'Acne Clearing', 'Organic Fruit Packs'],
    experience: '5+ years',
    image: '/image1.png'
  },
  {
    _id: 's4',
    name: 'Kavita Nair',
    role: 'Nail Artist & Spa Therapist',
    specialization: ['Gel Extensions', 'Chrome Nail Art', 'Spa Pedicure'],
    experience: '4+ years',
    image: '/hero.png'
  }
];

const StaffShowcase: React.FC = () => {
  const [staff, setStaff] = useState<StaffItem[]>(defaultStaff);

  useEffect(() => {
    apiFetch<StaffItem[]>('/staff')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStaff(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 bg-pink-50/40 border-y border-pink-100/60">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full mb-3">
            <UserCheck className="w-3.5 h-3.5 text-pink-500" /> Dedicated Artists
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Meet Our <span className="text-pink-500">Beauty Specialists</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Trained and certified professionals committed to providing hygienic, gentle, and radiant parlour transformations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.map((member, idx) => (
            <div
              key={member._id || idx}
              className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border border-pink-100 text-center flex flex-col justify-between"
            >
              <div>
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-pink-100 shadow-md">
                  <img
                    src={member.image || `/image${(idx % 3) + 1}.png`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/image${(idx % 3) + 1}.png`;
                    }}
                  />
                </div>

                <h3 className="font-bold text-gray-900 text-base">{member.name}</h3>
                <p className="text-xs font-semibold text-pink-600 mb-2">{member.role}</p>
                <span className="inline-block text-[10px] text-gray-400 font-medium mb-3">
                  Experience: {member.experience}
                </span>

                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {(member.specialization || []).slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full border border-pink-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <Link to={`/book?staff=${encodeURIComponent(member.name)}`}>
                <button className="w-full py-2 bg-pink-50 hover:bg-pink-500 text-pink-700 hover:text-white rounded-xl text-xs font-bold border border-pink-200 hover:border-transparent transition flex items-center justify-center gap-1.5 shadow-sm">
                  <CalendarCheck className="w-3.5 h-3.5" /> Book with {member.name.split(' ')[0]}
                </button>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StaffShowcase;
