import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './components/StudentLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import LiveClassesPage from './pages/LiveClassesPage';
import TasksPage from './pages/TasksPage';
import AssignmentsPage from './pages/AssignmentsPage';
import CertificatesPage from './pages/CertificatesPage';
import AnalyzerPage from './pages/AnalyzerPage';
import MessagesPage from './pages/MessagesPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Onboarding Path / Course Selection */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Student Learning Portal with Learnify Sidebar Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CoursePlayerPage />} />
            <Route path="live-classes" element={<LiveClassesPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="progress" element={<AnalyzerPage />} />
            <Route path="analyzer" element={<AnalyzerPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Direct Route Aliases for seamless navigation */}
          <Route path="/courses" element={<Navigate to="/dashboard/courses" replace />} />
          <Route path="/live-classes" element={<Navigate to="/dashboard/live-classes" replace />} />
          <Route path="/tasks" element={<Navigate to="/dashboard/tasks" replace />} />
          <Route path="/assignments" element={<Navigate to="/dashboard/assignments" replace />} />
          <Route path="/certificates" element={<Navigate to="/dashboard/certificates" replace />} />
          <Route path="/progress" element={<Navigate to="/dashboard/progress" replace />} />
          <Route path="/messages" element={<Navigate to="/dashboard/messages" replace />} />
          <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
          <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
