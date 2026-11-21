import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Tag, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  MessageCircle, 
  Check, 
  ShieldCheck,
  CreditCard,
  Gift
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { ACTUAL_PARLOUR_SERVICES } from './ContentPage';

interface ServicePackage {
  _id: string;
  name: string;
  category: string;
  price: string;
  duration?: string;
  desc?: string;
  image?: string;
  specialBenefit?: string;
}

interface StaffSpecialist {
  _id: string;
  name: string;
  role: string;
  specialization: string[];
  image?: string;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  
  const params = new URLSearchParams(location.search);
  const initialServiceName = params.get('service') || 'Facial';
  const initialPrice = params.get('price') || '₹300 – ₹1,250';

  // State
  const [packages, setPackages] = useState<ServicePackage[]>(ACTUAL_PARLOUR_SERVICES as any);
  const [staffList, setStaffList] = useState<StaffSpecialist[]>([]);
  const [selectedService, setSelectedService] = useState<string>(initialServiceName);
  const [selectedStaff, setSelectedStaff] = useState<string>('Any Available Specialist');
  const [servicePrice, setServicePrice] = useState<string>(initialPrice);
  const [serviceDuration, setServiceDuration] = useState<string>('45–60 mins');

  // Customer details
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Slots State
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Submission State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Load packages & staff
  useEffect(() => {
    Promise.all([
      apiFetch<ServicePackage[]>('/packages').catch(() => []),
      apiFetch<StaffSpecialist[]>('/staff').catch(() => [])
    ]).then(([pkgsData, staffData]) => {
      if (Array.isArray(pkgsData) && pkgsData.length > 0) {
        setPackages(pkgsData);
        const match = pkgsData.find(p => p.name.toLowerCase() === initialServiceName.toLowerCase());
        if (match) {
          setServicePrice(match.price);
          setServiceDuration(match.duration || '60 mins');
        }
      }
      if (Array.isArray(staffData)) {
        setStaffList(staffData);
      }
    });
  }, [initialServiceName]);

  // Sync user info if logged in
  useEffect(() => {
    if (user) {
      if (!clientName) setClientName(user.name);
      if (!clientEmail) setClientEmail(user.email);
      if (!clientPhone && user.phone) setClientPhone(user.phone);
    }
  }, [user]);

