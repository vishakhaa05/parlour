import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, CalendarDays, IndianRupee, Activity, Search, Menu, ArrowLeft, 
  Loader2, Package as PackageIcon, Image as ImageIcon, 
  MessageSquare, Plus, Edit2, Trash2, ShieldCheck, 
  LogOut, X, Mail, Clock, Tag, Settings, UserCheck, RefreshCw, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  joinDate?: string;
}

interface PackageItem {
  _id: string;
  name: string;
  category: string;
  price: string;
  duration?: string;
  desc: string;
  includes?: string[];
  image?: string;
  status: string;
  isFeatured?: boolean;
  specialBenefit?: string;
}

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
  status: string;
  cancellationReason?: string;
  rescheduledFrom?: string;
  notes?: string;
  createdAt?: string;
}

interface StaffItem {
  _id: string;
  name: string;
  role: string;
  specialization: string[];
  experience: string;
  phone?: string;
  email?: string;
  image?: string;
  status: string;
  workingHours?: string;
  daysOff?: string[];
}

interface CouponItem {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  description?: string;
  category?: string;
  validUntil?: string;
  status: string;
}

interface SettingItem {
  parlourName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  timings: string;
  cancellationPolicy: string;
  currency: string;
}

interface GalleryItem {
  _id: string;
  base64String: string;
  title?: string;
  category?: string;
  tags?: string[];
  description?: string;
  isPublished?: boolean;
  isActive?: boolean;
  uploadDate?: string;
  createdAt?: string;
}

const GALLERY_CATEGORIES = [
  'Party Makeup & Makeover',
  'Bridal Makeup & Makeover',
  'Hair Styling & Hairstyles',
  'Nail Art',
  'Manicure',
  'Pedicure',
  'Foot Massage',
  'Other Treatments'
];

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt?: string;
}

