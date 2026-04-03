import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { timeAgo } from '../../utils/helpers';
import './Admin.css';

export default function AdminReports() {
  const { data, loading } = useFetch('/admin/reports');
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch]         = useState('');

  const reports = (data?.reports || []).filter((r) => {
    const matchRole   = !roleFilter || r.authorRole === roleFilter;
    const matchSearch = !search ||
      r.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.internship?.title?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Reports</h1>
          <p className="page-subtitle">{data?.count ?? 0} weekly reports submitted</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="form-input filter-search"
          placeholder="Search by author or internship…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All authors</option>
          <option value="student">Students</option>
          <option value="supervisor">Supervisors</option>
        </select>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <strong>No reports found</strong>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Author</th>
                <th>Role</th>
                <th>Report title</th>
                <th>Internship</th>
                <th>Week</th>
                <th>Rating</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="table-avatar">{r.author?.name?.[0]}</div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{r.author?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                          {r.author?.studentId || r.author?.organization}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${r.authorRole === 'supervisor' ? 'badge-blue' : 'badge-gray'}`}>
                      {r.authorRole}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{r.title}</td>
                  <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                    {r.internship?.title}
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{r.internship?.company}</div>
                  </td>
                  <td>
                    <span className="badge badge-blue">Week {r.weekNumber}</span>
                  </td>
                  <td style={{ fontSize: 14, color: '#f59e0b' }}>
                    {r.rating ? `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}` : <span style={{ color: 'var(--gray-300)' }}>—</span>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{timeAgo(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}