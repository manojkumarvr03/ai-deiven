import React, { useState, useEffect, useRef } from 'react';
import { Radio, Play, Users, Calendar, Clock, Video, CheckCircle, Send, MessageSquare, Volume2, Mic, Settings } from 'lucide-react';

const LIVE_SESSIONS = [
  {
    id: 1,
    title: 'Advanced Prototyping in Figma & Framer',
    instructor: 'Sarah Jenkins',
    role: 'Principal Product Designer at DesignX',
    status: 'LIVE',
    viewers: 142,
    time: 'Happening Now',
    tags: ['UI/UX', 'Interactive Components', 'Figma Variants']
  },
  {
    id: 2,
    title: 'Redux State Management & RTK Query Architecture',
    instructor: 'David Chan',
    role: 'Senior Frontend Architect',
    status: 'UPCOMING',
    time: 'Today • 02:30 PM',
    tags: ['React', 'Redux', 'State Optimization']
  },
  {
    id: 3,
    title: 'Content Strategy 101 & Information Hierarchy',
    instructor: 'Emily Watson',
    role: 'Lead UX Content Strategist',
    status: 'UPCOMING',
    time: 'Tomorrow • 11:00 AM',
    tags: ['UX Writing', 'Content Systems', 'User Journeys']
  },
  {
    id: 4,
    title: 'Deep Dive: Microservices with Node.js & Docker',
    instructor: 'Alex Thorne',
    role: 'Cloud Solutions Engineer',
    status: 'UPCOMING',
    time: 'Thursday • 04:00 PM',
    tags: ['Backend', 'Docker', 'REST API']
  }
];

const INITIAL_LIVE_CHATS = [
  { user: 'Liam K.', text: 'Is Auto-Layout compatible with responsive breakpoints in Framer?', time: 'Just now' },
  { user: 'Maya R.', text: 'The component variants trick saved so much time!', time: '1m ago' },
  { user: 'Sarah Jenkins (Host)', text: 'Yes Liam! In level 3 we demonstrate the exact Framer bridge plugin.', time: 'Just now' }
];

