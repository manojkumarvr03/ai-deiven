import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import {
  User, Mail, BookOpen, GraduationCap, Palette,
  Save, Settings, ShieldCheck, Sparkles, Check,
  School, Laptop, Wrench, Code2
} from 'lucide-react';
import StudyRoleModal from '../components/StudyRoleModal';

const STUDY_ROLE_OPTIONS = [
  { value: 'school', label: 'School', description: 'Class 1–12 curriculum & board exam prep', icon: School, color: '#f59e0b' },
  { value: 'college', label: 'College', description: 'B.Tech / B.Sc / BCA & engineering courses', icon: GraduationCap, color: '#0284c7' },
  { value: 'diploma', label: 'Diploma', description: 'Polytechnic & technical diploma programs', icon: Wrench, color: '#059669' },
  { value: 'programming', label: 'Programming', description: 'Python, JavaScript, DSA & coding skills', icon: Code2, color: '#7c3aed' }
];

const LEARNING_STYLES = [
  { value: 'Visual', label: '👁️ Visual', desc: 'Learn through diagrams and illustrations' },
  { value: 'Auditory', label: '🎧 Auditory', desc: 'Learn best by hearing and listening' },
  { value: 'Reading/Writing', label: '📖 Reading/Writing', desc: 'Learn through notes and text' },
  { value: 'Kinesthetic', label: '🖐️ Kinesthetic', desc: 'Learn by doing hands-on practice' },
  { value: 'Mixed', label: '🔀 Mixed', desc: 'Combination of multiple styles' }
];

