import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [role, setRole]     = useState('student');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    studentId: '', course: '', yearOfStudy: '',
    organization: '', jobTitle: '', phone: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const payload = { ...form, role };
      delete payload.confirmPassword;
      const data = await register(payload);
      toast.success(data.message || 'Registered successfully!');
      const homes = { student: '/internships', supervisor: '/supervisor' };
      navigate(homes[role]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <img src="/cuims-logo.png" alt="CUIMS Logo" style={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0, borderRadius: '50%' }} />
          <em className="logo-text">CUIMS</em>
        </div>
        <div className="auth-left-content">
          <h1 className="auth-headline">Join the CUIMS<br /><em>community.</em></h1>
          <p className="auth-tagline">Create your account and start your professional journey through Cavendish University's internship platform.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Register as a student or supervisor</p>
          </div>

          {/* Role toggle */}
          <div className="auth-role-toggle">
            <button
              type="button"
              className={`auth-role-btn${role === 'student' ? ' active' : ''}`}
              onClick={() => setRole('student')}
            >Student</button>
            <button
              type="button"
              className={`auth-role-btn${role === 'supervisor' ? ' active' : ''}`}
              onClick={() => setRole('supervisor')}
            >Supervisor</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            {/* Student-specific */}
            {role === 'student' && (
              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input className="form-input" name="studentId" placeholder="CU2021/BSC/001" value={form.studentId} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Course / Programme</label>
                  <input className="form-input" name="course" placeholder="BSc Computer Science" value={form.course} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* Supervisor-specific */}
            {role === 'supervisor' && (
              <>
                <div className="auth-form-row">
                  <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input className="form-input" name="organization" placeholder="Company / Institution" value={form.organization} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job title</label>
                    <input className="form-input" name="jobTitle" placeholder="e.g. Engineering Manager" value={form.jobTitle} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone number</label>
                  <input className="form-input" name="phone" placeholder="+256700000000" value={form.phone} onChange={handleChange} />
                </div>
              </>
            )}

            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <input className="form-input" type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            {role === 'supervisor' && (
              <p className="form-hint" style={{background:'var(--blue-50)',padding:'10px 12px',borderRadius:'var(--radius-sm)',borderLeft:'3px solid var(--blue-400)'}}>
                Supervisor accounts require admin approval before you can post internships.
              </p>
            )}

            <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" />Creating account…</> : 'Create account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}