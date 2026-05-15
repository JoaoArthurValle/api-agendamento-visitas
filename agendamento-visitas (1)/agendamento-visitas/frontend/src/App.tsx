import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { NewAppointment } from './pages/NewAppointment';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-full">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/novo"
            element={
              <ProtectedRoute>
                <NewAppointment />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
