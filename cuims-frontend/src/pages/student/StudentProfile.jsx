import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Student.css';

export default function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    course: user?.course || '', yearOfStudy: user?.yearOfStudy || '',
    bio: user?.bio || '', studentId: user?.studentId || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      await refreshUser();
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
        {!editing && (
          <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Profile</button>
        )}
      </div>

      <div className="card">
        {/* Avatar row */}
        <div className="profile-header">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
            <span className="badge badge-blue" style={{ marginTop: 6 }}>Student</span>
          </div>
        </div>

        <hr className="divider" />

        {editing ? (
          <form onSubmit={handleSave} className="profile-form">
            <div className="profile-grid">
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input className="form-input" name="studentId" value={form.studentId} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Course / Programme</label>
                <input className="form-input" name="course" value={form.course} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Year of study</label>
                <input className="form-input" type="number" name="yearOfStudy" min={1} max={6} value={form.yearOfStudy} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 4 }}>
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" name="bio" rows={3} placeholder="Short bio or professional summary…" value={form.bio} onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><span className="spinner" />Saving…</> : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-grid">
              <ProfileField label="Student ID"    value={user?.studentId} />
              <ProfileField label="Course"         value={user?.course} />
              <ProfileField label="Year of study"  value={user?.yearOfStudy ? `Year ${user.yearOfStudy}` : null} />
              <ProfileField label="Phone"          value={user?.phone} />
            </div>
            {user?.bio && (
              <div style={{ marginTop: 16 }}>
                <div className="profile-field-label">Bio</div>
                <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <div className="profile-field-label">{label}</div>
      <div className="profile-field-value">{value || <span style={{ color: 'var(--gray-400)' }}>Not set</span>}</div>
    </div>
  );
}