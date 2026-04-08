import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ComplaintProvider } from './context/ComplaintContext.jsx';
import { Home } from './pages/Home.jsx';
import { Login, Signup } from './pages/Auth.jsx';
import { UserDashboard } from './dashboards/user/UserDashboard.jsx';
import { AdminDashboard } from './dashboards/admin/AdminDashboard.jsx';
import { Notification } from './components/Notification.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import DepartmentDashboard from './dashboards/department/DepartmentDashboard.jsx';

const AppContent = () => {
  const { success, clearSuccess } = useAuth();

  return (
    <>
      {success && (
        <Notification
          message={success}
          onClose={clearSuccess}
          type="success"
        />
      )}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user/*" element={<UserDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/department/*" element={<DepartmentDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <AppContent />
      </ComplaintProvider>
    </AuthProvider>
  );
}
