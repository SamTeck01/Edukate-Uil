import { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, Shield, ShieldCheck, Search, ChevronRight, Loader2, BarChart3, Activity, GraduationCap, TrendingUp, Zap, Clock, Check, X } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';
import Navbar from '../components/layout/Navbar';
import Button from '../components/shared/Button';
import EngagementChart from '../components/admin/EngagementChart';
import './admindashboard.css';

export default function AdminDashboard() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'users' : 'pending');
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const toast = useToast();
  
  // New Dept Form
  const [newDept, setNewDept] = useState({ code: '', name: '' });
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [promotingUser, setPromotingUser] = useState(null); // { user, targetRole }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [usersData, deptsData, statsInfo, pendingData] = await Promise.all([
          apiClient('/admin/users'),
          apiClient('/courses/departments'),
          apiClient('/analytics/stats'),
          apiClient('/admin/materials/pending')
        ]);
        setUsers(usersData);
        setDepartments(deptsData);
        setStatsData(statsInfo);
        setPendingMaterials(pendingData);
      } catch (err) {
        console.error('Admin fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = {
    totalStudents: users.filter(u => u.role === 'student').length,
    totalModerators: users.filter(u => u.role === 'moderator').length,
    totalDepartments: departments.length,
    activeNow: Math.floor(Math.random() * 10) + 1 // Simulated
  };

  const promoteUser = async (userId, role, deptId, level) => {
    try {
      await apiClient(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role, department_id: deptId, level })
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role, department_id: deptId, level } : u));
      toast.success(`User updated to ${role}`);
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient(`/admin/materials/${id}/approve`, { method: 'POST' });
      setPendingMaterials(prev => prev.filter(m => m.id !== id));
      toast.success('Material approved and published!');
    } catch (err) {
      toast.error('Failed to approve material.');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient(`/admin/materials/${id}/reject`, { method: 'POST' });
      setPendingMaterials(prev => prev.filter(m => m.id !== id));
      toast.info('Material rejected.');
    } catch (err) {
      toast.error('Failed to reject material.');
    }
  };

  const filteredPending = pendingMaterials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addDepartment = async (e) => {
    e.preventDefault();
    if (!newDept.code || !newDept.name) return;
    setIsAddingDept(true);
    try {
      const added = await apiClient('/admin/departments', {
        method: 'POST',
        body: JSON.stringify(newDept)
      });
      setDepartments([...departments, added]);
      setNewDept({ code: '', name: '' });
    } catch (err) {
      alert('Failed to add department');
    } finally {
      setIsAddingDept(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Navbar />
      
      <div className="admin-container container animate-fade-in">
        <header className="admin-header">
          <div className="admin-header-main">
            <div className="admin-header-title">
              <h1>Buhari's Command Center</h1>
              <p>PhySci Hub Faculty Management System</p>
            </div>
            <div className="admin-header-actions">
              <span className="live-indicator">
                <span className="live-dot"></span>
                System Live
              </span>
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--students"><GraduationCap size={20} /></div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalStudents}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--mods"><ShieldCheck size={20} /></div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalModerators}</span>
                <span className="stat-label">Moderators</span>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--depts"><BookOpen size={20} /></div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalDepartments}</span>
                <span className="stat-label">Departments</span>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--active"><Activity size={20} /></div>
              <div className="stat-info">
                <span className="stat-value">{stats.activeNow}</span>
                <span className="stat-label">Active Now</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content-layout">
          <aside className="admin-sidebar">
            <nav className="admin-nav">
              {user?.role === 'admin' && (
                <button 
                  className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <Users size={18} />
                  <span>Moderators & Users</span>
                </button>
              )}
              <button 
                className={`admin-nav-item ${activeTab === 'departments' ? 'active' : ''}`}
                onClick={() => setActiveTab('departments')}
              >
                <BookOpen size={18} />
                <span>Departments</span>
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                <Clock size={18} />
                <span>Pending Approvals</span>
                {pendingMaterials.length > 0 && <span className="admin-badge">{pendingMaterials.length}</span>}
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </button>
            </nav>
          </aside>

          <main className="admin-main">
            {loading ? (
              <div className="admin-loading">
                <Loader2 className="animate-spin" />
                <p>Syncing faculty records...</p>
              </div>
            ) : activeTab === 'users' ? (
              <div className="admin-section card">
                <div className="section-header">
                  <h2>Student Directory</h2>
                  <div className="admin-search">
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Search students..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Dept / Level</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{user.full_name[0]}</div>
                              <div className="user-details">
                                <span className="user-name">{user.full_name}</span>
                                <span className="user-email">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`role-badge role-badge--${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            {user.department_id ? (
                              <span className="dept-tag">
                                {user.department_id.split('-')[1].toUpperCase()} · {user.level}L
                              </span>
                            ) : (
                              <span className="text-muted">Unassigned</span>
                            )}
                          </td>
                          <td>
                            {user.role === 'admin' ? (
                              <span className="admin-label">Master Admin</span>
                            ) : (
                              <div className="admin-actions">
                                <button 
                                  className="btn-action promote"
                                  onClick={() => setPromotingUser({ user, role: 'moderator' })}
                                >
                                  Make Moderator
                                </button>
                                <button 
                                  className="btn-action promote"
                                  onClick={() => {
                                    if(confirm(`Make ${user.full_name} a Master Admin?`)) {
                                      promoteUser(user.id, 'admin', null, null);
                                    }
                                  }}
                                  style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                                >
                                  Make Admin
                                </button>
                                {user.role === 'moderator' && (
                                  <button 
                                    className="btn-action demote"
                                    onClick={() => promoteUser(user.id, 'student', null, null)}
                                  >
                                    Revoke
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'departments' ? (
              <div className="admin-section">
                <div className="departments-grid">
                  <div className="card add-dept-form">
                    <h3>Register Department</h3>
                    <form onSubmit={addDepartment}>
                      <div className="form-group">
                        <label>Code (e.g. CSC)</label>
                        <input 
                          type="text" 
                          placeholder="CSC"
                          value={newDept.code} 
                          onChange={e => setNewDept({...newDept, code: e.target.value.toUpperCase()})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Full Department Name</label>
                        <input 
                          type="text" 
                          placeholder="Computer Science"
                          value={newDept.name} 
                          onChange={e => setNewDept({...newDept, name: e.target.value})}
                        />
                      </div>
                      <Button variant="primary" type="submit" disabled={isAddingDept} style={{ width: '100%' }}>
                        {isAddingDept ? 'Registering...' : 'Add Department'}
                      </Button>
                    </form>
                  </div>

                  {departments.map(dept => (
                    <div key={dept.id} className="card dept-item">
                      <div className="dept-icon">{dept.code[0]}</div>
                      <div className="dept-info">
                        <h4>{dept.name}</h4>
                        <p>{dept.code} Faculty Branch</p>
                      </div>
                      <ChevronRight size={20} className="dept-arrow" />
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'pending' ? (
              <div className="admin-section animate-fade-in">
                <div className="card">
                  <div className="section-header">
                    <h2>Pending Approvals</h2>
                  </div>
                  <div className="admin-table-wrapper">
                    {filteredPending.length === 0 ? (
                      <div className="admin-empty-state">
                        <ShieldCheck size={48} color="var(--primary)" />
                        <h3>All caught up!</h3>
                        <p>No materials waiting for approval.</p>
                      </div>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Material</th>
                            <th>Course</th>
                            <th>Uploader</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPending.map(mat => (
                            <tr key={mat.id}>
                              <td>
                                <div className="user-name">{mat.title}</div>
                                <div className="user-email">PDF Document</div>
                              </td>
                              <td><span className="dept-tag">{mat.course_code}</span></td>
                              <td>{mat.uploader_name}</td>
                              <td>
                                <div className="admin-actions">
                                  <button className="btn-action promote" onClick={() => handleApprove(mat.id)}>
                                    <Check size={14} />
                                  </button>
                                  <button className="btn-action demote" onClick={() => handleReject(mat.id)}>
                                    <X size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="admin-section animate-fade-in">
                <div className="analytics-grid">
                  <div className="card analytics-card">
                    <div className="chart-header">
                      <h3><TrendingUp size={18} color="var(--primary)" /> Platform Engagement</h3>
                      <p className="text-muted text-xs">Active study sessions over the last 7 days</p>
                    </div>
                    <div className="chart-container">
                      <EngagementChart data={statsData?.engagement || [0,0,0,0,0,0,0]} />
                    </div>
                    <div className="engagement-stats">
                      <div className="eng-stat-item">
                        <span className="eng-stat-val">+{statsData?.engagement?.reduce((a,b)=>a+b,0) || 0}</span>
                        <span className="eng-stat-label">Total Sessions</span>
                      </div>
                      <div className="eng-stat-item">
                        <span className="eng-stat-val">{Math.round((statsData?.engagement?.[6] || 0) / 1.5)}%</span>
                        <span className="eng-stat-label">Retention</span>
                      </div>
                    </div>
                  </div>

                  <div className="card analytics-card">
                    <div className="chart-header">
                      <h3><Zap size={18} color="#F59E0B" /> AI Tutor Utilization</h3>
                      <p className="text-muted text-xs">Queries handled by Buhari AI</p>
                    </div>
                    <div className="chart-container">
                      <EngagementChart data={[12, 18, 15, 25, 22, 30, 28]} color="#F59E0B" />
                    </div>
                    <div className="engagement-stats">
                      <div className="eng-stat-item">
                        <span className="eng-stat-val" style={{ color: '#F59E0B' }}>{statsData?.chats || 0}</span>
                        <span className="eng-stat-label">Total Queries</span>
                      </div>
                      <div className="eng-stat-item">
                        <span className="eng-stat-val" style={{ color: '#F59E0B' }}>94%</span>
                        <span className="eng-stat-label">Accuracy Score</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Appointment Overlay */}
      {promotingUser && (
        <div className="modal-overlay" onClick={() => setPromotingUser(null)}>
          <div className="onboarding-card animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h2>Appoint Moderator</h2>
            <p className="text-muted">Set authority for {promotingUser.user.full_name}</p>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Target Department</label>
              <select 
                className="admin-select"
                onChange={e => setPromotingUser({ ...promotingUser, deptId: e.target.value })}
                value={promotingUser.deptId || ''}
              >
                <option value="">Select Department...</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Target Level</label>
              <select 
                className="admin-select"
                onChange={e => setPromotingUser({ ...promotingUser, level: parseInt(e.target.value) })}
                value={promotingUser.level || ''}
              >
                <option value="">Select Level...</option>
                {[100, 200, 300, 400, 500].map(l => (
                  <option key={l} value={l}>{l}L</option>
                ))}
              </select>
            </div>

            <div className="admin-modal-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Button variant="secondary" onClick={() => setPromotingUser(null)} style={{ flex: 1 }}>Cancel</Button>
              <Button 
                variant="primary" 
                style={{ flex: 1 }}
                disabled={!promotingUser.deptId || !promotingUser.level}
                onClick={() => {
                  promoteUser(promotingUser.user.id, 'moderator', promotingUser.deptId, promotingUser.level);
                  setPromotingUser(null);
                }}
              >
                Confirm Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
