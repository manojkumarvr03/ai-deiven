import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  Users,
  UserCheck,
  UserX,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Clock,
  Activity,
  GraduationCap,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/auth/admin/users');
      const data = res.data;
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteUser = async (userToDelete) => {
    if (!userToDelete) return;
    setDeletingId(userToDelete._id);
    try {
      const res = await API.delete(`/auth/admin/users/${userToDelete._id}`);
      const data = res.data;
      if (data.success) {
        setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
        setFeedbackMessage({ type: 'success', text: `User "${userToDelete.name}" was permanently deleted.` });
      } else {
        setFeedbackMessage({ type: 'danger', text: data.message || 'Failed to delete user.' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setFeedbackMessage({ type: 'danger', text: err.response?.data?.message || 'Error connecting to server to delete user.' });
    } finally {
      setDeletingId(null);
      setConfirmDeleteUser(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const activeUsers = users.filter(u => u.isActive);
  const inactiveUsers = users.filter(u => !u.isActive);

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
  };

  const timeSince = (dateStr) => {
    if (!dateStr) return null;
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-vh-100 py-4 px-3" style={{ background: 'radial-gradient(circle at 10% 20%, #e0f2fe 0%, #f0f7ff 50%, #edf6ff 100%)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div
          className="p-3 px-4 mb-4 d-flex align-items-center justify-content-between"
          style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #dbeafe', boxShadow: '0 4px 20px rgba(2,132,199,0.08)' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ background: '#0f172a', width: '42px', height: '42px' }}>
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <div className="fw-bold fs-5" style={{ color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                Admin Panel
              </div>
              <div className="small text-muted">Edura.AI • User Management & Access Control</div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="btn btn-sm d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3"
              style={{ background: '#edf4fe', border: '1px solid #d9e7f8', color: '#0284c7' }}
            >
              <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-sm d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* Notification Toast Banner */}
        {feedbackMessage && (
          <div
            className={`p-3 mb-4 rounded-3 d-flex align-items-center gap-2 shadow-sm ${feedbackMessage.type === 'success' ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'}`}
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            {feedbackMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          {/* Total Users */}
          <div className="col-6 col-md-3">
            <div className="p-3 text-center" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #dbeafe', boxShadow: '0 4px 15px rgba(2,132,199,0.07)' }}>
              <div className="mb-2 d-flex justify-content-center">
                <div className="p-2 rounded-3" style={{ background: '#e0f2fe' }}>
                  <Users size={22} style={{ color: '#0284c7' }} />
                </div>
              </div>
              <div className="fs-3 fw-bold" style={{ color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>{users.length}</div>
              <div className="small fw-semibold text-muted">Total Registered</div>
            </div>
          </div>

          {/* Currently Active */}
          <div className="col-6 col-md-3">
            <div className="p-3 text-center" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #bbf7d0', boxShadow: '0 4px 15px rgba(16,185,129,0.07)' }}>
              <div className="mb-2 d-flex justify-content-center">
                <div className="p-2 rounded-3" style={{ background: '#dcfce7' }}>
                  <UserCheck size={22} style={{ color: '#15803d' }} />
                </div>
              </div>
              <div className="fs-3 fw-bold" style={{ color: '#15803d', fontFamily: 'Outfit, sans-serif' }}>{activeUsers.length}</div>
              <div className="small fw-semibold" style={{ color: '#15803d' }}>Currently Logged In</div>
            </div>
          </div>

          {/* Offline Users */}
          <div className="col-6 col-md-3">
            <div className="p-3 text-center" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(100,116,139,0.07)' }}>
              <div className="mb-2 d-flex justify-content-center">
                <div className="p-2 rounded-3" style={{ background: '#f1f5f9' }}>
                  <UserX size={22} style={{ color: '#64748b' }} />
                </div>
              </div>
              <div className="fs-3 fw-bold" style={{ color: '#475569', fontFamily: 'Outfit, sans-serif' }}>{inactiveUsers.length}</div>
              <div className="small fw-semibold text-muted">Offline Users</div>
            </div>
          </div>

          {/* Last Refresh */}
          <div className="col-6 col-md-3">
            <div className="p-3 text-center" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e9d5ff', boxShadow: '0 4px 15px rgba(126,34,206,0.07)' }}>
              <div className="mb-2 d-flex justify-content-center">
                <div className="p-2 rounded-3" style={{ background: '#f3e8ff' }}>
                  <Activity size={22} style={{ color: '#7e22ce' }} />
                </div>
              </div>
              <div className="fs-6 fw-bold" style={{ color: '#7e22ce', fontFamily: 'Outfit, sans-serif' }}>{lastRefresh.toLocaleTimeString('en-IN')}</div>
              <div className="small fw-semibold" style={{ color: '#7e22ce' }}>Last Refreshed</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #dbeafe', boxShadow: '0 4px 20px rgba(2,132,199,0.08)', overflow: 'hidden' }}>
          {/* Table Header */}
          <div
            className="px-4 py-3 d-flex align-items-center justify-content-between"
            style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fbff' }}
          >
            <div className="fw-bold" style={{ color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
              All Registered Users ({users.length})
            </div>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)', animation: 'pulse 2s infinite' }}></div>
              <span className="small fw-semibold" style={{ color: '#10b981' }}>Live Monitoring</span>
            </div>
          </div>

          {loading && users.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#0284c7', width: '2rem', height: '2rem' }} role="status"></div>
              <div className="small text-muted mt-2 fw-semibold">Loading registered users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <GraduationCap size={40} style={{ color: '#cbd5e1' }} />
              <div className="small text-muted mt-2 fw-semibold">No users registered yet in the database.</div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th className="px-4 py-3 fw-semibold border-0">User</th>
                    <th className="py-3 fw-semibold border-0">Email</th>
                    <th className="py-3 fw-semibold border-0">Role</th>
                    <th className="py-3 fw-semibold border-0">Status</th>
                    <th className="py-3 fw-semibold border-0">Last Login</th>
                    <th className="py-3 fw-semibold border-0">Registered</th>
                    <th className="py-3 px-4 fw-semibold border-0 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Name */}
                      <td className="px-4 py-3 align-middle">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                            style={{ width: '34px', height: '34px', fontSize: '0.8rem', background: u.isActive ? '#0284c7' : '#94a3b8' }}
                          >
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="fw-semibold" style={{ color: '#0f172a' }}>{u.name}</span>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="py-3 align-middle" style={{ color: '#475569' }}>{u.email}</td>
                      {/* Role */}
                      <td className="py-3 align-middle">
                        <span
                          className="px-2 py-1 rounded-pill fw-semibold"
                          style={{
                            background: u.role === 'teacher' ? '#f3e8ff' : '#e0f2fe',
                            color: u.role === 'teacher' ? '#7e22ce' : '#0284c7',
                            fontSize: '0.72rem'
                          }}
                        >
                          {u.role === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="py-3 align-middle">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: u.isActive ? '#10b981' : '#cbd5e1',
                              boxShadow: u.isActive ? '0 0 0 3px rgba(16,185,129,0.25)' : 'none',
                              flexShrink: 0
                            }}
                          ></div>
                          <span className="fw-semibold" style={{ fontSize: '0.8rem', color: u.isActive ? '#15803d' : '#94a3b8' }}>
                            {u.isActive ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      {/* Last Login */}
                      <td className="py-3 align-middle">
                        <div style={{ color: '#475569', fontSize: '0.82rem' }}>
                          {formatTime(u.lastLogin)}
                          {u.lastLogin && (
                            <div className="small" style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                              {timeSince(u.lastLogin)}
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Registered At */}
                      <td className="py-3 align-middle" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        {formatTime(u.createdAt)}
                      </td>
                      {/* Action: Delete */}
                      <td className="py-3 px-4 align-middle text-end">
                        <button
                          onClick={() => setConfirmDeleteUser(u)}
                          disabled={deletingId === u._id}
                          className="btn btn-sm d-inline-flex align-items-center gap-1 fw-semibold px-2 py-1 rounded-2"
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            fontSize: '0.78rem',
                            transition: 'all 0.2s ease'
                          }}
                          title={`Delete ${u.name}`}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-3 small text-muted">
          <Clock size={12} className="me-1" />
          Auto-refreshes every 30 seconds &nbsp;•&nbsp;
          Logged in as <span className="fw-bold" style={{ color: '#0284c7' }}>{user?.email}</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999 }}
        >
          <div
            className="p-4 bg-white rounded-4 shadow-lg animate-in"
            style={{ maxWidth: '420px', width: '90%', border: '1px solid #e2e8f0' }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="p-2 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ background: '#fee2e2', color: '#dc2626' }}
              >
                <Trash2 size={24} />
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                  Delete User Account?
                </h5>
                <span className="small text-muted">This action is permanent and cannot be undone.</span>
              </div>
            </div>

            <div className="p-3 rounded-3 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="small text-muted mb-1">User to remove:</div>
              <div className="fw-bold" style={{ color: '#0f172a' }}>{confirmDeleteUser.name}</div>
              <div className="small text-muted">{confirmDeleteUser.email}</div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-sm px-3 py-2 fw-semibold rounded-3"
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
                onClick={() => setConfirmDeleteUser(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm px-3 py-2 fw-bold text-white rounded-3 d-flex align-items-center gap-2"
                style={{ background: '#dc2626', border: 'none' }}
                onClick={() => handleDeleteUser(confirmDeleteUser)}
                disabled={deletingId !== null}
              >
                {deletingId ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-anim { animation: spin 0.8s linear infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        .table-hover tbody tr:hover { background: #f8fbff !important; }
        .btn:hover { opacity: 0.92; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
