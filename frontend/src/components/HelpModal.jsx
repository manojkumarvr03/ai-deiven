import React from 'react';
import { Modal, Button, Accordion } from 'react-bootstrap';
import { HelpCircle, Mail, MessageSquare, BookOpen, ExternalLink } from 'lucide-react';

const HelpModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={{ borderBottom: '1px solid #edf2f7' }}>
        <Modal.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#0f172a' }}>
          <HelpCircle size={20} style={{ color: '#2563eb' }} />
          Learnify Help Center
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          <h4 className="fw-bold" style={{ color: '#0f172a' }}>How can we help you today?</h4>
          <p className="text-muted small">Find quick answers, explore guides, or reach out to our 24/7 academic support team.</p>
        </div>

        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>How do I earn Course Certificates?</Accordion.Header>
            <Accordion.Body className="small text-muted">
              Complete 100% of the lessons, submit all module assignments, and pass the final diagnostic assessment with a score of 80% or higher.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>How do live interactive classes work?</Accordion.Header>
            <Accordion.Body className="small text-muted">
              Live classes take place directly inside the portal. Click "Join Now" during live sessions to enter the interactive video stream and live coding editor.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>How are XP Points and Streaks calculated?</Accordion.Header>
            <Accordion.Body className="small text-muted">
              You earn 50 XP per completed lesson, 100 XP per assignment, and streak days increase every consecutive calendar day you log in and practice.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-3 rounded-3 d-flex align-items-center gap-3" style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}>
              <Mail size={22} style={{ color: '#2563eb' }} />
              <div>
                <div className="fw-bold small" style={{ color: '#0f172a' }}>Email Support</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>support@learnify.ai (Avg. 15m response)</div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 rounded-3 d-flex align-items-center gap-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <MessageSquare size={22} style={{ color: '#64748b' }} />
              <div>
                <div className="fw-bold small" style={{ color: '#0f172a' }}>Community Discord</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Join 15,000+ active learners online</div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: '1px solid #edf2f7' }}>
        <Button variant="secondary" onClick={onHide} style={{ borderRadius: '999px', fontSize: '0.85rem' }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HelpModal;
