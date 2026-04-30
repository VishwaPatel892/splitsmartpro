import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SparkleIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const BotIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  </div>
);

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I am the SplitSmart AI. Need help navigating or finding something?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      generateResponse(userMessage.text);
    }, 600);
  };

  const generateResponse = (query) => {
    const text = query.toLowerCase();
    let botReply = '';
    let action = null;

    if (text.includes('expense') || text.includes('add')) {
      botReply = 'You can add a new expense directly from your Dashboard. Let me take you there!';
      action = '/dashboard';
    } else if (text.includes('group')) {
      botReply = 'You can manage, create, or join groups on the Groups page. Navigating there now...';
      action = '/groups';
    } else if (text.includes('balance') || text.includes('settle')) {
      botReply = 'Checking who owes what? Head over to the Balances page to settle up.';
      action = '/balance';
    } else if (text.includes('analytics') || text.includes('insight') || text.includes('chart')) {
      botReply = 'You can view your financial breakdown and insights on the Analytics page. Taking you there...';
      action = '/analytics';
    } else if (text.includes('profile') || text.includes('setting')) {
      botReply = 'You can update your account preferences in the Profile settings. Going there now...';
      action = '/profile';
    } else if (text.includes('dashboard') || text.includes('home')) {
      botReply = 'Taking you back to the main dashboard!';
      action = '/dashboard';
    } else {
      botReply = "I'm not sure about that. Try asking me to take you to 'balances', 'groups', 'analytics', or 'add an expense'.";
    }

    setMessages((prev) => [...prev, { id: Date.now(), type: 'bot', text: botReply }]);

    if (action) {
      setTimeout(() => {
        navigate(action);
        // Optionally close the chat when navigating
        // setIsOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed z-50 bottom-24 right-4 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[400px] max-h-[80vh] flex flex-col 
                       bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BotIcon />
                <div>
                  <h3 className="text-white font-bold text-sm">SplitSmart AI</h3>
                  <p className="text-indigo-200 text-xs">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'bot' && <BotIcon />}
                  <div 
                    className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none ml-2' 
                        : 'bg-[#1E293B] text-[#E2E8F0] border border-white/5 rounded-bl-none ml-2 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-[#1E293B]/50 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me to navigate..."
                  className="w-full bg-[#0F172A] border border-[#334155] text-white text-sm rounded-full pl-4 pr-12 py-2.5 
                             focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-[#64748B]"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#334155] disabled:cursor-not-allowed rounded-full text-white transition-colors"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white focus:outline-none"
      >
        {isOpen ? <CloseIcon /> : <SparkleIcon />}
      </motion.button>
    </div>
  );
}
