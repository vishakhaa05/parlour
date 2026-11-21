import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isImage?: boolean;
}

const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hi there! I am your personal AI beauty consultant. Ask me about our treatments, prices, or upload a photo of your face for a personalized skincare recommendation!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendText = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = "I can definitely help with that! Our expert beauticians will take care of you. Would you like to book an appointment?";
      const lowerInput = newMsg.text.toLowerCase();
      
      if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('rupees')) {
        aiText = "Our treatments range from ₹2000 for basic Hair Spa to ₹8000 for Keratin Treatments. Facials start at ₹2500. Check our Treatments page for more details!";
      } else if (lowerInput.includes('facial') || lowerInput.includes('skin')) {
        aiText = "We offer Glowing Facials (₹2500), Acne Clearing (₹3500), and Anti-Aging treatments (₹5000). I highly recommend our Glowing Facial for a fresh look!";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSimulateImageUpload = () => {
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: '[User uploaded a photo]', isImage: true };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    // Simulate AI face analysis
    setTimeout(() => {
      const aiResponse = "I've analyzed your skin. It looks like you might have some dry areas and slight uneven tone. I highly recommend our Glowing Facial (₹2500) paired with a deep moisturizing mask to restore your natural glow!";
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 3000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-pink-500 text-white rounded-full shadow-2xl hover:bg-pink-600 hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 z-50 flex flex-col ${isOpen ? 'opacity-100 translate-y-0 h-[500px]' : 'opacity-0 translate-y-10 h-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold">AI Beauty Consultant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-pink-600 p-1 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-sm' : 'bg-white text-gray-700 shadow-sm rounded-bl-sm border border-gray-100'}`}>
                {msg.isImage ? (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm italic">Photo uploaded</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm rounded-bl-sm border border-gray-100 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
                <span className="text-xs text-gray-500 italic">Analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <button 
            onClick={handleSimulateImageUpload}
            title="Upload face photo for analysis"
            className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Ask about treatments..."
            className="flex-1 px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-300 text-sm"
          />
          <button 
            onClick={handleSendText}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAssistantWidget;
