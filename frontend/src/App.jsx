import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import { LoadingSpinner } from './components/Common/index';

// Auth Components
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

// Patient Pages
import { PatientDashboard } from './components/Dashboard/PatientDashboard';
import { BookingFlow } from './components/Booking/BookingFlow';
import { RescheduleAppointment } from './components/Booking/RescheduleAppointment';
import { Profile } from './components/Profile/Profile';

// Admin Pages
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminAppointments } from './components/Admin/AdminAppointments';

// Other Pages
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen bg-gray-100">
      {children}
    </main>
    <footer className="bg-gray-800 text-white py-6 text-center">
      <p>&copy; 2026 Clinic Booking System. All rights reserved.</p>
    </footer>
  </>
);

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
      <Route path="/register" element={<AppLayout><Register /></AppLayout>} />

      {/* Patient Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PatientDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/book-appointment"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BookingFlow />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reschedule-appointment/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RescheduleAppointment isAdmin={false} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute adminOnly={true}>
            <AppLayout>
              <AdminAppointments />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reschedule-appointment/:id"
        element={
          <ProtectedRoute adminOnly={true}>
            <AppLayout>
              <RescheduleAppointment isAdmin={true} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
