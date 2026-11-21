import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Contact from "./components/Contect";
import ContentPage from "./components/ContentPage";
import CheckoutModal from "./components/CheckoutModal";
import AIAssistantWidget from "./components/AIAssistantWidget";
import AdminDashboard from "./components/AdminDashboard";
import Gallery from "./components/Gallary";
import AuthModal from "./components/AuthModal";
import MyAppointments from "./components/MyAppointments";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8F6] text-[#29232A] overflow-x-hidden">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#29232A',
            border: '1px solid #F2DCE2',
            boxShadow: '0 10px 25px -5px rgba(198, 93, 123, 0.15)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '13px',
          },
        }}
      />
      <AuthModal />
      {!isDashboard && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/services" element={<ContentPage />} />
          <Route path="/book" element={<CheckoutModal />} />
          <Route path="/my-bookings" element={<MyAppointments />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
      <AIAssistantWidget />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
