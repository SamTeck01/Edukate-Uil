import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp, AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import ReaderPage from './pages/ReaderPage';
import AdminDashboard from './pages/AdminDashboard';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './components/shared/toast.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isOnboarded, isLoading } = useApp();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reader/:materialId"
              element={
                <ProtectedRoute>
                  <ReaderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
