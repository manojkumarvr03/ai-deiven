import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User, Search, Paperclip, CheckCheck, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'UI/UX Lead Instructor',
    avatar: 'SJ',
    lastMessage: 'Great job on the wireframe assignment! Check the feedback rubric.',
    time: '10:45 AM',
    unread: 0,
    online: true,
    messages: [
      { sender: 'them', text: 'Hi Alex! Have you reviewed module 4 regarding design tokens and WCAG AAA accessibility?', time: '10:30 AM' },
      { sender: 'me', text: 'Yes Sarah! I just completed the component library test and Auto-Layout lessons.', time: '10:38 AM' },
      { sender: 'them', text: 'Great job! I saw your real-time progress update. Let me know if you need help with micro-animations.', time: '10:45 AM' }
    ]
  },
  {
    id: 2,
    name: 'David Chan',
    role: 'React Architecture Mentor',
    avatar: 'DC',
    lastMessage: 'Let me know if you need help debugging the custom hook useEffect loop.',
    time: 'Yesterday',
    unread: 0,
    online: true,
    messages: [
      { sender: 'them', text: 'Hello! I noticed you are working on the React 18 & Next.js mastery track. Let me know if you need any feedback on state immutability.', time: 'Yesterday' }
    ]
  },
  {
    id: 3,
    name: 'Learnify AI Mentor',
    role: '24/7 Intelligent Learning Assistant',
    avatar: 'AI',
    lastMessage: 'I am ready to answer any questions about your active courses.',
    time: 'Just now',
    unread: 0,
    online: true,
    messages: [
      { sender: 'them', text: 'Welcome! I am your real-time AI study assistant. Ask me anything about Figma, React, Python, or exam concepts.', time: 'Just now' }
    ]
  }
];

const MENTOR_RESPONSES = [
  "Excellent question! In production architectures, always prioritize decoupling state from side effects.",
  "I just reviewed your progress! You're making swift headway through this module.",
  "That looks right on track! Make sure to test the edge cases in your assessment before submitting.",
  "Great question! Remember that Auto-Layout in Figma maps 1:1 with CSS Flexbox in frontend code.",
  "Awesome work! You've unlocked bonus XP for active participation today."
];

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(1);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv.messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsg = {
      sender: 'me',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: userText,
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputMsg('');
    setIsTyping(true);

    // Simulate real-time mentor reply
    setTimeout(() => {
      setIsTyping(false);
      const replyText = MENTOR_RESPONSES[Math.floor(Math.random() * MENTOR_RESPONSES.length)];
      const replyMsg = {
        sender: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: replyText,
            time: 'Just now',
            messages: [...c.messages, replyMsg]
          };
        }
        return c;
      }));
    }, 1400);
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <h2 className="fs-3 fw-bold font-heading" style={{ color: '#0f172a' }}>Real-Time Mentorship & Messaging</h2>
        <p className="text-muted small mb-0">Direct real-time 1-on-1 interaction with instructors and academic advisors</p>
      </div>

      <div className="learnify-card-wrapper p-0 overflow-hidden" style={{ minHeight: '560px' }}>
        <div className="row g-0">
          {/* Left: Chat list */}
          <div className="col-md-4 border-end" style={{ borderColor: '#edf2f7' }}>
            <div className="p-3 border-bottom" style={{ borderColor: '#edf2f7' }}>
              <div className="learnify-search-box w-100" style={{ maxWidth: '100%', padding: '8px 14px' }}>
                <Search size={16} color="#94a3b8" />
                <input type="text" className="learnify-search-input small" placeholder="Search chats..." />
              </div>
            </div>

            <div className="d-flex flex-column">
              {conversations.map((conv) => {
                const isActive = activeConv.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className="p-3 d-flex align-items-center gap-3"
                    style={{
                      cursor: 'pointer',
                      background: isActive ? '#eff6ff' : 'transparent',
                      borderLeft: isActive ? '3.5px solid #2563eb' : '3.5px solid transparent',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div className="position-relative">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                        style={{
                          width: '42px',
                          height: '42px',
                          background: conv.id === 1 ? '#2563eb' : (conv.id === 2 ? '#7c3aed' : '#059669'),
                          fontSize: '0.85rem'
                        }}
                      >
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <span
                          className="position-absolute bottom-0 end-0 rounded-circle"
                          style={{ width: '10px', height: '10px', background: '#10b981', border: '2px solid #ffffff' }}
                        ></span>
                      )}
                    </div>

                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="fw-bold small text-truncate" style={{ color: '#0f172a' }}>{conv.name}</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>{conv.time}</span>
                      </div>
                      <div className="text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Message Window */}
          <div className="col-md-8 d-flex flex-column" style={{ minHeight: '560px' }}>
            {/* Chat header */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: '#edf2f7', background: '#f8fafc' }}>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: '38px',
                    height: '38px',
                    background: activeConv.id === 1 ? '#2563eb' : (activeConv.id === 2 ? '#7c3aed' : '#059669'),
                    fontSize: '0.85rem'
                  }}
                >
                  {activeConv.avatar}
                </div>
                <div>
                  <div className="fw-bold small d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                    <span>{activeConv.name}</span>
                    <span className="badge bg-success-subtle text-success small">Online</span>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>{activeConv.role}</div>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="p-4 flex-grow-1 d-flex flex-column gap-3 overflow-auto" style={{ background: '#ffffff', maxHeight: '380px' }}>
              {activeConv.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`d-flex ${m.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className="p-3 rounded-4"
                    style={{
                      maxWidth: '75%',
                      background: m.sender === 'me' ? '#2563eb' : '#f1f5f9',
                      color: m.sender === 'me' ? '#ffffff' : '#0f172a',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>{m.text}</div>
                    <div
                      className="text-end mt-1 d-flex align-items-center justify-content-end gap-1"
                      style={{ fontSize: '0.65rem', opacity: 0.8 }}
                    >
                      <span>{m.time}</span>
                      {m.sender === 'me' && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="d-flex justify-content-start">
                  <div className="p-2 px-3 rounded-pill bg-light text-muted small d-flex align-items-center gap-1 border">
                    <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
                    <span>{activeConv.name} is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-top d-flex align-items-center gap-2" style={{ borderColor: '#edf2f7' }}>
              <input
                type="text"
                className="form-control rounded-pill small py-2 px-3"
                placeholder="Type your message to instructor (Instant real-time reply)..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ background: '#2563eb', border: 'none', width: '40px', height: '40px', flexShrink: 0 }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
