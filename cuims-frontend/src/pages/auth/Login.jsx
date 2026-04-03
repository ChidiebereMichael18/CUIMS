import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const { login, logout } = useAuth(); // Import logout

  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Clear any existing session when coming to the login page
  useEffect(() => {
    logout();
  }, [logout]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const homes = { student: '/internships', supervisor: '/supervisor', admin: '/admin' };
      window.location.href = homes[user.role] || '/internships';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h1 className="auth-headline">Internship management,<br /><em>simplified.</em></h1>
          <p className="auth-tagline">Cavendish University's platform connecting students with professional internship opportunities.</p>
          <ul className="auth-features">
            <li><span className="auth-feat-dot" />Browse and apply to verified internships</li>
            <li><span className="auth-feat-dot" />Track applications and weekly reports</li>
            <li><span className="auth-feat-dot" />Supervisors manage interns in one place</li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your CUIMS account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@cavendish.ac.ug"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" />Signing in…</> : 'Sign in'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
{/* 
          <div className="auth-demo">
            <p className="auth-demo-title">Demo credentials</p>
            <div className="auth-demo-grid">
              <div><strong>Admin</strong><br />admin@cavendish.ac.ug</div>
              <div><strong>Supervisor</strong><br />sarah.nakato@techcorp.ug</div>
              <div><strong>Student</strong><br />allan.mukasa@students…</div>
            </div>
            <p style={{fontSize:12,color:'var(--gray-400)',marginTop:6}}>All demo passwords: <code>Admin@1234</code> / <code>Super@1234</code> / <code>Student@1234</code></p>
          </div> */}
        </div>
      </div>
    </div>
  );
}