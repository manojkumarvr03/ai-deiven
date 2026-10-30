import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HelpModal from './HelpModal';
import {
  BookOpen,
  LayoutGrid,
  User,
  Radio,
  FileText,
  Award,
  TrendingUp,
  MessageSquare,
  Calendar as CalendarIcon,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Compass,
  Bell,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',    path: '/dashboard',             icon: LayoutGrid, exact: true },
  { label: 'My Courses',   path: '/dashboard/courses',     icon: User },
  { label: 'Live Classes', path: '/dashboard/live-classes',icon: Radio },
  { label: 'Assignments',  path: '/dashboard/assignments', icon: FileText },
  { label: 'Certificates', path: '/dashboard/certificates',icon: Award },
  { label: 'Progress',     path: '/dashboard/progress',    icon: TrendingUp },
  { label: 'Messages',     path: '/dashboard/messages',    icon: MessageSquare },
  { label: 'Calendar',     path: '/dashboard/calendar',    icon: CalendarIcon },
];

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.firstName || user?.name || 'Alex';
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AH';

  return (
    <div className="learnify-app-wrapper">
      {/* ============================================================
          SIDEBAR
          ============================================================ */}
      <aside className={`learnify-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="learnify-brand">
          <NavLink to="/dashboard" className="learnify-brand-left">
            <div className="learnify-brand-icon">
              <BookOpen size={18} color="#ffffff" />
            </div>
            {!collapsed && <span className="learnify-brand-text">Edura</span>}
          </NavLink>

          <button
            className="learnify-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <PanelLeft size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="learnify-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={!!item.exact}
                className={({ isActive }) => `learnify-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <div className="learnify-nav-icon">
                  <Icon size={18} />
                </div>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Footer Items */}
        <div className="learnify-sidebar-footer">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `learnify-nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? 'Settings' : ''}
          >
            <div className="learnify-nav-icon">
              <Settings size={18} />
            </div>
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <div
            className="learnify-nav-item"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowHelpModal(true)}
            title={collapsed ? 'Help Center' : ''}
          >
            <div className="learnify-nav-icon">
              <HelpCircle size={18} />
            </div>
            {!collapsed && <span>Help Center</span>}
          </div>

          <div
            className="learnify-nav-item"
            style={{ cursor: 'pointer' }}
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
          >
            <div className="learnify-nav-icon">
              <LogOut size={18} />
            </div>
            {!collapsed && <span>Logout</span>}
          </div>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT AREA
          ============================================================ */}
      <main className="learnify-main">
        {/* Top Header Bar */}
        <header className="learnify-topbar">
          {/* Search Box */}
          <div className="learnify-search-box">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              className="learnify-search-input"
              placeholder="Search courses, lessons"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right Header Actions */}
          <div className="learnify-topbar-actions">
            <button
              className="learnify-action-btn"
              title="Explore Pathways"
              onClick={() => navigate('/dashboard/courses')}
            >
              <Compass size={18} />
            </button>

            <button
              className="learnify-action-btn"
              title="Notifications"
              onClick={() => setNotificationsRead(true)}
            >
              <Bell size={18} />
              {!notificationsRead && <span className="learnify-notification-dot"></span>}
            </button>

            <div
              className="learnify-avatar-circle"
              title={`Logged in as ${displayName}`}
              onClick={() => navigate('/dashboard/settings')}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <Outlet context={{ searchQuery }} />
      </main>

      {/* Help Center Modal */}
      <HelpModal
        show={showHelpModal}
        onHide={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default StudentLayout;
