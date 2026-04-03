import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { StatusBadge, TypeBadge } from '../../components/shared/StatusBadge';
import { formatDate, timeAgo } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Student.css';

export default function MyApplications() {
  const { data, loading, refetch } = useFetch('/applications/my');
  const applications = data?.applications || [];

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await api.put(`/applications/${id}/withdraw`);
      toast.success('Application withdrawn');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Track all your internship applications</p>
        </div>
        <Link to="/internships" className="btn btn-primary">Browse More</Link>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <strong>No applications yet</strong>
          <p>Browse internships and apply to get started</p>
          <Link to="/internships" className="btn btn-primary" style={{ marginTop: 16 }}>Find Internships</Link>
        </div>
      ) : (
        <div className="app-list">
          {applications.map((app) => (
            <div key={app._id} className="app-card card">
              <div className="app-card-left">
                <div className="app-company-logo">{app.internship?.company?.[0]}</div>
                <div className="app-card-info">
                  <div className="app-card-title">{app.internship?.title}</div>
                  <div className="app-card-company">{app.internship?.company} · {app.internship?.location}</div>
                  <div className="app-card-meta">
                    <TypeBadge type={app.internship?.type} />
                    <span className="text-muted">Applied {timeAgo(app.createdAt)}</span>
                    {app.internship?.duration && <span className="text-muted">⏱ {app.internship.duration}</span>}
                  </div>
                </div>
              </div>

              <div className="app-card-right">
                <StatusBadge status={app.status} />
                {app.supervisorNote && (
                  <div className="app-note">
                    <span className="app-note-label">Supervisor note:</span> {app.supervisorNote}
                  </div>
                )}
                {app.status === 'accepted' && (
                  <div className="app-accepted-info">
                    <span>🗓 {formatDate(app.startDate)} → {formatDate(app.endDate)}</span>
                  </div>
                )}
                {app.status === 'pending' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleWithdraw(app._id)}>
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}