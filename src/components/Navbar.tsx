import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  CalendarCheck, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF9FA]/95 backdrop-blur-md border-b border-[#FCE7F0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-11 h-11 rounded-full bg-[#FFF0F5] border border-[#FCE7F0] p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
            <img 
              src="/hero.png" 
              alt="Shree Ambika Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // If hero.png is an icon or fails, fall back to spark icon
                (e.target as HTMLElement).style.display = 'none';
              }} 
            />
          </div>
          <div>
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#1F2937] tracking-tight block leading-none">
              Shree Ambika
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#FA4D89] font-semibold block mt-1">
              Beauty Parlour & Spa
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 font-medium text-sm">
          <Link 
            to="/" 
            className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
              isActive('/') && !location.hash
                ? 'text-[#FA4D89] bg-[#FFF0F5] font-semibold' 
                : 'text-[#1F2937] hover:text-[#FA4D89] hover:bg-[#FFF0F5]/60'
            }`}
          >
            Home
          </Link>

          <button 
            type="button"
            onClick={() => handleScrollTo('about')} 
            className="px-3.5 py-2 rounded-full text-[#1F2937] hover:text-[#FA4D89] hover:bg-[#FFF0F5]/60 transition-all duration-200"
          >
            About Us
          </button>

          <Link 
            to="/content" 
            className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
              isActive('/content') || isActive('/services')
                ? 'text-[#FA4D89] bg-[#FFF0F5] font-semibold' 
                : 'text-[#1F2937] hover:text-[#FA4D89] hover:bg-[#FFF0F5]/60'
            }`}
          >
            Treatments
          </Link>

          <Link 
            to="/gallery" 
            className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
              isActive('/gallery')
                ? 'text-[#FA4D89] bg-[#FFF0F5] font-semibold' 
                : 'text-[#1F2937] hover:text-[#FA4D89] hover:bg-[#FFF0F5]/60'
            }`}
          >
            Gallery
          </Link>

          <button 
            type="button"
            onClick={() => handleScrollTo('contact')} 
            className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
              isActive('/contact')
                ? 'text-[#FA4D89] bg-[#FFF0F5] font-semibold' 
                : 'text-[#1F2937] hover:text-[#FA4D89] hover:bg-[#FFF0F5]/60'
            }`}
          >
            Contact
          </button>

          {/* Customer "My Bookings" link if authenticated */}
          {isAuthenticated && (
            <Link 
              to="/my-bookings" 
              className={`px-3.5 py-2 rounded-full transition-all duration-200 inline-flex items-center gap-1.5 ${
                isActive('/my-bookings') 
                  ? 'text-[#FA4D89] bg-[#FFF0F5] font-semibold' 
                  : 'text-[#1F2937] hover:text-[#FA4D89] hover:bg-[#FFF0F5]/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#FA4D89]" />
              <span>My Bookings</span>
            </Link>
          )}

          {/* Admin Dashboard link if user is owner/admin */}
          {isAuthenticated && isAdmin && (
            <Link 
              to="/admin" 
              className="ml-2 px-3 py-1.5 rounded-full text-xs font-semibold text-[#FA4D89] bg-[#FFF0F5] border border-[#F9A8D4] hover:bg-[#F9A8D4]/30 transition inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/my-bookings"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#FCE7F0] rounded-full text-xs font-semibold text-[#1F2937] shadow-2xs hover:border-[#FA4D89] transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#FA4D89]" />
                <span className="max-w-[120px] truncate">{user?.name}</span>
                {isAdmin && <span className="bg-[#FA4D89] text-white text-[10px] px-1.5 py-0.5 rounded-full">Admin</span>}
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-[#4B5563] hover:text-[#FA4D89] hover:bg-[#FFF0F5] rounded-full transition"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1F2937] hover:text-[#FA4D89] px-3.5 py-2 rounded-full hover:bg-[#FFF0F5] transition"
            >
              <LogIn className="w-4 h-4 text-[#FA4D89]" />
              <span>Sign In</span>
            </button>
          )}

          <Link to="/book">
            <button className="inline-flex items-center gap-2 bg-[#FA4D89] hover:bg-[#E11D74] text-white px-4 sm:px-6 py-2.5 rounded-full shadow-salon hover:shadow-salon-hover transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm font-semibold">
              <CalendarCheck className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </Link>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1F2937] hover:text-[#FA4D89] hover:bg-[#FFF0F5] rounded-xl transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#FCE7F0] px-6 py-5 space-y-3 animate-fade-in shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F2937] hover:text-[#FA4D89]"
          >
            Home
          </Link>
          <button
            onClick={() => handleScrollTo('about')}
            className="block w-full text-left py-2 text-sm font-semibold text-[#1F2937] hover:text-[#FA4D89]"
          >
            About Us
          </button>
          <Link
            to="/content"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F2937] hover:text-[#FA4D89]"
          >
            Treatments & Pricing
          </Link>
          <Link
            to="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1F2937] hover:text-[#FA4D89]"
          >
            Beauty Gallery
          </Link>
          <button
            onClick={() => handleScrollTo('contact')}
            className="block w-full text-left py-2 text-sm font-semibold text-[#1F2937] hover:text-[#FA4D89]"
          >
            Contact & Location
          </button>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#FA4D89]"
            >
              My Bookings
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#FA4D89]"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
