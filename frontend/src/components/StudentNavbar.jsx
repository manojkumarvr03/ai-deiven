import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Code2,
  FileCheck2,
  Flame,
  Zap,
  LogOut,
  Settings,
  User,
  Sparkles,
  BookOpen
} from 'lucide-react';

const StudentNavbar = ({ activeRole, onOpenRoleModal, taskStats, assignmentStats }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;
  const isDashboard = currentPath === '/dashboard' || currentPath === '/dashboard/';
  const isTasks = currentPath.startsWith('/dashboard/tasks') || currentPath.startsWith('/tasks');
  const isAssignments = currentPath.startsWith('/dashboard/assignments') || currentPath.startsWith('/assignments');

  const displayName = user?.firstName || user?.name || 'Student';
  const totalXP = user?.learningStats?.totalXP || 150;
  const streakDays = user?.learningStats?.streakDays || 1;

  return (
    <div
      className="p-3 mb-4 rounded-4 shadow-sm"
      style={{
        background: '#ffffff',
        border: '1px solid #dbeafe',
        position: 'sticky',
        top: '16px',
        zIndex: 100
      }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        {/* Brand & Study Role */}
        <div className="d-flex align-items-center justify-content-between">
          <div
            className="d-flex align-items-center gap-3"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <div
              className="p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                width: '42px',
                height: '42px'
              }}
            >
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold mb-0 font-heading" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
                  Edura<span style={{ color: '#0284c7' }}>.AI</span>
                </h4>
                <span
                  className="badge text-capitalize d-none d-sm-inline-block"
                  style={{
                    background: '#e0f2fe',
                    color: '#0284c7',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {activeRole || user?.studyRole || 'college'} Path
                </span>
              </div>
              <span className="text-muted d-none d-sm-inline-block" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                ACADEMIC INTELLIGENCE PLATFORM
              </span>
            </div>
          </div>

          {/* Mobile Path Switch Button */}
          <button
            onClick={onOpenRoleModal}
            className="btn btn-sm d-md-none d-flex align-items-center gap-1 py-1 px-2 rounded-3"
            style={{ background: '#edf4fe', color: '#0284c7', border: '1px solid #bae6fd', fontSize: '0.75rem' }}
          >
            <Settings size={14} />
            <span>Path</span>
          </button>
        </div>

        {/* Navigation Tabs (Dashboard, Tasks, Assignments) */}
        <div className="d-flex align-items-center gap-1 p-1 rounded-3 overflow-auto" style={{ background: '#f1f5f9' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className={`btn d-flex align-items-center gap-2 py-1 px-3 rounded-3 fw-semibold text-nowrap transition-all`}
            style={{
              background: isDashboard ? '#ffffff' : 'transparent',
              color: isDashboard ? '#0284c7' : '#64748b',
              boxShadow: isDashboard ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              border: isDashboard ? '1px solid #e2e8f0' : '1px solid transparent',
              fontSize: '0.86rem'
            }}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/tasks')}
            className={`btn d-flex align-items-center gap-2 py-1 px-3 rounded-3 fw-semibold text-nowrap transition-all`}
            style={{
              background: isTasks ? '#ffffff' : 'transparent',
              color: isTasks ? '#0284c7' : '#64748b',
              boxShadow: isTasks ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              border: isTasks ? '1px solid #e2e8f0' : '1px solid transparent',
              fontSize: '0.86rem'
            }}
          >
            <Code2 size={16} />
            <span>Practice Tasks</span>
            {taskStats?.totalTasks > 0 && (
              <span
                className="badge rounded-pill"
                style={{
                  background: isTasks ? '#0284c7' : '#e2e8f0',
                  color: isTasks ? '#ffffff' : '#64748b',
                  fontSize: '0.68rem',
                  padding: '2px 6px'
                }}
              >
                {taskStats.solvedTasks}/{taskStats.totalTasks}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/dashboard/assignments')}
            className={`btn d-flex align-items-center gap-2 py-1 px-3 rounded-3 fw-semibold text-nowrap transition-all`}
            style={{
              background: isAssignments ? '#ffffff' : 'transparent',
              color: isAssignments ? '#0284c7' : '#64748b',
              boxShadow: isAssignments ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              border: isAssignments ? '1px solid #e2e8f0' : '1px solid transparent',
              fontSize: '0.86rem'
            }}
          >
            <FileCheck2 size={16} />
            <span>Assignments</span>
            {assignmentStats?.pendingCount > 0 && (
              <span
                className="badge rounded-pill"
                style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  fontSize: '0.68rem',
                  padding: '2px 6px'
                }}
              >
                {assignmentStats.pendingCount} due
              </span>
            )}
          </button>
        </div>

        {/* Stats, Settings & Profile Actions */}
        <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-2 gap-sm-3">
          {/* Streak Badge */}
          <div
            className="d-flex align-items-center gap-1 py-1 px-2 rounded-pill shadow-xs"
            style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', fontSize: '0.78rem', fontWeight: 700 }}
            title="Active Learning Streak"
          >
            <Flame size={15} className="text-warning fill-warning" />
            <span>{streakDays}d</span>
          </div>

          {/* XP Pill */}
          <div
            className="d-flex align-items-center gap-1 py-1 px-2.5 rounded-pill shadow-xs"
            style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '0.78rem', fontWeight: 700 }}
            title="Total Study Experience Points"
          >
            <Zap size={14} style={{ color: '#059669' }} />
            <span>{totalXP} XP</span>
          </div>

          {/* Change Path Button */}
          <button
            onClick={onOpenRoleModal}
            className="btn d-none d-md-flex align-items-center gap-1.5 py-1.5 px-2.5 fw-semibold rounded-3"
            style={{ background: '#edf4fe', color: '#0284c7', border: '1px solid #bae6fd', fontSize: '0.82rem' }}
            title="Change Study Role or Pathway"
          >
            <Settings size={15} />
            <span>Change Path</span>
          </button>

          {/* Student Name */}
          <div className="text-end d-none d-lg-block">
            <div className="fw-bold" style={{ color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.2 }}>
              {displayName}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.7rem' }}>
              Student
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn d-flex align-items-center gap-1 py-1.5 px-2.5 fw-semibold rounded-3"
            style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}
            title="Log out of Edura.AI"
          >
            <LogOut size={15} />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNavbar;