  // When service changes
  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    const found = packages.find(p => p.name === serviceName);
    if (found) {
      setServicePrice(found.price);
      setServiceDuration(found.duration || '60 mins');
    }
    if (appliedCoupon) {
      setAppliedCoupon(null);
      toast('Coupon removed due to service change', { icon: 'ℹ️' });
    }
  };

  // Fetch available slots from backend whenever bookingDate or selectedStaff changes
  useEffect(() => {
    if (!bookingDate) return;

    setIsLoadingSlots(true);
    const staffQuery = selectedStaff !== 'Any Available Specialist' ? `&staff=${encodeURIComponent(selectedStaff)}` : '';
    apiFetch<{ availableSlots: string[]; bookedSlots: string[] }>(`/appointments/available-slots?date=${bookingDate}${staffQuery}`)
      .then(res => {
        setAvailableSlots(res.availableSlots || []);
        if (res.availableSlots && res.availableSlots.length > 0) {
          if (!res.availableSlots.includes(bookingTime)) {
            setBookingTime(res.availableSlots[0]);
          }
        } else {
          setBookingTime('');
        }
      })
      .catch((err) => {
        console.error('Error fetching available slots:', err);
        // Fallback slots if backend slots service is unavailable
        const fallback = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];
        setAvailableSlots(fallback);
        if (!bookingTime) setBookingTime(fallback[0]);
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [bookingDate, selectedStaff]);

  // Coupon validation
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        valid: boolean;
        coupon: any;
        discountAmount: number;
        finalAmount: number;
        message: string;
      }>('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({
          code: couponInput.trim().toUpperCase(),
          amount: servicePrice,
          service: selectedService
        })
      });

      if (res.valid) {
        setAppliedCoupon(res);
        toast.success(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid coupon or voucher code.');
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
  };

  // Form submission
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!clientPhone.trim()) {
      toast.error('Please enter your contact phone number.');
      return;
    }
    if (!bookingDate) {
      toast.error('Please pick an appointment date.');
      return;
    }
    if (!bookingTime) {
      toast.error('Please select an available time slot.');
      return;
    }

    setIsProcessing(true);

    try {
      const finalAmountStr = appliedCoupon ? `₹${appliedCoupon.finalAmount}` : servicePrice;

      const response = await apiFetch<{ 
        success: boolean; 
        appointment: any; 
        message: string 
      }>('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          user: clientName.trim(),
          email: clientEmail.trim(),
          phone: clientPhone.trim(),
          service: selectedService,
          staff: selectedStaff,
          duration: serviceDuration,
          date: bookingDate,
          time: bookingTime,
          amount: finalAmountStr,
          couponCode: appliedCoupon ? appliedCoupon.coupon?.code : '',
          notes: notes.trim()
        })
      });

      if (response.success && response.appointment) {
        setConfirmedBooking(response.appointment);
        setIsSuccess(true);
        toast.success(`Appointment Confirmed! Ref: ${response.appointment.bookingRef} ✨`);
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      toast.error(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const isBridal = selectedService.toLowerCase().includes('bridal');
  const isContactPricing = servicePrice.toLowerCase().includes('contact') || isBridal;

  return (
    <div className="min-h-screen bg-[#FFF9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-[#4B5563] hover:text-[#FA4D89] mb-6 transition text-sm font-semibold bg-white px-4 py-2 rounded-full border border-[#FCE7F0] shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>

        {isSuccess && confirmedBooking ? (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-salon text-center border border-[#FCE7F0] max-w-xl mx-auto animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#FFF0F5] flex items-center justify-center mx-auto mb-5 text-[#FA4D89]">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FA4D89] bg-[#FFF0F5] px-3.5 py-1 rounded-full border border-[#F9A8D4]/40">
              Appointment Confirmed
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937] mt-3 mb-2">
              Thank You, {confirmedBooking.user}!
            </h2>
            <p className="text-[#4B5563] text-sm mb-6 leading-relaxed">
              Your appointment has been reserved at Shree Ambika Beauty Parlour & Spa. We look forward to welcoming you.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#FFF9FA] p-6 rounded-2xl mb-6 text-left border border-[#FCE7F0] text-sm space-y-3">
              <div className="flex justify-between items-center border-b border-[#FCE7F0] pb-2.5">
                <span className="text-[#4B5563] text-xs">Booking Reference:</span>
                <span className="font-mono font-bold text-[#FA4D89] bg-white px-2.5 py-0.5 rounded border border-[#F9A8D4]">
                  {confirmedBooking.bookingRef || 'SHR-APPT'}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#FCE7F0] pb-2">
                <span className="text-[#4B5563]">Service:</span>
                <span className="font-semibold text-[#1F2937]">{confirmedBooking.service}</span>
              </div>
              <div className="flex justify-between border-b border-[#FCE7F0] pb-2">
                <span className="text-[#4B5563]">Specialist:</span>
                <span className="font-medium text-[#1F2937]">{confirmedBooking.staff || 'Any Specialist'}</span>
              </div>
              <div className="flex justify-between border-b border-[#FCE7F0] pb-2">
                <span className="text-[#4B5563]">Date & Time:</span>
                <span className="font-semibold text-[#1F2937]">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between border-b border-[#FCE7F0] pb-2">
                <span className="text-[#4B5563]">Duration:</span>
                <span className="text-[#1F2937]">{confirmedBooking.duration || '60 mins'}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#1F2937] font-semibold">Total Amount:</span>
                <div className="text-right">
                  <span className="font-serif font-bold text-xl text-[#FA4D89]">{confirmedBooking.amount}</span>
                  {confirmedBooking.discountAmount && (
                    <span className="block text-[11px] text-emerald-700 font-semibold">
                      Discount Applied: -₹{confirmedBooking.discountAmount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <Link to="/my-bookings" className="flex-1">
                  <button className="w-full bg-[#FA4D89] hover:bg-[#E11D74] text-white py-3 rounded-full font-semibold transition shadow-salon text-sm">
                    View in My Bookings
                  </button>
                </Link>
              ) : (
                <Link to="/" className="flex-1">
                  <button className="w-full bg-[#FA4D89] hover:bg-[#E11D74] text-white py-3 rounded-full font-semibold transition shadow-salon text-sm">
                    Return to Home
                  </button>
                </Link>
              )}

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Shree Ambika Parlour! I have booked an appointment (Ref: ${confirmedBooking.bookingRef}) for ${confirmedBooking.service} on ${confirmedBooking.date} at ${confirmedBooking.time}. Please confirm my booking! ✨`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-semibold transition shadow-sm flex items-center justify-center gap-2 text-sm">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Details
                </button>
              </a>
            </div>

            <p className="text-[11px] text-[#4B5563] mt-5">
              Payment is made at the parlour upon service completion (UPI, Cash, or Cards). Free cancellation up to 2 hours prior to scheduled time.
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-salon border border-[#FCE7F0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FCE7F0] pb-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F5] text-[#FA4D89] text-xs font-semibold rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reserve Your Experience</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937]">
                  Book an <span className="text-[#FA4D89] italic">Appointment</span>
                </h1>
                <p className="text-[#4B5563] text-xs sm:text-sm mt-1">
                  Choose your beauty treatment, preferred specialist, and ideal time slot.
                </p>
              </div>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs text-[#FA4D89] hover:text-[#E11D74] font-semibold bg-[#FFF0F5] px-3.5 py-2 rounded-full border border-[#F9A8D4]/40 self-start sm:self-auto transition"
                >
                  Already a guest? Sign In
                </button>
              )}
            </div>

            <form onSubmit={handleBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              
              {/* Left Column (7 cols): Service, Staff, Date & Time */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Service Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#FA4D89]" />
                    <span>1. Select Treatment *</span>
                  </label>
                  {packages.length > 0 ? (
                    <select
                      value={selectedService}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#FCE7F0] text-sm font-medium focus:ring-2 focus:ring-[#FA4D89]/30 outline-none bg-white shadow-2xs text-[#1F2937]"
                    >
                      {packages.map(p => (
                        <option key={p._id} value={p.name}>
                          {p.name} — {p.price} ({p.duration || '60 mins'})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selectedService}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-[#FCE7F0] text-sm bg-[#FFF9FA] font-medium text-[#1F2937]"
                    />
                  )}
                </div>

                {/* 2. Staff Specialist Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FA4D89]" />
                    <span>2. Choose Beautician / Specialist</span>
                  </label>
                  <select
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#FCE7F0] text-sm font-medium focus:ring-2 focus:ring-[#FA4D89]/30 outline-none bg-white shadow-2xs text-[#1F2937]"
                  >
                    <option value="Any Available Specialist">Any Available Specialist (Recommended)</option>
                    {staffList.map(s => (
                      <option key={s._id} value={s.name}>
                        {s.name} — {s.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Appointment Date */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FA4D89]" />
                    <span>3. Select Date *</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#FCE7F0] text-sm font-medium focus:ring-2 focus:ring-[#FA4D89]/30 outline-none bg-white text-[#1F2937] shadow-2xs"
                  />
                </div>

                {/* 4. Time Slot Picker */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#FA4D89]" />
                      <span>4. Available Time Slots *</span>
                    </label>
                    <span className="text-[11px] text-[#4B5563]">
                      {availableSlots.length} slot(s) open
                    </span>
                  </div>

                  {isLoadingSlots ? (
                    <div className="p-8 text-center bg-[#FFF9FA] rounded-2xl border border-[#FCE7F0]">
                      <Loader2 className="w-6 h-6 text-[#FA4D89] animate-spin mx-auto mb-2" />
                      <p className="text-xs text-[#4B5563]">Checking availability for {bookingDate}...</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>All slots for this date are fully reserved. Please pick another date.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingTime(slot)}
                          className={`py-3 px-3 text-xs font-semibold rounded-xl border transition-all duration-200 flex items-center justify-center gap-1.5 ${
                            bookingTime === slot
                              ? 'bg-[#FA4D89] text-white border-[#FA4D89] shadow-salon'
                              : 'bg-white hover:bg-[#FFF0F5]/60 text-[#1F2937] border-[#FCE7F0] hover:border-[#F9A8D4]'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${bookingTime === slot ? 'text-white' : 'text-[#FA4D89]'}`} />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column (5 cols): Customer Info, Voucher & Order Summary */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Customer Information Card */}
                <div className="bg-[#FFF9FA] p-5 rounded-2xl border border-[#FCE7F0] space-y-4">
                  <h3 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FA4D89]" />
                    <span>Guest Information</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:ring-2 focus:ring-[#FA4D89]/30 outline-none bg-white text-[#1F2937]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">Phone Number (Required) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#4B5563] font-medium">+91</span>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:ring-2 focus:ring-[#FA4D89]/30 outline-none bg-white text-[#1F2937]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="aditi@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:ring-2 focus:ring-[#FA4D89]/30 outline-none bg-white text-[#1F2937]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">Notes / Special Requests</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Sensitive skin, bridal consultation..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#FCE7F0] text-xs focus:ring-2 focus:ring-[#FA4D89]/30 outline-none bg-white text-[#1F2937]"
                    />
                  </div>
                </div>

                {/* Optional Voucher Code (only for services with numeric pricing) */}
                {!isContactPricing && (
                  <div className="bg-white p-5 rounded-2xl border border-[#FCE7F0] shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-[#FA4D89]" />
                      <span>Voucher / Referral Code (Optional)</span>
                    </h3>

                    {appliedCoupon ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Code '{appliedCoupon.coupon?.code}' Applied!
                          </span>
                          <span className="text-emerald-700 block text-[11px]">
                            Discount: ₹{appliedCoupon.discountAmount}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter voucher code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-[#FCE7F0] text-xs uppercase font-mono tracking-wider focus:ring-2 focus:ring-[#FA4D89]/30 outline-none text-[#1F2937]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isValidatingCoupon || !couponInput.trim()}
                          className="px-4 py-2 bg-[#FFF0F5] hover:bg-[#F9A8D4]/30 text-[#FA4D89] border border-[#F9A8D4] disabled:opacity-50 rounded-xl text-xs font-semibold transition"
                        >
                          {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Bridal Special Benefit Notice */}
                {isBridal && (
                  <div className="p-4 bg-[#FFF0F5] border border-[#F9A8D4] rounded-2xl flex items-start gap-3 text-xs text-[#1F2937]">
                    <Gift className="w-5 h-5 text-[#FA4D89] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#FA4D89] block text-sm">Special Bridal Benefit Included</span>
                      <p className="text-[#4B5563] mt-0.5 leading-relaxed">
                        Every Bridal Makeup booking comes with <strong>one complimentary makeup service</strong> for a guest or family member. Our senior bridal artist will consult with you upon reservation to discuss your bridal look and confirm custom pricing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Summary & Submit CTA */}
                <div className="bg-[#FFF9FA] p-5 rounded-2xl border border-[#FCE7F0] space-y-3">
                  <div className="flex justify-between text-xs text-[#4B5563]">
                    <span>Treatment Fee:</span>
                    <span className="font-semibold text-[#1F2937]">
                      {isContactPricing ? 'Contact for Pricing' : servicePrice}
                    </span>
                  </div>

                  {!isContactPricing && appliedCoupon && (
                    <div className="flex justify-between text-xs text-emerald-700">
                      <span>Voucher Discount:</span>
                      <span className="font-semibold">-₹{appliedCoupon.discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-[#FCE7F0] pt-2.5 text-sm">
                    <span className="font-bold text-[#1F2937]">Total Payable:</span>
                    <span className="font-serif font-bold text-xl text-[#FA4D89]">
                      {isContactPricing 
                        ? 'Contact for Pricing' 
                        : (appliedCoupon ? `₹${appliedCoupon.finalAmount}` : servicePrice)}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-[#FCE7F0] text-[11px] text-[#4B5563] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#FA4D89] shrink-0" />
                    <span>
                      {isContactPricing 
                        ? 'Pricing and payment terms finalized with parlour owner.' 
                        : 'Pay in-person at salon via UPI, Cash, or Card.'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || !bookingTime}
                    className="w-full py-3.5 rounded-full bg-[#FA4D89] hover:bg-[#E11D74] disabled:opacity-50 text-white font-bold text-sm shadow-salon hover:shadow-salon-hover transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Reservation...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Confirm Appointment Reservation</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#4B5563] pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FA4D89]" />
                    <span>Instant confirmation • Free cancellation up to 2h prior</span>
                  </div>
                </div>

              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
