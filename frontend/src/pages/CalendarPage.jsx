import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Video, FileText, HelpCircle, Zap } from 'lucide-react';

const EVENTS = [
  { date: 9,  title: 'Live Class: Advanced Prototyping',        time: '10:00 AM', type: 'live',       instructor: 'Sarah Jenkins' },
  { date: 9,  title: 'Assignment Due: React State Lab',          time: '11:59 PM', type: 'assignment'                             },
  { date: 12, title: 'Live Class: Redux State Mgmt',             time: '02:30 PM', type: 'live',       instructor: 'David Chan'   },
  { date: 15, title: 'Diagnostic Quiz: Component Architecture',  time: '04:00 PM', type: 'quiz'                                   },
  { date: 22, title: 'Final Capstone Project Milestone 1',       time: '05:00 PM', type: 'assignment'                             },
  { date: 26, title: 'Live Class: React Hooks Deep Dive',        time: '11:00 AM', type: 'live',       instructor: 'Emily Watson' },
];

const TYPE_META = {
  live:       { color: '#0071e3', bg: '#dbeafe', label: 'LIVE',       Icon: Video,       dot: '#0071e3', cardBg: '#eff6ff', cardBorder: '#bfdbfe' },
  assignment: { color: '#7c3aed', bg: '#f3e8ff', label: 'ASSIGNMENT', Icon: FileText,    dot: '#7c3aed', cardBg: '#faf5ff', cardBorder: '#e9d5ff' },
  quiz:       { color: '#d97706', bg: '#fef3c7', label: 'QUIZ',       Icon: HelpCircle,  dot: '#f59e0b', cardBg: '#fffbeb', cardBorder: '#fde68a' },
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildDays() {
  const days = [];
  days.push({ day: 31, current: false });
  for (let d = 1; d <= 30; d++) days.push({ day: d, current: true });
  let next = 1;
  while (days.length < 42) days.push({ day: next++, current: false });
  return days;
}

const DAYS = buildDays();

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(5);
  const [selectedDay, setSelectedDay] = useState(9);

  const dayEvents = EVENTS.filter(e => e.date === selectedDay);
  const today = 9;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg,#ffffff 0%,#f0f4ff 100%)',
        border: '1px solid #dbeafe',
        borderRadius: 20,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            background: 'linear-gradient(135deg,#0071e3,#7c3aed)',
            borderRadius: 16,
            padding: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 8px 20px rgba(0,113,227,0.28)',
          }}>
            <CalendarIcon size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e0f2fe', color: '#0284c7', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Zap size={11} />
              <span>Academic Schedule</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
              Academic Calendar &amp; Schedule
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              Track live masterclasses, assignment deadlines, and quizzes
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(TYPE_META).map(([key, m]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, background: m.bg, color: m.color, fontSize: '0.72rem', fontWeight: 700, padding: '5px 12px', borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* CALENDAR CARD */}
        <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.035)', padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
              {MONTHS[currentMonth]} 2026
            </h4>
            <div style={{ display: 'flex', gap: 6 }}>
              {[ChevronLeft, ChevronRight].map((Icon, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentMonth(p => i === 0 ? (p === 0 ? 11 : p - 1) : (p === 11 ? 0 : p + 1))}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0071e3'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0071e3'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Weekdays */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 10 }}>
            {WEEKDAYS.map(w => (
              <div key={w} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', padding: '4px 0' }}>
                {w}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {DAYS.map((cell, idx) => {
              const isSelected = cell.current && cell.day === selectedDay;
              const isToday    = cell.current && cell.day === today;
              const eventTypes = cell.current ? [...new Set(EVENTS.filter(e => e.date === cell.day).map(e => e.type))] : [];

              return (
                <div
                  key={idx}
                  onClick={() => cell.current && setSelectedDay(cell.day)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    cursor: cell.current ? 'pointer' : 'default',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : isToday ? 700 : 500,
                    color: isSelected ? '#ffffff' : !cell.current ? '#cbd5e1' : isToday ? '#0071e3' : '#334155',
                    background: isSelected
                      ? 'linear-gradient(135deg,#0071e3,#3b82f6)'
                      : isToday && !isSelected ? '#eff6ff' : 'transparent',
                    boxShadow: isSelected ? '0 4px 14px rgba(0,113,227,0.35)' : 'none',
                    transition: 'all 0.15s',
                    border: isToday && !isSelected ? '1.5px solid #bfdbfe' : '1.5px solid transparent',
                  }}
                >
                  {cell.day < 10 && cell.current ? `0${cell.day}` : cell.day}
                  {eventTypes.length > 0 && !isSelected && (
                    <div style={{ position: 'absolute', bottom: 5, display: 'flex', gap: 2 }}>
                      {eventTypes.slice(0, 3).map(t => (
                        <span key={t} style={{ width: 5, height: 5, borderRadius: '50%', background: TYPE_META[t]?.dot || '#94a3b8' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Monthly event strip */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              This Month
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EVENTS.map((ev, i) => {
                const m = TYPE_META[ev.type];
                const Icon = m.Icon;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDay(ev.date)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 12,
                      background: selectedDay === ev.date ? m.bg : '#f8fafc',
                      border: `1px solid ${selectedDay === ev.date ? m.cardBorder : '#f1f5f9'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ background: m.bg, borderRadius: 8, padding: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} style={{ color: m.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>June {ev.date < 10 ? `0${ev.date}` : ev.date} · {ev.time}</div>
                    </div>
                    <span style={{ background: m.bg, color: m.color, fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Selected date pill */}
          <div style={{ background: 'linear-gradient(135deg,#0071e3,#3b82f6)', borderRadius: 16, padding: '18px 22px', color: '#ffffff', boxShadow: '0 8px 24px rgba(0,113,227,0.30)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Selected Date</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {MONTHS[currentMonth]} {selectedDay < 10 ? `0${selectedDay}` : selectedDay}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: 4 }}>
              {dayEvents.length === 0 ? 'No events scheduled' : `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''} scheduled`}
            </div>
          </div>

          {/* Event cards */}
          {dayEvents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dayEvents.map((evt, idx) => {
                const m = TYPE_META[evt.type];
                const Icon = m.Icon;
                return (
                  <div
                    key={idx}
                    style={{ background: m.cardBg, border: `1px solid ${m.cardBorder}`, borderRadius: 16, padding: '16px 18px', transition: 'transform 0.15s, box-shadow 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: m.bg, color: m.color, fontSize: '0.68rem', fontWeight: 800, padding: '4px 10px', borderRadius: 999 }}>
                        <Icon size={11} />
                        <span>{m.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                        <Clock size={12} />
                        <span>{evt.time}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, marginBottom: evt.instructor ? 8 : 0 }}>
                      {evt.title}
                    </div>
                    {evt.instructor && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: m.color, color: '#fff', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {evt.instructor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 500 }}>{evt.instructor}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ background: '#f1f5f9', borderRadius: 14, padding: 18, color: '#94a3b8' }}>
                <CalendarIcon size={30} />
              </div>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.92rem' }}>No events today</div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.5 }}>
                No sessions scheduled for this date.<br />Click a date with dots to see events.
              </div>
            </div>
          )}

          {/* Upcoming list */}
          <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Upcoming Events</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EVENTS.filter(e => e.date >= selectedDay).slice(0, 3).map((ev, i) => {
                const m = TYPE_META[ev.type];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>June {ev.date} · {ev.time}</div>
                    </div>
                  </div>
                );
              })}
              {EVENTS.filter(e => e.date >= selectedDay).length === 0 && (
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center', padding: '8px 0' }}>No more events this month</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
