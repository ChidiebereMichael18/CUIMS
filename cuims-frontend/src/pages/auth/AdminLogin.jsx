import { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function AdminLogin() {
  const { login, logout } = useAuth(); // Import logout

  // Pre-filled dummy credentials for Admin login
  const [form, setForm] = useState({ email: 'admin@cavendish.ac.ug', password: 'Admin@1234' });
  const [loading, setLoading] = useState(false);

  // Clear any existing session when coming to the admin login page
  useEffect(() => {
    logout();
  }, [logout]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('Access denied. Administrator privileges required.');
        return;
      }
      window.location.href = '/admin';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ background: 'var(--gray-900)' }}>
        <div className="auth-brand">
          <img src="/cuims-logo.png" alt="CUIMS Logo" style={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0, borderRadius: '50%' }} />
          <em className="logo-text">CUIMS</em>
        </div>
        <div className="auth-left-content">
          <h1 className="auth-headline">CUIMS<br /><em>Administration.</em></h1>
          <p className="auth-tagline">Secure access portal for system administrators and university management.</p>
          <ul className="auth-features">
            <li><span className="auth-feat-dot" />Govern system access & supervisor roles</li>
            <li><span className="auth-feat-dot" />Monitor university-wide internship analytics</li>
            <li><span className="auth-feat-dot" />Resolve issues & manage master records</li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card" style={{ borderTop: '4px solid var(--gray-900)' }}>
          <div className="auth-card-header">
            <h2>Admin Portal Access</h2>
            <p>Secure login for authorized personnel</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Administrator Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading} style={{ background: 'var(--gray-900)', border: 'none' }}>
              {loading ? <><span className="spinner" />Authenticating…</> : 'Secure Login'}
            </button>
          </form>

          <div className="auth-demo" style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              <em>Demo Environment:</em> Credentials are pre-filled<br/>
              <strong>{form.email}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
