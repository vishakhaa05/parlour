import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  AlertCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  CalendarCheck, 
  MessageCircle, 
  ArrowLeft,
  X,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

interface AppointmentItem {
  _id: string;
  bookingRef?: string;
  user: string;
  email?: string;
  phone?: string;
  service: string;
  staff?: string;
  duration?: string;
  date: string;
  time: string;
  amount: string;
  discountAmount?: string;
  couponCode?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';
  cancellationReason?: string;
  rescheduledFrom?: string;
  notes?: string;
  createdAt?: string;
}

const MyAppointments: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');

  // Reschedule modal state
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<AppointmentItem | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);

  // Cancel modal state
  const [cancelModalAppt, setCancelModalAppt] = useState<AppointmentItem | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<AppointmentItem[]>('/appointments');
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching user appointments:', err);
      toast.error('Failed to load your appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (newDate) {
      setIsLoadingSlots(true);
      apiFetch<{ availableSlots: string[] }>(`/appointments/available-slots?date=${newDate}`)
        .then(res => {
          setAvailableSlots(res.availableSlots || []);
          if (res.availableSlots && res.availableSlots.length > 0) {
            setNewTime(res.availableSlots[0]);
          } else {
            setNewTime('');
          }
        })
        .catch(() => {
          toast.error('Could not check slot availability.');
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [newDate]);

  const openRescheduleModal = (appt: AppointmentItem) => {
    setRescheduleModalAppt(appt);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    setNewDate(defaultDate);
    setRescheduleReason('');
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalAppt || !newDate || !newTime) {
      toast.error('Please choose a date and available time slot.');
      return;
    }

    setIsSubmittingReschedule(true);
    try {
      const res = await apiFetch<{ success: boolean; appointment: AppointmentItem; message: string }>(
        `/appointments/${rescheduleModalAppt._id}/reschedule`,
        {
          method: 'PUT',
          body: JSON.stringify({
            date: newDate,
            time: newTime,
            reason: rescheduleReason.trim()
          })
        }
      );

      if (res.success && res.appointment) {
        toast.success('Appointment successfully rescheduled! ✨');
        setAppointments(prev => prev.map(a => a._id === res.appointment._id ? res.appointment : a));
        setRescheduleModalAppt(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to reschedule.');
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalAppt) return;

    setIsSubmittingCancel(true);
    try {
      const res = await apiFetch<{ success: boolean; appointment: AppointmentItem; message: string }>(
        `/appointments/${cancelModalAppt._id}/cancel`,
        {
          method: 'PUT',
          body: JSON.stringify({ reason: cancelReason.trim() })
        }
      );

      if (res.success && res.appointment) {
        toast.success('Appointment has been cancelled.');
        setAppointments(prev => prev.map(a => a._id === res.appointment._id ? res.appointment : a));
        setCancelModalAppt(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to cancel.');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(appt => {
    if (filterTab === 'all') return true;
    if (filterTab === 'cancelled') return appt.status === 'Cancelled';
    if (filterTab === 'past') return appt.status === 'Completed' || (appt.date < todayStr && appt.status !== 'Cancelled');
    if (filterTab === 'upcoming') {
      return (appt.status === 'Confirmed' || appt.status === 'Pending') && appt.date >= todayStr;
    }
    return true;
  });

  const getStatusBadge = (status: AppointmentItem['status']) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">Confirmed</span>;
      case 'Pending':
        return <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">Pending Review</span>;
      case 'Completed':
        return <span className="px-3 py-1 bg-[#FFF0F5] text-[#FA4D89] border border-[#F9A8D4]/40 rounded-full text-xs font-semibold">Completed</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-[#FFF9FA] py-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-salon text-center border border-[#FCE7F0]">
          <Calendar className="w-16 h-16 text-[#FA4D89] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-2">My Appointments</h2>
          <p className="text-[#4B5563] text-sm mb-6 leading-relaxed">
            Please sign in to view your scheduled beauty treatments, booking references, and manage your appointments.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full bg-[#FA4D89] hover:bg-[#E11D74] text-white font-semibold py-3 rounded-xl transition shadow-salon text-sm"
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full bg-[#FFF0F5] hover:bg-[#F9A8D4]/30 text-[#FA4D89] font-semibold py-3 rounded-xl transition border border-[#F9A8D4] text-sm"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center text-xs font-semibold text-[#FA4D89] hover:text-[#E11D74] mb-2 transition">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#1F2937]">
              My <span className="text-[#FA4D89] italic">Appointments</span>
            </h1>
            <p className="text-[#4B5563] text-xs sm:text-sm mt-1">
              Signed in as <span className="font-semibold text-[#1F2937]">{user?.name}</span> ({user?.email})
            </p>
          </div>

          <Link to="/book">
            <button className="bg-[#FA4D89] hover:bg-[#E11D74] text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-salon hover:shadow-salon-hover transition">
              <CalendarCheck className="w-4 h-4" /> Book New Service
            </button>
          </Link>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-2xs border border-[#FCE7F0] max-w-fit">
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterTab === 'upcoming' 
                ? 'bg-[#FA4D89] text-white shadow-2xs' 
                : 'text-[#4B5563] hover:text-[#FA4D89] hover:bg-[#FFF0F5]'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterTab('past')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterTab === 'past' 
                ? 'bg-[#FA4D89] text-white shadow-2xs' 
                : 'text-[#4B5563] hover:text-[#FA4D89] hover:bg-[#FFF0F5]'
            }`}
          >
            Past & Completed
          </button>
          <button
            onClick={() => setFilterTab('cancelled')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterTab === 'cancelled' 
                ? 'bg-[#FA4D89] text-white shadow-2xs' 
                : 'text-[#4B5563] hover:text-[#FA4D89] hover:bg-[#FFF0F5]'
            }`}
          >
            Cancelled
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterTab === 'all' 
                ? 'bg-[#FA4D89] text-white shadow-2xs' 
                : 'text-[#4B5563] hover:text-[#FA4D89] hover:bg-[#FFF0F5]'
            }`}
          >
            All Bookings ({appointments.length})
          </button>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-[#FA4D89] animate-spin mx-auto mb-3" />
            <p className="text-[#4B5563] text-sm">Loading your appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#FCE7F0] shadow-2xs max-w-lg mx-auto">
            <Calendar className="w-16 h-16 text-[#F9A8D4] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-[#1F2937] mb-2">No Appointments Found</h3>
            <p className="text-[#4B5563] text-xs sm:text-sm mb-6">
              {filterTab === 'upcoming' 
                ? 'You do not have any upcoming appointments scheduled right now.' 
                : 'No appointments in this category.'}
            </p>
            <Link to="/book">
              <button className="bg-[#FA4D89] hover:bg-[#E11D74] text-white px-6 py-3 rounded-full font-semibold transition shadow-salon text-sm">
                Schedule a Treatment
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => {
              const isEligibleForActions = appt.status !== 'Cancelled' && appt.status !== 'Completed' && appt.date >= todayStr;

              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xs border border-[#FCE7F0] hover:shadow-salon transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-lg font-bold text-[#1F2937]">
                        {appt.service}
                      </h3>
                      {getStatusBadge(appt.status)}
                      {appt.bookingRef && (
                        <span className="font-mono text-xs bg-[#FFF0F5] text-[#FA4D89] px-2.5 py-0.5 rounded-md border border-[#F9A8D4]/40">
                          Ref: {appt.bookingRef}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 text-xs text-[#4B5563]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FA4D89] shrink-0" />
                        <span>Date: <strong className="text-[#1F2937]">{appt.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#FA4D89] shrink-0" />
                        <span>Time: <strong className="text-[#1F2937]">{appt.time}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#FA4D89] shrink-0" />
                        <span>Specialist: <strong className="text-[#1F2937]">{appt.staff || 'Any Specialist'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-[#FA4D89] shrink-0" />
                        <span>Duration: {appt.duration || '60 mins'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#4B5563]">Amount:</span>
                        <strong className="text-[#1F2937] text-sm">{appt.amount}</strong>
                        {appt.discountAmount && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                            Saved {appt.discountAmount}
                          </span>
                        )}
                      </div>
                    </div>

                    {appt.rescheduledFrom && (
                      <p className="text-xs text-amber-700 italic">
                        ℹ️ Rescheduled from: {appt.rescheduledFrom}
                      </p>
                    )}

                    {appt.cancellationReason && (
                      <p className="text-xs text-red-700 bg-red-50 p-2 rounded-xl border border-red-200">
                        <strong>Reason for cancellation:</strong> {appt.cancellationReason}
                      </p>
                    )}

                    {appt.notes && (
                      <p className="text-xs text-[#4B5563]">
                        <FileText className="w-3.5 h-3.5 inline mr-1 text-[#FA4D89]" />
                        <strong>Notes:</strong> {appt.notes}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0 w-full md:w-auto">
                    {isEligibleForActions && (
                      <>
                        <button
                          onClick={() => openRescheduleModal(appt)}
                          className="px-4 py-2 bg-[#FFF0F5] hover:bg-[#F9A8D4]/30 text-[#FA4D89] rounded-xl text-xs font-semibold border border-[#F9A8D4]/50 transition flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Reschedule Slot
                        </button>

                        <button
                          onClick={() => { setCancelModalAppt(appt); setCancelReason(''); }}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold border border-red-200 transition flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                        </button>
                      </>
                    )}

                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, regarding my appointment (Ref: ${appt.bookingRef || appt._id}) for ${appt.service} on ${appt.date}...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Support
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleModalAppt && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FCE7F0]">
              <div className="flex items-center justify-between pb-4 border-b border-[#FCE7F0] mb-4">
                <h3 className="font-serif text-lg font-bold text-[#1F2937]">
                  Reschedule Appointment
                </h3>
                <button onClick={() => setRescheduleModalAppt(null)} className="p-1 text-[#4B5563] hover:text-[#1F2937]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div className="p-3 bg-[#FFF9FA] rounded-xl text-xs space-y-1 border border-[#FCE7F0]">
                  <p><strong>Service:</strong> {rescheduleModalAppt.service}</p>
                  <p><strong>Current Slot:</strong> {rescheduleModalAppt.date} at {rescheduleModalAppt.time}</p>
                  <p><strong>Booking Ref:</strong> {rescheduleModalAppt.bookingRef}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Select New Date *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7F0] text-sm focus:ring-2 focus:ring-[#FA4D89]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Available Time Slot *
                  </label>
                  {isLoadingSlots ? (
                    <div className="p-4 text-center text-xs text-[#4B5563]">
                      <Loader2 className="w-5 h-5 text-[#FA4D89] animate-spin mx-auto mb-1" />
                      Checking available slots for {newDate}...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-xs text-red-600 p-2.5 bg-red-50 rounded-xl border border-red-200">
                      No open slots on this date. Please choose another date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setNewTime(slot)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl border transition ${
                            newTime === slot 
                              ? 'bg-[#FA4D89] text-white border-[#FA4D89] shadow-2xs' 
                              : 'bg-white hover:bg-[#FFF0F5] text-[#1F2937] border-[#FCE7F0]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Reason for Rescheduling (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule conflict, personal commitment"
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FCE7F0] text-xs focus:ring-2 focus:ring-[#FA4D89]/30 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalAppt(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#FCE7F0] text-[#4B5563] font-semibold text-xs hover:bg-[#FFF0F5] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReschedule || !newTime}
                    className="flex-1 py-2.5 rounded-xl bg-[#FA4D89] hover:bg-[#E11D74] disabled:opacity-50 text-white font-semibold text-xs shadow-salon transition flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingReschedule ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm New Slot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelModalAppt && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="font-serif text-lg font-bold text-[#1F2937]">
                  Cancel Appointment?
                </h3>
              </div>

              <p className="text-xs text-[#4B5563] mb-4 leading-relaxed">
                Are you sure you want to cancel your appointment for <strong>{cancelModalAppt.service}</strong> on <strong>{cancelModalAppt.date}</strong> at <strong>{cancelModalAppt.time}</strong>?
              </p>

              <form onSubmit={handleCancelSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Reason for cancellation (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Please let us know why you need to cancel..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FCE7F0] text-xs focus:ring-2 focus:ring-[#FA4D89]/30 outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelModalAppt(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#FCE7F0] text-[#4B5563] font-semibold text-xs hover:bg-[#FFF0F5] transition"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCancel}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingCancel ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyAppointments;
