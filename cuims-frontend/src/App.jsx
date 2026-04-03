import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from '../src/components/shared/ProtectedRoute';
import AppLayout from '../src/components/layout/AppLayout';

import LandingPage from './pages/LandingPage';

// Auth pages
import Login      from '../src/pages/auth/Login';
import Register   from '../src/pages/auth/Register';
import AdminLogin from '../src/pages/auth/AdminLogin';

// Student pages
import BrowseInternships  from '../src/pages/student/BrowseInternships';
import InternshipDetail   from '../src/pages/student/InternshipDetail';
import MyApplications     from '../src/pages/student/MyApplications';
import StudentReports     from '../src/pages/student/StudentReports';
import StudentProfile     from '../src/pages/student/StudentProfile';

// Supervisor pages
import SupervisorDashboard   from '../src/pages/supervisor/SupervisorDashboard';
import ManageInternships     from '../src/pages/supervisor/ManageInternships';
import InternshipForm        from '../src/pages/supervisor/InternshipForm';
import Applicants            from '../src/pages/supervisor/Applicants';
import MyInterns             from '../src/pages/supervisor/MyInterns';
import SupervisorReports     from '../src/pages/supervisor/SupervisorReports';

// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminInternships  from './pages/admin/AdminInternships';
import AdminApplications from './pages/admin/AdminApplications';
import AdminReports      from './pages/admin/AdminReports';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Student */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route element={<AppLayout />}>
            <Route path="/internships"           element={<BrowseInternships />} />
            <Route path="/internships/:id"       element={<InternshipDetail />} />
            <Route path="/my-applications"       element={<MyApplications />} />
            <Route path="/my-reports"            element={<StudentReports />} />
            <Route path="/profile"               element={<StudentProfile />} />
          </Route>
        </Route>

        {/* Supervisor */}
        <Route element={<ProtectedRoute role="supervisor" />}>
          <Route element={<AppLayout />}>
            <Route path="/supervisor"                          element={<SupervisorDashboard />} />
            <Route path="/supervisor/internships"              element={<ManageInternships />} />
            <Route path="/supervisor/internships/new"         element={<InternshipForm />} />
            <Route path="/supervisor/internships/:id/edit"    element={<InternshipForm />} />
            <Route path="/supervisor/internships/:id/applicants" element={<Applicants />} />
            <Route path="/supervisor/interns"                 element={<MyInterns />} />
            <Route path="/supervisor/reports"                 element={<SupervisorReports />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AppLayout />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/users"        element={<AdminUsers />} />
            <Route path="/admin/internships"  element={<AdminInternships />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/reports"      element={<AdminReports />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}