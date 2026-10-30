import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { Container, Row, Col, Modal, Button, Spinner, Alert, ProgressBar, Badge } from 'react-bootstrap';
import {
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  Search,
  Filter,
  Check,
  Copy,
  ArrowRight,
  BookOpen,
  Zap,
  Clock,
  Layers,
  Terminal,
  Lightbulb
} from 'lucide-react';
import StudentNavbar from '../components/StudentNavbar';
import StudyRoleModal from '../components/StudyRoleModal';

const TasksPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeStudyRole, setActiveStudyRole] = useState(user?.studyRole || 'programming');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Active Solving Task Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [loadingTaskDetail, setLoadingTaskDetail] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [activeLeftTab, setActiveLeftTab] = useState('problem'); // 'problem' | 'hints'
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [revealedHints, setRevealedHints] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load Tasks
  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/tasks?studyRole=${activeStudyRole}`);
      if (res.data.success) {
        setTasks(res.data.tasks || []);
        setTaskStats(res.data.stats || null);

        // If URL has taskId query parameter, open it
        const directTaskId = searchParams.get('taskId');
        if (directTaskId) {
          const matched = res.data.tasks.find((t) => t.code === directTaskId || t._id === directTaskId);
          if (matched) {
            handleOpenTask(matched);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not load practice challenges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.studyRole) {
      setActiveStudyRole(user.studyRole);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [activeStudyRole]);

  // Open Task Workspace Modal
  const handleOpenTask = async (taskSummary) => {
    setLoadingTaskDetail(true);
    setSubmissionResult(null);
    setRevealedHints([]);
    setActiveLeftTab('problem');

    try {
      const res = await API.get(`/tasks/${taskSummary._id || taskSummary.code}`);
      if (res.data.success) {
        const fullTask = res.data.task;
        setSelectedTask(fullTask);

        // Prepopulate with user previous solution or starter code
        if (res.data.userSubmission?.solutionCode) {
          setUserCode(res.data.userSubmission.solutionCode);
          setSubmissionResult({
            status: res.data.userSubmission.status,
            allPassed: res.data.userSubmission.status === 'solved',
            passedTestCases: res.data.userSubmission.passedTestCases,
            totalTestCases: res.data.userSubmission.totalTestCases,
            testResults: res.data.userSubmission.testResults || [],
            xpAwarded: res.data.userSubmission.xpEarned || 0
          });
        } else {
          setUserCode(fullTask.starterCode || '');
        }
      }
    } catch (err) {
      console.error('Error loading task details:', err);
      alert('Failed to load task details.');
    } finally {
      setLoadingTaskDetail(false);
    }
  };

  // Reset starter code
  const handleResetCode = () => {
    if (selectedTask && window.confirm('Reset code editor to starter template?')) {
      setUserCode(selectedTask.starterCode || '');
      setSubmissionResult(null);
    }
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Reveal next hint
  const handleRevealNextHint = async () => {
    if (!selectedTask) return;
    const nextIndex = revealedHints.length;
    try {
      const res = await API.get(`/tasks/${selectedTask._id || selectedTask.code}/hint?index=${nextIndex}`);
      if (res.data.success && res.data.hint) {
        setRevealedHints((prev) => [...prev, { number: nextIndex + 1, text: res.data.hint }]);
      }
    } catch (err) {
      console.error('Error fetching hint:', err);
    }
  };

  // Submit Solution / Run Tests
  const handleSubmitSolution = async () => {
    if (!selectedTask) return;
    if (!userCode.trim()) {
      alert('Please write code before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post(`/tasks/${selectedTask._id || selectedTask.code}/submit`, {
        solutionCode: userCode,
        language: selectedTask.language
      });

      if (res.data.success) {
        setSubmissionResult(res.data);
        if (res.data.allPassed) {
          refreshUser();
          loadTasks(); // Update status cards
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(err.response?.data?.message || 'Error submitting solution.');
    } finally {
      setSubmitting(false);
    }
  };

  // Find next unsolved task
  const handleNextChallenge = () => {
    const currentIndex = tasks.findIndex((t) => t.code === selectedTask?.code);
    const nextUnsolved = tasks.slice(currentIndex + 1).find((t) => t.userStatus !== 'solved');
    if (nextUnsolved) {
      handleOpenTask(nextUnsolved);
    } else {
      const anyUnsolved = tasks.find((t) => t.userStatus !== 'solved');
      if (anyUnsolved) {
        handleOpenTask(anyUnsolved);
      } else {
        alert('🎉 Amazing work! You have completed all practice tasks in this path!');
        setSelectedTask(null);
      }
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === 'all' || task.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'solved' && task.userStatus === 'solved') ||
      (statusFilter === 'unsolved' && task.userStatus !== 'solved');

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  return (
    <div>

        {/* Hero Section */}
        <div
          className="p-4 p-md-5 mb-4 rounded-4 shadow-sm position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
            border: '1px solid #dbeafe'
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div>
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
                style={{ background: '#e0f2fe', color: '#0284c7', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <Code2 size={14} />
                <span>INTERACTIVE PRACTICE ENGINE</span>
              </div>
              <h2 className="fs-2 fw-extrabold mb-2 font-heading" style={{ color: '#0f172a' }}>
                Practice Challenges & Code Lab ⚡
              </h2>
              <p className="text-muted small mb-0" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
                Sharpen your computational thinking and theoretical mastery with live in-browser test validation, AI hints, and instant XP rewards.
              </p>
            </div>

            {/* Quick Metrics Tile */}
            <div
              className="p-3.5 rounded-3 d-flex align-items-center gap-4 shadow-sm"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div>
                <div className="text-muted" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Solved Progress</div>
                <div className="fs-4 fw-extrabold" style={{ color: '#0284c7' }}>
                  {taskStats?.solvedTasks || 0} / {taskStats?.totalTasks || 0}
                </div>
                <ProgressBar
                  now={taskStats?.completionRate || 0}
                  variant="info"
                  style={{ height: '6px', width: '100px', borderRadius: '20px' }}
                />
              </div>

              <div className="border-start ps-3" style={{ borderColor: '#e2e8f0' }}>
                <div className="text-muted" style={{ fontSize: '0.72rem', fontWeight: 600 }}>XP Rewards</div>
                <div className="fs-4 fw-extrabold d-flex align-items-center gap-1" style={{ color: '#059669' }}>
                  <Flame size={20} className="text-warning fill-warning" />
                  <span>+{taskStats?.totalXPEarned || 0}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  of {taskStats?.totalXPAvailable || 0} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          className="p-3 mb-4 rounded-4 shadow-sm"
          style={{ background: '#ffffff', border: '1px solid #dbeafe' }}
        >
          <Row className="g-2 align-items-center">
            {/* Search Input */}
            <Col md={5}>
              <div className="position-relative">
                <Search
                  size={17}
                  className="position-absolute"
                  style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type="text"
                  placeholder="Search challenges by name or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control ps-5 py-2 rounded-3"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.88rem' }}
                />
              </div>
            </Col>

            {/* Difficulty Tabs */}
            <Col sm={6} md={4}>
              <div className="d-flex align-items-center gap-1 p-1 rounded-3" style={{ background: '#f1f5f9' }}>
                {['all', 'easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className="btn btn-sm flex-fill text-capitalize fw-semibold rounded-2 transition-all"
                    style={{
                      background: difficultyFilter === diff ? '#ffffff' : 'transparent',
                      color: difficultyFilter === diff ? '#0284c7' : '#64748b',
                      border: difficultyFilter === diff ? '1px solid #e2e8f0' : 'none',
                      fontSize: '0.78rem',
                      padding: '5px 8px'
                    }}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </Col>

            {/* Status Filter */}
            <Col sm={6} md={3}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select py-2 rounded-3"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
              >
                <option value="all">All Status (Any)</option>
                <option value="unsolved">Unsolved Challenges</option>
                <option value="solved">Solved Challenges</option>
              </select>
            </Col>
          </Row>
        </div>

        {/* Tasks List Content */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2 text-muted small">Loading interactive challenges...</div>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredTasks.length === 0 ? (
          <div
            className="p-5 text-center rounded-4 shadow-sm bg-white"
            style={{ border: '1px dashed #cbd5e1' }}
          >
            <Code2 size={48} className="text-muted mb-2" />
            <h5 className="fw-bold" style={{ color: '#0f172a' }}>No matching challenges found</h5>
            <p className="text-muted small">Try adjusting your search query or filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setDifficultyFilter('all'); setStatusFilter('all'); }}
              className="btn btn-outline-primary btn-sm rounded-3"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <Row className="g-3">
            {filteredTasks.map((task) => {
              const isSolved = task.userStatus === 'solved';
              const difficultyColors = {
                Easy: { bg: '#dcfce7', text: '#15803d' },
                Medium: { bg: '#fef3c7', text: '#b45309' },
                Hard: { bg: '#fee2e2', text: '#b91c1c' }
              };
              const diffStyle = difficultyColors[task.difficulty] || difficultyColors.Easy;

              return (
                <Col key={task._id || task.code} lg={6}>
                  <div
                    className="p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between transition-all"
                    style={{
                      background: isSolved ? '#fcfdfd' : '#ffffff',
                      border: isSolved ? '1.5px solid #86efac' : '1px solid #dbeafe',
                      position: 'relative'
                    }}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span
                            className="badge rounded-pill fw-bold"
                            style={{ background: diffStyle.bg, color: diffStyle.text, fontSize: '0.72rem' }}
                          >
                            {task.difficulty}
                          </span>
                          <span
                            className="badge rounded-pill"
                            style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem' }}
                          >
                            {task.category}
                          </span>
                        </div>

                        {/* Status Badge */}
                        {isSolved ? (
                          <span
                            className="badge d-flex align-items-center gap-1 rounded-pill"
                            style={{ background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            <CheckCircle2 size={13} /> Solved
                          </span>
                        ) : (
                          <span
                            className="badge d-flex align-items-center gap-1 rounded-pill"
                            style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}
                          >
                            Unsolved
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h5 className="fw-bold mb-2 font-heading" style={{ color: '#0f172a' }}>
                        {task.title}
                      </h5>
                      <p
                        className="text-muted small mb-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.55
                        }}
                      >
                        {task.description.replace(/###.*?\n/g, '').replace(/```[\s\S]*?```/g, '')}
                      </p>
                    </div>

                    {/* Footer / Meta info */}
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2" style={{ borderColor: '#f1f5f9' }}>
                      <div className="d-flex align-items-center gap-3">
                        <span className="small d-flex align-items-center gap-1" style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.8rem' }}>
                          <Flame size={15} /> +{task.xpReward} XP
                        </span>
                        <span className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                          <Clock size={13} /> {task.estimatedMinutes}m
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenTask(task)}
                        className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 fw-semibold transition-all`}
                        style={{
                          background: isSolved ? '#edf4fe' : '#0284c7',
                          color: isSolved ? '#0284c7' : '#ffffff',
                          border: isSolved ? '1px solid #bae6fd' : 'none',
                          fontSize: '0.82rem'
                        }}
                      >
                        <span>{isSolved ? 'Review / Solve Again' : 'Solve Challenge'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

      {/* ========================================================================= */}
      {/* INTERACTIVE TASK SOLVER & TEST RUNNER MODAL */}
      {/* ========================================================================= */}
      <Modal
        show={!!selectedTask}
        onHide={() => setSelectedTask(null)}
        fullscreen
        centered
        className="academic-task-modal"
      >
        <Modal.Header
          closeButton
          style={{ background: '#0f172a', color: '#ffffff', borderBottom: '1px solid #334155' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="p-2 rounded-3 d-flex align-items-center justify-content-center"
              style={{ background: '#0284c7' }}
            >
              <Code2 size={20} className="text-white" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0 fw-bold font-heading text-white">{selectedTask?.title}</h5>
                <Badge bg="secondary" className="text-capitalize" style={{ fontSize: '0.72rem' }}>
                  {selectedTask?.difficulty}
                </Badge>
                <Badge bg="warning" text="dark" style={{ fontSize: '0.72rem' }}>
                  +{selectedTask?.xpReward} XP
                </Badge>
              </div>
              <span className="text-slate-400 small" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {selectedTask?.category} • Language: {selectedTask?.language || 'Python'}
              </span>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="p-0" style={{ background: '#090d16', color: '#f8fafc' }}>
          <Row className="g-0 h-100" style={{ minHeight: 'calc(100vh - 65px)' }}>
            {/* LEFT COLUMN: Problem Workspace & AI Hints */}
            <Col lg={5} className="border-end d-flex flex-column" style={{ borderColor: '#1e293b', background: '#0f172a' }}>
              {/* Left Tab Switcher */}
              <div className="d-flex border-bottom p-2 gap-2" style={{ borderColor: '#1e293b', background: '#0b1120' }}>
                <button
                  onClick={() => setActiveLeftTab('problem')}
                  className="btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-2 fw-semibold"
                  style={{
                    background: activeLeftTab === 'problem' ? '#1e293b' : 'transparent',
                    color: activeLeftTab === 'problem' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    fontSize: '0.82rem'
                  }}
                >
                  <BookOpen size={14} />
                  <span>Problem Statement</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('hints')}
                  className="btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-2 fw-semibold position-relative"
                  style={{
                    background: activeLeftTab === 'hints' ? '#1e293b' : 'transparent',
                    color: activeLeftTab === 'hints' ? '#f59e0b' : '#94a3b8',
                    border: 'none',
                    fontSize: '0.82rem'
                  }}
                >
                  <Lightbulb size={14} />
                  <span>AI Hints & Tutor</span>
                  {selectedTask?.hints?.length > 0 && (
                    <span
                      className="badge rounded-pill bg-warning text-dark ms-1"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {selectedTask.hints.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Left Body Content */}
              <div className="p-4 overflow-auto flex-grow-1" style={{ maxHeight: 'calc(100vh - 125px)' }}>
                {activeLeftTab === 'problem' ? (
                  <div>
                    {/* Problem Statement text */}
                    <div className="problem-markdown mb-4" style={{ lineHeight: 1.6, fontSize: '0.92rem' }}>
                      <h6 className="text-uppercase small fw-bold text-info mb-2" style={{ letterSpacing: '0.05em' }}>
                        Description
                      </h6>
                      <div
                        style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{
                          __html: (selectedTask?.description || '')
                            .replace(/### (.*?)\n/g, '<h6 class="fw-bold text-white mt-3 mb-2">$1</h6>')
                            .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded text-info" style="background:#1e293b;">$1</code>')
                        }}
                      />
                    </div>

                    {/* Examples */}
                    {selectedTask?.examples?.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-uppercase small fw-bold text-info mb-2" style={{ letterSpacing: '0.05em' }}>
                          Examples
                        </h6>
                        {selectedTask.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="p-3 mb-2 rounded-3"
                            style={{ background: '#1e293b', border: '1px solid #334155' }}
                          >
                            <div className="small mb-1">
                              <span className="text-muted">Input: </span>
                              <code className="text-warning">{ex.input}</code>
                            </div>
                            <div className="small mb-1">
                              <span className="text-muted">Output: </span>
                              <code className="text-success">{ex.output}</code>
                            </div>
                            {ex.explanation && (
                              <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                                <span className="text-slate-400">Explanation: </span>
                                {ex.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Constraints */}
                    {selectedTask?.constraints?.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-uppercase small fw-bold text-info mb-2" style={{ letterSpacing: '0.05em' }}>
                          Constraints
                        </h6>
                        <ul className="small text-slate-300 ps-3 mb-0" style={{ color: '#cbd5e1' }}>
                          {selectedTask.constraints.map((c, i) => (
                            <li key={i} className="mb-1">{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-uppercase small fw-bold text-warning mb-0" style={{ letterSpacing: '0.05em' }}>
                        AI Progressive Guidance
                      </h6>
                      <button
                        onClick={handleRevealNextHint}
                        disabled={revealedHints.length >= (selectedTask?.hints?.length || 0)}
                        className="btn btn-sm btn-outline-warning rounded-pill py-1 px-3"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {revealedHints.length >= (selectedTask?.hints?.length || 0)
                          ? 'All Hints Revealed'
                          : `Reveal Hint (${revealedHints.length + 1}/${selectedTask?.hints?.length || 1})`}
                      </button>
                    </div>

                    {revealedHints.length === 0 ? (
                      <div className="p-4 text-center rounded-3" style={{ background: '#1e293b', border: '1px dashed #475569' }}>
                        <Lightbulb size={32} className="text-warning mb-2" />
                        <h6 className="text-white">Need a hint?</h6>
                        <p className="text-muted small mb-3">Click the button above to reveal step-by-step guidance without giving away the full answer.</p>
                      </div>
                    ) : (
                      revealedHints.map((h, i) => (
                        <div
                          key={i}
                          className="p-3 mb-2 rounded-3 animate__animated animate__fadeIn"
                          style={{ background: '#1e293b', border: '1px solid #f59e0b' }}
                        >
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '0.65rem' }}>
                              HINT #{h.number}
                            </span>
                          </div>
                          <p className="small text-slate-200 mb-0" style={{ color: '#f1f5f9', lineHeight: 1.5 }}>
                            {h.text}
                          </p>
                        </div>
                      ))
                    )}

                    {/* AI Guidance Notes */}
                    {selectedTask?.aiGuidance && (
                      <div className="p-3 mt-3 rounded-3" style={{ background: '#0284c720', border: '1px solid #0284c7' }}>
                        <div className="d-flex align-items-center gap-1.5 text-info mb-1 fw-bold small">
                          <Sparkles size={15} />
                          <span>AI Tutor Conceptual Note</span>
                        </div>
                        <p className="small text-slate-300 mb-0" style={{ fontSize: '0.82rem' }}>
                          {selectedTask.aiGuidance}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Col>

            {/* RIGHT COLUMN: Code Editor & Live Test Console */}
            <Col lg={7} className="d-flex flex-column" style={{ background: '#090d16' }}>
              {/* Code Editor Header */}
              <div
                className="d-flex justify-content-between align-items-center p-2.5 px-3 border-bottom"
                style={{ borderColor: '#1e293b', background: '#0d1322' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <Terminal size={16} className="text-info" />
                  <span className="small fw-bold text-white">Solution Editor ({selectedTask?.language || 'python'})</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="btn btn-sm d-flex align-items-center gap-1 py-1 px-2.5 rounded-2"
                    style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', fontSize: '0.75rem' }}
                    title="Copy Code"
                  >
                    {copiedCode ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleResetCode}
                    className="btn btn-sm d-flex align-items-center gap-1 py-1 px-2.5 rounded-2"
                    style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', fontSize: '0.75rem' }}
                    title="Reset to starter template"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="position-relative flex-grow-1" style={{ minHeight: '320px', background: '#090d16' }}>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="# Write your solution here..."
                  spellCheck={false}
                  className="w-100 h-100 p-3"
                  style={{
                    background: '#090d16',
                    color: '#38bdf8',
                    fontFamily: '"Fira Code", "Courier New", Courier, monospace',
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    minHeight: '300px'
                  }}
                />
              </div>

              {/* Action Buttons Bar */}
              <div
                className="d-flex justify-content-between align-items-center p-3 border-top"
                style={{ borderColor: '#1e293b', background: '#0d1322' }}
              >
                <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                  ⚡ Press <b>Submit Solution</b> to execute against all test cases.
                </span>

                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={handleSubmitSolution}
                    disabled={submitting}
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-bold shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      border: 'none',
                      fontSize: '0.88rem'
                    }}
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Submit & Verify Solution</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* TEST RESULTS CONSOLE (Bottom Drawer) */}
              <div
                className="p-3 border-top overflow-auto"
                style={{
                  background: '#070b13',
                  borderColor: '#1e293b',
                  maxHeight: '260px'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-bold text-uppercase text-slate-400" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    Test Cases Execution Console
                  </span>
                  {submissionResult && (
                    <span
                      className={`badge rounded-pill fw-bold ${submissionResult.allPassed ? 'bg-success' : 'bg-warning text-dark'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {submissionResult.passedTestCases} / {submissionResult.totalTestCases} Tests Passed
                    </span>
                  )}
                </div>

                {submissionResult ? (
                  <div>
                    {/* Celebration Banner if all passed */}
                    {submissionResult.allPassed && (
                      <div
                        className="p-3 mb-3 rounded-3 d-flex align-items-center justify-content-between shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', border: '1px solid #10b981' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <Award size={24} className="text-warning" />
                          <div>
                            <div className="fw-bold text-white" style={{ fontSize: '0.95rem' }}>
                              Challenge Solved! +{selectedTask.xpReward} XP Awarded 🎉
                            </div>
                            <div className="text-emerald-100 small" style={{ fontSize: '0.78rem' }}>
                              All test assertions passed successfully.
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleNextChallenge}
                          className="btn btn-sm btn-light fw-bold text-success d-flex align-items-center gap-1 rounded-3 px-3 py-1.5"
                        >
                          <span>Next Challenge</span>
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    )}

                    {/* Test Cases Details */}
                    <div className="d-flex flex-column gap-2">
                      {submissionResult.testResults?.map((tr, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-2 d-flex justify-content-between align-items-center"
                          style={{
                            background: tr.passed ? '#064e3b30' : '#7f1d1d30',
                            border: `1px solid ${tr.passed ? '#059669' : '#dc2626'}`
                          }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {tr.passed ? (
                              <CheckCircle2 size={16} className="text-success" />
                            ) : (
                              <XCircle size={16} className="text-danger" />
                            )}
                            <div>
                              <div className="small fw-semibold text-white">
                                Test Case #{idx + 1} {tr.isHidden ? '(Hidden)' : ''}
                              </div>
                              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                Input: <code>{tr.input}</code> • Expected: <code>{tr.expectedOutput}</code> • Actual: <code>{tr.actualOutput}</code>
                              </div>
                              {tr.error && (
                                <div className="text-danger small mt-0.5" style={{ fontSize: '0.7rem' }}>
                                  {tr.error}
                                </div>
                              )}
                            </div>
                          </div>

                          <span
                            className={`badge ${tr.passed ? 'bg-success' : 'bg-danger'}`}
                            style={{ fontSize: '0.68rem' }}
                          >
                            {tr.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted small">
                    Click <b>Submit & Verify Solution</b> to run tests and receive validation output.
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Role Change Modal */}
      <StudyRoleModal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
        onRoleChanged={(newRole) => {
          setActiveStudyRole(newRole);
          setShowRoleModal(false);
        }}
      />
    </div>
  );
};

export default TasksPage;
