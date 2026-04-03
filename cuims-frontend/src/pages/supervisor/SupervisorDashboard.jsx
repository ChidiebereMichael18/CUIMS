import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, Users, Target } from 'lucide-react';
import './Supervisor.css';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const { data: intData } = useFetch('/internships/my');
  const { data: internData } = useFetch('/applications/my-interns');

  const internships = intData?.internships || [];
  const interns     = internData?.interns   || [];

  const totalSlots    = internships.reduce((s, i) => s + (i.slots || 0), 0);
  const totalAccepted = internships.reduce((s, i) => s + (i.acceptedCount || 0), 0);
  const totalApps     = internships.reduce((s, i) => s + (i.applicationCount || 0), 0);

  return (
    <div>
      {!user?.isApproved && (
        <div className="approval-banner">
          <strong>Account pending approval</strong> — Your account is awaiting admin approval. You can view your dashboard but cannot post internships yet.
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="page-subtitle">{user?.organization} · {user?.jobTitle}</p>
        </div>
        <Link to="/supervisor/internships/new" className="btn btn-primary">+ Post Internship</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Briefcase size={20} /></div>
          <div className="stat-label">Total internships</div>
          <div className="stat-value">{internships.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FileText size={20} /></div>
          <div className="stat-label">Total applications</div>
          <div className="stat-value">{totalApps}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-label">Active interns</div>
          <div className="stat-value">{totalAccepted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Target size={20} /></div>
          <div className="stat-label">Available slots</div>
          <div className="stat-value">{totalSlots - totalAccepted}</div>
        </div>
      </div>

      <div className="dashboard-cols">
        {/* My internships */}
        <div className="card">
          <div className="card-section-header">
            <h2 className="section-title">My Internships</h2>
            <Link to="/supervisor/internships" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
        {internships.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon"><Briefcase size={36} color="var(--gray-300)" /></div>
              <strong>No internships yet</strong>
              <p>Post your first internship listing</p>
            </div>
          ) : (
            <div className="mini-list">
              {internships.slice(0, 4).map((i) => (
                <div key={i._id} className="mini-list-row">
                  <div>
                    <div className="mini-list-title">{i.title}</div>
                    <div className="mini-list-sub">
                      {i.applicationCount} applicant{i.applicationCount !== 1 ? 's' : ''} · {i.acceptedCount}/{i.slots} slots filled
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <StatusBadge status={i.status} />
                    <Link to={`/supervisor/internships/${i._id}/applicants`} className="btn btn-secondary btn-sm">Review</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active interns */}
        <div className="card">
          <div className="card-section-header">
            <h2 className="section-title">Active Interns</h2>
            <Link to="/supervisor/interns" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {interns.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon"><Users size={36} color="var(--gray-300)" /></div>
              <strong>No interns yet</strong>
              <p>Accept applicants to see them here</p>
            </div>
          ) : (
            <div className="mini-list">
              {interns.slice(0, 4).map((a) => (
                <div key={a._id} className="mini-list-row">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div className="mini-avatar">{a.student?.name?.[0]}</div>
                    <div>
                      <div className="mini-list-title">{a.student?.name}</div>
                      <div className="mini-list-sub">{a.internship?.title} · {a.student?.course}</div>
                    </div>
                  </div>
                  <div className="mini-list-sub">{formatDate(a.startDate)} →</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}