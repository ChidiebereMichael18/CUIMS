import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader" style={{ height: '100vh' }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    // Redirect each role to their home
    const homes = { student: '/internships', supervisor: '/supervisor', admin: '/admin' };
    return <Navigate to={homes[user.role] || '/login'} replace />;
  }

  return <Outlet />;
}