import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Zap, Shield, TrendingUp, Code } from 'lucide-react';
import bot from '../assets/bot.png';
import bot1 from '../assets/bot1.png';
import bot3 from '../assets/bot3.png';

const StunningChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Welcome to the future of AI assistance! 🚀 How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fetchBotReply = async (userText: string): Promise<string> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are BIMA Assistant, a helpful assistant for a land marketplace. Be concise and friendly.' },
            { role: 'user', content: userText }
          ]
        })
      });
      if (!res.ok) {
        let details: any = undefined;
        try {
          details = await res.json();
        } catch {}
        console.error('Chat backend error payload:', details || (await res.text()));
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      return data.reply || 'Sorry, I could not generate a response.';
    } catch (err) {
      console.error('Chat error:', err);
      return 'Sorry, I had trouble reaching the AI service. Please try again.';
    }
  };

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = { 
      text: inputMessage, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    try {
      const botText = await fetchBotReply(userMessage.text);
      const botMessage = { 
        text: botText, 
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const botMessage = { 
        text: 'Sorry, I had trouble reaching the AI service. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: <Sparkles className="w-4 h-4" />, text: "AI Features", gradient: "from-purple-500 via-pink-500 to-red-500" },
    { icon: <Code className="w-4 h-4" />, text: "Code Help", gradient: "from-blue-500 via-cyan-500 to-teal-500" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Analytics", gradient: "from-green-500 via-emerald-500 to-teal-500" },
  ];

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.3); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.5); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.4s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.4s ease-out;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }

        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }

        .message-hover:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `}</style>



      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          {/* Animated Rings */}
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse-ring"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
            </>
          )}
          
          {/* Main Button */}
          <button
            onClick={toggleChat}
            className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white p-5 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-110 active:scale-95 animate-gradient-shift animate-glow"
            aria-label="Toggle chat"
          >
            <div className="relative">
              {isOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <MessageSquare className="w-7 h-7" />
              )}
            </div>
          </button>
        </div>
        
        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce shadow-lg">
            AI
          </div>
        )}
      </div>
      
      {/* Chat Interface */}
      <div className={`fixed bottom-28 right-8 w-full max-w-[400px] rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 z-50 transform ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
      }`}>
        {/* Glass Effect Container */}
        <div className="glass-effect backdrop-blur-2xl">
          {/* Chat Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-shift text-white p-6 overflow-hidden">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
              }}></div>
            </div>

            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {/* AI Avatar with Hacker Image */}
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 animate-glow">
                    <div className="w-full h-full bg-black rounded-2xl overflow-hidden">
                      <img 
                        src={bot} 
                        alt="BIMA Assistant"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-shadow-glow">BIMA Assistant</h2>
                  <div className="flex items-center gap-2 text-xs text-purple-100">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online • Powered by BIMA</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={toggleChat} 
                className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 transform hover:rotate-180 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-5 bg-gradient-to-b from-purple-50/50 to-transparent backdrop-blur-sm">
              <p className="text-xs font-semibold text-purple-900 mb-3 uppercase tracking-wide">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputMessage(action.text)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${action.gradient} text-white text-sm font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300`}
                  >
                    {action.icon}
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat Messages */}
          <div className="h-[420px] overflow-y-auto p-6 bg-gradient-to-b from-white/95 to-purple-50/95 backdrop-blur-xl">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 flex items-end gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse animate-slide-in-right' : 'flex-row animate-slide-in-left'
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500' 
                    : 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 p-0.5'
                }`}>
                  {message.sender === 'user' ? (
                    <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                      <img 
                        src={bot3} 
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                      <img 
                        src={bot1} 
                        alt="Bot"
                        className="w-full h-full object-cover opacity-70"
                      />
                    </div>
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-[75%] flex flex-col ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`p-4 rounded-2xl shadow-lg message-hover transition-all duration-300 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border-2 border-purple-100'
                  }`}>
                    <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 px-2 font-medium">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="mb-6 flex items-end gap-3 animate-slide-in-left">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 shadow-lg p-0.5">
                  <div className="w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                    <img 
                      src={bot} 
                      alt="Bot"
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-lg border-2 border-purple-100">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce"></div>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-5 bg-white/95 backdrop-blur-xl border-t-2 border-purple-100">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-1 transition-all duration-300 focus-within:ring-4 focus-within:ring-purple-300 focus-within:shadow-xl">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent px-5 py-3 focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                className={`p-3.5 rounded-xl transition-all duration-300 transform ${
                  inputMessage.trim() 
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95 animate-gradient-shift' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Footer Info */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-purple-500" />
                <span>Encrypted & Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StunningChatbot;
