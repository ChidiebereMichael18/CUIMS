import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { StatusBadge, TypeBadge } from '../../components/shared/StatusBadge';
import { formatDate } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Supervisor.css';

export default function ManageInternships() {
  const { data, loading, refetch } = useFetch('/internships/my');
  const internships = data?.internships || [];

  const toggleStatus = async (i) => {
    const newStatus = i.status === 'open' ? 'closed' : 'open';
    try {
      await api.put(`/internships/${i._id}`, { status: newStatus });
      toast.success(`Internship ${newStatus === 'open' ? 'reopened' : 'closed'}`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this internship? This cannot be undone.')) return;
    try {
      await api.delete(`/internships/${id}`);
      toast.success('Internship deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Internships</h1>
          <p className="page-subtitle">{internships.length} listing{internships.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/supervisor/internships/new" className="btn btn-primary">+ New Internship</Link>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : internships.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <strong>No internships posted yet</strong>
          <p>Create your first internship listing to start receiving applications</p>
          <Link to="/supervisor/internships/new" className="btn btn-primary" style={{ marginTop: 16 }}>Post Internship</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Slots</th>
                <th>Applications</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {internships.map((i) => (
                <tr key={i._id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{i.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{i.location}</div>
                  </td>
                  <td><TypeBadge type={i.type} /></td>
                  <td>{i.acceptedCount || 0} / {i.slots}</td>
                  <td>
                    <Link to={`/supervisor/internships/${i._id}/applicants`} className="table-link">
                      {i.applicationCount || 0} applicant{i.applicationCount !== 1 ? 's' : ''}
                    </Link>
                  </td>
                  <td>{formatDate(i.applicationDeadline)}</td>
                  <td><StatusBadge status={i.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/supervisor/internships/${i._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(i)}>
                        {i.status === 'open' ? 'Close' : 'Reopen'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i._id)}>Delete</button>
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