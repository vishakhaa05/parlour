import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, IndianRupee, Activity, Search, Bell, Menu, ArrowLeft, MoreVertical, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  joinDate: string;
  status: string;
}

interface Appointment {
  _id: string;
  user: string;
  service: string;
  date: string;
  time: string;
  amount: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(() => localStorage.getItem('isAdmin') === 'true');

  const toggleAdminMode = () => {
    const newValue = !isAdminMode;
    setIsAdminMode(newValue);
    localStorage.setItem('isAdmin', String(newValue));
  };

  React.useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/users').then(res => res.json()),
      fetch('http://localhost:5000/api/appointments').then(res => res.json())
    ])
    .then(([usersData, apptsData]) => {
      setUsers(usersData);
      setAppointments(apptsData);
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      toast.error('Failed to load dashboard data.');
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && <span className="font-bold text-xl text-pink-500 tracking-wide">AdminPanel</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:bg-pink-50 hover:text-pink-500 rounded-lg transition">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Activity className="w-5 h-5" />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition ${activeTab === 'users' ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Users className="w-5 h-5" />
            {isSidebarOpen && <span>Users</span>}
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition ${activeTab === 'appointments' ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <CalendarDays className="w-5 h-5" />
            {isSidebarOpen && <span>Appointments</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link to="/" className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition ${!isSidebarOpen && 'justify-center'}`}>
            <ArrowLeft className="w-5 h-5" />
            {isSidebarOpen && <span>Back to Website</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users, bookings..." className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleAdminMode}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${isAdminMode ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {isAdminMode ? 'Admin Mode: ON' : 'Admin Mode: OFF'}
            </button>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-pink-100 border-2 border-pink-200 flex items-center justify-center font-bold text-pink-600 text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-pink-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading Dashboard Data...</p>
            </div>
          ) : activeTab === 'dashboard' && (
            <div className="animate-fade-in-up">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-4 bg-blue-50 text-blue-500 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-800">{users.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-4 bg-pink-50 text-pink-500 rounded-xl">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Appointments</p>
                    <h3 className="text-2xl font-bold text-gray-800">{appointments.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-4 bg-green-50 text-green-500 rounded-xl">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Revenue (Today)</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      ₹{appointments.reduce((sum, app) => sum + parseInt(app.amount.replace(/\D/g, '') || '0'), 0).toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Recent Appointments</h3>
                  <button onClick={() => setActiveTab('appointments')} className="text-sm text-pink-500 hover:text-pink-600 font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Client</th>
                        <th className="px-6 py-4 font-medium">Service</th>
                        <th className="px-6 py-4 font-medium">Date & Time</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.slice(0, 5).map((appt) => (
                        <tr key={appt._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-800">{appt.user}</td>
                          <td className="px-6 py-4 text-gray-600">{appt.service}</td>
                          <td className="px-6 py-4 text-gray-600">{appt.date} at {appt.time}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{appt.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-fade-in-up">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Joined Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-500">#{user._id.slice(-6)}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="animate-fade-in-up">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">All Appointments</h1>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Client</th>
                        <th className="px-6 py-4 font-medium">Service</th>
                        <th className="px-6 py-4 font-medium">Date & Time</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.map((appt) => (
                        <tr key={appt._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-800">{appt.user}</td>
                          <td className="px-6 py-4 text-gray-600">{appt.service}</td>
                          <td className="px-6 py-4 text-gray-600">{appt.date} at {appt.time}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{appt.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
