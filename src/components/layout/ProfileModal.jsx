import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import './profilemodal.css';

export default function ProfileModal({ user, dept, completionPercentage, onClose }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // In a real app, call sign out API here
    onClose();
    navigate('/auth');
  };

  const handleSettings = () => {
    onClose();
    navigate('/settings');
  };

  if (!user) return null;

  return (
    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
      {/* Header Info */}
      <div className="profile-modal-header">
        <div className="profile-modal-name">{user.name || 'Student'}</div>
        <div className="profile-modal-email">{user.email || 'student@physci.edu'}</div>
        {dept && (
          <div className="profile-modal-badge" style={{ '--dept-color': dept.color }}>
            <span className="profile-modal-dept">{dept.code}</span>
            <span className="profile-modal-level">Level {user.level || '100'}</span>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="profile-modal-section">
        <h4 className="profile-modal-subtitle">Your Progress</h4>
        <div className="profile-modal-progress-wrap">
          <div className="profile-modal-progress-bar">
            <div 
              className="profile-modal-progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="profile-modal-progress-text">{completionPercentage}% Completed</span>
        </div>
        <p className="profile-modal-hint">
          {user.totalMaterialsRead || 0} out of {user.totalMaterials || 0} materials read
        </p>
      </div>

      {/* Streak Section */}
      <div className="profile-modal-section profile-modal-streak">
        <div className="profile-modal-streak-icon">🔥</div>
        <div className="profile-modal-streak-info">
          <div className="profile-modal-streak-title">{user.studyStreak || 0} Day Streak!</div>
          <div className="profile-modal-streak-desc">Keep studying every day to maintain your streak.</div>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-modal-actions">
        <button className="profile-modal-action-btn" onClick={handleSettings}>
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button className="profile-modal-action-btn profile-modal-signout" onClick={handleSignOut}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
