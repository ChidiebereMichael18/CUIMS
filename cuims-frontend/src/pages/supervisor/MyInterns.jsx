import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import './Supervisor.css';

export default function MyInterns() {
  const { data, loading } = useFetch('/applications/my-interns');
  const interns = data?.interns || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Interns</h1>
          <p className="page-subtitle">{interns.length} active intern{interns.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : interns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <strong>No active interns</strong>
          <p>Accept applications to onboard interns</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Internship</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {interns.map((a) => (
                <tr key={a._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="mini-avatar">{a.student?.name?.[0]}</div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{a.student?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{a.student?.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{a.student?.course || '—'}</td>
                  <td>{a.internship?.title}</td>
                  <td>{formatDate(a.startDate)}</td>
                  <td>{formatDate(a.endDate)}</td>
                  <td>
                    <a href={`mailto:${a.student?.email}`} className="table-link">{a.student?.email}</a>
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