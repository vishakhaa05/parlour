import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Contact from "./components/Contect";
import ContentPage from "./components/ContentPage";
import CheckoutModal from "./components/CheckoutModal";
import AIAssistantWidget from "./components/AIAssistantWidget";
import AdminDashboard from "./components/AdminDashboard";
import Gallery from "./components/Gallary";
import { Toaster } from "react-hot-toast";

const App = () => {
  
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-right" />
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/book" element={<CheckoutModal />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
      {!isDashboard && <Contact />}
      <AIAssistantWidget />
    </>
  );
};

export default App;