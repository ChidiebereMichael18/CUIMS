import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminApplications() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const query = new URLSearchParams({ search, ...(status !== '' ? { status } : {}) }).toString();
  const { data, loading, refetch } = useFetch(`/admin/applications?${query}`, [search, status]);
  const applications = data?.applications || [];

  const handleDelete = async (appId) => {
    if (!confirm('Delete this application? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/applications/${appId}`);
      toast.success('Application deleted successfully');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete application');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Applications</h1>
          <p className="page-subtitle">{data?.total ?? 0} total applications submitted</p>
        </div>
      </div>

      <div className="filter-bar">
        <input 
          className="form-input filter-search" 
          placeholder="Search by student or internship..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select className="form-select filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <strong>No applications found</strong>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Internship</th>
                <th>Supervisor</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="table-avatar">{app.student?.name?.[0] || '?'}</div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{app.student?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{app.student?.studentId || app.student?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{app.internship?.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{app.internship?.company}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                    {app.internship?.supervisor?.name || 'Unknown'}
                  </td>
                  <td>
                    <span className={`badge ${app.status === 'accepted' ? 'badge-green' : app.status === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                      {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{formatDate(app.createdAt)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(app._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
