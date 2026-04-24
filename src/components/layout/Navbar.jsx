import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Grid3x3, ShieldCheck } from 'lucide-react';
import ProgressRingAvatar from '../shared/ProgressRingAvatar';
import ProfileModal from './ProfileModal';
import { useApp } from '../../context/AppContext';
import './navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, getUserDepartment } = useApp();
  const dept = getUserDepartment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const completionPercentage = user
    ? Math.round((user.totalMaterialsRead / Math.max(user.totalMaterials, 1)) * 100)
    : 0;

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-inner">
        {/* Left: Logo */}
        <div className="navbar-left">
          <button className="navbar-logo" onClick={() => navigate('/dashboard')}>
            <span className="navbar-logo-icon">📖</span>
            <span className="navbar-logo-text">Edukate UIL</span>
          </button>
        </div>

        {/* Right: Actions — matches NotebookLM: Settings(text+icon) | grid icon | avatar */}
        <div className="navbar-right">
          {/* Dept + Level badge (user liked this) */}
          {dept && (
            <div className="navbar-dept-badge" style={{ '--dept-color': dept.color }}>
              <span className="navbar-dept-icon">{dept.icon}</span>
              <span className="navbar-dept-name">{dept.code} · {user?.level}</span>
            </div>
          )}

          {/* Settings — text + icon like NotebookLM */}
          <button
            className="navbar-settings-btn"
            onClick={() => navigate('/settings')}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          {/* Buhari's Admin Boss Mode or Moderator Access */}
          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <button
              className="navbar-settings-btn navbar-admin-btn"
              onClick={() => navigate('/admin')}
            >
              <ShieldCheck size={16} />
              <span>{user?.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
            </button>
          )}

          {/* Grid icon — like NotebookLM's 9-dot grid */}
          <button className="navbar-icon-btn" aria-label="Menu">
            <Grid3x3 size={20} />
          </button>

          {/* Avatar with progress ring & Profile Modal */}
          <div className="navbar-profile-wrap" ref={modalRef} style={{ position: 'relative' }}>
            <ProgressRingAvatar
              name={user?.name || 'S'}
              avatar={user?.avatar}
              percentage={completionPercentage}
              streak={user?.studyStreak || 0}
              size={40}
              onClick={() => setIsModalOpen(!isModalOpen)}
            />
            
            {isModalOpen && (
              <ProfileModal
                user={user}
                dept={dept}
                completionPercentage={completionPercentage}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
