import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/shared/Modal';
import { timeAgo } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Supervisor.css';

export default function SupervisorReports() {
  const { data, loading, refetch }      = useFetch('/reports/supervisor-overview');
  const { data: internData }            = useFetch('/applications/my-interns');
  const reports = data?.reports || [];
  const interns = internData?.interns || [];

  const [modalOpen, setModalOpen]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    applicationId: '', weekNumber: '', title: '',
    studentPerformance: '', areasOfImprovement: '',
    overallFeedback: '', rating: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openModal = () => {
    setForm({ applicationId: interns[0]?._id || '', weekNumber: '', title: '', studentPerformance: '', areasOfImprovement: '', overallFeedback: '', rating: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reports', form);
      toast.success('Supervisor report submitted!');
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const studentReports = reports.filter((r) => r.authorRole === 'student');
  const myReports      = reports.filter((r) => r.authorRole === 'supervisor');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Weekly reports from your interns and your own evaluations</p>
        </div>
        {interns.length > 0 && (
          <button className="btn btn-primary" onClick={openModal}>+ Submit Evaluation</button>
        )}
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Intern reports */}
          <section>
            <h2 className="section-title" style={{ marginBottom: 12 }}>Intern Reports ({studentReports.length})</h2>
            {studentReports.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div className="empty-icon">📝</div>
                <strong>No intern reports yet</strong>
              </div>
            ) : (
              <div className="report-list">
                {studentReports.map((r) => (
                  <div key={r._id} className="card report-card-sv">
                    <div className="report-sv-header">
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="mini-avatar">{r.author?.name?.[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{r.author?.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{r.internship?.title} · Week {r.weekNumber}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{timeAgo(r.createdAt)}</div>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>{r.title}</div>
                    {r.activitiesCarriedOut && <div className="report-field"><span className="report-field-label">Activities:</span> {r.activitiesCarriedOut}</div>}
                    {r.skillsLearned        && <div className="report-field"><span className="report-field-label">Skills learned:</span> {r.skillsLearned}</div>}
                    {r.challenges           && <div className="report-field"><span className="report-field-label">Challenges:</span> {r.challenges}</div>}
                    {r.goalsForNextWeek     && <div className="report-field"><span className="report-field-label">Next week goals:</span> {r.goalsForNextWeek}</div>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My evaluations */}
          <section>
            <h2 className="section-title" style={{ marginBottom: 12 }}>My Evaluations ({myReports.length})</h2>
            {myReports.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div className="empty-icon">✍️</div>
                <strong>No evaluations submitted yet</strong>
              </div>
            ) : (
              <div className="report-list">
                {myReports.map((r) => (
                  <div key={r._id} className="card report-card-sv">
                    <div className="report-sv-header">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{r.internship?.title} · Week {r.weekNumber}</div>
                      </div>
                      {r.rating && (
                        <div className="report-rating">
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          <span style={{ marginLeft: 6 }}>{r.rating}/5</span>
                        </div>
                      )}
                    </div>
                    {r.studentPerformance  && <div className="report-field"><span className="report-field-label">Performance:</span> {r.studentPerformance}</div>}
                    {r.areasOfImprovement  && <div className="report-field"><span className="report-field-label">Areas to improve:</span> {r.areasOfImprovement}</div>}
                    {r.overallFeedback     && <div className="report-field"><span className="report-field-label">Overall feedback:</span> {r.overallFeedback}</div>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Submit Evaluation Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Submit Intern Evaluation" width={600}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Intern</label>
            <select className="form-select" name="applicationId" value={form.applicationId} onChange={handleChange} required>
              <option value="">Select intern</option>
              {interns.map((a) => (
                <option key={a._id} value={a._id}>{a.student?.name} — {a.internship?.title}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Week number</label>
              <input className="form-input" type="number" name="weekNumber" min={1} value={form.weekNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Evaluation title</label>
              <input className="form-input" name="title" placeholder="e.g. Week 3 Evaluation" value={form.title} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Student performance</label>
            <textarea className="form-textarea" name="studentPerformance" rows={2} placeholder="How is the intern performing overall?" value={form.studentPerformance} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Areas of improvement</label>
            <textarea className="form-textarea" name="areasOfImprovement" rows={2} placeholder="What can the intern work on?" value={form.areasOfImprovement} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Overall feedback</label>
            <textarea className="form-textarea" name="overallFeedback" rows={2} placeholder="General comments or feedback…" value={form.overallFeedback} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Rating (1–5)</label>
            <select className="form-select" name="rating" value={form.rating} onChange={handleChange}>
              <option value="">No rating</option>
              {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} — {'★'.repeat(n)}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><span className="spinner" />Submitting…</> : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}