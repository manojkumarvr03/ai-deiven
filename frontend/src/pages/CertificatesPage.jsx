import React from 'react';
import { Award, Download, Share2, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CERTIFICATES = [
  {
    id: 'cert-ui-ux',
    title: 'Professional UI/UX Design Specialist',
    issueDate: 'May 24, 2026',
    credentialId: 'EDU-849204-UIUX',
    grade: '98% (Distinction)',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    issuer: 'Learnify Academic Board'
  },
  {
    id: 'cert-react',
    title: 'Modern Frontend Architecture & React 18',
    issueDate: 'April 10, 2026',
    credentialId: 'EDU-510934-REACT',
    grade: '95% (Honors)',
    skills: ['React.js', 'Redux Toolkit', 'TypeScript', 'REST APIs'],
    issuer: 'Learnify Academic Board'
  }
];

const CertificatesPage = () => {
  const { user } = useAuth();
  const studentName = user?.firstName || user?.name || 'Alex Harrison';

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="fs-3 fw-bold font-heading" style={{ color: '#0f172a' }}>Verified Credentials & Certificates</h2>
          <p className="text-muted small mb-0">Industry-recognized cryptographic certificates earned from course completion</p>
        </div>
      </div>

      <div className="row g-4">
        {CERTIFICATES.map((cert) => (
          <div className="col-lg-6" key={cert.id}>
            <div className="learnify-card-wrapper p-4 h-100 position-relative overflow-hidden">
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)'
                }}
              ></div>

              <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <span className="badge bg-success-subtle text-success small fw-bold">VERIFIED ACCREDITED</span>
                  </div>
                </div>
                <span className="small text-muted font-monospace">{cert.credentialId}</span>
              </div>

              <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{cert.title}</h4>
              <div className="small text-muted mb-3">Issued to <strong>{studentName}</strong> • {cert.issueDate}</div>

              <div className="p-3 rounded-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">Assessment Score:</span>
                  <span className="fw-bold text-success">{cert.grade}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Issued By:</span>
                  <span className="fw-bold" style={{ color: '#0f172a' }}>{cert.issuer}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="small text-muted mb-2 fw-semibold">Mastered Competencies:</div>
                <div className="d-flex flex-wrap gap-1">
                  {cert.skills.map((s) => (
                    <span key={s} className="badge bg-light text-dark border small">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 pt-3 border-top">
                <button
                  className="learnify-continue-btn d-flex align-items-center gap-2 flex-grow-1 justify-content-center"
                  onClick={() => alert(`Downloading verified PDF Certificate: ${cert.credentialId}`)}
                >
                  <Download size={16} /> Download PDF
                </button>
                <button
                  className="btn btn-light border d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-muted fw-semibold small"
                  onClick={() => alert(`Share link copied for ${cert.title}`)}
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;
