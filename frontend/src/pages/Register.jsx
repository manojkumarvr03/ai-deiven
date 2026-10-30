import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const Register = () => {
  const navigate = useNavigate();
  const { register, authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    termsAgreed: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Password strength calculation
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { label: '', color: '' };
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;

    if (score <= 25) return { label: 'Weak', color: '#ef4444' };
    if (score <= 50) return { label: 'Fair', color: '#f59e0b' };
    if (score <= 75) return { label: 'Good', color: '#3b82f6' };
    return { label: 'Strong', color: '#10b981' };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationError) setValidationError('');
    if (authError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.firstName.trim()) {
      setValidationError('Please enter your first name.');
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setValidationError('Please fill in your email address and password.');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.termsAgreed) {
      setValidationError('Please accept the Terms & Conditions to proceed.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      firstName: formData.firstName.trim(),
      name: formData.firstName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'student'
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-4 py-lg-5 px-3" style={{ background: 'radial-gradient(circle at 10% 20%, #e0f2fe 0%, #f0f7ff 50%, #edf6ff 100%)' }}>
      <Container style={{ maxWidth: '1100px' }}>
        <div className="academic-outer-panel">
          <Row className="g-0">
            {/* ========================================================================= */}
            {/* LEFT COLUMN: AI Showcase (Academic Blue & White Theme) */}
            {/* ========================================================================= */}
            <Col
              lg={6}
              className="d-none d-lg-flex flex-column justify-content-between p-5 position-relative"
              style={{
                background: 'linear-gradient(160deg, #f8fbff 0%, #edf4fe 100%)',
                borderRight: '1px solid #dbeafe'
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                      style={{ background: '#0284c7', width: '42px', height: '42px' }}
                    >
                      <BrainCircuit size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="fs-4 fw-bold font-heading mb-0" style={{ color: '#0f172a' }}>
                        Edura<span style={{ color: '#0284c7' }}>.AI</span>
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.04em', fontWeight: 600 }}>
                        NEXT-GEN LEARNING PLATFORM
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: '#e0f2fe', border: '1px solid #bae6fd' }}>
                    <div className="pulse-indicator-blue"></div>
                    <span className="small fw-bold" style={{ fontSize: '0.72rem', color: '#0284c7' }}>ML ENGINE ACTIVE</span>
                  </div>
                </div>

                {/* Hero Title */}
                <h1 className="fs-2 fw-extrabold mb-3 font-heading" style={{ color: '#0f172a', lineHeight: 1.25 }}>
                  Empower Your Study with{' '}
                  <span style={{ color: '#0284c7' }}>Intelligent AI Analytics</span>
                </h1>
                <p className="fs-6 mb-4" style={{ color: '#475569', lineHeight: 1.6, maxWidth: '440px' }}>
                  Experience real-time performance tracking, adaptive course pathways, and sequential mastery progression tailored for you.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="d-flex flex-column gap-3 my-2">
                <div
                  className="academic-feature-card d-flex align-items-start gap-3"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #dbeafe',
                    borderRadius: '14px',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.08)'
                  }}
                >
                  <div className="p-2 rounded-3 mt-1 flex-shrink-0" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                    <TrendingUp size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small" style={{ color: '#0f172a' }}>Adaptive Recommendation Engine</span>
                      <span className="badge-emerald">+34% Efficiency</span>
                    </div>
                    <p className="small mb-0" style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.45 }}>
                      Pinpoint weak topics & sequence ideal study material automatically.
                    </p>
                  </div>
                </div>

                <div
                  className="academic-feature-card d-flex align-items-start gap-3"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #dbeafe',
                    borderRadius: '14px',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.08)'
                  }}
                >
                  <div className="p-2 rounded-3 mt-1 flex-shrink-0" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                    <Zap size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small" style={{ color: '#0f172a' }}>Sequential Course Unlock</span>
                      <span className="badge-purple">Progressive Mastery</span>
                    </div>
                    <p className="small mb-0" style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.45 }}>
                      Master each level, pass verified diagnostic quizzes, and unlock next modules seamlessly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Trust */}
              <div className="pt-3 border-top mt-3 d-flex align-items-center justify-content-between" style={{ borderColor: '#e2e8f0' }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '26px', height: '26px', fontSize: '0.7rem', background: '#0284c7', border: '2px solid #ffffff' }}>M</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '26px', height: '26px', fontSize: '0.7rem', background: '#7c3aed', border: '2px solid #ffffff', marginLeft: '-6px' }}>A</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '26px', height: '26px', fontSize: '0.7rem', background: '#059669', border: '2px solid #ffffff', marginLeft: '-6px' }}>S</div>
                  </div>
                  <span className="small fw-semibold text-muted" style={{ fontSize: '0.78rem' }}>12.5k+ active scholars</span>
                </div>

                <div className="d-flex align-items-center gap-1 small fw-semibold text-success" style={{ fontSize: '0.78rem' }}>
                  <ShieldCheck size={16} />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>
            </Col>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: Clean White Register Form */}
            {/* ========================================================================= */}
            <Col
              lg={6}
              xs={12}
              className="p-4 p-sm-5 d-flex flex-column justify-content-center"
              style={{ background: '#ffffff' }}
            >
              {/* Header Title */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h2 className="fs-3 fw-bold font-heading mb-0" style={{ color: '#0f172a' }}>
                    Create Account
                  </h2>
                  <span className="badge-blue">Student</span>
                </div>
                <p className="text-muted small mb-0">
                  Join the academic excellence community
                </p>
              </div>

              {/* Error Alert Display */}
              {(validationError || authError) && (
                <Alert
                  variant="danger"
                  className="border-0 d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-3"
                  style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <div className="small fw-semibold">{validationError || authError}</div>
                </Alert>
              )}

              {/* Registration Form with Requested Fields */}
              <form onSubmit={handleSubmit}>
                {/* 1. First Name */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold mb-1" style={{ color: '#475569' }}>
                    First Name
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      name="firstName"
                      className="academic-input"
                      placeholder="Manoj"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <User
                      size={18}
                      className="position-absolute"
                      style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}
                    />
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold mb-1" style={{ color: '#475569' }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <input
                      type="email"
                      name="email"
                      className="academic-input"
                      placeholder="manoj@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                    />
                    <Mail
                      size={18}
                      className="position-absolute"
                      style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}
                    />
                  </div>
                </div>

                {/* 3. Password */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold mb-1" style={{ color: '#475569' }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="academic-input"
                      style={{ paddingRight: '2.8rem' }}
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                    <Lock
                      size={18}
                      className="position-absolute"
                      style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}
                    />
                    <button
                      type="button"
                      className="btn position-absolute p-0 border-0 shadow-none d-flex align-items-center justify-content-center"
                      style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 5, color: '#64748b' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Live Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-1 d-flex align-items-center justify-content-between">
                      <span className="small fw-bold" style={{ color: strength.color, fontSize: '0.78rem' }}>
                        Strength: {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Terms & Conditions */}
                <div className="form-check mt-3 mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsAgreed"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    style={{ cursor: 'pointer', borderColor: '#cbd5e1' }}
                  />
                  <label className="form-check-label small text-muted user-select-none" htmlFor="termsAgreed" style={{ cursor: 'pointer', fontSize: '0.82rem' }}>
                    I agree to the <a href="#terms" className="fw-semibold text-decoration-none" style={{ color: '#0284c7' }}>Terms of Service</a> and <a href="#privacy" className="fw-semibold text-decoration-none" style={{ color: '#0284c7' }}>Privacy Policy</a>.
                  </label>
                </div>

                {/* Submit Action Button */}
                <button type="submit" className="btn-academic-blue mt-2 mb-3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Free AI Account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center small text-muted">
                Already have an account?{' '}
                <Link to="/login" className="fw-bold text-decoration-none ms-1" style={{ color: '#0284c7' }}>
                  Log In Here
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Register;
