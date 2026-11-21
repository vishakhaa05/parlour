import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  Camera,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isImage?: boolean;
  imageUrl?: string;
  source?: string;
}

const QUICK_SUGGESTIONS = [
  { label: '👰 Bridal Packages', query: 'What bridal and party makeover packages do you offer?' },
  { label: '✨ Glowing Facial', query: 'Tell me about your Glowing Facial and skincare treatments.' },
  { label: '💇‍♀️ Hair Spa & Keratin', query: 'What hair treatments like hair spa and keratin do you have?' },
  { label: '📍 Location & Hours', query: 'Where is your parlour located and what are your timings?' },
  { label: '📅 How to Book', query: 'How can I book an appointment and what are your payment options?' }
];

const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Hello! ✨ I am your personal Beauty Consultant at **Shree Ambika Beauty Parlour & Spa**.\n\nAsk me about bridal makeovers, skincare facials, hair spa, prices, or tap the camera icon to upload a photo for personalized recommendations.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const whatsappNumber = '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Shree Ambika Beauty Parlour! I would like to inquire about booking an appointment. ✨')}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const sendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await apiFetch<{ success: boolean; reply: string; source?: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload
        })
      });

      if (res.success && res.reply) {
        setMessages(prev => [
          ...prev, 
          { 
            id: (Date.now() + 1).toString(), 
            sender: 'ai', 
            text: res.reply,
            source: res.source
          }
        ]);
      } else {
        throw new Error('No reply from AI service.');
      }
    } catch (err: any) {
      console.error('AI chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I'm having a little trouble connecting to my live knowledge base right now. You can view our full Treatment Menu or chat directly with our team on WhatsApp!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendText = () => {
    sendQuery(input);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;

      const userImgMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Uploaded facial photo for skin recommendation.',
        isImage: true,
        imageUrl: base64String
      };
      setMessages(prev => [...prev, userImgMsg]);
      setIsTyping(true);

      try {
        const res = await apiFetch<{ success: boolean; reply: string; analysis?: string }>('/ai/analyze-face', {
          method: 'POST',
          body: JSON.stringify({ imageBase64: base64String })
        });

        if (res.success && res.reply) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'ai',
              text: res.reply,
              source: 'gemini-vision'
            }
          ]);
        } else {
          throw new Error('Could not analyze photo.');
        }
      } catch (err: any) {
        console.error('Vision analysis error:', err);
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "Based on aesthetic best practices, our **Glowing Facial** or **Acne Clearing Treatment** provides gentle cleansing and barrier restoration. Book a consultation or chat with our experts on WhatsApp for tailored advice!"
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    };

    reader.readAsDataURL(file);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const clearChat = () => {
    setMessages([
      { 
        id: Date.now().toString(), 
        sender: 'ai', 
        text: 'Conversation reset. ✨ How may I assist your beauty & wellness goals today?' 
      }
    ]);
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="h-2" />;

      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-[#1F2937] mt-2 mb-1 text-sm">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-bold text-[#1F2937] mt-2.5 mb-1 text-base">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-0.5 ml-1">
            <span className="text-[#FA4D89] font-bold">•</span>
            <span>{renderInlineStyles(line.substring(2), `li-${idx}`)}</span>
          </div>
        );
      }

      return <p key={idx} className="my-1">{renderInlineStyles(line, `p-${idx}`)}</p>;
    });
  };

  const renderInlineStyles = (content: string, keyPrefix: string) => {
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((chunk, i) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return <strong key={`${keyPrefix}-${i}`} className="font-semibold text-[#1F2937]">{chunk.slice(2, -2)}</strong>;
      }
      if (chunk.startsWith('*') && chunk.endsWith('*')) {
        return <em key={`${keyPrefix}-${i}`} className="text-[#4B5563]">{chunk.slice(1, -1)}</em>;
      }
      return chunk;
    });
  };

  return (
    <>
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />

      {/* Single Floating Support Launcher Button */}
      <button 
        onClick={() => setIsOpen(true)}
        title="Beauty Consultant & Support"
        aria-label="Open Beauty Consultant and Support"
        className={`fixed bottom-6 right-6 p-4 bg-[#FA4D89] hover:bg-[#E11D74] text-white rounded-full shadow-salon hover:shadow-salon-hover hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-4 sm:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 z-50 flex flex-col border border-[#FCE7F0] ${isOpen ? 'opacity-100 translate-y-0 h-[560px] max-h-[85vh]' : 'opacity-0 translate-y-10 h-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FA4D89] to-[#D87491] p-4 text-white flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm tracking-wide">Beauty Consultant</h3>
              <p className="text-[11px] text-pink-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block" />
                Shree Ambika Salon • Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="hover:bg-white/20 p-1.5 rounded-full transition text-white"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <button 
              onClick={clearChat} 
              title="Reset Conversation"
              className="hover:bg-white/20 p-1.5 rounded-full transition text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              title="Close Chat"
              className="hover:bg-white/20 p-1.5 rounded-full transition text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Banner */}
        <div className="bg-[#FFF9FA] px-3.5 py-1.5 border-b border-[#FCE7F0] flex items-center justify-between text-xs text-[#1F2937]">
          <span className="text-[11px] text-[#4B5563]">Need direct human assistance?</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <MessageCircle className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-3.5 overflow-y-auto bg-[#FFF9FA]/40 flex flex-col gap-3 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl ${msg.sender === 'user' ? 'bg-[#FA4D89] text-white rounded-br-xs shadow-sm' : 'bg-white text-[#1F2937] shadow-sm rounded-bl-xs border border-[#FCE7F0]'}`}>
                {msg.isImage && msg.imageUrl ? (
                  <div className="space-y-2">
                    <img src={msg.imageUrl} alt="Uploaded face" className="w-44 h-32 object-cover rounded-xl border border-[#FCE7F0]" />
                    <p className="text-[11px] opacity-90 italic">Uploaded photo for analysis</p>
                  </div>
                ) : (
                  <div className="leading-relaxed">
                    {renderFormattedText(msg.text)}
                  </div>
                )}
                {msg.source && msg.sender === 'ai' && (
                  <div className="mt-2 pt-1 border-t border-gray-100 text-[10px] text-[#4B5563] flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#FA4D89]" />
                    <span>
                      {msg.source === 'gemini' || msg.source === 'gemini-vision' ? 'Powered by AI Beauty Expert' : 'Shree Ambika Beauty Advisor'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm rounded-bl-xs border border-[#FCE7F0] flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#FA4D89] animate-spin" />
                <span className="text-xs text-[#4B5563] italic">Advisor is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-[#FFF9FA] border-t border-[#FCE7F0] overflow-x-auto scrollbar-none flex items-center gap-1.5 whitespace-nowrap">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FFF0F5] border border-[#FCE7F0] rounded-full text-[11px] font-semibold text-[#FA4D89] transition shrink-0"
          >
            <Camera className="w-3 h-3" />
            <span>Skin Photo Scan</span>
          </button>
          {QUICK_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isTyping}
              onClick={() => sendQuery(s.query)}
              className="px-2.5 py-1 bg-white hover:bg-[#FFF0F5] border border-[#FCE7F0] rounded-full text-[11px] font-medium text-[#1F2937] hover:text-[#FA4D89] transition shrink-0 disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-[#FCE7F0] flex items-center gap-2">
          <button 
            type="button"
            onClick={() => photoInputRef.current?.click()}
            title="Upload photo for skin analysis"
            disabled={isTyping}
            className="p-2 text-[#4B5563] hover:text-[#FA4D89] hover:bg-[#FFF0F5] rounded-full transition disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <input 
            type="text" 
            value={input}
            disabled={isTyping}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Ask about treatments, bridal, hair..."
            className="flex-1 px-3.5 py-2.5 bg-[#FFF9FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FA4D89]/30 text-xs sm:text-sm disabled:opacity-60 border border-[#FCE7F0] focus:bg-white transition"
          />
          <button 
            type="button"
            onClick={handleSendText}
            disabled={!input.trim() || isTyping}
            title="Send Message"
            className="p-2.5 bg-[#FA4D89] hover:bg-[#E11D74] text-white rounded-full transition disabled:opacity-50 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAssistantWidget;
