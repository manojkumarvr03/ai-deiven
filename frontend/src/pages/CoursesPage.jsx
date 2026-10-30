import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { BookOpen, Layers, Code, Play, CheckCircle2, Star, Clock, Filter, Sparkles, ArrowRight, RotateCcw, BrainCircuit, Zap, Target } from 'lucide-react';
import { getStoredProgress, resetProgressToClean, isCourseMcqCompleted } from '../services/courseProgressService';

const COURSES_DATA = [
  {
    id: 'ui-ux',
    title: 'UI/UX Design Masterclass',
    category: 'Design',
    badgeClass: 'badge-design',
    totalLessons: 20,
    rating: 4.9,
    hours: '18 hrs',
    instructor: 'Sarah Jenkins',
    desc: 'Master Figma wireframing, high-fidelity prototypes, user research, and design systems.',
    bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    iconColor: '#7c3aed'
  },
  {
    id: 'react-dev',
    title: 'React Development',
    category: 'Development',
    badgeClass: 'badge-dev',
    totalLessons: 20,
    rating: 4.8,
    hours: '32 hrs',
    instructor: 'David Chan',
    desc: 'Build scalable modern web apps using React 18, Redux Toolkit, Next.js, and TypeScript.',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    iconColor: '#38bdf8'
  },
  {
    id: 'python-data',
    title: 'Python for Data Science & AI',
    category: 'Data Science',
    badgeClass: 'badge-data',
    totalLessons: 20,
    rating: 4.9,
    hours: '28 hrs',
    instructor: 'Dr. Michael Vance',
    desc: 'NumPy, Pandas, Matplotlib, Scikit-learn, and Machine Learning predictive modeling fundamentals.',
    bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    iconColor: '#16a34a'
  },
  {
    id: 'content-strat',
    title: 'Content Strategy & Technical Writing',
    category: 'Design',
    badgeClass: 'badge-design',
    totalLessons: 20,
    rating: 4.7,
    hours: '12 hrs',
    instructor: 'Emily Watson',
    desc: 'Structure comprehensive user guides, API documentation, and brand content strategies.',
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    iconColor: '#d97706'
  }
];

