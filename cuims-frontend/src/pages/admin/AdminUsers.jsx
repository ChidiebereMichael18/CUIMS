import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminUsers() {
  const [role,       setRole]       = useState('');
  const [search,     setSearch]     = useState('');
  const [isApproved, setIsApproved] = useState('');

  const query = new URLSearchParams({ role, search, ...(isApproved !== '' ? { isApproved } : {}) }).toString();
  const { data, loading, refetch } = useFetch(`/admin/users?${query}`, [role, search, isApproved]);
  const users = data?.users || [];

  const handleApprove = async (userId, approved) => {
    try {
      await api.put(`/admin/users/${userId}/approve`, { isApproved: approved });
      toast.success(`Supervisor ${approved ? 'approved' : 'revoked'}`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user? This is permanent.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{data?.total ?? 0} total users</p>
        </div>
      </div>

      <div className="filter-bar">
        <input className="form-input filter-search" placeholder="Search by name, email or student ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select filter-select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="supervisor">Supervisors</option>
          <option value="admin">Admins</option>
        </select>
        <select className="form-select filter-select" value={isApproved} onChange={(e) => setIsApproved(e.target.value)}>
          <option value="">All approval status</option>
          <option value="true">Approved</option>
          <option value="false">Pending approval</option>
        </select>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <strong>No users found</strong>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Details</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="table-avatar">{u.name?.[0]}</div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'supervisor' ? 'badge-blue' : 'badge-gray'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                    {u.role === 'student'    && (u.studentId || u.course || '—')}
                    {u.role === 'supervisor' && (u.organization || '—')}
                    {u.role === 'admin'      && 'Administrator'}
                  </td>
                  <td>
                    {u.isApproved
                      ? <span className="badge badge-green">Approved</span>
                      : <span className="badge badge-amber">Pending</span>}
                  </td>
                  <td style={{ fontSize: 13 }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.role === 'supervisor' && (
                        <button
                          className={`btn btn-sm ${u.isApproved ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => handleApprove(u._id, !u.isApproved)}
                        >
                          {u.isApproved ? 'Revoke' : 'Approve'}
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
                      )}
                    </div>
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