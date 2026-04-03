import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Supervisor.css';

const EMPTY = {
  title: '', description: '', company: '', location: '',
  type: 'on-site', duration: '', applicationDeadline: '',
  startDate: '', slots: '', stipend: '', skills: '',
  requirements: '', benefits: '',
};

export default function InternshipForm() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = !!id;
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/internships/${id}`).then(({ data }) => {
      const i = data.internship;
      setForm({
        title: i.title, description: i.description, company: i.company,
        location: i.location, type: i.type, duration: i.duration,
        applicationDeadline: i.applicationDeadline?.slice(0, 10) || '',
        startDate: i.startDate?.slice(0, 10) || '',
        slots: i.slots, stipend: i.stipend || '',
        skills: i.skills?.join(', ') || '',
        requirements: i.requirements || '', benefits: i.benefits || '',
      });
      setLoading(false);
    }).catch(() => { toast.error('Failed to load'); navigate('/supervisor/internships'); });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slots: Number(form.slots),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (isEdit) {
        await api.put(`/internships/${id}`, payload);
        toast.success('Internship updated');
      } else {
        await api.post('/internships', payload);
        toast.success('Internship posted!');
      }
      navigate('/supervisor/internships');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Internship' : 'Post New Internship'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update your internship listing' : 'Fill in the details to post a new internship'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="internship-form card">
        <h3 className="form-section-title">Basic information</h3>
        <div className="form-2col">
          <div className="form-group">
            <label className="form-label">Job title <span className="req">*</span></label>
            <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Engineering Intern" required />
          </div>
          <div className="form-group">
            <label className="form-label">Company <span className="req">*</span></label>
            <input className="form-input" name="company" value={form.company} onChange={handleChange} placeholder="Your organization name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Location <span className="req">*</span></label>
            <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="City, Country" required />
          </div>
          <div className="form-group">
            <label className="form-label">Work type <span className="req">*</span></label>
            <select className="form-select" name="type" value={form.type} onChange={handleChange}>
              <option value="on-site">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Duration <span className="req">*</span></label>
            <input className="form-input" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months, 12 weeks" required />
          </div>
          <div className="form-group">
            <label className="form-label">Available slots <span className="req">*</span></label>
            <input className="form-input" type="number" name="slots" value={form.slots} onChange={handleChange} min={1} placeholder="Number of openings" required />
          </div>
          <div className="form-group">
            <label className="form-label">Application deadline <span className="req">*</span></label>
            <input className="form-input" type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Start date</label>
            <input className="form-input" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Stipend</label>
            <input className="form-input" name="stipend" value={form.stipend} onChange={handleChange} placeholder="e.g. UGX 300,000/month or Unpaid" />
          </div>
          <div className="form-group">
            <label className="form-label">Required skills</label>
            <input className="form-input" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, Python (comma-separated)" />
          </div>
        </div>

        <hr className="divider" />
        <h3 className="form-section-title">Description</h3>

        <div className="form-group">
          <label className="form-label">Internship description <span className="req">*</span></label>
          <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe the role, responsibilities, and what the intern will do…" required style={{ minHeight: 120 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Requirements</label>
          <textarea className="form-textarea" name="requirements" value={form.requirements} onChange={handleChange} rows={3} placeholder="Year of study, prerequisite courses, qualifications…" />
        </div>
        <div className="form-group">
          <label className="form-label">Benefits</label>
          <textarea className="form-textarea" name="benefits" value={form.benefits} onChange={handleChange} rows={3} placeholder="Mentorship, certificate, possible employment, etc." />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/supervisor/internships')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <><span className="spinner" />{isEdit ? 'Saving…' : 'Posting…'}</> : isEdit ? 'Save Changes' : 'Post Internship'}
          </button>
        </div>
      </form>
    </div>
  );
}