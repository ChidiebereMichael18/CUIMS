import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';
import './Topbar.css';

const TITLES = {
  '/internships':           'Browse Internships',
  '/my-applications':       'My Applications',
  '/my-reports':            'My Reports',
  '/profile':               'My Profile',
  '/supervisor':            'Dashboard',
  '/supervisor/internships':'My Internships',
  '/supervisor/interns':    'My Interns',
  '/supervisor/reports':    'Reports',
  '/admin':                 'Dashboard',
  '/admin/users':           'User Management',
  '/admin/internships':     'All Internships',
  '/admin/applications':    'All Applications',
  '/admin/reports':         'All Reports',
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user }     = useAuth();

  const title = TITLES[pathname]
    ?? (pathname.includes('/applicants') ? 'Applicants'
      : pathname.includes('/edit') ? 'Edit Internship'
      : pathname.includes('/new')  ? 'New Internship'
      : 'CUIMS');

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open sidebar">
          <Menu size={24} />
        </button>
        <div className="topbar-title">{title}</div>
      </div>
      <div className="topbar-right">
        {!user?.isApproved && user?.role === 'supervisor' && (
          <span className="badge badge-amber">Pending Approval</span>
        )}
        <div className="topbar-user">
          <div className="topbar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <span className="topbar-name">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}