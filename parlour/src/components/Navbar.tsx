import { Link } from 'react-router-dom';
import { Home, Info, Sparkles, Image as ImageIcon, Phone, CalendarCheck, ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-4 bg-pink-50 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src="/hero.png" alt="logo" className="h-20" />
        </Link>
        <span className="text-pink-400 font-bold text-lg hidden md:block tracking-wide">
          Shree Ambika
        </span>
      </div>

      <ul className="flex gap-6 text-sm items-center">
        <li>
          <Link to="/" className="flex items-center gap-1 text-pink-500 font-medium hover:text-pink-700 transition">
            <Home className="w-4 h-4" /> Home
          </Link>
        </li>
        <li>
          <Link to="/" className="flex items-center gap-1 text-pink-500 font-medium hover:text-pink-700 transition">
            <Info className="w-4 h-4" /> About Us
          </Link>
        </li>
        <li>
          <Link to="/content" className="flex items-center gap-1 text-pink-500 font-medium hover:text-pink-700 transition">
            <Sparkles className="w-4 h-4" /> Treatments
          </Link>
        </li>
        <li>
          <Link to="/gallery" className="flex items-center gap-1 text-pink-500 font-medium hover:text-pink-700 transition">
            <ImageIcon className="w-4 h-4" /> Gallery
          </Link>
        </li>
        <li>
          <Link to="/contact" className="flex items-center gap-1 text-pink-500 font-medium hover:text-pink-700 transition">
            <Phone className="w-4 h-4" /> Contact
          </Link>
        </li>
        <li>
          <Link to="/admin" className="flex items-center gap-1 text-gray-500 font-medium hover:text-gray-700 transition ml-4 border-l border-pink-200 pl-4">
            <ShieldCheck className="w-4 h-4" /> Admin
          </Link>
        </li>
      </ul>
      <Link to="/book">
        <button className="flex items-center gap-2 bg-pink-400 text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-pink-500 transition-all hover:-translate-y-0.5">
          <CalendarCheck className="w-4 h-4" /> Book Appointment
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;