import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { StatusBadge, TypeBadge } from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import { formatDate } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Student.css';

export default function InternshipDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { data, loading } = useFetch(`/internships/${id}`);
  const internship  = data?.internship;

  const [modalOpen, setModalOpen]   = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume]         = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) return toast.error('Cover letter is required');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('internshipId', id);
      fd.append('coverLetter', coverLetter);
      if (resume) fd.append('resume', resume);
      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted successfully!');
      setModalOpen(false);
      navigate('/my-applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!internship) return <div className="empty-state"><p>Internship not found.</p></div>;

  const isOpen = internship.status === 'open' && new Date() < new Date(internship.applicationDeadline);

  return (
    <div className="detail-layout">
      {/* Back */}
      <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-main">
        {/* Header card */}
        <div className="card detail-header-card">
          <div className="detail-header-top">
            <div className="detail-company-logo">{internship.company?.[0]}</div>
            <div className="detail-header-info">
              <h1 className="detail-title">{internship.title}</h1>
              <p className="detail-company">{internship.company}</p>
              <div className="detail-badges">
                <TypeBadge type={internship.type} />
                <StatusBadge status={internship.status} />
                <span className="badge badge-gray">📍 {internship.location}</span>
                <span className="badge badge-gray">⏱ {internship.duration}</span>
              </div>
            </div>
            {isOpen && (
              <button className="btn btn-primary btn-lg" onClick={() => setModalOpen(true)}>
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">
          <div className="detail-content">
            <section className="card detail-section">
              <h2 className="detail-section-title">About this internship</h2>
              <p className="detail-text">{internship.description}</p>
            </section>

            {internship.requirements && (
              <section className="card detail-section">
                <h2 className="detail-section-title">Requirements</h2>
                <p className="detail-text">{internship.requirements}</p>
              </section>
            )}

            {internship.benefits && (
              <section className="card detail-section">
                <h2 className="detail-section-title">Benefits</h2>
                <p className="detail-text">{internship.benefits}</p>
              </section>
            )}

            {internship.skills?.length > 0 && (
              <section className="card detail-section">
                <h2 className="detail-section-title">Skills required</h2>
                <div className="skills-list">
                  {internship.skills.map((s) => <span key={s} className="badge badge-blue">{s}</span>)}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar info */}
          <aside className="detail-aside">
            <div className="card">
              <h3 className="detail-section-title">Details</h3>
              <div className="detail-info-list">
                <div className="detail-info-row">
                  <span className="detail-info-label">Stipend</span>
                  <span className="detail-info-value">{internship.stipend || 'Unpaid'}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Duration</span>
                  <span className="detail-info-value">{internship.duration}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Slots</span>
                  <span className="detail-info-value">{internship.slots}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Start date</span>
                  <span className="detail-info-value">{formatDate(internship.startDate)}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Deadline</span>
                  <span className="detail-info-value" style={{ color: 'var(--color-danger)' }}>{formatDate(internship.applicationDeadline)}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="detail-section-title">Supervisor</h3>
              <div className="detail-supervisor">
                <div className="supervisor-avatar">{internship.createdBy?.name?.[0]}</div>
                <div>
                  <div className="supervisor-name">{internship.createdBy?.name}</div>
                  <div className="supervisor-org">{internship.createdBy?.organization}</div>
                  <div className="supervisor-email">{internship.createdBy?.email}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Apply — ${internship.title}`} width={560}>
        <form onSubmit={handleApply} className="apply-form">
          <div className="form-group">
            <label className="form-label">Cover letter <span style={{color:'var(--color-danger)'}}>*</span></label>
            <textarea
              className="form-textarea"
              rows={7}
              placeholder="Tell the supervisor why you're a great fit for this role…"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              style={{ minHeight: 140 }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Resume / CV (optional)</label>
            <input
              className="form-input"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg"
              onChange={(e) => setResume(e.target.files[0])}
            />
            <span className="form-hint">PDF, DOC or image — max 5MB</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><span className="spinner" />Submitting…</> : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}