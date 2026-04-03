import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, FileText, ClipboardList, User, LayoutDashboard, Briefcase, Users, UsersRound, LogOut, X } from 'lucide-react';
import './Sidebar.css';

const NAV = {
  student: [
    { to: '/internships',     icon: Search, label: 'Browse Internships' },
    { to: '/my-applications', icon: FileText, label: 'My Applications' },
    { to: '/my-reports',      icon: ClipboardList, label: 'My Reports' },
    { to: '/profile',         icon: User, label: 'Profile' },
  ],
  supervisor: [
    { to: '/supervisor',                   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/supervisor/internships',       icon: Briefcase, label: 'My Internships' },
    { to: '/supervisor/interns',           icon: Users, label: 'My Interns' },
    { to: '/supervisor/reports',           icon: ClipboardList, label: 'Reports' },
  ],
  admin: [
    { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users',        icon: UsersRound, label: 'Users' },
    { to: '/admin/internships',  icon: Briefcase, label: 'Internships' },
    { to: '/admin/applications', icon: FileText, label: 'Applications' },
    { to: '/admin/reports',      icon: ClipboardList, label: 'Reports' },
  ],
};

const ROLE_LABEL = { student: 'Student Portal', supervisor: 'Supervisor Portal', admin: 'Admin Panel' };

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <img src="/cuims-logo.png" alt="CUIMS Logo" className="sidebar-logo-img" />
        <div style={{ flex: 1 }}>
          <div className="sidebar-brand-name">CUIMS</div>
          <div className="sidebar-brand-sub">{ROLE_LABEL[user?.role]}</div>
        </div>
        {isOpen && (
          <button className="mobile-close-btn" onClick={onClose} aria-label="Close sidebar">
            <X size={20} color="#fff" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              onClick={onClose}
              key={link.to}
              to={link.to}
              end={link.to === '/supervisor' || link.to === '/admin'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon className="sidebar-link-icon" size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}