const LiveClassesPage = () => {
  const [activeSession, setActiveSession] = useState(LIVE_SESSIONS[0]);
  const [isJoined, setIsJoined] = useState(false);
  const [reminderSet, setReminderSet] = useState({});
  const [viewerCount, setViewerCount] = useState(142);
  const [chatMessages, setChatMessages] = useState(INITIAL_LIVE_CHATS);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Live viewer counter subtle simulation
  useEffect(() => {
    if (!isJoined) return;
    const interval = setInterval(() => {
      setViewerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isJoined]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendLiveChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      user: 'You (Alex)',
      text: chatInput.trim(),
      time: 'Just now'
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="fs-3 fw-bold font-heading" style={{ color: '#0f172a' }}>Live Interactive Masterclasses</h2>
          <p className="text-muted small mb-0">Join live mentor workshops with real-time audio, Q&A, and live coding demos</p>
        </div>
      </div>

      {/* Featured Live Player */}
      <div className="learnify-card-wrapper p-4" style={{ background: '#090e17', color: '#ffffff' }}>
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <div
              className="rounded-4 position-relative overflow-hidden d-flex flex-column justify-content-between"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                aspectRatio: '16 / 9',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px'
              }}
            >
              {/* Top Stream Indicators */}
              <div className="d-flex align-items-center justify-content-between">
                <span className="badge-live-tag">
                  <span className="live-dot"></span> {isJoined ? 'BROADCASTING LIVE' : 'LIVE NOW'}
                </span>
                <span className="badge bg-dark border text-white small d-flex align-items-center gap-1">
                  <Users size={12} /> {viewerCount} Scholars in Stream
                </span>
              </div>

              {/* Center Content */}
              <div className="text-center my-auto">
                <h4 className="fw-bold text-white mb-1">{activeSession.title}</h4>
                <p className="text-muted small mb-3">Host: {activeSession.instructor} • {activeSession.role}</p>

                {isJoined ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span className="badge bg-success rounded-pill px-3 py-1.5">Audio & Video Connected</span>
                  </div>
                ) : (
                  <button
                    className="learnify-continue-btn d-inline-flex align-items-center gap-2"
                    onClick={() => setIsJoined(true)}
                  >
                    <Play size={16} fill="#ffffff" /> Enter Live Classroom
                  </button>
                )}
              </div>

              {/* Stream Controls */}
              {isJoined && (
                <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary">
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-dark rounded-circle p-2" title="Audio"><Volume2 size={15} /></button>
                    <button className="btn btn-sm btn-dark rounded-circle p-2" title="Microphone"><Mic size={15} /></button>
                  </div>
                  <button
                    className="btn btn-danger btn-sm rounded-pill px-3"
                    onClick={() => setIsJoined(false)}
                  >
                    Leave Room
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Chat or Info */}
          <div className="col-lg-5">
            {isJoined ? (
              <div className="d-flex flex-column h-100" style={{ maxHeight: '340px' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold small text-white d-flex align-items-center gap-1">
                    <MessageSquare size={14} /> Live Stream Chat
                  </span>
                  <span className="badge bg-success small">Active</span>
                </div>

                <div className="flex-grow-1 overflow-auto d-flex flex-column gap-2 p-2 rounded-3 mb-2" style={{ background: 'rgba(255,255,255,0.04)', maxHeight: '230px' }}>
                  {chatMessages.map((c, i) => (
                    <div key={i} className="small">
                      <strong style={{ color: c.user.includes('Sarah') ? '#38bdf8' : (c.user.includes('You') ? '#10b981' : '#f8fafc') }}>
                        {c.user}:
                      </strong>{' '}
                      <span className="text-light">{c.text}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendLiveChat} className="d-flex gap-1">
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-pill"
                    placeholder="Ask instructor a question..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm rounded-circle p-2">
                    <Send size={13} />
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge-live-tag"><span className="live-dot"></span> LIVE CLASSROOM</span>
                </div>
                <h3 className="fw-bold mb-2 text-white">{activeSession.title}</h3>
                <p className="text-muted small mb-3">
                  Led by <strong>{activeSession.instructor}</strong> ({activeSession.role}).
                </p>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {activeSession.tags.map((t) => (
                    <span key={t} className="badge bg-secondary rounded-pill px-3 py-1 text-white small">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="fw-bold small text-white mb-1">Live Benefits:</div>
                  <div className="text-muted small">• Ask live voice/chat questions</div>
                  <div className="text-muted small">• Real-time mentor code review</div>
                  <div className="text-muted small">• Automatic +100 XP completion bonus</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class Schedule Grid */}
      <h4 className="fw-bold font-heading mt-2" style={{ color: '#0f172a' }}>Upcoming Sessions Schedule</h4>
      <div className="row g-3">
        {LIVE_SESSIONS.map((session) => (
          <div className="col-md-6" key={session.id}>
            <div className="learnify-card-wrapper h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className={session.status === 'LIVE' ? 'badge-live-tag' : 'badge bg-light text-dark border'}>
                    {session.status === 'LIVE' && <span className="live-dot"></span>}
                    {session.status}
                  </span>
                  <span className="small text-muted d-flex align-items-center gap-1">
                    <Clock size={14} /> {session.time}
                  </span>
                </div>

                <h5 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{session.title}</h5>
                <div className="small text-muted mb-3">{session.instructor} • {session.role}</div>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <div className="d-flex gap-1">
                  {session.tags.slice(0, 2).map(t => (
                    <span key={t} className="badge bg-light text-muted small border">{t}</span>
                  ))}
                </div>

                {session.status === 'LIVE' ? (
                  <button
                    className="btn-join-live"
                    onClick={() => {
                      setActiveSession(session);
                      setIsJoined(true);
                    }}
                  >
                    Join Now
                  </button>
                ) : (
                  <button
                    className="btn-set-reminder"
                    onClick={() => setReminderSet(p => ({ ...p, [session.id]: !p[session.id] }))}
                  >
                    {reminderSet[session.id] ? 'Reminder Set ✓' : 'Set Reminder'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveClassesPage;
