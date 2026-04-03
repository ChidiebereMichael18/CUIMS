import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { StatusBadge } from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import { timeAgo } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Supervisor.css';

export default function Applicants() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { data, loading, refetch } = useFetch(`/applications/internship/${id}`);
  const applications = data?.applications || [];

  const [selected, setSelected]   = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: '', supervisorNote: '', startDate: '', endDate: '' });
  const [saving, setSaving]         = useState(false);

  const openReview = (app) => {
    setSelected(app);
    setReviewForm({ status: app.status, supervisorNote: app.supervisorNote || '', startDate: '', endDate: '' });
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/applications/${selected._id}/review`, reviewForm);
      toast.success('Application updated');
      setSelected(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 6 }}>← Back</button>
          <h1 className="page-title">Applicants</h1>
          <p className="page-subtitle">{data?.count ?? 0} application{data?.count !== 1 ? 's' : ''} received</p>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <strong>No applications yet</strong>
          <p>Share your internship listing to attract applicants</p>
        </div>
      ) : (
        <div className="applicant-list">
          {applications.map((app) => (
            <div key={app._id} className="applicant-card card">
              <div className="applicant-card-top">
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div className="mini-avatar large">{app.student?.name?.[0]}</div>
                  <div>
                    <div className="applicant-name">{app.student?.name}</div>
                    <div className="applicant-meta">
                      {app.student?.studentId && <span>{app.student.studentId}</span>}
                      {app.student?.course    && <span>· {app.student.course}</span>}
                      {app.student?.yearOfStudy && <span>· Year {app.student.yearOfStudy}</span>}
                    </div>
                    <div className="applicant-email">{app.student?.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <StatusBadge status={app.status} />
                  <button className="btn btn-secondary btn-sm" onClick={() => openReview(app)}>Review</button>
                </div>
              </div>

              <div className="applicant-cover">
                <div className="applicant-cover-label">Cover letter</div>
                <p>{app.coverLetter}</p>
              </div>

              {app.resumeUrl && (
                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  📎 View Resume
                </a>
              )}

              {app.supervisorNote && (
                <div className="applicant-note">
                  <strong>Your note:</strong> {app.supervisorNote}
                </div>
              )}

              <div className="applicant-footer">Applied {timeAgo(app.createdAt)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Review modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Review — ${selected?.student?.name}`} width={480}>
        <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Decision</label>
            <select className="form-select" value={reviewForm.status} onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })} required>
              <option value="">Select…</option>
              <option value="reviewing">Mark as Reviewing</option>
              <option value="accepted">Accept</option>
              <option value="rejected">Reject</option>
            </select>
          </div>
          {reviewForm.status === 'accepted' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Start date</label>
                <input className="form-input" type="date" value={reviewForm.startDate} onChange={(e) => setReviewForm({ ...reviewForm, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">End date</label>
                <input className="form-input" type="date" value={reviewForm.endDate} onChange={(e) => setReviewForm({ ...reviewForm, endDate: e.target.value })} />
              </div>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Note to student (optional)</label>
            <textarea className="form-textarea" rows={3} placeholder="Feedback or reason…" value={reviewForm.supervisorNote} onChange={(e) => setReviewForm({ ...reviewForm, supervisorNote: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !reviewForm.status}>
              {saving ? <><span className="spinner" />Saving…</> : 'Save Decision'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}