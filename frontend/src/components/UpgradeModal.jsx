import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Sparkles, Check, ShieldCheck, Zap } from 'lucide-react';

const UpgradeModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={{ borderBottom: '1px solid #edf2f7' }}>
        <Modal.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#0f172a' }}>
          <Sparkles size={20} style={{ color: '#2563eb' }} />
          Upgrade to Learnify Enterprise Pro
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          <span className="badge rounded-pill px-3 py-1 mb-2" style={{ background: '#eff6ff', color: '#2563eb', fontWeight: 600 }}>
            EXCLUSIVE 40% DISCOUNT
          </span>
          <h3 className="fw-bold" style={{ color: '#0f172a' }}>Accelerate Your Mastery with Pro Access</h3>
          <p className="text-muted small" style={{ maxWidth: '520px', margin: '0 auto' }}>
            Get unlimited access to 100+ accredited masterclasses, live mentor code reviews, 1-on-1 career coaching, and verifiable verified certificates.
          </p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="p-3 rounded-4 h-100" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
              <h6 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Standard Student</h6>
              <div className="fs-3 fw-bold mb-3" style={{ color: '#64748b' }}>Free</div>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-muted mb-0">
                <li className="d-flex align-items-center gap-2"><Check size={16} className="text-success" /> Access to core community courses</li>
                <li className="d-flex align-items-center gap-2"><Check size={16} className="text-success" /> Standard AI quiz assessments</li>
                <li className="d-flex align-items-center gap-2"><Check size={16} className="text-success" /> Discussion forum access</li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 rounded-4 h-100 position-relative" style={{ background: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)', border: '2px solid #2563eb' }}>
              <div className="position-absolute top-0 end-0 m-3">
                <span className="badge bg-primary rounded-pill">RECOMMENDED</span>
              </div>
              <h6 className="fw-bold mb-2" style={{ color: '#1e40af' }}>Enterprise Pro</h6>
              <div className="fs-3 fw-bold mb-3" style={{ color: '#1e3a8a' }}>$19<span className="fs-6 fw-normal text-muted">/month</span></div>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0" style={{ color: '#1e293b' }}>
                <li className="d-flex align-items-center gap-2"><Check size={16} className="text-primary" /> <strong>All 100+ Pro Masterclasses</strong></li>
                <li className="d-flex align-items-center gap-2"><Check size={16} className="text-primary" /> <strong>Unlimited Live Classes & Mentorship</strong></li>
                <li className="d-flex align-items-center gap-2"><Check size={16} className="text-primary" /> <strong>Industry-Recognized Certificates</strong></li>
                <li className="d-flex align-items-center gap-2"><Check size={16} className="text-primary" /> <strong>Priority 24/7 AI Code Reviewer</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="d-flex align-items-center gap-2 small text-muted">
            <ShieldCheck size={18} className="text-success" />
            <span>30-Day Money-Back Guarantee • Cancel anytime</span>
          </div>
          <Button
            onClick={onHide}
            style={{
              background: '#2563eb',
              border: 'none',
              borderRadius: '999px',
              padding: '8px 24px',
              fontWeight: 600
            }}
          >
            Activate Pro Access
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpgradeModal;
