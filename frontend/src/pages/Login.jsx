import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const Login = () => {
  const navigate = useNavigate();
  const { login, authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (validationError) setValidationError('');
    if (authError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setValidationError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="edura-login-page d-flex align-items-center justify-content-center min-vh-100 py-4 py-lg-5 px-3">
      <Container className="edura-auth-shell" style={{ maxWidth: '1100px' }}>
        <div className="academic-outer-panel edura-login-panel">
          <Row className="g-0">
            {/* ========================================================================= */}
            {/* LEFT COLUMN: AI Showcase (Restored Before UI Layout in Academic Colors) */}
            {/* ========================================================================= */}
            <Col
              lg={6}
              className="edura-login-showcase d-none d-lg-flex flex-column justify-content-between p-5 position-relative"
              style={{
                background: 'linear-gradient(160deg, #f8fbff 0%, #edf4fe 100%)',
                borderRight: '1px solid #dbeafe'
              }}
            >
              {/* Top Branding & Status */}
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
                  Accelerate Mastery with{' '}
                  <span style={{ color: '#0284c7' }}>Predictive AI Analytics</span>
                </h1>
                <p className="fs-6 mb-4" style={{ color: '#475569', lineHeight: 1.6, maxWidth: '440px' }}>
                  Harness neural learning curves, automated topic diagnostics, and real-time risk prevention built for modern education.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="d-flex flex-column gap-3 my-2">
                {/* Feature 1 */}
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
                      <span className="fw-bold small" style={{ color: '#0f172a' }}>Neural Recommendation Engine</span>
                      <span className="badge-emerald">+34% Efficiency</span>
                    </div>
                    <p className="small mb-0" style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.45 }}>
                      Detects concept dependencies and sequences ideal study material automatically.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
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
                      <span className="fw-bold small" style={{ color: '#0f172a' }}>Early Risk Detection Matrix</span>
                      <span className="badge-purple">92.4% Precision</span>
                    </div>
                    <p className="small mb-0" style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.45 }}>
                      Predicts exam bottlenecks weeks ahead and provides targeted remedy quizzes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Social Proof & Trust */}
              <div className="pt-3 border-top mt-3 d-flex align-items-center justify-content-between" style={{ borderColor: '#e2e8f0' }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '26px', height: '26px', fontSize: '0.7rem', background: '#0284c7', border: '2px solid #ffffff' }}>A</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '26px', height: '26px', fontSize: '0.7rem', background: '#7c3aed', border: '2px solid #ffffff', marginLeft: '-6px' }}>S</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '26px', height: '26px', fontSize: '0.7rem', background: '#059669', border: '2px solid #ffffff', marginLeft: '-6px' }}>M</div>
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
            {/* RIGHT COLUMN: Clean White Login Form */}
            {/* ========================================================================= */}
            <Col
              lg={6}
              xs={12}
              className="edura-login-form p-4 p-sm-5 d-flex flex-column justify-content-center"
              style={{ background: '#ffffff' }}
            >
              {/* Header Title */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h2 className="edura-login-form-title fs-3 fw-bold font-heading mb-0" style={{ color: '#0f172a' }}>
                    Welcome Back
                  </h2>
                  <span className="fs-4">👋</span>
                </div>
                <p className="text-muted small mb-0">
                  Sign in to your personalized AI learning hub
                </p>
              </div>

              {/* Error Message */}
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

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Address */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold mb-1" style={{ color: '#475569' }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <input
                      type="email"
                      name="email"
                      className="academic-input edura-login-input"
                      placeholder="student@university.edu"
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

                {/* Password */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold mb-0" style={{ color: '#475569' }}>
                      Password
                    </label>
                    <a
                      href="#forgot"
                      className="small text-decoration-none fw-semibold"
                      style={{ fontSize: '0.8rem', color: '#0284c7' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="academic-input edura-login-input"
                      style={{ paddingRight: '2.8rem' }}
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
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
                </div>

                {/* Primary Sign In Button */}
                <button type="submit" className="btn-academic-blue edura-login-submit mb-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Registration Link */}
              <div className="text-center small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="edura-login-link fw-bold text-decoration-none ms-1" style={{ color: '#0284c7' }}>
                  Create Free AI Account →
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Login;
