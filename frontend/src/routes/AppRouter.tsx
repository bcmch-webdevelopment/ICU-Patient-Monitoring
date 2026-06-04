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

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* TV Dashboard Route */}
        <Route path="/" element={<TvDashboard />} />

        {/* Auth Route */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/registration" element={<Registration />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<RequireAuth><Outlet /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientsList />} />
          <Route path="patients/new" element={<PatientCreate />} />
          <Route path="patients/edit/:id" element={<PatientEdit />} />
          <Route path="users/create" element={<UserCreate />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Navigate to="/admin" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};
