import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Row, Col, Spinner, Alert, Badge, Modal, ProgressBar, Button } from 'react-bootstrap';
import {
  FileCheck2, CheckCircle2, Clock, Award, ArrowRight,
  BookOpen, Layers, Star, AlertCircle, Send, RotateCcw,
  Code2, PenLine, ChevronDown, ChevronUp, Sparkles, XCircle
} from 'lucide-react';

const GRADE_COLORS = {
  'A+': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  'A':  { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  'B':  { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  'C':  { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  'D':  { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  'Needs Revision': { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' }
};

const AssignmentsPage = () => {
  const { user } = useAuth();
  const [activeStudyRole] = useState(user?.studyRole || 'programming');
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Workspace modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [codeSubmission, setCodeSubmission] = useState('');
  const [writtenSubmission, setWrittenSubmission] = useState('');
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'rubric' | 'submit'
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [expandedRubric, setExpandedRubric] = useState(null);

  const loadAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/assignments?studyRole=${activeStudyRole}&status=${statusFilter}`);
      if (res.data.success) {
        setAssignments(res.data.assignments || []);
        setStats(res.data.stats || null);
      }
    } catch (err) {
      setError('Could not load assignments. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAssignments(); }, [activeStudyRole, statusFilter]);

  const handleOpenAssignment = async (asgn) => {
    setLoadingDetail(true);
    setSubmissionResult(null);
    setActiveTab('problem');
    try {
      const res = await API.get(`/assignments/${asgn._id || asgn.code}`);
      if (res.data.success) {
        setSelectedAssignment(res.data.assignment);
        if (res.data.userSubmission) {
          setCodeSubmission(res.data.userSubmission.codeSubmission || '');
          setWrittenSubmission(res.data.userSubmission.writtenSubmission || '');
          setSubmissionResult(res.data.userSubmission);
          setActiveTab('submit');
        } else {
          setCodeSubmission(res.data.assignment.starterTemplate?.code || '');
          setWrittenSubmission(res.data.assignment.starterTemplate?.writtenTemplate || '');
        }
      }
    } catch (err) {
      alert('Failed to load assignment details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;
    if (!codeSubmission.trim() && !writtenSubmission.trim()) {
      alert('Please add code or written answer before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await API.post(`/assignments/${selectedAssignment._id || selectedAssignment.code}/submit`, {
        codeSubmission,
        writtenSubmission
      });
      if (res.data.success) {
        setSubmissionResult(res.data.submission);
        setActiveTab('submit');
        loadAssignments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!selectedAssignment) return;
    if (window.confirm('Reset your submission back to the starter template?')) {
      setCodeSubmission(selectedAssignment.starterTemplate?.code || '');
      setWrittenSubmission(selectedAssignment.starterTemplate?.writtenTemplate || '');
      setSubmissionResult(null);
      setActiveTab('problem');
    }
  };

  return (
    <div>
      {/* Page Hero */}
      <div
        className="p-4 p-md-5 mb-4 rounded-4 shadow-sm position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1033 0%, #2d1b69 60%, #1e1033 100%)', border: '1px solid #4c1d95' }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
              style={{ background: 'rgba(167,139,250,0.2)', color: '#a78bfa', fontSize: '0.78rem', fontWeight: 700 }}>
              <FileCheck2 size={14} />
              <span>AI-GRADED ASSIGNMENTS</span>
            </div>
            <h2 className="fs-2 fw-extrabold mb-2 font-heading text-white">
              Course Assignments Portal 📝
            </h2>
            <p className="mb-0 small" style={{ color: '#94a3b8', maxWidth: '580px', lineHeight: 1.6 }}>
              Submit code implementations and written analyses. Get instant AI-powered rubric scoring,
              personalized feedback, and grade breakdown.
            </p>
          </div>

          {stats && (
            <div className="d-flex gap-3 flex-wrap">
              <div className="p-3 rounded-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '80px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>{stats.totalAssignments}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total</div>
              </div>
              <div className="p-3 rounded-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '80px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa', fontFamily: 'Outfit,sans-serif' }}>{stats.submittedCount}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Submitted</div>
              </div>
              <div className="p-3 rounded-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '80px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit,sans-serif' }}>{stats.averageScore}%</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Avg Score</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex align-items-center gap-2 mb-4 p-1 rounded-3" style={{ background: '#f1f5f9', width: 'fit-content' }}>
        {[
          { label: 'All Assignments', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Graded', value: 'graded' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className="btn btn-sm fw-semibold px-3 py-1.5 rounded-2"
            style={{
              background: statusFilter === tab.value ? '#ffffff' : 'transparent',
              color: statusFilter === tab.value ? '#0284c7' : '#64748b',
              border: statusFilter === tab.value ? '1px solid #dbeafe' : 'none',
              boxShadow: statusFilter === tab.value ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              fontSize: '0.84rem',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assignment Cards */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : assignments.length === 0 ? (
        <div className="p-5 text-center rounded-4 bg-white shadow-sm" style={{ border: '1px dashed #cbd5e1' }}>
          <FileCheck2 size={48} className="text-muted mb-2" />
          <h5>No assignments found for this filter</h5>
        </div>
      ) : (
        <Row className="g-3">
          {assignments.map((asgn) => {
            const isGraded = asgn.userStatus !== 'pending';
            const gradeStyle = asgn.userGrade ? GRADE_COLORS[asgn.userGrade] || GRADE_COLORS['B'] : null;
            const isPending = asgn.userStatus === 'pending';

            return (
              <Col key={asgn._id || asgn.code} lg={6}>
                <div
                  className="p-4 rounded-4 shadow-sm h-100 d-flex flex-column"
                  style={{
                    background: '#ffffff',
                    border: isGraded ? `1.5px solid ${gradeStyle?.border || '#dbeafe'}` : '1px solid #dbeafe'
                  }}
                >
                  {/* Header */}
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span
                        className="badge rounded-pill"
                        style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem', fontWeight: 600 }}
                      >
                        {asgn.category}
                      </span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          background: asgn.difficulty === 'Beginner' ? '#dcfce7' : asgn.difficulty === 'Intermediate' ? '#fef3c7' : '#fee2e2',
                          color: asgn.difficulty === 'Beginner' ? '#166534' : asgn.difficulty === 'Intermediate' ? '#92400e' : '#991b1b',
                          fontSize: '0.72rem', fontWeight: 700
                        }}
                      >
                        {asgn.difficulty}
                      </span>
                    </div>

                    {isGraded && gradeStyle ? (
                      <span
                        className="badge fw-extrabold"
                        style={{ background: gradeStyle.bg, color: gradeStyle.text, border: `1px solid ${gradeStyle.border}`, fontSize: '0.88rem', padding: '4px 10px', borderRadius: '8px' }}
                      >
                        {asgn.userGrade}
                      </span>
                    ) : (
                      <span className="badge rounded-pill" style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #fde68a' }}>
                        <Clock size={11} className="me-1" />
                        {asgn.dueDateFormatted}
                      </span>
                    )}
                  </div>

                  <h5 className="fw-bold mb-2 font-heading" style={{ color: '#0f172a', fontSize: '1rem' }}>
                    {asgn.title}
                  </h5>
                  <p className="text-muted small mb-3" style={{ lineHeight: 1.55 }}>
                    {asgn.description}
                  </p>

                  {/* Learning Objectives */}
                  {asgn.learningObjectives?.length > 0 && (
                    <div className="mb-3">
                      {asgn.learningObjectives.slice(0, 2).map((obj, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 small text-muted mb-1" style={{ fontSize: '0.78rem' }}>
                          <CheckCircle2 size={13} style={{ color: '#0284c7', marginTop: '2px', flexShrink: 0 }} />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Progress bar if graded */}
                  {isGraded && asgn.userPercentage !== null && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Score</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                          {asgn.userScore}/{asgn.userMaxScore} pts ({asgn.userPercentage}%)
                        </span>
                      </div>
                      <ProgressBar
                        now={asgn.userPercentage}
                        variant={asgn.userPercentage >= 85 ? 'success' : asgn.userPercentage >= 60 ? 'info' : 'warning'}
                        style={{ height: '7px', borderRadius: '99px' }}
                      />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small fw-bold" style={{ color: '#0284c7', fontSize: '0.78rem' }}>
                        {asgn.totalPoints} pts
                      </span>
                      <span className="small text-muted" style={{ fontSize: '0.72rem' }}>
                        • {asgn.rubricCount} rubric criteria
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenAssignment(asgn)}
                      className="btn btn-sm d-flex align-items-center gap-1 px-3 py-1.5 rounded-3 fw-semibold"
                      style={{
                        background: isGraded ? '#edf4fe' : '#7c3aed',
                        color: isGraded ? '#0284c7' : '#ffffff',
                        border: isGraded ? '1px solid #bae6fd' : 'none',
                        fontSize: '0.8rem'
                      }}
                    >
                      <span>{isGraded ? 'Review Feedback' : 'Start Assignment'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}

      {/* =============================================
          ASSIGNMENT WORKSPACE MODAL
      ============================================= */}
      <Modal
        show={!!selectedAssignment && !loadingDetail}
        onHide={() => setSelectedAssignment(null)}
        size="xl"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header
          closeButton
          style={{ background: '#1e1033', borderBottom: '1px solid #4c1d95', paddingBlock: '14px' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded-3" style={{ background: 'rgba(167,139,250,0.2)' }}>
              <FileCheck2 size={20} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-white font-heading" style={{ fontSize: '1rem' }}>
                {selectedAssignment?.title}
              </h5>
              <span className="small" style={{ color: '#7c3aed', fontSize: '0.72rem' }}>
                {selectedAssignment?.category} • {selectedAssignment?.totalPoints} pts • {selectedAssignment?.difficulty}
              </span>
            </div>
          </div>
        </Modal.Header>

        {loadingDetail ? (
          <Modal.Body className="text-center py-5" style={{ background: '#0f0a1e' }}>
            <Spinner animation="border" variant="primary" />
          </Modal.Body>
        ) : selectedAssignment && (
          <Modal.Body className="p-0" style={{ background: '#f8fafc' }}>
            {/* Tab Navigation */}
            <div className="d-flex border-bottom px-4" style={{ background: '#ffffff', borderColor: '#e2e8f0' }}>
              {[
                { key: 'problem', label: 'Problem', icon: BookOpen },
                { key: 'rubric', label: 'Rubric', icon: Star },
                { key: 'submit', label: submissionResult ? 'Results & Feedback' : 'Submit Solution', icon: submissionResult ? Award : Send }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="btn border-0 py-3 px-3 fw-semibold d-flex align-items-center gap-2"
                    style={{
                      borderBottom: activeTab === tab.key ? '2px solid #7c3aed' : '2px solid transparent',
                      color: activeTab === tab.key ? '#7c3aed' : '#64748b',
                      borderRadius: 0,
                      fontSize: '0.84rem',
                      marginBottom: '-1px',
                      background: 'transparent'
                    }}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                    {tab.key === 'submit' && submissionResult && (
                      <span className="badge ms-1" style={{ background: '#7c3aed', color: '#fff', fontSize: '0.65rem', padding: '2px 6px' }}>
                        {submissionResult.grade}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ maxHeight: '72vh', overflowY: 'auto', padding: '24px 28px' }}>
              {/* ==== PROBLEM TAB ==== */}
              {activeTab === 'problem' && (
                <div>
                  <h5 className="fw-bold mb-3 font-heading" style={{ color: '#0f172a' }}>Assignment Brief</h5>

                  <div className="p-4 rounded-4 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div
                      style={{ lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}
                      dangerouslySetInnerHTML={{
                        __html: (selectedAssignment.problemStatement || '')
                          .replace(/### (.*?)\n/g, '<h6 class="fw-bold mt-3 mb-2" style="color:#0f172a">$1</h6>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/`([^`]+)`/g, '<code class="px-1 rounded" style="background:#e0f2fe;color:#0284c7;font-size:0.85em">$1</code>')
                      }}
                    />
                  </div>

                  {selectedAssignment.learningObjectives?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Learning Objectives</h6>
                      {selectedAssignment.learningObjectives.map((obj, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 mb-2 small" style={{ color: '#334155' }}>
                          <CheckCircle2 size={15} style={{ color: '#059669', marginTop: 2, flexShrink: 0 }} />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedAssignment.deliverables?.length > 0 && (
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Deliverables</h6>
                      {selectedAssignment.deliverables.map((d, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 mb-2 small" style={{ color: '#334155' }}>
                          <ArrowRight size={14} style={{ color: '#7c3aed', marginTop: 2, flexShrink: 0 }} />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-3 d-flex gap-2">
                    <button
                      onClick={() => setActiveTab('rubric')}
                      className="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-1"
                    >
                      <Star size={14} /> View Rubric
                    </button>
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                      style={{ background: '#7c3aed', color: '#fff', border: 'none', fontWeight: 700 }}
                    >
                      <Send size={14} /> Start Solving →
                    </button>
                  </div>
                </div>
              )}

              {/* ==== RUBRIC TAB ==== */}
              {activeTab === 'rubric' && (
                <div>
                  <h5 className="fw-bold mb-1 font-heading" style={{ color: '#0f172a' }}>Grading Rubric</h5>
                  <p className="text-muted small mb-4">Your submission will be evaluated against these criteria by our AI grader.</p>

                  <div className="d-flex flex-column gap-3">
                    {selectedAssignment.rubric?.map((item, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-3"
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                      >
                        <div className="d-flex align-items-center justify-content-between gap-3">
                          <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-3 fw-bold"
                              style={{ width: 44, height: 44, background: '#f3e8ff', color: '#7c3aed', fontSize: '0.9rem', flexShrink: 0, fontFamily: 'Outfit, sans-serif' }}
                            >
                              {item.maxPoints}
                            </div>
                            <div>
                              <div className="fw-bold" style={{ color: '#0f172a', fontSize: '0.9rem' }}>{item.criteria}</div>
                              {item.description && (
                                <div className="text-muted small mt-1" style={{ fontSize: '0.78rem' }}>{item.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-muted small text-nowrap" style={{ fontSize: '0.75rem' }}>{item.maxPoints} pts</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-3 d-flex align-items-center justify-content-between" style={{ background: '#0f172a', border: '1px solid #334155' }}>
                    <span className="fw-bold text-white">Total Points</span>
                    <span className="fw-extrabold" style={{ color: '#a78bfa', fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>
                      {selectedAssignment.totalPoints} pts
                    </span>
                  </div>
                </div>
              )}

              {/* ==== SUBMIT / RESULTS TAB ==== */}
              {activeTab === 'submit' && (
                <div>
                  {submissionResult ? (
                    // === GRADE RESULTS VIEW ===
                    <div>
                      {/* Grade Header */}
                      <div
                        className="p-4 rounded-4 mb-4 d-flex align-items-center gap-4"
                        style={{
                          background: 'linear-gradient(135deg, #1e1033 0%, #2d1b69 100%)',
                          border: '1px solid #4c1d95'
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3 fw-extrabold"
                          style={{ width: 72, height: 72, background: GRADE_COLORS[submissionResult.grade]?.bg || '#f1f5f9', color: GRADE_COLORS[submissionResult.grade]?.text || '#475569', fontSize: '2rem', fontFamily: 'Outfit,sans-serif', border: `2px solid ${GRADE_COLORS[submissionResult.grade]?.border || '#cbd5e1'}`, flexShrink: 0 }}
                        >
                          {submissionResult.grade}
                        </div>
                        <div>
                          <div className="text-white fw-bold" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem' }}>
                            {submissionResult.score}/{submissionResult.maxScore} Points Scored
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 4 }}>
                            {submissionResult.percentage}% — {submissionResult.grade === 'A+' || submissionResult.grade === 'A' ? '🌟 Excellent Work!' : submissionResult.grade === 'B' ? '✅ Strong Submission' : '📈 Keep Improving!'}
                          </div>
                          <ProgressBar
                            now={submissionResult.percentage}
                            variant={submissionResult.percentage >= 85 ? 'success' : 'info'}
                            style={{ height: '6px', borderRadius: '99px', marginTop: '8px', background: '#334155' }}
                          />
                        </div>
                      </div>

                      {/* AI Feedback */}
                      {submissionResult.aiFeedback && (
                        <div className="p-4 rounded-3 mb-4" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                          <div className="d-flex align-items-center gap-2 mb-2 fw-bold" style={{ color: '#065f46', fontSize: '0.88rem' }}>
                            <Sparkles size={16} />
                            <span>AI Tutor Feedback</span>
                          </div>
                          <p className="mb-0 small" style={{ color: '#064e3b', lineHeight: 1.6 }}>
                            {submissionResult.aiFeedback}
                          </p>
                        </div>
                      )}

                      {/* Rubric Breakdown */}
                      {submissionResult.rubricBreakdown?.length > 0 && (
                        <div>
                          <h6 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Rubric Score Breakdown</h6>
                          <div className="d-flex flex-column gap-2">
                            {submissionResult.rubricBreakdown.map((rb, i) => (
                              <div key={i} className="p-3 rounded-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                                <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                                  <span className="fw-semibold small" style={{ color: '#0f172a' }}>{rb.criteria}</span>
                                  <span className="fw-bold" style={{ color: rb.awardedPoints >= rb.maxPoints * 0.8 ? '#059669' : '#d97706', fontSize: '0.88rem' }}>
                                    {rb.awardedPoints}/{rb.maxPoints}
                                  </span>
                                </div>
                                <ProgressBar
                                  now={Math.round((rb.awardedPoints / rb.maxPoints) * 100)}
                                  variant={rb.awardedPoints >= rb.maxPoints * 0.8 ? 'success' : 'warning'}
                                  style={{ height: '5px', borderRadius: '99px', marginBottom: '6px' }}
                                />
                                {rb.feedback && (
                                  <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>{rb.feedback}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 d-flex gap-2">
                        <button onClick={handleReset} className="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-1">
                          <RotateCcw size={13} /> Revise & Resubmit
                        </button>
                      </div>
                    </div>
                  ) : (
                    // === SUBMISSION EDITOR ===
                    <div>
                      <h5 className="fw-bold mb-1 font-heading" style={{ color: '#0f172a' }}>Submit Your Solution</h5>
                      <p className="text-muted small mb-4">
                        {selectedAssignment.submissionType === 'hybrid'
                          ? 'Submit both your code implementation and written analysis.'
                          : selectedAssignment.submissionType === 'code'
                          ? 'Submit your code implementation.'
                          : 'Submit your written analysis.'}
                      </p>

                      {/* Code Editor */}
                      {(selectedAssignment.submissionType === 'code' || selectedAssignment.submissionType === 'hybrid') && (
                        <div className="mb-4">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Code2 size={16} style={{ color: '#0284c7' }} />
                            <span className="fw-bold small" style={{ color: '#0f172a' }}>Code Implementation</span>
                          </div>
                          <div className="rounded-3 overflow-hidden" style={{ border: '1px solid #1e293b' }}>
                            <div className="px-3 py-2 d-flex align-items-center gap-2" style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
                              <div className="d-flex gap-1">
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                              </div>
                              <span style={{ color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' }}>solution.py</span>
                            </div>
                            <textarea
                              value={codeSubmission}
                              onChange={(e) => setCodeSubmission(e.target.value)}
                              rows={14}
                              spellCheck={false}
                              className="w-100 p-3"
                              style={{
                                background: '#090d16', color: '#38bdf8',
                                fontFamily: '"Fira Code", "Courier New", monospace',
                                fontSize: '0.9rem', lineHeight: 1.6,
                                border: 'none', outline: 'none', resize: 'vertical'
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Written Editor */}
                      {(selectedAssignment.submissionType === 'written' || selectedAssignment.submissionType === 'hybrid') && (
                        <div className="mb-4">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <PenLine size={16} style={{ color: '#7c3aed' }} />
                            <span className="fw-bold small" style={{ color: '#0f172a' }}>Written Analysis & Documentation</span>
                          </div>
                          <textarea
                            value={writtenSubmission}
                            onChange={(e) => setWrittenSubmission(e.target.value)}
                            rows={10}
                            placeholder="Write your theoretical analysis, design decisions, complexity explanation, and testing notes here..."
                            className="form-control rounded-3"
                            style={{ fontSize: '0.88rem', lineHeight: 1.7, background: '#f8fafc', border: '1px solid #e2e8f0', resize: 'vertical' }}
                          />
                        </div>
                      )}

                      <div className="d-flex gap-2 align-items-center">
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-bold"
                          style={{ background: '#7c3aed', color: '#ffffff', border: 'none', fontSize: '0.9rem' }}
                        >
                          {submitting ? <Spinner animation="border" size="sm" /> : <Send size={16} />}
                          <span>{submitting ? 'Evaluating...' : 'Submit for AI Grading'}</span>
                        </button>
                        <span className="text-muted small">Results are instant ⚡</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
};

export default AssignmentsPage;
