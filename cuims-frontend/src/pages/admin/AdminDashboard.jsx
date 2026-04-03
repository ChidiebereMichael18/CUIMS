import { useFetch } from '../../hooks/useFetch';
import { Link } from 'react-router-dom';
import { Users, Briefcase, ClipboardList, FileText, AlertTriangle } from 'lucide-react';
import './Admin.css';

export default function AdminDashboard() {
  const { data, loading } = useFetch('/admin/stats');
  const s = data?.stats;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Overview</h1>
          <p className="page-subtitle">Cavendish University Internship Management System</p>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <>
          <div className="admin-stats-grid">
            <StatCard icon={<Users size={24} />} label="Total users"        value={s?.totalUsers}        sub={`${s?.totalStudents} students · ${s?.totalSupervisors} supervisors`} />
            <StatCard icon={<Briefcase size={24} />} label="Internships"         value={s?.totalInternships}   sub={`${s?.openInternships} open`} color="blue" />
            <StatCard icon={<ClipboardList size={24} />} label="Applications"        value={s?.totalApplications}  sub={`${s?.acceptedApplications} accepted`} color="green" />
            <StatCard icon={<FileText size={24} />} label="Reports submitted"   value={s?.totalReports}        sub="weekly logs" color="amber" />
          </div>

          {s?.pendingSupervisors > 0 && (
            <div className="admin-alert">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="var(--amber-600)" />
                <strong>{s.pendingSupervisors}</strong> supervisor{s.pendingSupervisors !== 1 ? 's' : ''} pending approval
              </span>
              <Link to="/admin/users?role=supervisor&isApproved=false" className="btn btn-primary btn-sm">Review Now</Link>
            </div>
          )}

          <div className="admin-quick-links">
            <h2 className="section-title" style={{ marginBottom: 14 }}>Quick access</h2>
            <div className="quick-links-grid">
              {[
                { to: '/admin/users',        icon: <Users size={24} />, title: 'User Management',   desc: 'View, edit and approve users' },
                { to: '/admin/internships',  icon: <Briefcase size={24} />, title: 'Internships',        desc: 'All posted internship listings' },
                { to: '/admin/applications', icon: <ClipboardList size={24} />, title: 'Applications',       desc: 'Track all student applications' },
                { to: '/admin/reports',      icon: <FileText size={24} />, title: 'Weekly Reports',     desc: 'View all submitted reports' },
              ].map((q) => (
                <Link to={q.to} key={q.to} className="quick-link-card">
                  <div className="quick-link-icon">{q.icon}</div>
                  <div className="quick-link-title">{q.title}</div>
                  <div className="quick-link-desc">{q.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${color || 'blue'}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? '—'}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}