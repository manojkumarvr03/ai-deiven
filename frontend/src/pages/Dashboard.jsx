import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  CheckCircle2,
  Hourglass,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Bell,
  Code,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { getStoredProgress, isCourseMcqCompleted } from '../services/courseProgressService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.firstName || user?.name || 'Alex';

  // Calendar State
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5); // June (0-indexed)
  const [selectedDay, setSelectedDay] = useState(9);
  const [progressPeriod, setProgressPeriod] = useState('Weekly');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [reminders, setReminders] = useState({ 2: false, 3: false });
  const [progressData, setProgressData] = useState(getStoredProgress());

  // Reload progress when the logged-in user changes (different email/account)
  useEffect(() => {
    setProgressData(getStoredProgress());
  }, [user?._id, user?.id, user?.email]);

  useEffect(() => {
    const handleUpdate = () => {
      setProgressData(getStoredProgress());
    };
    window.addEventListener('learnify_progress_updated', handleUpdate);
    return () => window.removeEventListener('learnify_progress_updated', handleUpdate);
  }, []);

  const getCourseInfo = (courseId, defaultTotal) => {
    const p = progressData[courseId];
    if (!p) return { completed: 0, total: defaultTotal, percentage: 0 };
    const completed = p.completedLessons?.length || 0;
    const total = p.totalLessons || defaultTotal;
    const percentage = Math.min(100, Math.round((completed / total) * 100));
    return { completed, total, percentage };
  };

  const uiuxProg = getCourseInfo('ui-ux', 20);
  const reactProg = getCourseInfo('react-dev', 20);

  // Dynamic KPI Stats calculated in pure real-time
  const totalCompletedLessons = Object.values(progressData).reduce((acc, c) => acc + (c.completedLessons?.length || 0), 0);
  const completedCoursesCount = Object.values(progressData).filter(c => (c.progressPercentage || 0) >= 100).length;
  const totalXP = totalCompletedLessons * 50;
  const learningHours = (totalCompletedLessons * 0.4).toFixed(1);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const toggleReminder = (id) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* ============================================================
          TOP SECTION: HERO BANNER & 4 KPI METRIC CARDS
          ============================================================ */}
      <div className="learnify-dashboard-grid">
        {/* HERO DARK BANNER */}
        <div className="learnify-hero-card">
          <div className="learnify-hero-bg-lines"></div>

          <div className="learnify-hero-content">
            <h2 className="learnify-hero-title">
              Welcome back, {displayName} 👋
            </h2>
            <p className="learnify-hero-sub">
              {totalCompletedLessons > 0
                ? `You've completed ${totalCompletedLessons} lessons. Keep going to hit your weekly learning goal!`
                : 'Start your first interactive lesson to begin tracking real-time mastery!'}
            </p>
            <button
              className="learnify-continue-btn"
              onClick={() => {
                if (uiuxProg.completed > 0) {
                  navigate('/dashboard/courses/ui-ux');
                } else {
                  navigate('/dashboard/courses/ui-ux?tab=assessment');
                }
              }}
            >
              {uiuxProg.completed > 0 ? 'Continue Learning' : 'Start Diagnostic (20 Qs)'}
            </button>
          </div>


          <div className="learnify-hero-rings">
            {/* Ring 1: Streak */}
            <div className="learnify-stat-ring-box">
              <div className="learnify-stat-ring ring-cyan">
                {totalCompletedLessons > 0 ? '7d' : '1d'}
              </div>
              <span className="learnify-stat-ring-label">Current streak</span>
            </div>

            {/* Ring 2: Learning Hours */}
            <div className="learnify-stat-ring-box">
              <div className="learnify-stat-ring ring-purple">
                {learningHours > 0 ? `${learningHours}h` : '0h'}
              </div>
              <span className="learnify-stat-ring-label">Learning hours</span>
            </div>

            {/* Ring 3: XP Points */}
            <div className="learnify-stat-ring-box">
              <div className="learnify-stat-ring ring-teal">
                {totalXP > 0 ? `${totalXP} XP` : '0 XP'}
              </div>
              <span className="learnify-stat-ring-label">XP points</span>
            </div>
          </div>
        </div>

        {/* 2X2 KPI METRIC CARDS */}
        <div className="learnify-kpi-grid">
          {/* 1. Enrolled */}
          <div className="learnify-kpi-card">
            <div className="learnify-kpi-icon">
              <User size={22} />
            </div>
            <div className="learnify-kpi-info">
              <span className="learnify-kpi-label">Enrolled</span>
              <span className="learnify-kpi-value">4</span>
            </div>
          </div>

          {/* 2. Completed */}
          <div className="learnify-kpi-card">
            <div className="learnify-kpi-icon">
              <CheckCircle2 size={22} />
            </div>
            <div className="learnify-kpi-info">
              <span className="learnify-kpi-label">Completed</span>
              <span className="learnify-kpi-value">{completedCoursesCount < 10 ? `0${completedCoursesCount}` : completedCoursesCount}</span>
            </div>
          </div>

          {/* 3. Learning Hours */}
          <div className="learnify-kpi-card">
            <div className="learnify-kpi-icon">
              <Hourglass size={22} />
            </div>
            <div className="learnify-kpi-info">
              <span className="learnify-kpi-label">Learning Hours</span>
              <span className="learnify-kpi-value">{learningHours} hrs</span>
            </div>
          </div>

          {/* 4. Streak */}
          <div className="learnify-kpi-card">
            <div className="learnify-kpi-icon">
              <Flame size={22} />
            </div>
            <div className="learnify-kpi-info">
              <span className="learnify-kpi-label">Streak</span>
              <span className="learnify-kpi-value">{totalCompletedLessons > 0 ? '7 Days' : '1 Day'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          MIDDLE SECTION: CONTINUE LEARNING & CALENDAR
          ============================================================ */}
      <div className="learnify-dashboard-grid">
        {/* CONTINUE LEARNING */}
        <div className="learnify-card-wrapper">
          <div className="learnify-section-header">
            <h3 className="learnify-section-title">Continue Learning</h3>
            <Link to="/dashboard/courses" className="learnify-section-link">
              View My Courses
            </Link>
          </div>

          <div className="learnify-course-list">
            {/* Course 1: UI/UX Design Masterclass */}
            {(() => {
              const uiuxAi = progressData['ui-ux']?.aiAssessment;
              const isUiUxMcqDone = isCourseMcqCompleted(progressData['ui-ux']);
              return (
                <div className="learnify-course-item">
                  <div className="learnify-course-thumb" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Layers size={28} color="#7c3aed" />
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#6d28d9', marginTop: 2 }}>UI / UX</div>
                    </div>
                  </div>

                  <div className="learnify-course-info">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <span className="learnify-course-badge badge-design">Design</span>
                      {isUiUxMcqDone && uiuxAi?.score !== undefined ? (
                        <span
                          className="badge rounded-pill fw-bold d-inline-flex align-items-center gap-1"
                          style={{ background: '#f3e8ff', color: '#7e22ce', fontSize: '0.7rem', padding: '2px 8px' }}
                        >
                          <BrainCircuit size={11} /> AI: {uiuxAi.score}% ({uiuxAi.masteryTier})
                        </span>
                      ) : !isUiUxMcqDone ? (
                        <span className="badge rounded-pill fw-bold text-muted bg-light border" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                          MCQ Pending
                        </span>
                      ) : null}
                    </div>
                    <div className="learnify-course-title">UI/UX Design Masterclass</div>
                    <div className="learnify-progress-row">
                      <span>{uiuxProg.completed}/{uiuxProg.total} Lessons</span>
                      <span className={`fw-bold ${uiuxProg.percentage > 0 ? 'text-primary' : 'text-muted'}`}>
                        {uiuxProg.percentage}% Complete
                      </span>
                    </div>
                    <div className="learnify-progress-bar-bg">
                      <div className="learnify-progress-bar-fill" style={{ width: `${uiuxProg.percentage}%` }}></div>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-1.5">
                    {!isUiUxMcqDone ? (
                      <button
                        className="btn btn-sm btn-primary rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1.5 justify-content-center shadow-sm"
                        style={{ fontSize: '0.82rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', border: 'none' }}
                        onClick={() => navigate('/dashboard/courses/ui-ux?tab=assessment&mode=test')}
                      >
                        <BrainCircuit size={14} />
                        <span>Complete MCQ</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <>
                        <button
                          className="learnify-resume-btn d-flex align-items-center justify-content-center gap-1"
                          onClick={() => navigate('/dashboard/courses/ui-ux?tab=lesson')}
                        >
                          <span>Resume Course</span>
                          <ArrowRight size={13} />
                        </button>
                        {uiuxAi && (
                          <button
                            className="btn btn-sm text-primary p-0 text-decoration-none fw-semibold d-flex align-items-center gap-1 justify-content-center"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => navigate('/dashboard/courses/ui-ux?tab=assessment')}
                          >
                            <BrainCircuit size={12} />
                            <span>AI Study Plan ({uiuxAi.score}%)</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Course 2: React Development */}
            {(() => {
              const reactAi = progressData['react-dev']?.aiAssessment;
              const isReactMcqDone = isCourseMcqCompleted(progressData['react-dev']);
              return (
                <div className="learnify-course-item">
                  <div className="learnify-course-thumb" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Code size={28} color="#38bdf8" />
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>REACT</div>
                    </div>
                  </div>

                  <div className="learnify-course-info">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <span className="learnify-course-badge badge-dev">Development</span>
                      {isReactMcqDone && reactAi?.score !== undefined ? (
                        <span
                          className="badge rounded-pill fw-bold d-inline-flex align-items-center gap-1"
                          style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.7rem', padding: '2px 8px' }}
                        >
                          <BrainCircuit size={11} /> AI: {reactAi.score}%
                        </span>
                      ) : !isReactMcqDone ? (
                        <span className="badge rounded-pill fw-bold text-muted bg-light border" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                          MCQ Pending
                        </span>
                      ) : null}
                    </div>
                    <div className="learnify-course-title">React Development</div>
                    <div className="learnify-progress-row">
                      <span>{reactProg.completed}/{reactProg.total} Lessons</span>
                      <span className={`fw-bold ${reactProg.percentage > 0 ? 'text-primary' : 'text-muted'}`}>
                        {reactProg.percentage}% Complete
                      </span>
                    </div>
                    <div className="learnify-progress-bar-bg">
                      <div className="learnify-progress-bar-fill" style={{ width: `${reactProg.percentage}%` }}></div>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-1.5">
                    {!isReactMcqDone ? (
                      <button
                        className="btn btn-sm btn-primary rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1.5 justify-content-center shadow-sm"
                        style={{ fontSize: '0.82rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', border: 'none' }}
                        onClick={() => navigate('/dashboard/courses/react-dev?tab=assessment&mode=test')}
                      >
                        <BrainCircuit size={14} />
                        <span>Complete MCQ</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <>
                        <button
                          className="learnify-resume-btn d-flex align-items-center justify-content-center gap-1"
                          onClick={() => navigate('/dashboard/courses/react-dev?tab=lesson')}
                        >
                          <span>Resume Course</span>
                          <ArrowRight size={13} />
                        </button>
                        {reactAi && (
                          <button
                            className="btn btn-sm text-primary p-0 text-decoration-none fw-semibold d-flex align-items-center gap-1 justify-content-center"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => navigate('/dashboard/courses/react-dev?tab=assessment')}
                          >
                            <BrainCircuit size={12} />
                            <span>AI Study Plan ({reactAi.score}%)</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>


        {/* CALENDAR WIDGET */}
        <div className="learnify-calendar-card">
          <div className="learnify-cal-header">
            <div className="learnify-cal-month">
              {months[currentMonthIndex]} 09, 2026
            </div>
            <div className="learnify-cal-navs">
              <button
                className="learnify-cal-nav-btn"
                onClick={() => setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1))}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="learnify-cal-nav-btn"
                onClick={() => setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="learnify-cal-weekdays">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          <div className="learnify-cal-days">
            {/* Row 1 */}
            <div className="learnify-cal-day faded">31</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(1)}>01</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(2)}>02</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(3)}>03</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(4)}>04</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(5)}>05</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(6)}>06</div>

            {/* Row 2 */}
            <div className="learnify-cal-day" onClick={() => setSelectedDay(7)}>07</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(8)}>08</div>
            <div
              className={`learnify-cal-day ${selectedDay === 9 ? 'active' : ''}`}
              onClick={() => setSelectedDay(9)}
            >
              09
            </div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(10)}>10</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(11)}>11</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(12)}>12</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(13)}>13</div>

            {/* Row 3 */}
            <div className="learnify-cal-day" onClick={() => setSelectedDay(14)}>14</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(15)}>15</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(16)}>16</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(17)}>17</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(18)}>18</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(19)}>19</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(20)}>20</div>

            {/* Row 4 */}
            <div className="learnify-cal-day" onClick={() => setSelectedDay(21)}>21</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(22)}>22</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(23)}>23</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(24)}>24</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(25)}>25</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(26)}>26</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(27)}>27</div>

            {/* Row 5 */}
            <div className="learnify-cal-day" onClick={() => setSelectedDay(28)}>28</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(29)}>29</div>
            <div className="learnify-cal-day" onClick={() => setSelectedDay(30)}>30</div>
            <div className="learnify-cal-day faded">01</div>
            <div className="learnify-cal-day faded">02</div>
            <div className="learnify-cal-day faded">03</div>
            <div className="learnify-cal-day faded">04</div>
          </div>
        </div>
      </div>

      {/* ============================================================
          BOTTOM SECTION: UPCOMING LIVE CLASSES & LEARNING PROGRESS
          ============================================================ */}
      <div className="learnify-dashboard-grid">
        {/* UPCOMING LIVE CLASSES */}
        <div className="learnify-card-wrapper">
          <div className="learnify-section-header">
            <h3 className="learnify-section-title">Upcoming Live Classes</h3>
            <Link to="/dashboard/live-classes" className="learnify-section-link">
              View All
            </Link>
          </div>

          <table className="learnify-classes-table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Instructor</th>
                <th>Time</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="fw-bold">Advanced Prototyping</td>
                <td className="text-muted">Sarah Jenkins</td>
                <td>
                  <span className="badge-live-tag">
                    <span className="live-dot"></span>
                    LIVE
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn-join-live"
                    onClick={() => navigate('/dashboard/live-classes')}
                  >
                    Join Now
                  </button>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="fw-bold">Redux State Mgmt</td>
                <td className="text-muted">David Chan</td>
                <td className="text-muted">02:30PM</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn-set-reminder"
                    onClick={() => toggleReminder(2)}
                  >
                    {reminders[2] ? 'Reminder Set ✓' : 'Set Reminder'}
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="fw-bold">Content Strategy 101</td>
                <td className="text-muted">Emily Watson</td>
                <td className="text-muted">Tomorrow</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn-set-reminder"
                    onClick={() => toggleReminder(3)}
                  >
                    {reminders[3] ? 'Reminder Set ✓' : 'Set Reminder'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LEARNING PROGRESS (DONUT CHART) */}
        <div className="learnify-progress-card">
          <div className="learnify-section-header">
            <h3 className="learnify-section-title">Learning Progress</h3>
            <div className="position-relative">
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#475569',
                  padding: '4px 12px'
                }}
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              >
                <span>{progressPeriod}</span>
                <ChevronDown size={14} />
              </button>

              {showPeriodDropdown && (
                <div
                  className="position-absolute end-0 mt-1 py-1 rounded-3 shadow-lg"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    zIndex: 20,
                    minWidth: '100px'
                  }}
                >
                  {['Weekly', 'Monthly', 'All Time'].map((item) => (
                    <div
                      key={item}
                      className="px-3 py-1.5 small fw-semibold"
                      style={{
                        cursor: 'pointer',
                        color: progressPeriod === item ? '#2563eb' : '#334155',
                        background: progressPeriod === item ? '#eff6ff' : 'transparent'
                      }}
                      onClick={() => {
                        setProgressPeriod(item);
                        setShowPeriodDropdown(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="learnify-donut-wrapper">
            {/* Donut Chart Legend */}
            <div className="learnify-donut-legend">
              <div className="learnify-legend-item">
                <span className="learnify-legend-color" style={{ background: '#2563eb' }}></span>
                <span>Communication – {uiuxProg.percentage > 0 ? `${uiuxProg.percentage}%` : '60%'}</span>
              </div>
              <div className="learnify-legend-item">
                <span className="learnify-legend-color" style={{ background: '#8b5cf6' }}></span>
                <span>UI Design – {reactProg.percentage > 0 ? `${reactProg.percentage}%` : '24%'}</span>
              </div>
              <div className="learnify-legend-item">
                <span className="learnify-legend-color" style={{ background: '#06b6d4' }}></span>
                <span>Coding – 16%</span>
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div style={{ width: '130px', height: '130px', position: 'relative' }}>
              <svg viewBox="0 0 100 100" width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="11"
                />

                {/* Communication */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="11"
                  strokeDasharray="143.25 238.76"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />

                {/* UI Design */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="11"
                  strokeDasharray="57.30 238.76"
                  strokeDashoffset="-143.25"
                  strokeLinecap="round"
                />

                {/* Coding */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="11"
                  strokeDasharray="38.20 238.76"
                  strokeDashoffset="-200.55"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
