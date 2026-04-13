import { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiUser, FiUsers, FiChevronDown } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useChat } from '../../hooks/useChat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, sendMessage, isConnected, isEscalated, isTyping, requestHumanAssistance, suggestions } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  // Track scroll position for scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format bot messages with markdown-like syntax
  const formatMessage = (text) => {
    if (!text) return null;

    // Split into lines for bullet point handling
    const lines = text.split('\n');
    const elements = [];

    lines.forEach((line, lineIdx) => {
      // Check for bullet points: "* text" or "- text"
      const bulletMatch = line.match(/^\s*[\*\-]\s+(.+)/);
      if (bulletMatch) {
        elements.push(
          <div key={`line-${lineIdx}`} className="flex gap-1.5 ml-1 my-0.5">
            <span className="text-primary-500 mt-0.5 shrink-0">&#8226;</span>
            <span>{formatInline(bulletMatch[1], lineIdx)}</span>
          </div>
        );
      } else if (line.trim()) {
        elements.push(
          <span key={`line-${lineIdx}`}>
            {lineIdx > 0 && elements.length > 0 && <br />}
            {formatInline(line, lineIdx)}
          </span>
        );
      }
    });

    return elements;
  };

  // Format inline markdown: **bold** and _italic_
  const formatInline = (text, keyPrefix = 0) => {
    // Match **bold** and _italic_
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${keyPrefix}-${i}`} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
        return <em key={`${keyPrefix}-${i}`} className="italic text-gray-500 dark:text-slate-400 text-[12px]">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Chat Widget Styles */}
      <style>{`
        @keyframes chat-panel-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chat-panel-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(16px) scale(0.96); }
        }
        @keyframes chat-fab-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3); }
          50% { box-shadow: 0 4px 30px rgba(5, 150, 105, 0.5); }
        }
        @keyframes msg-slide-in-right {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes msg-slide-in-left {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes msg-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes welcome-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-panel-enter {
          animation: chat-panel-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .chat-fab {
          animation: chat-fab-pulse 3s ease-in-out infinite;
        }
        .msg-user { animation: msg-slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .msg-bot { animation: msg-slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .msg-system { animation: msg-fade-in 0.3s ease-out forwards; }
        .welcome-anim { animation: welcome-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .chat-dot {
          animation: dot-pulse 1.4s ease-in-out infinite;
        }
        .chat-dot:nth-child(2) { animation-delay: 0.2s; }
        .chat-dot:nth-child(3) { animation-delay: 0.4s; }

        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 10px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.5); }

        .suggestions-scroll::-webkit-scrollbar { display: none; }
        .suggestions-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
          overscroll-behavior-x: contain;
          touch-action: pan-x;
        }
        .suggestions-scroll > button {
          scroll-snap-align: start;
        }
      `}</style>

      <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
        {isOpen ? (
          <div
            className="chat-panel-enter bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden
              fixed inset-0
              sm:relative sm:inset-auto sm:rounded-2xl sm:w-[400px] sm:h-[600px]
              border-0 sm:border sm:border-gray-200/60 dark:sm:border-slate-700/60"
            role="dialog"
            aria-label="Chat with hospital assistant"
          >
            {/* ============ HEADER ============ */}
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 text-white px-5 py-4 shrink-0">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
              />
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <FaHeart className="w-5 h-5 text-white" />
                    </div>
                    {/* Online indicator */}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-primary-600 ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[15px] tracking-tight">SCH Assistant</h3>
                    <p className="text-[11px] text-primary-100/80 font-medium">
                      {!isConnected ? 'Connecting...' : isEscalated ? 'Connected to staff' : 'Socsargen County Hospital'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors duration-200"
                  aria-label="Close chat"
                >
                  <FiX size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* ============ MESSAGES AREA ============ */}
            <div
              ref={messagesContainerRef}
              className="flex-grow overflow-y-auto px-4 py-4 space-y-3 chat-scrollbar relative"
              style={{ background: 'linear-gradient(180deg, #f8faf9 0%, #ffffff 100%)' }}
            >
              {/* Dark mode bg override */}
              <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                {/* Welcome Screen */}
                {messages.length === 0 && (
                  <div className="welcome-anim flex flex-col items-center text-center pt-6 pb-2">
                    <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                      <span className="text-3xl">👋</span>
                    </div>
                    <h4 className="font-display font-bold text-gray-800 dark:text-slate-100 text-base mb-1">
                      Welcome to SCH!
                    </h4>
                    <p className="text-gray-500 dark:text-slate-400 text-[13px] mb-5 max-w-[260px] leading-relaxed">
                      I can help you find doctors, book appointments, and answer hospital inquiries.
                    </p>
                    {/* Welcome Suggestions Grid */}
                    <div className="w-full grid grid-cols-2 gap-2 px-2">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="group bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 rounded-xl px-3 py-3 text-left
                            hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/20
                            transition-all duration-200 hover:shadow-sm"
                          style={{ animationDelay: `${idx * 80}ms` }}
                        >
                          <span className="text-[13px] font-medium text-gray-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                            {suggestion}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end msg-user' : msg.sender === 'system' ? 'justify-center msg-system' : 'justify-start msg-bot'}`}
                  >
                    {/* System Message */}
                    {msg.sender === 'system' ? (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 rounded-xl px-4 py-2.5 max-w-[85%]">
                        <p className="text-amber-700 dark:text-amber-300 text-[12px] text-center leading-relaxed">{msg.text}</p>
                      </div>
                    ) : (
                      <>
                        {/* Bot Avatar */}
                        {msg.sender !== 'user' && (
                          <div className="w-7 h-7 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-2 mt-1 shrink-0">
                            {msg.sender === 'staff' ? (
                              <FiUser className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                            ) : (
                              <FaHeart className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                            )}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`max-w-[78%] ${
                          msg.sender === 'user'
                            ? 'order-1'
                            : ''
                        }`}>
                          {/* Staff label */}
                          {msg.sender === 'staff' && (
                            <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 mb-1 ml-1">
                              {msg.staffName || 'Staff Member'}
                            </p>
                          )}

                          <div className={`px-3.5 py-2.5 ${
                            msg.sender === 'user'
                              ? 'bg-primary-600 text-white rounded-2xl rounded-br-md shadow-sm shadow-primary-600/20'
                              : msg.sender === 'staff'
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-gray-800 dark:text-slate-200 rounded-2xl rounded-bl-md border border-emerald-200/60 dark:border-emerald-700/40'
                              : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-slate-700/60'
                          }`}>
                            <div className={`text-[13.5px] leading-[1.6] ${
                              msg.sender === 'user' ? 'text-white whitespace-pre-wrap' : ''
                            }`}>
                              {msg.sender === 'user' ? msg.text : formatMessage(msg.text)}
                            </div>
                          </div>
                          {/* Timestamp */}
                          <p className={`text-[10px] mt-1 px-1 ${
                            msg.sender === 'user'
                              ? 'text-right text-gray-400 dark:text-slate-500'
                              : 'text-gray-400 dark:text-slate-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start msg-bot">
                    <div className="w-7 h-7 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-2 mt-1 shrink-0">
                      <FaHeart className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5">
                        <div className="chat-dot w-2 h-2 bg-primary-400 rounded-full" />
                        <div className="chat-dot w-2 h-2 bg-primary-400 rounded-full" />
                        <div className="chat-dot w-2 h-2 bg-primary-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Scroll to bottom button */}
            {showScrollBtn && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-36 right-6 w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-gray-200 dark:border-slate-600 flex items-center justify-center z-20
                  hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200"
                aria-label="Scroll to bottom"
              >
                <FiChevronDown size={16} className="text-gray-500 dark:text-slate-300" />
              </button>
            )}

            {/* ============ SUGGESTIONS + STAFF ============ */}
            {!isEscalated && messages.length > 0 && (
              <div className="shrink-0 border-t border-gray-100 dark:border-slate-700/60 bg-gray-50/80 dark:bg-slate-800/50 py-2.5">
                {/* Horizontal scrollable suggestions with fade edges */}
                <div className="relative">
                  <div className="suggestions-scroll flex gap-2 overflow-x-auto pb-1 px-3">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="shrink-0 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 text-[12px] font-medium
                          px-3.5 py-2 rounded-full border border-gray-200/80 dark:border-slate-600
                          hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50/60 dark:hover:bg-primary-900/20
                          transition-all duration-200 whitespace-nowrap active:scale-95"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  {/* Right fade indicator */}
                  <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-gray-50/90 dark:from-slate-800/90 to-transparent pointer-events-none" />
                </div>

                {/* Talk to staff */}
                {messages.length > 2 && (
                  <button
                    onClick={requestHumanAssistance}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 text-[11px] font-semibold py-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors duration-200"
                  >
                    <FiUsers size={13} />
                    Talk to a staff member
                  </button>
                )}
              </div>
            )}

            {/* ============ INPUT AREA ============ */}
            <form onSubmit={handleSend} className="shrink-0 px-3 pb-3 pt-2 bg-white dark:bg-slate-900 sm:pb-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
              <div className="flex gap-2 items-end">
                <div className="flex-grow relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isEscalated ? "Message staff..." : "Ask about doctors, services..."}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl
                      focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 dark:focus:border-primary-500 focus:bg-white dark:focus:bg-slate-700
                      text-[13.5px] text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500
                      transition-all duration-200 outline-none"
                    disabled={!isConnected}
                    aria-label="Chat message input"
                  />
                </div>
                <button
                  type="submit"
                  className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center
                    hover:bg-primary-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                    active:scale-95 shadow-sm shadow-primary-600/25 shrink-0"
                  disabled={!isConnected || !input.trim()}
                  aria-label="Send message"
                >
                  <FiSend size={16} strokeWidth={2.5} />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-medium tracking-wide">
                {isEscalated ? 'Connected to hospital staff' : 'Socsargen County Hospital'}
              </p>
            </form>
          </div>
        ) : (
          /* ============ FAB BUTTON ============ */
          <button
            onClick={() => setIsOpen(true)}
            className="chat-fab group bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full
              w-14 h-14 sm:w-auto sm:h-auto sm:rounded-2xl sm:px-5 sm:py-3.5
              flex items-center justify-center sm:justify-start gap-0 sm:gap-3
              hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-[1.03] active:scale-95"
            aria-label="Open chat"
          >
            <FaHeart className="w-6 h-6 sm:w-5 sm:h-5" />
            <div className="hidden sm:block text-left">
              <p className="font-display font-semibold text-[13px] leading-tight">Chat with us</p>
              <p className="text-[11px] text-primary-200/80 leading-tight mt-0.5">We're here to help</p>
            </div>
          </button>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
