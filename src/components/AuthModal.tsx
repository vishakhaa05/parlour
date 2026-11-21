import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authModalMode === 'login') {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      setIsSubmitting(true);
      const success = await login(email.trim(), password);
      setIsSubmitting(false);
      if (success) {
        setEmail('');
        setPassword('');
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      const success = await register(name.trim(), email.trim(), password, phone.trim());
      setIsSubmitting(false);
      if (success) {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#FCE7F0] overflow-hidden transform transition-all">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#FA4D89] to-[#D87491] px-6 py-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl">
                {authModalMode === 'login' ? 'Welcome Back' : 'Join Shree Ambika'}
              </h3>
              <p className="text-xs text-pink-100 mt-0.5">
                {authModalMode === 'login' ? 'Sign in to access your appointments and profile' : 'Create your account for personalized parlour care'}
              </p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 bg-[#FFF9FA]/30">
          {/* Tab buttons */}
          <div className="flex rounded-xl bg-[#FFF0F5] p-1 mb-6 border border-[#FCE7F0]">
            <button
              type="button"
              onClick={() => { setAuthModalMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-[#FA4D89] shadow-sm'
                  : 'text-[#4B5563] hover:text-[#FA4D89]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                authModalMode === 'register'
                  ? 'bg-white text-[#FA4D89] shadow-sm'
                  : 'text-[#4B5563] hover:text-[#FA4D89]'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FCE7F0] rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30 focus:border-[#FA4D89] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FCE7F0] rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30 focus:border-[#FA4D89] transition"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FCE7F0] rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30 focus:border-[#FA4D89] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#FCE7F0] rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30 focus:border-[#FA4D89] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#4B5563] hover:text-[#1F2937] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FCE7F0] rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30 focus:border-[#FA4D89] transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 bg-[#FA4D89] hover:bg-[#E11D74] text-white font-semibold py-3 rounded-xl shadow-salon hover:shadow-salon-hover transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{authModalMode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <span>{authModalMode === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
