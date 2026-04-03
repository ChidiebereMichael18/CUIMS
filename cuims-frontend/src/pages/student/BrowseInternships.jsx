import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { StatusBadge, TypeBadge } from '../../components/shared/StatusBadge';
import { formatDate, truncate } from '../../utils/helpers';
import { Search, MapPin, Clock, CalendarDays, Inbox } from 'lucide-react';
import './Student.css';

export default function BrowseInternships() {
  const [search, setSearch] = useState('');
  const [type,   setType]   = useState('');
  const [page,   setPage]   = useState(1);

  const query = new URLSearchParams({ search, type, page, limit: 9 }).toString();
  const { data, loading } = useFetch(`/internships?${query}`, [search, type, page]);

  const internships = data?.internships || [];
  const totalPages  = data?.pages || 1;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Internship Listings</h1>
          <p className="page-subtitle">{data?.total ?? '…'} opportunities available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-search-wrapper" style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--gray-400)' }} />
          <input
            className="form-input filter-search"
            placeholder="Search by title, company or skill…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: 38 }}
          />
        </div>
        <select
          className="form-select filter-select"
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
        >
          <option value="">All types</option>
          <option value="on-site">On-site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : internships.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Inbox size={48} color="var(--gray-300)" /></div>
          <strong>No internships found</strong>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="internship-grid">
          {internships.map((i) => (
            <Link to={`/internships/${i._id}`} key={i._id} className="internship-card">
              <div className="internship-card-top">
                <div className="internship-company-logo">{i.company?.[0]?.toUpperCase()}</div>
                <div className="internship-card-badges">
                  <TypeBadge type={i.type} />
                  <StatusBadge status={i.status} />
                </div>
              </div>
              <h3 className="internship-card-title">{i.title}</h3>
              <p className="internship-card-company">{i.company}</p>
              
              <div className="internship-card-meta-row">
                <span className="meta-item"><MapPin size={14} /> {i.location}</span>
                <span className="meta-item"><Clock size={14} /> {i.duration}</span>
              </div>

              <p className="internship-card-desc">{truncate(i.description, 90)}</p>
              
              <div className="internship-card-skills" style={{ marginTop: 'auto' }}>
                {i.skills?.slice(0, 3).map((s) => (
                  <span key={s} className="badge badge-gray">{s}</span>
                ))}
                {i.skills?.length > 3 && <span className="badge badge-gray">+{i.skills.length - 3}</span>}
              </div>
              
              <div className="internship-card-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarDays size={14} /> {formatDate(i.applicationDeadline)}
                </span>
                <span className="apply-btn-text">View Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}