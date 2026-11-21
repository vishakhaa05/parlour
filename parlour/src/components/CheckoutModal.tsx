import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const params = new URLSearchParams(location.search);
  const serviceName = params.get('service') || 'Custom Treatment';
  const price = params.get('price') || '₹1000';
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: 'Guest User', // Hardcoded for demo
          service: serviceName,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          amount: price,
          status: 'Confirmed'
        })
      });
      if (response.ok) {
        setIsSuccess(true);
        toast.success(`Booking confirmed for ${serviceName}!`);
      } else {
        const errorData = await response.json();
        toast.error(`Booking failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to the server.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-pink-500 mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        {isSuccess ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm text-center transform transition-all animate-fade-in-up border border-green-100">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-8 text-lg">Your appointment for <span className="font-semibold">{serviceName}</span> has been confirmed.</p>
            <Link to="/">
              <button className="bg-pink-400 text-white px-8 py-3 rounded-full font-medium hover:bg-pink-500 transition shadow-md hover:-translate-y-1">
                Return Home
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Complete Your Booking</h1>
            
            <div className="grid md:grid-cols-2 gap-10">
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h3>
                <div className="bg-pink-50 p-6 rounded-2xl mb-6">
                  <div className="flex justify-between items-center mb-4 border-b border-pink-100 pb-4">
                    <span className="text-gray-600 font-medium">{serviceName}</span>
                    <span className="text-gray-800 font-bold">{price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">Taxes & Fees</span>
                    <span className="text-gray-500 text-sm">Included</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-pink-200">
                    <span className="text-gray-800 font-bold">Total Amount</span>
                    <span className="text-pink-500 font-bold text-xl">{price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Method</h3>
                <form onSubmit={handlePayment}>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-3 flex flex-col items-center justify-center rounded-xl border-2 transition ${paymentMethod === 'upi' ? 'border-pink-400 bg-pink-50 text-pink-500' : 'border-gray-200 text-gray-500 hover:border-pink-200'}`}
                    >
                      <Smartphone className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">UPI</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3 flex flex-col items-center justify-center rounded-xl border-2 transition ${paymentMethod === 'card' ? 'border-pink-400 bg-pink-50 text-pink-500' : 'border-gray-200 text-gray-500 hover:border-pink-200'}`}
                    >
                      <CreditCard className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">Card</span>
                    </button>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mb-6 animate-fade-in-up">
                      <label className="block text-sm font-medium text-gray-600 mb-2">UPI ID</label>
                      <input required type="text" placeholder="example@okhdfcbank" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition" />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="mb-6 animate-fade-in-up space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Card Number</label>
                        <input required type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Expiry</label>
                          <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">CVV</label>
                          <input required type="password" placeholder="***" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition" />
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    disabled={isProcessing}
                    type="submit" 
                    className="w-full bg-pink-400 text-white font-bold py-4 rounded-xl shadow-md hover:bg-pink-500 transition hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none flex justify-center items-center"
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      `Pay ${price}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
