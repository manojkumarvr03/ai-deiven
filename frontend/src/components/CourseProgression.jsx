import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  Check,
  X,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Modal, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap';

const CourseProgression = ({ courseId, onProgressUpdate }) => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [activeModule, setActiveModule] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Fetch course details & student progress
  const loadCourseAndProgress = async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    try {
      const [courseRes, progressRes] = await Promise.all([
        API.get(`/education/course/${courseId}`),
        API.get(`/progress/${courseId}`)
      ]);

      if (courseRes.data.success) {
        setCourse(courseRes.data.course);
      }
      if (progressRes.data.success) {
        setProgress(progressRes.data.progress);
        if (onProgressUpdate) {
          onProgressUpdate(progressRes.data.progress);
        }
      }
    } catch (err) {
      console.error('Error loading course progression:', err);
      setError('Could not load course curriculum. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseAndProgress();
  }, [courseId]);

  // Open Lesson Modal
  const handleOpenLesson = (module) => {
    const isUnlocked = (module.level <= (progress?.unlockedLevel || 1));
    if (!isUnlocked) return;
    setActiveModule(module);
    setShowLessonModal(true);
  };

  // Open Quiz Modal
  const handleOpenQuiz = (module) => {
    const isUnlocked = (module.level <= (progress?.unlockedLevel || 1));
    if (!isUnlocked) return;
    setActiveModule(module);
    setQuizAnswers({});
    setQuizResult(null);
    setShowQuizModal(true);
  };

  // Switch from Lesson directly to Quiz
  const handleProceedToQuiz = () => {
    setShowLessonModal(false);
    setQuizAnswers({});
    setQuizResult(null);
    setShowQuizModal(true);
  };

  // Answer selection handler
  const handleSelectOption = (questionId, optionIndex) => {
    if (quizResult) return; // Prevent changing after submission
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Submit Quiz to Backend
  const handleSubmitQuiz = async () => {
    if (!activeModule) return;
    const questions = activeModule.assessment?.questions || [];
    const answeredCount = Object.keys(quizAnswers).length;

    if (answeredCount < questions.length) {
      alert('Please answer all questions before submitting your assessment.');
      return;
    }

    setQuizSubmitting(true);
    try {
      const res = await API.post('/progress/complete', {
        courseId,
        level: activeModule.level,
        answers: quizAnswers
      });

      if (res.data.success) {
        setQuizResult(res.data);
        if (res.data.progress) {
          setProgress(res.data.progress);
          if (onProgressUpdate) {
            onProgressUpdate(res.data.progress);
          }
        }
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert(err.response?.data?.message || 'Error submitting assessment.');
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2 text-muted small">Loading course progression & unlock state...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <Alert variant="warning" className="d-flex align-items-center gap-2">
        <AlertCircle size={18} />
        <span>{error || 'Course data not found.'}</span>
      </Alert>
    );
  }

  const modules = course.modules || [];
  const unlockedLevel = progress?.unlockedLevel || 1;
  const completedLevels = progress?.completedLevels || [];
  const progressPercent = progress?.progressPercentage || 0;

  return (
    <div>
      {/* Progression Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: '#e2e8f0' }}>
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm"
            style={{ background: '#0284c7', fontSize: '1.8rem', width: '48px', height: '48px' }}
          >
            {course.icon || '🚀'}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0 font-heading" style={{ color: '#0f172a' }}>
                {course.title}
              </h4>
              <span className="badge-blue">{course.category}</span>
            </div>
            <p className="text-muted small mb-0">
              {modules.length} Sequential Levels • Passing threshold: 60% per level
            </p>
          </div>
        </div>

        {/* Course Progress Bar */}
        <div style={{ minWidth: '180px' }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small fw-bold" style={{ color: '#64748b', fontSize: '0.78rem' }}>Course Mastery</span>
            <span className="small fw-bold" style={{ color: '#0284c7', fontSize: '0.82rem' }}>{progressPercent}%</span>
          </div>
          <ProgressBar now={progressPercent} variant="info" style={{ height: '8px', borderRadius: '50px' }} />
        </div>
      </div>

      {/* Sequential Progression Tree */}
      <div className="d-flex flex-column gap-3">
        {modules.map((mod, idx) => {
          const isCompleted = completedLevels.includes(mod.level);
          const isUnlocked = mod.level <= unlockedLevel;
          const isCurrent = isUnlocked && !isCompleted;
          const isLocked = !isUnlocked;

          const assessmentScore = progress?.assessmentScores
            ? (typeof progress.assessmentScores.get === 'function'
                ? progress.assessmentScores.get(mod.level.toString())
                : progress.assessmentScores[mod.level.toString()])
            : null;

          return (
            <div
              key={mod.level}
              className="p-3 p-md-4 rounded-3 position-relative transition-all"
              style={{
                background: isCompleted
                  ? '#f0fdf4'
                  : isCurrent
                  ? '#ffffff'
                  : '#f8fafc',
                border: isCompleted
                  ? '1.5px solid #bbf7d0'
                  : isCurrent
                  ? '2px solid #0284c7'
                  : '1px solid #e2e8f0',
                borderRadius: '16px',
                opacity: isLocked ? 0.75 : 1,
                boxShadow: isCurrent ? '0 8px 25px rgba(2, 132, 199, 0.12)' : 'none'
              }}
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                {/* Left Side: Status Icon & Details */}
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                    style={{
                      width: '38px',
                      height: '38px',
                      background: isCompleted
                        ? '#dcfce7'
                        : isCurrent
                        ? '#e0f2fe'
                        : '#e2e8f0',
                      color: isCompleted
                        ? '#15803d'
                        : isCurrent
                        ? '#0284c7'
                        : '#94a3b8'
                    }}
                  >
                    {isCompleted ? (
                      <Check size={20} className="fw-bold" />
                    ) : isCurrent ? (
                      <PlayCircle size={20} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>

                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <h5 className="fw-bold mb-0 font-heading" style={{ color: isLocked ? '#64748b' : '#0f172a' }}>
                        {mod.title}
                      </h5>

                      {/* Status Badges */}
                      {isCompleted && (
                        <span className="badge-emerald py-0 px-2" style={{ fontSize: '0.72rem' }}>
                          ✓ Completed {assessmentScore ? `(${assessmentScore}%)` : ''}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="badge-blue py-0 px-2 d-inline-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                          <span className="pulse-indicator-blue" style={{ width: '6px', height: '6px' }}></span>
                          Current Level
                        </span>
                      )}
                      {isLocked && (
                        <span className="badge bg-secondary bg-opacity-10 text-muted py-0 px-2" style={{ fontSize: '0.72rem' }}>
                          🔒 Locked
                        </span>
                      )}
                    </div>

                    <p className="text-muted small mb-0" style={{ maxWidth: '600px', lineHeight: 1.45 }}>
                      {mod.description || 'Master core concepts and complete the level quiz to progress.'}
                    </p>

                    {isLocked && (
                      <div className="text-danger small mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                        <Lock size={12} />
                        <span>Pass Level {mod.level - 1} assessment with ≥ 60% to unlock</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  {isUnlocked ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenLesson(mod)}
                        className="btn d-flex align-items-center gap-2 py-2 px-3 fw-semibold rounded-3"
                        style={{
                          background: '#edf4fe',
                          color: '#0284c7',
                          border: '1px solid #bae6fd',
                          fontSize: '0.85rem'
                        }}
                      >
                        <BookOpen size={16} />
                        <span>Read Lesson</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenQuiz(mod)}
                        className="btn d-flex align-items-center gap-2 py-2 px-3 fw-bold rounded-3 text-white"
                        style={{
                          background: isCompleted ? '#059669' : '#0284c7',
                          border: 'none',
                          fontSize: '0.85rem',
                          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                        }}
                      >
                        <Award size={16} />
                        <span>{isCompleted ? 'Retake Quiz' : 'Take Quiz'}</span>
                      </button>
                    </>
                  ) : (
                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-light text-muted small fw-semibold">
                      <Lock size={14} />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* LESSON READER MODAL */}
      {/* ========================================================================= */}
      <Modal
        show={showLessonModal}
        onHide={() => setShowLessonModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Modal.Title className="d-flex align-items-center gap-2 font-heading fs-5" style={{ color: '#0f172a' }}>
            <BookOpen size={20} style={{ color: '#0284c7' }} />
            <span>{activeModule?.title}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <div className="d-flex flex-column gap-4">
            {activeModule?.lessons?.map((lesson, lIdx) => (
              <div
                key={lesson.id || lIdx}
                className="p-3 rounded-3"
                style={{ background: '#f8fbff', border: '1px solid #dbeafe' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0 font-heading" style={{ color: '#0284c7' }}>
                    {lIdx + 1}. {lesson.title}
                  </h6>
                  <span className="badge bg-light text-muted border">
                    <Clock size={11} className="me-1" /> {lesson.duration || '15 mins'}
                  </span>
                </div>

                <p className="text-dark small mb-3" style={{ lineHeight: 1.65 }}>
                  {lesson.content}
                </p>

                {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                  <div>
                    <div className="small fw-bold text-muted mb-1">Key Takeaways:</div>
                    <ul className="small text-muted mb-0 ps-3">
                      {lesson.keyPoints.map((kp, kIdx) => (
                        <li key={kIdx}>{kp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Button variant="secondary" onClick={() => setShowLessonModal(false)} className="rounded-3">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleProceedToQuiz}
            className="d-flex align-items-center gap-2 rounded-3"
            style={{ background: '#0284c7', border: 'none' }}
          >
            <span>Proceed to Assessment Quiz</span>
            <ArrowRight size={16} />
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ========================================================================= */}
      {/* ASSESSMENT QUIZ MODAL */}
      {/* ========================================================================= */}
      <Modal
        show={showQuizModal}
        onHide={() => setShowQuizModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Modal.Title className="d-flex align-items-center gap-2 font-heading fs-5" style={{ color: '#0f172a' }}>
            <Award size={20} style={{ color: '#0284c7' }} />
            <span>Assessment: {activeModule?.title}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {/* Quiz Result Banner */}
          {quizResult && (
            <div
              className={`p-4 rounded-3 mb-4 ${quizResult.passed ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'}`}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle p-2 d-flex align-items-center justify-content-center text-white ${quizResult.passed ? 'bg-success' : 'bg-danger'}`}
                  style={{ width: '42px', height: '42px' }}
                >
                  {quizResult.passed ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                </div>

                <div>
                  <h5 className={`fw-bold mb-1 ${quizResult.passed ? 'text-success' : 'text-danger'}`}>
                    {quizResult.passed ? 'Assessment Passed! 🎉' : 'Minimum Score Not Met'}
                  </h5>
                  <div className="small fw-semibold mb-1">
                    Your Score: <strong className="fs-6">{quizResult.score}%</strong> (Passing threshold: {quizResult.passingScore || 60}%)
                  </div>
                  <div className="small text-muted">
                    {quizResult.message}
                  </div>
                  {quizResult.remedy && (
                    <div className="small text-danger fw-semibold mt-1">
                      💡 {quizResult.remedy}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quiz Questions */}
          <div className="d-flex flex-column gap-4">
            {(activeModule?.assessment?.questions || []).map((q, qIdx) => {
              const selectedOpt = quizAnswers[q.id];
              const isCorrectAnswer = quizResult && selectedOpt === q.correctIndex;
              const isWrongAnswer = quizResult && selectedOpt !== q.correctIndex;

              return (
                <div
                  key={q.id || qIdx}
                  className="p-3 rounded-3"
                  style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div className="fw-bold mb-3 d-flex align-items-start gap-2" style={{ color: '#0f172a', fontSize: '0.92rem' }}>
                    <span className="badge bg-primary bg-opacity-10 text-primary">{qIdx + 1}</span>
                    <span>{q.question}</span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {q.options.map((option, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionTheCorrectOne = quizResult && optIdx === q.correctIndex;

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                          style={{
                            background: isOptionTheCorrectOne
                              ? '#dcfce7'
                              : isOptionSelected && isWrongAnswer
                              ? '#fee2e2'
                              : isOptionSelected
                              ? '#e0f2fe'
                              : '#f8fafc',
                            border: isOptionTheCorrectOne
                              ? '1.5px solid #22c55e'
                              : isOptionSelected && isWrongAnswer
                              ? '1.5px solid #ef4444'
                              : isOptionSelected
                              ? '1.5px solid #0284c7'
                              : '1px solid #e2e8f0',
                            cursor: quizResult ? 'default' : 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="radio"
                              name={`question_${q.id}`}
                              checked={isOptionSelected}
                              onChange={() => {}}
                              disabled={!!quizResult}
                              style={{ cursor: 'pointer' }}
                            />
                            <span className="small fw-semibold" style={{ color: '#334155' }}>
                              {option}
                            </span>
                          </div>

                          {quizResult && isOptionTheCorrectOne && (
                            <span className="badge bg-success small">Correct</span>
                          )}
                          {quizResult && isOptionSelected && isWrongAnswer && (
                            <span className="badge bg-danger small">Incorrect</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {quizResult && q.explanation && (
                    <div className="mt-2 p-2 rounded-2 bg-light text-muted small" style={{ fontSize: '0.78rem' }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Modal.Body>

        <Modal.Footer style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Button variant="secondary" onClick={() => setShowQuizModal(false)} className="rounded-3">
            {quizResult ? 'Close' : 'Cancel'}
          </Button>

          {!quizResult ? (
            <Button
              variant="primary"
              onClick={handleSubmitQuiz}
              disabled={quizSubmitting}
              className="d-flex align-items-center gap-2 rounded-3 fw-bold"
              style={{ background: '#0284c7', border: 'none' }}
            >
              {quizSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>Grading Assessment...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Submit & Verify Score</span>
                </>
              )}
            </Button>
          ) : !quizResult.passed ? (
            <Button
              variant="warning"
              onClick={() => {
                setQuizAnswers({});
                setQuizResult(null);
              }}
              className="d-flex align-items-center gap-2 rounded-3 fw-bold"
            >
              <RefreshCw size={16} />
              <span>Retake Assessment</span>
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={() => setShowQuizModal(false)}
              className="rounded-3 fw-bold"
            >
              Done
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseProgression;