interface DashboardStats {
  totalUsers: number;
  activePackages: number;
  totalPackages: number;
  totalGalleryImages: number;
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  todayRevenue: number;
  totalInquiries: number;
  newInquiries: number;
}

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, isOwner, login, logout, isLoading: authLoading, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'packages' | 'gallery' | 'appointments' | 'inquiries' | 'staff' | 'coupons' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Data State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<ContactItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [, setSettings] = useState<SettingItem>({
    parlourName: 'Shree Ambika Beauty Parlour & Spa',
    tagline: 'Beauty That Glows Naturally',
    phone: '+91 98765 43210',
    whatsappNumber: '919876543210',
    email: 'shreeambika@gmail.com',
    address: 'Shop No. 12, Ambika Galleria, Main Road, City Center',
    timings: 'Monday - Sunday: 9:00 AM - 8:00 PM',
    cancellationPolicy: 'Free cancellation or rescheduling up to 2 hours before your scheduled appointment.',
    currency: 'INR (₹)'
  });
  const [settingsForm, setSettingsForm] = useState<SettingItem>({
    parlourName: 'Shree Ambika Beauty Parlour & Spa',
    tagline: 'Beauty That Glows Naturally',
    phone: '+91 98765 43210',
    whatsappNumber: '919876543210',
    email: 'shreeambika@gmail.com',
    address: 'Shop No. 12, Ambika Galleria, Main Road, City Center',
    timings: 'Monday - Sunday: 9:00 AM - 8:00 PM',
    cancellationPolicy: 'Free cancellation or rescheduling up to 2 hours before your scheduled appointment.',
    currency: 'INR (₹)'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [pkgCategoryFilter, setPkgCategoryFilter] = useState('all');
  const [apptStatusFilter, setApptStatusFilter] = useState('all');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', phone: '', status: 'Active', role: 'user' });

  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [pkgForm, setPkgForm] = useState({ 
    name: '', 
    category: 'Skin Care', 
    price: '', 
    duration: '45 mins', 
    desc: '', 
    includes: '', 
    image: '/images/facial-treatment.jpg', 
    status: 'Active',
    specialBenefit: ''
  });

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({ 
    title: '', 
    category: 'Bridal Makeup & Makeover', 
    tags: '', 
    description: '', 
    base64String: '', 
    isPublished: true 
  });

  // Staff Modals & State
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    specialization: '',
    experience: '3+ years',
    phone: '',
    email: '',
    image: '/image1.png',
    workingHours: '09:00 AM - 07:00 PM',
    daysOff: 'Monday',
    status: 'Active'
  });

  // Coupon Modals & State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minOrderAmount: 1000,
    maxDiscount: 500,
    description: '',
    category: 'all',
    validUntil: '2027-12-31',
    status: 'Active'
  });

  // Walk-In Booking Modal
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    user: '',
    phone: '',
    email: '',
    service: 'Facial',
    staff: 'Any Available Specialist',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    amount: '₹300 – ₹1,250',
    notes: ''
  });

  // Reschedule Modal
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<AppointmentItem | null>(null);
  const [adminRescheduleDate, setAdminRescheduleDate] = useState('');
  const [adminRescheduleTime, setAdminRescheduleTime] = useState('');
  const [adminAvailableSlots, setAdminAvailableSlots] = useState<string[]>([]);
  const [isLoadingAdminSlots, setIsLoadingAdminSlots] = useState(false);

  // Direct Owner Login Form (if not logged in as admin)
  const [adminLoginEmail, setAdminLoginEmail] = useState('');
  const [adminLoginPassword, setAdminLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Strict route guard: reject direct URL access for ordinary users & unauthenticated visitors
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error('Authentication required. Please sign in with verified owner credentials.');
        navigate('/');
        openAuthModal('login');
      } else if (!isAdmin) {
        toast.error('Access Denied: Owner or Administrator privileges required.');
        navigate('/');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate, openAuthModal]);

  // Fetch all admin data when authenticated as admin
  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, pkgsRes, apptsRes, galleryRes, inqRes, staffRes, couponsRes, settingsRes] = await Promise.all([
        apiFetch<{ stats: DashboardStats; recentAppointments: any[]; recentInquiries: any[] }>('/stats/dashboard'),
        apiFetch<UserItem[]>('/users'),
        apiFetch<PackageItem[]>('/packages?all=true'),
        apiFetch<AppointmentItem[]>('/appointments'),
        apiFetch<GalleryItem[]>('/gallery/admin'),
        apiFetch<ContactItem[]>('/contacts'),
        apiFetch<StaffItem[]>('/staff?all=true').catch(() => []),
        apiFetch<CouponItem[]>('/coupons?all=true').catch(() => []),
        apiFetch<SettingItem>('/settings').catch(() => null)
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(pkgsRes)) setPackages(pkgsRes);
      if (Array.isArray(apptsRes)) setAppointments(apptsRes);
      if (Array.isArray(galleryRes)) setGalleryImages(galleryRes);
      if (Array.isArray(inqRes)) setInquiries(inqRes);
      if (Array.isArray(staffRes)) setStaff(staffRes);
      if (Array.isArray(couponsRes)) setCoupons(couponsRes);
      if (settingsRes) {
        setSettings(settingsRes);
        setSettingsForm(settingsRes);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      toast.error(err.message || 'Error loading dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers for Owner Login ---
  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await login(adminLoginEmail, adminLoginPassword);
    setIsLoggingIn(false);
    if (success) {
      loadAllData();
    }
  };

  // --- User CRUD Handlers ---
  const handleOpenUserModal = (targetUser: UserItem | null = null) => {
    if (targetUser) {
      setEditingUser(targetUser);
      setUserForm({
        name: targetUser.name,
        email: targetUser.email,
        password: '',
        phone: targetUser.phone || '',
        status: targetUser.status,
        role: targetUser.role
      });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', phone: '', status: 'Active', role: 'user' });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        const res = await apiFetch<{ success: boolean; user: UserItem }>(`/users/${editingUser._id}`, {
          method: 'PUT',
          body: JSON.stringify(userForm)
        });
        setUsers(prev => prev.map(u => u._id === editingUser._id ? res.user : u));
        toast.success(`User ${res.user.name} updated!`);
      } else {
        // Create user
        const res = await apiFetch<{ success: boolean; user: UserItem }>('/users', {
          method: 'POST',
          body: JSON.stringify(userForm)
        });
        setUsers(prev => [res.user, ...prev]);
        toast.success(`User ${res.user.name} created!`);
      }
      setShowUserModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save user.');
    }
  };

  const handleToggleUserStatus = async (targetUser: UserItem) => {
    if (targetUser.role === 'owner') {
      toast.error('The Owner account cannot be disabled.');
      return;
    }
    const newStatus = targetUser.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await apiFetch<{ success: boolean; user: UserItem }>(`/users/${targetUser._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setUsers(prev => prev.map(u => u._id === targetUser._id ? res.user : u));
      toast.success(`User marked as ${newStatus}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to change status.');
    }
  };

  const handleDeleteUser = async (targetUser: UserItem) => {
    if (targetUser.role === 'owner') {
      toast.error('The Owner account cannot be deleted.');
      return;
    }
    if (String(targetUser._id) === String(user?._id)) {
      toast.error('You cannot delete your own account.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user ${targetUser.name} (${targetUser.email})?`)) {
      try {
        await apiFetch(`/users/${targetUser._id}`, { method: 'DELETE' });
        setUsers(prev => prev.filter(u => u._id !== targetUser._id));
        toast.success(`User deleted.`);
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete user.');
      }
    }
  };

  // --- Package CRUD Handlers ---
  const handleOpenPkgModal = (targetPkg: PackageItem | null = null) => {
    if (targetPkg) {
      setEditingPkg(targetPkg);
      setPkgForm({
        name: targetPkg.name,
        category: targetPkg.category || 'Skin Care',
        price: targetPkg.price,
        duration: targetPkg.duration || '45 mins',
        desc: targetPkg.desc,
        includes: targetPkg.includes ? targetPkg.includes.join(', ') : '',
        image: targetPkg.image || '/images/facial-treatment.jpg',
        status: targetPkg.status || 'Active',
        specialBenefit: targetPkg.specialBenefit || ''
      });
    } else {
      setEditingPkg(null);
      setPkgForm({ 
        name: '', 
        category: 'Skin Care', 
        price: '₹800', 
        duration: '45 mins', 
        desc: '', 
        includes: '', 
        image: '/images/facial-treatment.jpg', 
        status: 'Active',
        specialBenefit: '' 
      });
    }
    setShowPkgModal(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPkg) {
        const res = await apiFetch<{ success: boolean; package: PackageItem }>(`/packages/${editingPkg._id}`, {
          method: 'PUT',
          body: JSON.stringify(pkgForm)
        });
        setPackages(prev => prev.map(p => p._id === editingPkg._id ? res.package : p));
        toast.success(`Package '${res.package.name}' updated!`);
      } else {
        const res = await apiFetch<{ success: boolean; package: PackageItem }>('/packages', {
          method: 'POST',
          body: JSON.stringify(pkgForm)
        });
        setPackages(prev => [res.package, ...prev]);
        toast.success(`Package '${res.package.name}' created!`);
      }
      setShowPkgModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save package.');
    }
  };

  const handleTogglePackageStatus = async (pkg: PackageItem) => {
    try {
      const res = await apiFetch<{ success: boolean; package: PackageItem }>(`/packages/${pkg._id}/status`, {
        method: 'PATCH'
      });
      setPackages(prev => prev.map(p => p._id === pkg._id ? res.package : p));
      toast.success(res.package.status === 'Active' ? 'Package activated!' : 'Package deactivated.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle package status.');
    }
  };

  const handleDeletePackage = async (pkg: PackageItem) => {
    if (window.confirm(`Delete package '${pkg.name}'? If bookings reference this package, it will be safely deactivated.`)) {
      try {
        const res = await apiFetch<{ success: boolean; message: string; deactivated?: boolean }>(`/packages/${pkg._id}`, {
          method: 'DELETE'
        });
        if (res.deactivated) {
          setPackages(prev => prev.map(p => p._id === pkg._id ? { ...p, status: 'Inactive' } : p));
          toast.success(res.message);
        } else {
          setPackages(prev => prev.filter(p => p._id !== pkg._id));
          toast.success(res.message);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete package.');
      }
    }
  };

  // --- Gallery Handlers ---
  const handleOpenGalleryModal = (item: GalleryItem | null = null) => {
    if (item) {
      setEditingGalleryItem(item);
      setGalleryForm({
        title: item.title || '',
        category: item.category || 'Bridal Makeup & Makeover',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        description: item.description || '',
        base64String: item.base64String || '',
        isPublished: item.isPublished !== false
      });
    } else {
      setEditingGalleryItem(null);
      setGalleryForm({
        title: '',
        category: 'Bridal Makeup & Makeover',
        tags: '',
        description: '',
        base64String: '',
        isPublished: true
      });
    }
    setShowGalleryModal(true);
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.base64String) {
      toast.error('Please select an image file to upload.');
      return;
    }

    try {
      const payload = {
        base64String: galleryForm.base64String,
        title: galleryForm.title.trim() || 'Parlour Treatment',
        category: galleryForm.category,
        tags: galleryForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        description: galleryForm.description.trim(),
        isPublished: galleryForm.isPublished
      };

      if (editingGalleryItem) {
        const res = await apiFetch<{ success: boolean; image: GalleryItem }>(`/gallery/${editingGalleryItem._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setGalleryImages(prev => prev.map(img => img._id === editingGalleryItem._id ? res.image : img));
        toast.success('Gallery treatment updated!');
      } else {
        const res = await apiFetch<{ success: boolean; image: GalleryItem }>('/gallery', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setGalleryImages(prev => [res.image, ...prev]);
        toast.success('Treatment published to gallery! ✨');
      }
      setShowGalleryModal(false);
      setEditingGalleryItem(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save gallery item.');
    }
  };

  const handleToggleGalleryPublish = async (img: GalleryItem) => {
    try {
      const res = await apiFetch<{ success: boolean; image: GalleryItem }>(`/gallery/${img._id}/publish`, {
        method: 'PATCH'
      });
      setGalleryImages(prev => prev.map(item => item._id === img._id ? res.image : item));
      toast.success(res.image.isPublished ? 'Treatment published to gallery.' : 'Treatment hidden from gallery.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update publication status.');
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (window.confirm('Delete this image permanently from the gallery?')) {
      try {
        await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
        setGalleryImages(prev => prev.filter(img => img._id !== id));
        toast.success('Image deleted from gallery.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete image.');
      }
    }
  };

  // --- Appointments Status Handlers ---
  const handleUpdateApptStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch<{ success: boolean; appointment: AppointmentItem }>(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setAppointments(prev => prev.map(a => a._id === id ? res.appointment : a));
      toast.success(`Booking status: ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status.');
    }
  };

  const handleDeleteAppt = async (id: string) => {
    if (window.confirm('Delete this appointment record?')) {
      try {
        await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
        setAppointments(prev => prev.filter(a => a._id !== id));
        toast.success('Appointment deleted.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete appointment.');
      }
    }
  };

  // --- Inquiries Handlers ---
  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch<{ success: boolean; contact: ContactItem }>(`/contacts/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setInquiries(prev => prev.map(c => c._id === id ? res.contact : c));
      toast.success(`Inquiry marked as ${newStatus}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update inquiry status.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      try {
        await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
        setInquiries(prev => prev.filter(c => c._id !== id));
        toast.success('Message deleted.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete message.');
      }
    }
  };

  // --- Walk-in Booking Handlers ---
  const handleSaveWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ success: boolean; appointment: AppointmentItem; message: string }>('/appointments/admin-book', {
        method: 'POST',
        body: JSON.stringify(walkInForm)
      });
      if (res.success && res.appointment) {
        setAppointments(prev => [res.appointment, ...prev]);
        toast.success(res.message);
        setShowWalkInModal(false);
        setWalkInForm({
          user: '',
          phone: '',
          email: '',
          service: 'Facial',
          staff: 'Any Available Specialist',
          date: new Date().toISOString().split('T')[0],
          time: '11:00 AM',
          amount: '₹300 – ₹1,250',
          notes: ''
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create walk-in appointment.');
    }
  };

  // --- Admin Reschedule Handlers ---
  const handleOpenAdminReschedule = (appt: AppointmentItem) => {
    setRescheduleModalAppt(appt);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defDate = tomorrow.toISOString().split('T')[0];
    setAdminRescheduleDate(defDate);
    fetchSlotsForAdminReschedule(defDate, appt.staff);
  };

  const fetchSlotsForAdminReschedule = async (date: string, staffName?: string) => {
    setIsLoadingAdminSlots(true);
    try {
      const staffQuery = staffName && staffName !== 'Any Available Specialist' ? `&staff=${encodeURIComponent(staffName)}` : '';
      const res = await apiFetch<{ availableSlots: string[] }>(`/appointments/available-slots?date=${date}${staffQuery}`);
      setAdminAvailableSlots(res.availableSlots || []);
      if (res.availableSlots && res.availableSlots.length > 0) {
        setAdminRescheduleTime(res.availableSlots[0]);
      } else {
        setAdminRescheduleTime('');
      }
    } catch {
      toast.error('Could not load slots.');
    } finally {
      setIsLoadingAdminSlots(false);
    }
  };

  const handleSaveAdminReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalAppt || !adminRescheduleDate || !adminRescheduleTime) {
      toast.error('Please pick a date and slot.');
      return;
    }

    try {
      const res = await apiFetch<{ success: boolean; appointment: AppointmentItem; message: string }>(`/appointments/${rescheduleModalAppt._id}/reschedule`, {
        method: 'PATCH',
        body: JSON.stringify({
          newDate: adminRescheduleDate,
          newTime: adminRescheduleTime,
          reason: 'Rescheduled by parlour management'
        })
      });
      if (res.success && res.appointment) {
        setAppointments(prev => prev.map(a => a._id === rescheduleModalAppt._id ? res.appointment : a));
        toast.success(res.message);
        setRescheduleModalAppt(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Reschedule failed.');
    }
  };

  // --- Staff Management Handlers ---
  const handleOpenStaffModal = (targetStaff: StaffItem | null = null) => {
    if (targetStaff) {
      setEditingStaff(targetStaff);
      setStaffForm({
        name: targetStaff.name,
        role: targetStaff.role,
        specialization: (targetStaff.specialization || []).join(', '),
        experience: targetStaff.experience || '3+ years',
        phone: targetStaff.phone || '',
        email: targetStaff.email || '',
        image: targetStaff.image || '/image1.png',
        workingHours: targetStaff.workingHours || '09:00 AM - 07:00 PM',
        daysOff: (targetStaff.daysOff || ['Monday']).join(', '),
        status: targetStaff.status || 'Active'
      });
    } else {
      setEditingStaff(null);
      setStaffForm({
        name: '',
        role: '',
        specialization: '',
        experience: '3+ years',
        phone: '',
        email: '',
        image: '/image1.png',
        workingHours: '09:00 AM - 07:00 PM',
        daysOff: 'Monday',
        status: 'Active'
      });
    }
    setShowStaffModal(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: staffForm.name.trim(),
        role: staffForm.role.trim(),
        specialization: staffForm.specialization.split(',').map(s => s.trim()).filter(Boolean),
        experience: staffForm.experience.trim(),
        phone: staffForm.phone.trim(),
        email: staffForm.email.trim(),
        image: staffForm.image,
        workingHours: staffForm.workingHours,
        daysOff: staffForm.daysOff.split(',').map(s => s.trim()).filter(Boolean),
        status: staffForm.status
      };

      if (editingStaff) {
        const res = await apiFetch<{ success: boolean; staff: StaffItem }>(`/staff/${editingStaff._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setStaff(prev => prev.map(s => s._id === editingStaff._id ? res.staff : s));
        toast.success('Staff profile updated!');
      } else {
        const res = await apiFetch<{ success: boolean; staff: StaffItem }>('/staff', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setStaff(prev => [...prev, res.staff]);
        toast.success('New staff member added!');
      }
      setShowStaffModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save staff profile.');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm('Delete this staff member profile?')) {
      try {
        await apiFetch(`/staff/${id}`, { method: 'DELETE' });
        setStaff(prev => prev.filter(s => s._id !== id));
        toast.success('Staff profile deleted.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete staff member.');
      }
    }
  };

  // --- Coupon Handlers ---
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ success: boolean; coupon: CouponItem }>('/coupons', {
        method: 'POST',
        body: JSON.stringify(couponForm)
      });
      if (res.success && res.coupon) {
        setCoupons(prev => [res.coupon, ...prev]);
        toast.success(`Coupon '${res.coupon.code}' created!`);
        setShowCouponModal(false);
        setCouponForm({
          code: '',
          discountType: 'percentage',
          discountValue: 15,
          minOrderAmount: 1000,
          maxDiscount: 500,
          description: '',
          category: 'all',
          validUntil: '2027-12-31',
          status: 'Active'
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create coupon.');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm('Delete this coupon code?')) {
      try {
        await apiFetch(`/coupons/${id}`, { method: 'DELETE' });
        setCoupons(prev => prev.filter(c => c._id !== id));
        toast.success('Coupon removed.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete coupon.');
      }
    }
  };

  // --- Settings Handler ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ success: boolean; settings: SettingItem; message: string }>('/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsForm)
      });
      if (res.success && res.settings) {
        setSettings(res.settings);
        toast.success('Business settings saved successfully! ✨');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save business settings.');
    }
  };

  // If loading authentication state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-pink-500">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-gray-500 font-medium">Verifying owner credentials...</p>
      </div>
    );
  }

  // --- OWNER-ONLY ACCESS WALL ---
  // If not authenticated as Owner or Admin, show Owner Access Portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-pink-100 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Owner Access Portal</h2>
            <p className="text-gray-500 text-xs mt-1">
              Restricted Area: Legitimate project owner credentials required.
            </p>
          </div>

          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Email</label>
              <input
                type="email"
                required
                value={adminLoginEmail}
                onChange={(e) => setAdminLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Password</label>
              <input
                type="password"
                required
                value={adminLoginPassword}
                onChange={(e) => setAdminLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl shadow-md transition hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In as Owner'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <Link to="/" className="text-pink-500 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
            <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded">Owner Only</span>
          </div>
        </div>
      </div>
    );
  }

  // --- FILTERS & SEARCH COMPUTATION ---
  const filteredUsers = users.filter(u => {
    const matchesStatus = userStatusFilter === 'all' || (u.status || '').toLowerCase() === userStatusFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  const filteredPackages = packages.filter(p => {
    const matchesCat = pkgCategoryFilter === 'all' || (p.category || '').toLowerCase() === pkgCategoryFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = apptStatusFilter === 'all' || (a.status || '').toLowerCase() === apptStatusFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      (a.user && a.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.service && a.service.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.phone && a.phone.includes(searchQuery)) ||
      (a.date && a.date.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  const filteredGallery = galleryImages.filter(g => {
    const matchesCat = galleryCategoryFilter === 'all' || (g.category || '').toLowerCase() === galleryCategoryFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      (g.title && g.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.category && g.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(g.tags) && g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col z-20`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-pink-500" />
              <span className="font-bold text-xl text-pink-500 tracking-wide">OwnerAdmin</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 text-gray-500 hover:bg-pink-50 hover:text-pink-500 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'dashboard' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Activity className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Dashboard Overview</span>}
          </button>

          <button 
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'packages' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <PackageIcon className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Packages & Services</span>}
          </button>

          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'gallery' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Gallery Manager</span>}
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'users' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>User Management</span>}
          </button>

          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'appointments' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-5 h-5 shrink-0" />
            {isSidebarOpen && (
              <div className="flex justify-between items-center w-full">
                <span>Appointments</span>
                {appointments.filter(a => a.status === 'Pending').length > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {appointments.filter(a => a.status === 'Pending').length}
                  </span>
                )}
              </div>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'inquiries' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            {isSidebarOpen && (
              <div className="flex justify-between items-center w-full">
                <span>Contact Inquiries</span>
                {inquiries.filter(c => c.status === 'New').length > 0 && (
                  <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {inquiries.filter(c => c.status === 'New').length}
                  </span>
                )}
              </div>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('staff')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'staff' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Staff Specialists</span>}
          </button>

          <button 
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'coupons' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Tag className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Offers & Coupons</span>}
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'settings' ? 'bg-pink-50 text-pink-600 font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Business Settings</span>}
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-200 space-y-1">
          <Link 
            to="/" 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition text-sm ${!isSidebarOpen && 'justify-center'}`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {isSidebarOpen && <span>Public Website</span>}
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition text-sm ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-72 md:w-96">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none ml-2 text-xs md:text-sm w-full" 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full">
                {isOwner ? '👑 Owner' : '🛡️ Admin'}
              </span>
              <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-800 leading-tight">{user?.name || 'Admin Owner'}</p>
                <p className="text-[11px] text-gray-400">{user?.email || 'Authorized Owner'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content View */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-pink-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-gray-500 font-medium text-sm">Loading dynamic parlour data...</p>
            </div>
          ) : activeTab === 'dashboard' ? (
            /* --- DASHBOARD TAB --- */
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                  <p className="text-gray-500 text-xs mt-1">Live statistics and parlour activities from real database.</p>
                </div>
                <button
                  onClick={loadAllData}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:text-pink-600 hover:border-pink-200 rounded-xl text-xs font-medium transition shadow-xs flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-pink-500" /> Refresh Metrics
                </button>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-3.5 bg-blue-50 text-blue-500 rounded-2xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Registered Users</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats?.totalUsers ?? users.length}</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-3.5 bg-pink-50 text-pink-500 rounded-2xl">
                    <PackageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Active Packages</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats?.activePackages ?? packages.filter(p => p.status === 'Active').length}</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-3.5 bg-purple-50 text-purple-500 rounded-2xl">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Bookings</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats?.totalAppointments ?? appointments.length}</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-3.5 bg-green-50 text-green-500 rounded-2xl">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-800">₹{(stats?.totalRevenue ?? 0).toLocaleString()}</h3>
                  </div>
                </div>
              </div>

              {/* Two Column Section: Recent Bookings & Recent Inquiries */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base">Recent Bookings</h3>
                    <button onClick={() => setActiveTab('appointments')} className="text-xs text-pink-500 hover:text-pink-600 font-semibold">View All ({appointments.length})</button>
                  </div>
                  <div className="divide-y divide-gray-100 flex-1">
                    {appointments.slice(0, 5).map((appt) => (
                      <div key={appt._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{appt.user}</p>
                          <p className="text-xs text-pink-500 font-medium">{appt.service}</p>
                          <p className="text-[11px] text-gray-400">{appt.date} at {appt.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-gray-800">{appt.amount}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            appt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <p className="text-center py-8 text-gray-400 text-xs">No bookings yet.</p>
                    )}
                  </div>
                </div>

                {/* Recent Inquiries */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base">Contact Inquiries</h3>
                    <button onClick={() => setActiveTab('inquiries')} className="text-xs text-pink-500 hover:text-pink-600 font-semibold">View All ({inquiries.length})</button>
                  </div>
                  <div className="divide-y divide-gray-100 flex-1">
                    {inquiries.slice(0, 5).map((inq) => (
                      <div key={inq._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                        <div className="max-w-[70%]">
                          <p className="font-semibold text-gray-800 text-sm">{inq.name}</p>
                          <p className="text-xs text-gray-500 truncate">{inq.message}</p>
                          <p className="text-[11px] text-gray-400">{inq.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'New' ? 'bg-pink-100 text-pink-600' :
                          inq.status === 'Replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                    ))}
                    {inquiries.length === 0 && (
                      <p className="text-center py-8 text-gray-400 text-xs">No contact inquiries yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'packages' ? (
            /* --- PACKAGES CRUD TAB --- */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Manage Parlour Packages</h1>
                  <p className="text-gray-500 text-xs mt-1">Changes are live and immediately reflected on public website.</p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={pkgCategoryFilter}
                    onChange={(e) => setPkgCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-pink-300"
                  >
                    <option value="all">All Services</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Body Care">Body Care</option>
                    <option value="Makeup & Bridal">Makeup & Bridal</option>
                  </select>
                  <button
                    onClick={() => handleOpenPkgModal()}
                    className="flex items-center gap-1.5 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Package
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <div key={pkg._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="relative h-40 rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                        <img 
                          src={pkg.image || '/image1.png'} 
                          alt={pkg.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { (e.target as HTMLImageElement).src = '/image1.png'; }}
                        />
                        <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pkg.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {pkg.status}
                        </span>
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-gray-700 uppercase">
                          {pkg.category}
                        </span>
                      </div>

                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-800 text-base">{pkg.name}</h3>
                        <span className="font-bold text-pink-500 text-base">{pkg.price}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {pkg.duration || '45 mins'}
                      </p>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-3">{pkg.desc}</p>
                      {pkg.specialBenefit && (
                        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 text-[11px] font-medium flex items-center gap-1.5">
                          <span>✨</span>
                          <span className="line-clamp-2">{pkg.specialBenefit}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleTogglePackageStatus(pkg)}
                        className={`px-3 py-1 rounded-lg font-medium transition ${
                          pkg.status === 'Active' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {pkg.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenPkgModal(pkg)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Package"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'gallery' ? (
            /* --- GALLERY CRUD TAB --- */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
                  <p className="text-gray-500 text-xs mt-1">Upload, categorize, publish/unpublish, and manage real treatment results.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <select
                    value={galleryCategoryFilter}
                    onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-pink-300"
                  >
                    <option value="all">All Categories</option>
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleOpenGalleryModal()}
                    className="flex items-center gap-1.5 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Upload Treatment Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGallery.map((img) => (
                  <div key={img._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="relative h-44 bg-gray-50 overflow-hidden border-b border-gray-100">
                        <img 
                          src={img.base64String} 
                          alt={img.title || 'Gallery'} 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/image1.png'; }}
                        />
                        <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          img.isPublished !== false ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {img.isPublished !== false ? 'Published' : 'Unpublished'}
                        </span>
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-pink-600 shadow-xs max-w-[130px] truncate">
                          {img.category || 'Treatment'}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-1">
                        <p className="font-bold text-gray-800 text-xs truncate">{img.title || 'Parlour Look'}</p>
                        {img.description && (
                          <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed">{img.description}</p>
                        )}
                        {Array.isArray(img.tags) && img.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {img.tags.slice(0, 3).map((tag, tIdx) => (
                              <span key={tIdx} className="text-[9px] bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs bg-gray-50/50">
                      <button
                        onClick={() => handleToggleGalleryPublish(img)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                          img.isPublished !== false 
                            ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100' 
                            : 'text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {img.isPublished !== false ? 'Unpublish' : 'Publish'}
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenGalleryModal(img)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Metadata"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryImage(img._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredGallery.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-white rounded-3xl p-8 border border-gray-100">
                    <p className="text-gray-400 text-sm">No gallery images found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'users' ? (
            /* --- USERS CRUD TAB --- */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                  <p className="text-gray-500 text-xs mt-1">View, search, edit, and control registered accounts.</p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-pink-300"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                  <button
                    onClick={() => handleOpenUserModal()}
                    className="flex items-center gap-1.5 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add User
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Phone</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/60 transition">
                        <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                            {u.name.slice(0, 1)}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{u.email}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{u.phone || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {u.role !== 'owner' && (
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className={`text-xs px-2 py-1 rounded transition ${
                                  u.status === 'Active' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
                                }`}
                              >
                                {u.status === 'Active' ? 'Disable' : 'Enable'}
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenUserModal(u)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {u.role !== 'owner' && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'appointments' ? (
            /* --- APPOINTMENTS TAB --- */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Appointments & Bookings</h1>
                  <p className="text-gray-500 text-xs mt-1">Review scheduled appointments and manage confirmation states.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowWalkInModal(true)}
                    className="px-3.5 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book Walk-In
                  </button>
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setApptStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                        apptStatusFilter === st
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Client & Ref</th>
                      <th className="px-6 py-4 font-semibold">Service & Specialist</th>
                      <th className="px-6 py-4 font-semibold">Date & Time</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-gray-50/60 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] bg-pink-50 text-pink-700 font-bold px-1.5 py-0.5 rounded border border-pink-100">
                              {appt.bookingRef || 'SHR-BK'}
                            </span>
                            <p className="font-semibold text-gray-800">{appt.user}</p>
                          </div>
                          {appt.phone && <p className="text-xs text-gray-400 mt-0.5">{appt.phone}</p>}
                          {appt.email && <p className="text-[11px] text-gray-400">{appt.email}</p>}
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium text-xs md:text-sm">
                          <p>{appt.service}</p>
                          {appt.staff && (
                            <p className="text-[11px] text-pink-600 font-medium">Specialist: {appt.staff}</p>
                          )}
                          {appt.couponCode && (
                            <p className="text-[10px] text-emerald-600 font-medium">Coupon: {appt.couponCode} (-{appt.discountAmount})</p>
                          )}
                          {appt.cancellationReason && (
                            <p className="text-[10px] text-red-500 italic mt-0.5">Reason: {appt.cancellationReason}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs">
                          <p className="font-medium text-gray-800">{appt.date}</p>
                          <p className="text-gray-400">{appt.time}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">{appt.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            appt.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                            appt.status === 'No-show' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            <select
                              value={appt.status}
                              onChange={(e) => handleUpdateApptStatus(appt._id, e.target.value)}
                              className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="No-show">No-show</option>
                            </select>
                            {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                              <button
                                onClick={() => handleOpenAdminReschedule(appt)}
                                className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                                title="Reschedule booking"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAppt(appt._id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                          No appointments found matching filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'inquiries' ? (
            /* --- INQUIRIES TAB --- */
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Customer Inquiries</h1>
                <p className="text-gray-500 text-xs mt-1">Messages and beauty questions submitted via website contact form.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-base">{inq.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-pink-400" />
                            <span>{inq.email}</span>
                            {inq.phone && <span>• {inq.phone}</span>}
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          inq.status === 'New' ? 'bg-pink-100 text-pink-700' :
                          inq.status === 'Replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                        "{inq.message}"
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                      <div className="flex gap-2">
                        {inq.status !== 'Replied' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq._id, 'Replied')}
                            className="text-green-600 hover:bg-green-50 px-2.5 py-1 rounded-lg font-medium transition"
                          >
                            Mark Replied
                          </button>
                        )}
                        {inq.status === 'New' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq._id, 'Read')}
                            className="text-gray-600 hover:bg-gray-100 px-2.5 py-1 rounded-lg font-medium transition"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteInquiry(inq._id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <div className="col-span-2 text-center py-16 bg-white rounded-3xl p-8 border border-gray-100">
                    <p className="text-gray-400 text-sm">No contact inquiries received yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'staff' ? (
            /* --- STAFF SPECIALISTS TAB --- */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Staff & Beauty Specialists</h1>
                  <p className="text-gray-500 text-xs mt-1">Manage parlour beauticians, stylists, working hours, and specializations.</p>
                </div>
                <button
                  onClick={() => handleOpenStaffModal()}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" /> Add Specialist
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Specialist</th>
                      <th className="px-6 py-4 font-semibold">Role & Experience</th>
                      <th className="px-6 py-4 font-semibold">Specializations</th>
                      <th className="px-6 py-4 font-semibold">Working Hours</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {staff.map((st) => (
                      <tr key={st._id} className="hover:bg-gray-50/60 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={st.image || '/image1.png'}
                            alt={st.name}
                            className="w-10 h-10 rounded-full object-cover border border-pink-100"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{st.name}</p>
                            <p className="text-xs text-gray-400">{st.phone || st.email || 'No contact'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-medium text-gray-800">{st.role}</p>
                          <p className="text-gray-400">{st.experience}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(st.specialization || []).map((sp, idx) => (
                              <span key={idx} className="bg-pink-50 text-pink-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {sp}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          <p className="font-medium">{st.workingHours || '09:00 AM - 07:00 PM'}</p>
                          <p className="text-gray-400 text-[11px]">Off: {(st.daysOff || ['Monday']).join(', ')}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            st.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {st.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            <button
                              onClick={() => handleOpenStaffModal(st)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Specialist"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(st._id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Specialist"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {staff.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                          No specialists added yet. Click 'Add Specialist' to set up your team.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'coupons' ? (
            /* --- OFFERS & COUPONS TAB --- */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Offers & Promo Coupons</h1>
                  <p className="text-gray-500 text-xs mt-1">Manage seasonal promo codes, discount percentages, and validity rules.</p>
                </div>
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Promo Code</th>
                      <th className="px-6 py-4 font-semibold">Discount</th>
                      <th className="px-6 py-4 font-semibold">Min Order & Cap</th>
                      <th className="px-6 py-4 font-semibold">Valid Until</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {coupons.map((c) => (
                      <tr key={c._id} className="hover:bg-gray-50/60 transition">
                        <td className="px-6 py-4 font-mono font-bold text-pink-600">
                          <span className="bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-lg">
                            {c.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-800">
                          {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          <p>Min Spend: ₹{c.minOrderAmount || 0}</p>
                          {c.maxDiscount && <p className="text-gray-400 text-[11px]">Max Discount: ₹{c.maxDiscount}</p>}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {c.validUntil || 'No Expiry'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {coupons.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                          No coupons configured yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            /* --- BUSINESS SETTINGS TAB --- */
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Business & Parlour Settings</h1>
                <p className="text-gray-500 text-xs mt-1">Configure salon contact information, opening hours, and appointment policies.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Parlour Name</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.parlourName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, parlourName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number (e.g. 919876543210)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Parlour Address</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Operating Hours & Timings</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.timings}
                      onChange={(e) => setSettingsForm({ ...settingsForm, timings: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Default Currency</label>
                    <input
                      type="text"
                      value={settingsForm.currency}
                      onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cancellation & Rescheduling Policy</label>
                  <textarea
                    rows={3}
                    value={settingsForm.cancellationPolicy}
                    onChange={(e) => setSettingsForm({ ...settingsForm, cancellationPolicy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save Business Settings
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </main>

      {/* --- MODAL: ADD / EDIT PACKAGE --- */}
      {showPkgModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingPkg ? `Edit Package: ${editingPkg.name}` : 'Create New Parlour Package'}
              </h3>
              <button onClick={() => setShowPkgModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Glowing Bridal Facial"
                  value={pkgForm.name}
                  onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={pkgForm.category}
                    onChange={(e) => setPkgForm({ ...pkgForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="Skin Care">Skin Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Body Care">Body Care</option>
                    <option value="Makeup & Bridal">Makeup & Bridal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹800, ₹300 – ₹1,250, or Contact for Pricing"
                    value={pkgForm.price}
                    onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 60 mins"
                    value={pkgForm.duration}
                    onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={pkgForm.status}
                    onChange={(e) => setPkgForm({ ...pkgForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe treatment benefits..."
                  value={pkgForm.desc}
                  onChange={(e) => setPkgForm({ ...pkgForm, desc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Special Benefit / Complimentary Perk (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. One complimentary makeup service with the bridal booking"
                  value={pkgForm.specialBenefit}
                  onChange={(e) => setPkgForm({ ...pkgForm, specialBenefit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Included Services (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Deep Cleansing, Steam, Glow Mask, Shoulder Massage"
                  value={pkgForm.includes}
                  onChange={(e) => setPkgForm({ ...pkgForm, includes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Service Photograph</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="/images/facial-treatment.jpg or URL"
                      value={pkgForm.image}
                      onChange={(e) => setPkgForm({ ...pkgForm, image: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <label className="px-3 py-2 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-xl text-xs font-semibold cursor-pointer border border-pink-200 flex items-center justify-center">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPkgForm({ ...pkgForm, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-gray-500 self-center">Presets:</span>
                    {[
                      { label: 'Facial', url: '/images/facial-treatment.jpg' },
                      { label: 'Hair Spa', url: '/images/hair-spa.jpg' },
                      { label: 'Haircut', url: '/images/haircut.jpg' },
                      { label: 'Waxing', url: '/images/body-wax.jpg' },
                      { label: 'Mani/Pedi', url: '/images/pedicure-spa.jpg' },
                      { label: 'Party Makeup', url: '/images/party-makeup.jpg' },
                      { label: 'Engagement', url: '/images/nail-art.jpg' },
                      { label: 'Bridal', url: '/images/bridal-makeup.jpg' },
                    ].map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setPkgForm({ ...pkgForm, image: p.url })}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                          pkgForm.image === p.url 
                            ? 'bg-pink-600 text-white border-pink-600' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {pkgForm.image && (
                    <div className="h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 mt-2">
                      <img 
                        src={pkgForm.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/facial-treatment.jpg'; }} 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPkgModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold transition shadow-md"
                >
                  {editingPkg ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD / EDIT USER --- */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingUser ? `Edit User: ${editingUser.name}` : 'Create New User Account'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {editingUser ? 'New Password (Leave blank to keep unchanged)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? '••••••••' : 'Min 6 characters'}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold transition shadow-md"
                >
                  {editingUser ? 'Save Updates' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: UPLOAD / EDIT GALLERY IMAGE --- */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {editingGalleryItem ? 'Edit Treatment Photo' : 'Upload Treatment Photo'}
                </h3>
                <p className="text-xs text-gray-500">Genuine makeover & treatment work by Shree Ambika</p>
              </div>
              <button onClick={() => setShowGalleryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {editingGalleryItem ? 'Change Photo File (Optional)' : 'Select Photo File *'}
                </label>
                <input
                  type="file"
                  required={!editingGalleryItem}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setGalleryForm({ ...galleryForm, base64String: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 cursor-pointer"
                />
              </div>

              {galleryForm.base64String && (
                <div className="h-40 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                  <img src={galleryForm.base64String} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal HD Bridal Transformation"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                >
                  {GALLERY_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Bridal, HD Makeup, Wedding Glow, Traditional"
                  value={galleryForm.tags}
                  onChange={(e) => setGalleryForm({ ...galleryForm, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Treatment Caption</label>
                <textarea
                  rows={3}
                  placeholder="Describe treatment procedures, styling details, or products..."
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="galleryIsPublishedAdmin"
                  checked={galleryForm.isPublished}
                  onChange={(e) => setGalleryForm({ ...galleryForm, isPublished: e.target.checked })}
                  className="w-4 h-4 text-pink-500 rounded border-gray-300 focus:ring-pink-300 cursor-pointer"
                />
                <label htmlFor="galleryIsPublishedAdmin" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Visible to Public Website (Published)
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold transition shadow-md"
                >
                  {editingGalleryItem ? 'Save Changes' : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: WALK-IN / PHONE BOOKING --- */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Book Walk-In / Phone Customer</h3>
                <p className="text-xs text-gray-500">Record an on-site or telephonic client booking directly</p>
              </div>
              <button onClick={() => setShowWalkInModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWalkIn} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={walkInForm.user}
                    onChange={(e) => setWalkInForm({ ...walkInForm, user: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="priya@example.com"
                  value={walkInForm.email}
                  onChange={(e) => setWalkInForm({ ...walkInForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Service / Treatment *</label>
                  <select
                    value={walkInForm.service}
                    onChange={(e) => {
                      const sel = packages.find(p => p.name === e.target.value);
                      setWalkInForm({
                        ...walkInForm,
                        service: e.target.value,
                        amount: sel ? sel.price : walkInForm.amount
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    {packages.map(p => (
                      <option key={p._id} value={p.name}>{p.name} ({p.price})</option>
                    ))}
                    {packages.length === 0 && (
                      <option value="Facial">Facial (₹300 – ₹1,250)</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Specialist</label>
                  <select
                    value={walkInForm.staff}
                    onChange={(e) => setWalkInForm({ ...walkInForm, staff: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="Any Available Specialist">Any Available Specialist</option>
                    {staff.map(s => (
                      <option key={s._id} value={s.name}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={walkInForm.date}
                    onChange={(e) => setWalkInForm({ ...walkInForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    placeholder="11:00 AM"
                    value={walkInForm.time}
                    onChange={(e) => setWalkInForm({ ...walkInForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Amount *</label>
                  <input
                    type="text"
                    required
                    value={walkInForm.amount}
                    onChange={(e) => setWalkInForm({ ...walkInForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Booking Notes / Requests</label>
                <textarea
                  rows={2}
                  placeholder="Special requests or payment notes..."
                  value={walkInForm.notes}
                  onChange={(e) => setWalkInForm({ ...walkInForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition shadow-md"
                >
                  Confirm Walk-In Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADMIN RESCHEDULE APPOINTMENT --- */}
      {rescheduleModalAppt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Reschedule Appointment</h3>
                <p className="text-xs text-gray-500">
                  {rescheduleModalAppt.user} • {rescheduleModalAppt.bookingRef}
                </p>
              </div>
              <button onClick={() => setRescheduleModalAppt(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100 text-xs text-gray-700 mb-4">
              <p><strong>Current:</strong> {rescheduleModalAppt.date} at {rescheduleModalAppt.time}</p>
              <p><strong>Service:</strong> {rescheduleModalAppt.service}</p>
              {rescheduleModalAppt.staff && <p><strong>Specialist:</strong> {rescheduleModalAppt.staff}</p>}
            </div>

            <form onSubmit={handleSaveAdminReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={adminRescheduleDate}
                  onChange={(e) => {
                    setAdminRescheduleDate(e.target.value);
                    fetchSlotsForAdminReschedule(e.target.value, rescheduleModalAppt.staff);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Available Time Slot *</label>
                {isLoadingAdminSlots ? (
                  <div className="flex items-center justify-center py-4 text-pink-500 gap-2 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" /> Checking slot availability...
                  </div>
                ) : adminAvailableSlots.length === 0 ? (
                  <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
                    No available time slots on this date. Please pick another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                    {adminAvailableSlots.map(slot => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setAdminRescheduleTime(slot)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                          adminRescheduleTime === slot
                            ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRescheduleModalAppt(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!adminRescheduleTime || adminAvailableSlots.length === 0}
                  className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD / EDIT STAFF --- */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingStaff ? `Edit Specialist: ${editingStaff.name}` : 'Add Beauty Specialist'}
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Joshi"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Bridal Makeup Artist"
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Specializations (Comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="Bridal Makeup, HD Airbrush, Hair Styling"
                  value={staffForm.specialization}
                  onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Experience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7+ years"
                    value={staffForm.experience}
                    onChange={(e) => setStaffForm({ ...staffForm, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={staffForm.status}
                    onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43211"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL or Path</label>
                  <input
                    type="text"
                    placeholder="/image1.png"
                    value={staffForm.image}
                    onChange={(e) => setStaffForm({ ...staffForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Working Hours</label>
                  <input
                    type="text"
                    placeholder="09:00 AM - 07:00 PM"
                    value={staffForm.workingHours}
                    onChange={(e) => setStaffForm({ ...staffForm, workingHours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Weekly Off Days</label>
                  <input
                    type="text"
                    placeholder="Monday"
                    value={staffForm.daysOff}
                    onChange={(e) => setStaffForm({ ...staffForm, daysOff: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition shadow-md"
                >
                  {editingStaff ? 'Save Changes' : 'Add Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE COUPON --- */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-lg">Create Promo Coupon</h3>
              <button onClick={() => setShowCouponModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Coupon Code (e.g. FESTIVE20) *</label>
                <input
                  type="text"
                  required
                  placeholder="FESTIVE20"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Type *</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.minOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={couponForm.validUntil}
                  onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Banner Note</label>
                <input
                  type="text"
                  placeholder="Get 15% discount on all premium salon services"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition shadow-md"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