const CoursesPage = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const searchQuery = outletContext?.searchQuery || '';

  const [activeFilter, setActiveFilter] = useState('All');
  const [progressData, setProgressData] = useState(getStoredProgress());

  useEffect(() => {
    const handleUpdate = () => {
      setProgressData(getStoredProgress());
    };
    window.addEventListener('learnify_progress_updated', handleUpdate);
    return () => window.removeEventListener('learnify_progress_updated', handleUpdate);
  }, []);

  const getCourseProgress = (courseId, defaultTotal) => {
    const p = progressData[courseId];
    if (!p) return { completed: 0, total: defaultTotal, percentage: 0 };
    const completed = p.completedLessons?.length || 0;
    const total = p.totalLessons || defaultTotal;
    const percentage = Math.min(100, Math.round((completed / total) * 100));
    return { completed, total, percentage };
  };

  const [resetMessage, setResetMessage] = useState('');

  const handleResetProgress = () => {
    if (window.confirm('Reset all course progress and AI assessments back to 0%?')) {
      const clean = resetProgressToClean();
      setProgressData({ ...clean });
      setResetMessage('All course progress & AI tests reset to 0%!');
      setTimeout(() => setResetMessage(''), 3500);
    }
  };

  const filteredCourses = COURSES_DATA.filter((c) => {
    const matchesFilter = activeFilter === 'All' || c.category === activeFilter;
    const matchesSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Reset Toast Feedback */}
      {resetMessage && (
        <div
          className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-0 rounded-3 shadow-sm border-0"
          style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.88rem' }}
        >
          <div className="d-flex align-items-center gap-2">
            <CheckCircle2 size={18} color="#059669" />
            <span className="fw-semibold">{resetMessage}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            style={{ fontSize: '0.75rem' }}
            onClick={() => setResetMessage('')}
          ></button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="fs-3 fw-bold font-heading" style={{ color: '#0f172a' }}>My Enrolled Courses</h2>
          <p className="text-muted small mb-0">Progress tracks live in real-time as you complete lessons and quizzes</p>
        </div>

        {/* Filter Pills & Reset Action */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {['All', 'Design', 'Development', 'Data Science'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="btn btn-sm"
              style={{
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeFilter === cat ? '#2563eb' : '#ffffff',
                color: activeFilter === cat ? '#ffffff' : '#475569',
                border: activeFilter === cat ? 'none' : '1px solid #e2e8f0',
                boxShadow: activeFilter === cat ? '0 4px 10px rgba(37, 99, 235, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={handleResetProgress}
            className="btn btn-sm btn-light border rounded-pill px-3 text-muted d-flex align-items-center gap-1 shadow-sm"
            title="Reset all course progress to 0%"
          >
            <RotateCcw size={13} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Reset 0%</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="row g-3">
        {filteredCourses.map((c) => {
          const prog = getCourseProgress(c.id, c.totalLessons);
          const aiData = progressData[c.id]?.aiAssessment;
          const isMcqDone = isCourseMcqCompleted(progressData[c.id]);
          const currentLvl = progressData[c.id]?.currentLevel || 1;

          return (
            <div className="col-md-6" key={c.id}>
              <div
                className="learnify-card-wrapper h-100 d-flex flex-column justify-content-between p-4"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={(e) => {
                  if (e.target.closest('button')) return;
                  if (isMcqDone) {
                    navigate(`/dashboard/courses/${c.id}?tab=lesson`);
                  } else {
                    navigate(`/dashboard/courses/${c.id}?tab=assessment&mode=test`);
                  }
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-1.5 flex-wrap">
                      <span className={`learnify-course-badge ${c.badgeClass}`}>{c.category}</span>
                      {isMcqDone && aiData?.score !== undefined ? (
                        <span
                          className="badge rounded-pill fw-bold d-inline-flex align-items-center gap-1"
                          style={{
                            background: '#f3e8ff',
                            color: '#7e22ce',
                            border: '1px solid #e9d5ff',
                            fontSize: '0.72rem',
                            padding: '4px 10px'
                          }}
                        >
                          <BrainCircuit size={12} /> AI Tested: {aiData.score}% ({aiData.masteryTier || 'Calibrated'})
                        </span>
                      ) : !isMcqDone ? (
                        <span
                          className="badge rounded-pill fw-bold d-inline-flex align-items-center gap-1"
                          style={{
                            background: '#fef3c7',
                            color: '#92400e',
                            border: '1px solid #fde68a',
                            fontSize: '0.72rem',
                            padding: '4px 10px'
                          }}
                        >
                          <Clock size={12} /> MCQ Required
                        </span>
                      ) : null}
                    </div>
                    <div className="d-flex align-items-center gap-1 small text-muted">
                      <Star size={14} className="text-warning fill-warning" />
                      <span className="fw-bold" style={{ color: '#0f172a' }}>{c.rating}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="learnify-course-thumb" style={{ background: c.bg, width: '70px', height: '60px' }}>
                      <Layers size={24} color={c.iconColor} />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1" style={{ color: '#0f172a', fontSize: '1.05rem' }}>{c.title}</h5>
                      <div className="small text-muted mb-2">By {c.instructor} • {c.hours}</div>
                    </div>
                  </div>

                  <p className="small text-muted mb-3" style={{ lineHeight: 1.5 }}>
                    {c.desc}
                  </p>
                </div>

                <div>
                  <div className="learnify-progress-row">
                    <span>{prog.completed}/{prog.total} Lessons</span>
                    <span className={`fw-bold ${prog.percentage > 0 ? 'text-primary' : 'text-muted'}`}>
                      {prog.percentage}% Complete
                    </span>
                  </div>
                  <div className="learnify-progress-bar-bg mb-3">
                    <div className="learnify-progress-bar-fill" style={{ width: `${prog.percentage}%` }}></div>
                  </div>

                  {!isMcqDone ? (
                    <button
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill py-2.5 fw-bold shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        border: 'none',
                        fontSize: '0.88rem',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/courses/${c.id}?tab=assessment&mode=test`);
                      }}
                    >
                      <BrainCircuit size={16} />
                      <span>Complete MCQ</span>
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      {aiData ? (
                        <button
                          className="btn btn-sm d-flex align-items-center gap-1.5 rounded-pill px-3 py-1.5 fw-semibold"
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            fontSize: '0.8rem'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/courses/${c.id}?tab=assessment`);
                          }}
                          title="View AI Diagnostic Report & Roadmap"
                        >
                          <BrainCircuit size={14} />
                          <span>AI Roadmap ({aiData.score}%)</span>
                        </button>
                      ) : <div />}

                      <button
                        className="learnify-resume-btn d-flex align-items-center gap-1 ms-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/courses/${c.id}?tab=lesson`);
                        }}
                      >
                        <span>Resume Course</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesPage;

