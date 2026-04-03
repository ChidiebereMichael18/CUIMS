import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/shared/Modal';
import { formatDate, timeAgo } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Student.css';

export default function StudentReports() {
  const { data: appData }        = useFetch('/applications/my');
  const { data, loading, refetch } = useFetch('/reports/my');
  const reports      = data?.reports || [];
  const applications = appData?.applications?.filter((a) => a.status === 'accepted') || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    applicationId: '', weekNumber: '', title: '',
    activitiesCarriedOut: '', skillsLearned: '',
    challenges: '', goalsForNextWeek: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openModal = () => {
    setForm({ applicationId: applications[0]?._id || '', weekNumber: '', title: '', activitiesCarriedOut: '', skillsLearned: '', challenges: '', goalsForNextWeek: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reports', form);
      toast.success('Weekly report submitted!');
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Weekly Reports</h1>
          <p className="page-subtitle">Submit and track your internship progress reports</p>
        </div>
        {applications.length > 0 && (
          <button className="btn btn-primary" onClick={openModal}>+ New Report</button>
        )}
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <strong>No reports yet</strong>
          <p>{applications.length === 0 ? 'You need an active internship to submit reports' : 'Submit your first weekly report'}</p>
        </div>
      ) : (
        <div className="report-list">
          {reports.map((r) => (
            <div key={r._id} className="card report-card">
              <div className="report-card-header">
                <div>
                  <span className="badge badge-blue">Week {r.weekNumber}</span>
                  <h3 className="report-title">{r.title}</h3>
                  <p className="report-meta">{r.internship?.title} · {r.internship?.company} · {timeAgo(r.createdAt)}</p>
                </div>
              </div>
              {r.activitiesCarriedOut && (
                <div className="report-section">
                  <div className="report-section-label">Activities carried out</div>
                  <p>{r.activitiesCarriedOut}</p>
                </div>
              )}
              {r.skillsLearned && (
                <div className="report-section">
                  <div className="report-section-label">Skills learned</div>
                  <p>{r.skillsLearned}</p>
                </div>
              )}
              {r.challenges && (
                <div className="report-section">
                  <div className="report-section-label">Challenges faced</div>
                  <p>{r.challenges}</p>
                </div>
              )}
              {r.goalsForNextWeek && (
                <div className="report-section">
                  <div className="report-section-label">Goals for next week</div>
                  <p>{r.goalsForNextWeek}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Report Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Submit Weekly Report" width={600}>
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label className="form-label">Internship</label>
            <select className="form-select" name="applicationId" value={form.applicationId} onChange={handleChange} required>
              <option value="">Select internship</option>
              {applications.map((a) => (
                <option key={a._id} value={a._id}>{a.internship?.title} — {a.internship?.company}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Week number</label>
              <input className="form-input" type="number" name="weekNumber" min={1} value={form.weekNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Report title</label>
              <input className="form-input" name="title" placeholder="e.g. Week 3 Progress Report" value={form.title} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Activities carried out</label>
            <textarea className="form-textarea" name="activitiesCarriedOut" placeholder="Describe what you worked on this week…" value={form.activitiesCarriedOut} onChange={handleChange} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Skills learned</label>
            <textarea className="form-textarea" name="skillsLearned" placeholder="What new skills or knowledge did you acquire?" value={form.skillsLearned} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Challenges faced</label>
            <textarea className="form-textarea" name="challenges" placeholder="Any difficulties or blockers?" value={form.challenges} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Goals for next week</label>
            <textarea className="form-textarea" name="goalsForNextWeek" placeholder="What do you plan to achieve next week?" value={form.goalsForNextWeek} onChange={handleChange} rows={2} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><span className="spinner" />Submitting…</> : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}