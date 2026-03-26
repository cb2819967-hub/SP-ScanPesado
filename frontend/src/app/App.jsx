import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { MODULES } from '../config/modules.js';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { ModulePage } from '../pages/ModulePage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { ReportsPage } from '../pages/ReportsPage.jsx';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {MODULES.filter((module) => !module.readOnly).map((module) => (
          <Route
            key={module.path}
            path={module.path}
            element={
              <ProtectedRoute roles={module.roles}>
                <ModulePage module={module} />
              </ProtectedRoute>
            }
          />
        ))}
        <Route
          path="reportes"
          element={
            <ProtectedRoute roles={['ADMIN', 'TECNICO']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="tec-unidades" element={<Navigate to="/dashboard/vehiculos" replace />} />
        <Route path="tec-historial" element={<Navigate to="/dashboard/reportes" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
