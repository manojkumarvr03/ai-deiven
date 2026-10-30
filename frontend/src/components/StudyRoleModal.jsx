import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Modal,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';

const PATH_OPTIONS = [
  {
    id: 'school',
    title: 'School',
    icon: '🏫',
    badge: 'Classes 1–12',
    desc: 'Foundational schooling and board examinations'
  },
  {
    id: 'college',
    title: 'College',
    icon: '🎓',
    badge: 'Degree Programs',
    desc: 'BCA, B.Sc, B.Tech, MCA, MBA & other degree curricula'
  },
  {
    id: 'diploma',
    title: 'Diploma',
    icon: '📚',
    badge: 'Polytechnic',
    desc: 'Hands-on polytechnic and engineering diploma courses'
  },
  {
    id: 'programming',
    title: 'Programming',
    icon: '💻',
    badge: 'Coding & Dev',
    desc: 'Python, Java, C++, JavaScript, React, SQL & DSA mastery'
  }
];

// Maps study role options to the actual studyRole values stored in the DB seed
const ROLE_TO_PATH_MAP = {
  school:      'design',       // school path → design courses
  college:     'development',  // college path → development courses
  diploma:     'data_science', // diploma path → data science courses
  programming: 'development'   // programming path → development courses
};

const StudyRoleModal = ({ show, onHide, onRoleChanged }) => {
  const { user, updateStudyRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState(user?.studyRole || 'programming');
  const [courses, setCourses] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(user?.selectedCourseId || '');
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Sync state with active user
  useEffect(() => {
    if (show && user) {
      setSelectedRole(user.studyRole || 'programming');
      setSelectedCourseCode(user.selectedCourseId || '');
      setFeedback(null);
    }
  }, [show, user]);

  // Load courses when selectedRole changes
  useEffect(() => {
    if (!show) return;
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        // Map the UI role id to the actual studyRole stored in the DB
        const pathFilter = ROLE_TO_PATH_MAP[selectedRole] || selectedRole;
        const res = await API.get(`/education/courses?studyRole=${pathFilter}`);
        if (res.data.success) {
          const list = res.data.courses || [];
          setCourses(list);
          // If previous selection isn't in this path, default to first course
          if (list.length > 0 && !list.some((c) => c.code === selectedCourseCode)) {
            setSelectedCourseCode(list[0].code);
          }
        }
      } catch (err) {
        console.error('Error fetching path courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [selectedRole, show]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateStudyRole(selectedRole, selectedCourseCode);
      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Study role updated to ${selectedRole.toUpperCase()}! Your past progress remains 100% safe.`
        });
        if (onRoleChanged) {
          onRoleChanged(selectedRole, selectedCourseCode);
        }
        setTimeout(() => {
          onHide();
        }, 1200);
      } else {
        setFeedback({ type: 'danger', msg: res.message || 'Could not update role' });
      }
    } catch (err) {
      setFeedback({ type: 'danger', msg: 'Failed to update study role.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Modal.Title className="d-flex align-items-center gap-2 font-heading fs-5" style={{ color: '#0f172a' }}>
          <Sparkles size={20} style={{ color: '#0284c7' }} />
          <span>Change Study Role & Education Path</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Retention Assurance Note */}
        <div
          className="p-3 rounded-3 mb-4 d-flex align-items-start gap-3"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <ShieldCheck size={22} className="text-success flex-shrink-0 mt-1" />
          <div className="small" style={{ color: '#166534', lineHeight: 1.5 }}>
            <strong>Zero Data Loss Guarantee:</strong> Changing your study role will <em>never</em> delete your previous learning progress. You can return to any path later and continue from where you left off.
          </div>
        </div>

        {feedback && (
          <Alert variant={feedback.type} className="d-flex align-items-center gap-2 py-2 px-3 rounded-3 border-0">
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span className="small fw-semibold">{feedback.msg}</span>
          </Alert>
        )}

        {/* 1. Select Study Role */}
        <label className="form-label small fw-bold mb-2" style={{ color: '#0f172a' }}>
          Select New Study Role
        </label>
        <div className="row g-2 mb-4">
          {PATH_OPTIONS.map((path) => {
            const isSelected = selectedRole === path.id;
            return (
              <div className="col-sm-6" key={path.id}>
                <div
                  onClick={() => setSelectedRole(path.id)}
                  className="p-3 rounded-3 h-100 position-relative"
                  style={{
                    background: isSelected ? '#edf4fe' : '#f8fafc',
                    border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '1.3rem' }}>{path.icon}</span>
                      <span className="fw-bold" style={{ color: isSelected ? '#0284c7' : '#0f172a', fontSize: '0.92rem' }}>
                        {path.title}
                      </span>
                    </div>
                    {isSelected && <Check size={16} style={{ color: '#0284c7' }} />}
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                    {path.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Select Course within this Path */}
        <label className="form-label small fw-bold mb-2" style={{ color: '#0f172a' }}>
          Select Active Course / Class
        </label>
        {loadingCourses ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" variant="primary" />
            <span className="ms-2 small text-muted">Loading courses for this path...</span>
          </div>
        ) : (
          <div className="row g-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {courses.map((course) => {
              const isSelected = selectedCourseCode === course.code;
              return (
                <div className="col-12" key={course.code}>
                  <div
                    onClick={() => setSelectedCourseCode(course.code)}
                    className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                    style={{
                      background: isSelected ? '#edf4fe' : '#ffffff',
                      border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      borderRadius: '10px'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span>{course.icon || '📚'}</span>
                      <div>
                        <span className="fw-bold small" style={{ color: isSelected ? '#0284c7' : '#0f172a' }}>
                          {course.title}
                        </span>
                        <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>
                          ({course.category})
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check size={15} style={{ color: '#0284c7' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button variant="secondary" onClick={onHide} className="rounded-3">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || !selectedCourseCode}
          className="d-flex align-items-center gap-2 rounded-3 fw-bold"
          style={{ background: '#0284c7', border: 'none' }}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <span>Save & Switch Path</span>
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudyRoleModal;