const SettingsPage = () => {
  const { user, updateProfile, refreshUser } = useAuth();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState(user?.firstName || user?.name || '');
  const [preferredLearningStyle, setPreferredLearningStyle] = useState(user?.preferredLearningStyle || 'Visual');
  const [institution, setInstitution] = useState(user?.institution || 'Edura Academy');

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const result = await updateProfile({ firstName, preferredLearningStyle, institution });
      if (!result.success) {
        throw new Error(result.message);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.firstName || user?.name || 'Student';
  const initials = displayName.slice(0, 2).toUpperCase();
  const currentRole = STUDY_ROLE_OPTIONS.find(r => r.value === (user?.studyRole || 'college'));

  return (
    <div>
      {/* Page Header */}
      <div
        className="p-4 p-md-5 mb-4 rounded-4 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)', border: '1px solid #dbeafe' }}
      >
        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="p-3 rounded-3 shadow-sm" style={{ background: '#0f172a' }}>
            <Settings size={24} style={{ color: '#38bdf8' }} />
          </div>
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-1"
              style={{ background: '#e0f2fe', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700 }}>
              <ShieldCheck size={13} />
              <span>ACCOUNT SETTINGS</span>
            </div>
            <h2 className="fs-3 fw-extrabold mb-0 font-heading" style={{ color: '#0f172a' }}>
              Profile & Preferences ⚙️
            </h2>
          </div>
        </div>
        <p className="text-muted small mb-0">Customize your learning experience, study path, and account details.</p>
      </div>

      <Row className="g-4">
        {/* Left: Profile & Study Path */}
        <Col lg={4}>
          {/* Profile Card */}
          <div className="p-4 rounded-4 shadow-sm mb-4" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4"
                style={{
                  width: 80, height: 80,
                  background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                  fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 8px 25px rgba(2,132,199,0.35)'
                }}
              >
                {initials}
              </div>
              <h5 className="fw-bold mb-1" style={{ color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>{displayName}</h5>
              <p className="mb-1" style={{ color: '#64748b', fontSize: '0.8rem' }}>{user?.email}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(2,132,199,0.2)', color: '#38bdf8',
                padding: '3px 12px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize'
              }}>
                <Sparkles size={11} /> {user?.studyRole || 'college'} Student
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              {[
                { label: 'Study Role', value: user?.studyRole || 'college', icon: GraduationCap },
                { label: 'XP Points', value: `${user?.learningStats?.totalXP || 150} XP`, icon: Sparkles },
                { label: 'Institution', value: user?.institution || 'Edura Academy', icon: BookOpen }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <Icon size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{item.label}:</span>
                    <span style={{ color: '#f1f5f9', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Study Path */}
          <div className="p-4 rounded-4 shadow-sm" style={{ background: '#ffffff', border: '1px solid #dbeafe' }}>
            <h6 className="fw-bold mb-3" style={{ color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
              Current Study Path
            </h6>

            {currentRole && (
              <div
                className="p-3 rounded-3 mb-3 d-flex align-items-center gap-3"
                style={{ background: '#f0f7ff', border: `1.5px solid ${currentRole.color}30` }}
              >
                <div className="p-2 rounded-3" style={{ background: `${currentRole.color}20` }}>
                  <currentRole.icon size={20} style={{ color: currentRole.color }} />
                </div>
                <div>
                  <div className="fw-bold" style={{ color: '#0f172a', fontSize: '0.9rem' }}>{currentRole.label} Path</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>{currentRole.description}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowRoleModal(true)}
              className="btn w-100 py-2 rounded-3 fw-bold"
              style={{ background: '#0f172a', color: '#38bdf8', border: '1px solid #1e293b', fontSize: '0.85rem' }}
            >
              <GraduationCap size={15} className="me-2" />
              Switch Study Path
            </button>
          </div>
        </Col>

        {/* Right: Edit Settings */}
        <Col lg={8}>
          <div className="p-4 p-lg-5 rounded-4 shadow-sm" style={{ background: '#ffffff', border: '1px solid #dbeafe' }}>
            <h5 className="fw-bold mb-4 font-heading" style={{ color: '#0f172a' }}>Edit Profile Settings</h5>

            {error && <Alert variant="danger" className="small mb-3">{error}</Alert>}
            {saved && (
              <Alert variant="success" className="small mb-3 d-flex align-items-center gap-2">
                <Check size={16} /> Settings saved successfully!
              </Alert>
            )}

            {/* Name */}
            <div className="mb-4">
              <label className="small fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                <User size={15} style={{ color: '#0284c7' }} /> Display Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-control py-2 px-3 rounded-3"
                style={{ border: '1.5px solid #e2e8f0', fontSize: '0.9rem', background: '#f8fafc' }}
                placeholder="Your first name"
              />
            </div>

            {/* Email (read-only) */}
            <div className="mb-4">
              <label className="small fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                <Mail size={15} style={{ color: '#0284c7' }} /> Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="form-control py-2 px-3 rounded-3"
                style={{ border: '1px solid #e2e8f0', fontSize: '0.9rem', background: '#f1f5f9', color: '#64748b' }}
              />
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Email address cannot be changed.</small>
            </div>

            {/* Institution */}
            <div className="mb-4">
              <label className="small fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                <BookOpen size={15} style={{ color: '#0284c7' }} /> Institution / School
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="form-control py-2 px-3 rounded-3"
                style={{ border: '1.5px solid #e2e8f0', fontSize: '0.9rem', background: '#f8fafc' }}
                placeholder="Your school or college name"
              />
            </div>

            {/* Learning Style */}
            <div className="mb-5">
              <label className="small fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                <Palette size={15} style={{ color: '#0284c7' }} /> Preferred Learning Style
              </label>
              <div className="d-flex flex-column gap-2">
                {LEARNING_STYLES.map((style) => (
                  <div
                    key={style.value}
                    onClick={() => setPreferredLearningStyle(style.value)}
                    className="p-3 rounded-3 d-flex align-items-center gap-3 transition-all"
                    style={{
                      cursor: 'pointer',
                      background: preferredLearningStyle === style.value ? '#edf4fe' : '#f8fafc',
                      border: preferredLearningStyle === style.value ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 32, height: 32, flexShrink: 0,
                        background: preferredLearningStyle === style.value ? '#0284c7' : '#e2e8f0',
                        color: preferredLearningStyle === style.value ? '#ffffff' : '#64748b',
                        fontSize: '0.9rem'
                      }}
                    >
                      {preferredLearningStyle === style.value ? <Check size={16} /> : style.label.split(' ')[0]}
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ color: '#0f172a', fontSize: '0.85rem' }}>{style.label}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>{style.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff', border: 'none', fontSize: '0.95rem',
                boxShadow: '0 6px 20px rgba(2,132,199,0.3)'
              }}
            >
              {saving ? <Spinner animation="border" size="sm" /> : saved ? <Check size={18} /> : <Save size={18} />}
              <span>{saving ? 'Saving...' : saved ? 'Settings Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </Col>
      </Row>

      <StudyRoleModal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
        onRoleChanged={() => { setShowRoleModal(false); refreshUser(); }}
      />
    </div>
  );
};

export default SettingsPage;
