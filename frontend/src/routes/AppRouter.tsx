import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import TvDashboard from '@/pages/monitoring/TvDashboard';
import Login from '@/pages/auth/Login';
import Registration from '@/pages/auth/Registration';
import Dashboard from '@/pages/admin/Dashboard';
import PatientsList from '@/pages/admin/PatientsList';
import PatientCreate from '@/pages/admin/PatientCreate';
import PatientEdit from '@/pages/admin/PatientEdit';
import UserCreate from '@/pages/admin/UserCreate';
import UserManagement from '@/pages/admin/UserManagement';
import MyProfile from '@/pages/admin/MyProfile';
import ChangePassword from '@/pages/auth/ChangePassword';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/useAuthStore';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.designation !== 'Administrator') {
    return <Navigate to="/admin/patients" replace />;
  }

  return children;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* TV Dashboard Route */}
        <Route path="/" element={<TvDashboard />} />

        {/* Auth Route */}
        <Route path="/admin/login" element={<Login />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<RequireAuth><Outlet /></RequireAuth>}>
          <Route index element={<RequireAdmin><Dashboard /></RequireAdmin>} />
          <Route path="patients" element={<PatientsList />} />
          <Route path="patients/new" element={<PatientCreate />} />
          <Route path="patients/edit/:id" element={<PatientEdit />} />
          
          {/* Admin-only Routes */}
          <Route path="registration" element={<RequireAdmin><Registration /></RequireAdmin>} />
          <Route path="users/create" element={<RequireAdmin><UserCreate /></RequireAdmin>} />
          <Route path="users" element={<RequireAdmin><UserManagement /></RequireAdmin>} />
          
          {/* Authenticated Routes */}
          <Route path="profile" element={<MyProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};
