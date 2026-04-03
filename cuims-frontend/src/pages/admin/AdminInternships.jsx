import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminInternships() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const query = new URLSearchParams({ search, ...(status !== '' ? { status } : {}) }).toString();
  const { data, loading, refetch } = useFetch(`/admin/internships?${query}`, [search, status]);
  const internships = data?.internships || [];

  const handleDelete = async (id) => {
    if (!confirm('Delete this internship? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/internships/${id}`);
      toast.success('Internship deleted successfully');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete internship');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Internships Management</h1>
          <p className="page-subtitle">{data?.total ?? 0} internships posted across the platform</p>
        </div>
      </div>

      <div className="filter-bar">
        <input 
          className="form-input filter-search" 
          placeholder="Search by title or company..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select className="form-select filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : internships.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <strong>No internships found</strong>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Internship</th>
                <th>Company</th>
                <th>Supervisor</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {internships.map((internship) => (
                <tr key={internship._id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{internship.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                       {internship.location || 'Remote'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>{internship.company}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className="table-avatar" style={{width: 24, height: 24, fontSize: 10}}>{internship.supervisor?.name?.[0] || '?'}</div>
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--gray-900)' }}>{internship.supervisor?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${internship.status === 'open' ? 'badge-green' : internship.status === 'closed' ? 'badge-gray' : 'badge-amber'}`}>
                      {internship.status ? internship.status.charAt(0).toUpperCase() + internship.status.slice(1) : 'Open'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{formatDate(internship.createdAt)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(internship._id)}>Delete</button>
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
