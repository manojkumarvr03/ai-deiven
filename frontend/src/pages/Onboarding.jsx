import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  BrainCircuit,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Unlock,
  Clock,
  Layers,
  Search,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const PATHS = [
  {
    id: 'school',
    title: 'School Education',
    label: 'School',
    icon: '🏫',
    badge: 'Classes 1–12',
    description: 'Foundational numeracy, sciences, mathematics, and board exam preparation.'
  },
  {
    id: 'college',
    title: 'College & University',
    label: 'College',
    icon: '🎓',
    badge: 'Degree Programs',
    description: 'Undergraduate and postgraduate degrees including BCA, B.Sc CS, B.Tech, MCA, and MBA.'
  },
  {
    id: 'diploma',
    title: 'Diploma Studies',
    label: 'Diploma',
    icon: '📚',
    badge: 'Diploma Courses',
    description: 'Practical polytechnic engineering curriculum in Computer, IT, Mechanical, and Civil.'
  },
  {
    id: 'programming',
    title: 'Programming & Tech',
    label: 'Programming',
    icon: '💻',
    badge: 'Coding & Skills',
    description: 'Hands-on language mastery in Python, Java, C++, JavaScript, React, SQL, and DSA.'
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(user?.studyRole || 'programming');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch courses dynamically from MongoDB / Backend whenever selectedRole changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      setErrorMsg('');
      try {
        const res = await API.get(`/education/courses?studyRole=${selectedRole}`);
        if (res.data.success) {
          setCourses(res.data.courses || []);
          // Pre-select first course if available
          if (res.data.courses.length > 0) {
            setSelectedCourse(res.data.courses[0]);
          } else {
            setSelectedCourse(null);
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setErrorMsg('Failed to load courses from server. Please check your connection.');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [selectedRole]);

  // Handle path confirmation
  const handleNextToCourses = () => {
    setStep(2);
  };

  // Handle course confirmation
  const handleNextToSummary = () => {
    if (!selectedCourse) {
      setErrorMsg('Please select a course to continue.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  // Final Complete Onboarding Submission
  const handleCompleteOnboarding = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await API.post('/onboarding/complete', {
        studyRole: selectedRole,
        courseCode: selectedCourse.code,
        courseTitle: selectedCourse.title,
        educationLevel: selectedCourse.category
      });

      if (res.data.success) {
        if (res.data.user) {
          updateUser(res.data.user);
        }
        navigate('/dashboard');
      } else {
        setErrorMsg(res.data.message || 'Could not complete onboarding.');
      }
    } catch (err) {
      console.error('Onboarding Error:', err);
      setErrorMsg(err.response?.data?.message || 'Server error completing setup.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered courses for Step 2
  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  // Group by category
  const categories = Array.from(new Set(filteredCourses.map((c) => c.category)));

  return (
    <div
      className="min-vh-100 py-4 py-lg-5 px-3 d-flex align-items-center justify-content-center"
      style={{ background: 'radial-gradient(circle at 10% 20%, #e0f2fe 0%, #f0f7ff 50%, #edf6ff 100%)' }}
    >
      <Container style={{ maxWidth: '1020px' }}>
        {/* Top Branding */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <div
              className="p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm"
              style={{ background: '#0284c7', width: '38px', height: '38px' }}
            >
              <BrainCircuit size={22} className="text-white" />
            </div>
            <span className="fs-4 fw-bold font-heading" style={{ color: '#0f172a' }}>
              Edura<span style={{ color: '#0284c7' }}>.AI</span>
            </span>
          </div>
          <h1 className="fs-3 fw-extrabold font-heading mb-1" style={{ color: '#0f172a' }}>
            Choose Your Learning Path
          </h1>
          <p className="text-muted small mb-0">
            Welcome, <strong style={{ color: '#0284c7' }}>{user?.firstName || user?.name || 'Scholar'}</strong> 👋 Let's personalize your educational journey and unlock your first modules.
          </p>
        </div>

        {/* Step Indicator Wizard */}
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="d-flex align-items-center gap-2 gap-sm-3 bg-white px-3 py-2 rounded-pill shadow-sm border" style={{ borderColor: '#dbeafe' }}>
            <div className={`d-flex align-items-center gap-2 px-3 py-1 rounded-pill ${step === 1 ? 'bg-primary text-white fw-bold' : step > 1 ? 'text-success fw-bold' : 'text-muted'}`} style={{ fontSize: '0.8rem' }}>
              <span>1</span>
              <span className="d-none d-sm-inline">Education Path</span>
            </div>

            <span className="text-muted">━</span>

            <div className={`d-flex align-items-center gap-2 px-3 py-1 rounded-pill ${step === 2 ? 'bg-primary text-white fw-bold' : step > 2 ? 'text-success fw-bold' : 'text-muted'}`} style={{ fontSize: '0.8rem' }}>
              <span>2</span>
              <span className="d-none d-sm-inline">Select Course</span>
            </div>

            <span className="text-muted">━</span>

            <div className={`d-flex align-items-center gap-2 px-3 py-1 rounded-pill ${step === 3 ? 'bg-primary text-white fw-bold' : 'text-muted'}`} style={{ fontSize: '0.8rem' }}>
              <span>3</span>
              <span className="d-none d-sm-inline">Start Learning</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <Alert variant="danger" className="d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-3 border-0" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
            <AlertCircle size={18} />
            <span className="small fw-semibold">{errorMsg}</span>
          </Alert>
        )}

        {/* Main Content Box */}
        <div
          className="p-4 p-md-5 rounded-4 shadow-sm"
          style={{ background: '#ffffff', border: '1px solid #dbeafe' }}
        >
          {/* ========================================================================= */}
          {/* STEP 1: CHOOSE / CONFIRM EDUCATION PATH */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div>
              <div className="text-center mb-4">
                <div className="badge-blue d-inline-block mb-2">STEP 1 OF 3</div>
                <h3 className="fs-4 fw-bold font-heading mb-1" style={{ color: '#0f172a' }}>
                  Select Your Educational Category
                </h3>
                <p className="text-muted small">
                  We've highlighted your registration choice. You can confirm or choose a different path below.
                </p>
              </div>

              <Row className="g-3 mb-4">
                {PATHS.map((path) => {
                  const isSelected = selectedRole === path.id;
                  return (
                    <Col md={6} key={path.id}>
                      <div
                        onClick={() => setSelectedRole(path.id)}
                        className="p-3 p-md-4 rounded-3 h-100 d-flex flex-column justify-content-between position-relative"
                        style={{
                          background: isSelected ? 'linear-gradient(145deg, #f0f8ff 0%, #e3f2fd 100%)' : '#f8fafc',
                          border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 8px 25px rgba(2, 132, 199, 0.16)' : 'none'
                        }}
                      >
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-3">
                            <span style={{ fontSize: '2rem' }}>{path.icon}</span>
                            <div>
                              <h5 className="fw-bold mb-0 font-heading" style={{ color: isSelected ? '#0284c7' : '#0f172a' }}>
                                {path.title}
                              </h5>
                              <span className="badge" style={{ background: isSelected ? '#bae6fd' : '#e2e8f0', color: isSelected ? '#0369a1' : '#64748b', fontSize: '0.72rem' }}>
                                {path.badge}
                              </span>
                            </div>
                          </div>

                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '24px',
                              height: '24px',
                              border: isSelected ? '2px solid #0284c7' : '2px solid #cbd5e1',
                              background: isSelected ? '#0284c7' : 'transparent',
                              color: '#ffffff'
                            }}
                          >
                            {isSelected && <Check size={14} />}
                          </div>
                        </div>

                        <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                          {path.description}
                        </p>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              <div className="d-flex justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                <button
                  type="button"
                  onClick={handleNextToCourses}
                  className="btn-academic-blue px-4 py-2"
                  style={{ width: 'auto' }}
                >
                  <span>Continue to Courses</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: CHOOSE SPECIFIC COURSE / CLASS / DEGREE */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                  <div className="badge-blue d-inline-block mb-1">STEP 2 OF 3</div>
                  <h3 className="fs-4 fw-bold font-heading mb-0" style={{ color: '#0f172a' }}>
                    Choose Your Specific Course or Class
                  </h3>
                  <p className="text-muted small mb-0">
                    Showing available programs for <strong className="text-capitalize" style={{ color: '#0284c7' }}>{selectedRole}</strong>
                  </p>
                </div>

                {/* Quick Search */}
                <div className="position-relative" style={{ minWidth: '240px' }}>
                  <input
                    type="text"
                    className="academic-input py-2"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: '0.88rem' }}
                  />
                  <Search
                    size={16}
                    className="position-absolute"
                    style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}
                  />
                </div>
              </div>

              {loadingCourses ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2 text-muted small">Loading course catalog from database...</div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <BookOpen size={40} className="mb-2 text-muted" />
                  <div className="fw-semibold">No courses matched your query.</div>
                  <div className="small">Try a different search term or change your study path.</div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4 mb-4">
                  {categories.map((category) => (
                    <div key={category}>
                      <div className="d-flex align-items-center gap-2 mb-2 pb-1 border-bottom" style={{ borderColor: '#e2e8f0' }}>
                        <span className="fw-bold small text-uppercase" style={{ color: '#64748b', letterSpacing: '0.04em', fontSize: '0.75rem' }}>
                          {category}
                        </span>
                      </div>

                      <Row className="g-3">
                        {filteredCourses
                          .filter((c) => c.category === category)
                          .map((course) => {
                            const isSelected = selectedCourse?.code === course.code;
                            const moduleCount = course.modules?.length || 0;
                            return (
                              <Col md={6} key={course.code}>
                                <div
                                  onClick={() => setSelectedCourse(course)}
                                  className="p-3 rounded-3 h-100 position-relative"
                                  style={{
                                    background: isSelected ? '#edf4fe' : '#ffffff',
                                    border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.18s ease',
                                    boxShadow: isSelected ? '0 6px 20px rgba(2, 132, 199, 0.14)' : 'none'
                                  }}
                                >
                                  <div className="d-flex align-items-start gap-3">
                                    <div
                                      className="rounded-3 p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                      style={{
                                        background: isSelected ? '#dbeafe' : '#f1f5f9',
                                        fontSize: '1.4rem',
                                        width: '42px',
                                        height: '42px'
                                      }}
                                    >
                                      {course.icon || '📚'}
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="fw-bold mb-0 text-truncate" style={{ color: isSelected ? '#0284c7' : '#0f172a' }}>
                                          {course.title}
                                        </h6>
                                        {isSelected && (
                                          <CheckCircle2 size={18} style={{ color: '#0284c7' }} />
                                        )}
                                      </div>

                                      <p className="text-muted small mb-2 text-truncate-2" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                                        {course.description}
                                      </p>

                                      <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '0.72rem' }}>
                                        <span className="badge rounded-pill bg-light text-dark border">
                                          <Layers size={11} className="me-1" /> {moduleCount} Levels
                                        </span>
                                        <span className="badge rounded-pill bg-light text-dark border">
                                          <Clock size={11} className="me-1" /> {course.estimatedHours || 20}h Est.
                                        </span>
                                        <span className="badge-purple py-0 px-2" style={{ fontSize: '0.7rem' }}>
                                          {course.difficulty || 'Beginner'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                      </Row>
                    </div>
                  ))}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn d-flex align-items-center gap-2 py-2 px-3 fw-semibold rounded-3"
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                >
                  <ArrowLeft size={16} />
                  <span>Change Path</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextToSummary}
                  disabled={!selectedCourse}
                  className="btn-academic-blue px-4 py-2"
                  style={{ width: 'auto' }}
                >
                  <span>Continue to Overview</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: CONFIRM & LAUNCH PROGRESSION */}
          {/* ========================================================================= */}
          {step === 3 && selectedCourse && (
            <div>
              <div className="text-center mb-4">
                <div className="badge-emerald d-inline-block mb-2">STEP 3 OF 3 • READY TO LAUNCH</div>
                <h3 className="fs-4 fw-bold font-heading mb-1" style={{ color: '#0f172a' }}>
                  Your Learning Curriculum is Calibrated
                </h3>
                <p className="text-muted small">
                  Level 1 will unlock immediately. Complete lesson quizzes to automatically unlock subsequent levels!
                </p>
              </div>

              {/* Course Overview Card */}
              <div
                className="p-4 rounded-3 mb-4"
                style={{
                  background: 'linear-gradient(145deg, #f8fbff 0%, #edf4fe 100%)',
                  border: '1.5px solid #bae6fd'
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-3 p-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ background: '#0284c7', fontSize: '2rem', width: '56px', height: '56px' }}
                  >
                    {selectedCourse.icon || '🚀'}
                  </div>
                  <div>
                    <span className="badge-blue mb-1 d-inline-block">{selectedCourse.category}</span>
                    <h4 className="fw-bold mb-0 font-heading" style={{ color: '#0f172a' }}>
                      {selectedCourse.title}
                    </h4>
                  </div>
                </div>

                <p className="text-muted small mb-3">
                  {selectedCourse.description}
                </p>

                {/* Level 1 Unlock Notice */}
                <div
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                  style={{ background: '#ffffff', border: '1px solid #dbeafe' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                      <Unlock size={18} />
                    </div>
                    <div>
                      <div className="fw-bold small" style={{ color: '#0f172a' }}>
                        Level 1: {selectedCourse.modules?.[0]?.title || 'Module Basics'}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Unlocked & ready for your first study session.
                      </div>
                    </div>
                  </div>

                  <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1" style={{ fontSize: '0.75rem' }}>
                    UNLOCKED
                  </span>
                </div>
              </div>

              {/* Rules & Trust Checklist */}
              <div className="row g-2 mb-4">
                <div className="col-sm-6">
                  <div className="p-2 px-3 rounded-3 bg-light d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: '#475569' }}>
                    <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                    <span>Passing Score: 60% unlocks next level</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 px-3 rounded-3 bg-light d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: '#475569' }}>
                    <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                    <span>Change study role anytime in Settings</span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn d-flex align-items-center gap-2 py-2 px-3 fw-semibold rounded-3"
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                >
                  <ArrowLeft size={16} />
                  <span>Choose Other Course</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  disabled={submitting}
                  className="btn-academic-blue px-4 py-2"
                  style={{ width: 'auto' }}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Initializing Path...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Launch Learning Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Onboarding;
