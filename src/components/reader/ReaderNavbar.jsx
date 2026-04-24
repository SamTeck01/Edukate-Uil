import { useNavigate } from 'react-router-dom';
import { PanelLeft, PanelRight, Share2, Settings, Grid3x3, Plus, Maximize2, Minimize2 } from 'lucide-react';
import ProgressRingAvatar from '../shared/ProgressRingAvatar';
import { useApp } from '../../context/AppContext';
import './readernavbar.css';

/**
 * Reader page navbar:
 * Left: 📖 logo → back to dashboard | Material title
 * Center: Panel toggles (Sources | Chat)
 * Right: "+ Create notebook" | maximize | "Share" | "Settings" | ⊞ grid | Avatar
 */
export default function ReaderNavbar({
  material,
  course,
  onToggleSources,
  onToggleChat,
  onToggleMaximize,
  isPdfMaximized,
  showSources,
  showChat,
}) {
  const navigate = useNavigate();
  const { user } = useApp();

  const completionPercentage = user?.totalMaterials
    ? Math.round((user.totalMaterialsRead / Math.max(user.totalMaterials, 1)) * 100)
    : 0;

  return (
    <header className="reader-navbar">
      <div className="reader-navbar-inner">
        {/* Left: logo + title */}
        <div className="reader-navbar-left">
          <button className="reader-navbar-home" onClick={() => navigate('/dashboard')} title="Back to dashboard">
            <span className="reader-navbar-logo-icon">📖</span>
          </button>
          <h1 className="reader-navbar-title">
            {material?.title || 'Untitled'}
          </h1>
        </div>

        {/* Right: actions */}
        <div className="reader-navbar-right">
          {/* Panel toggles */}
          <button
            className={`reader-navbar-toggle ${showSources ? 'reader-navbar-toggle--active' : ''}`}
            onClick={onToggleSources}
            title="Toggle sources panel"
          >
            <PanelLeft size={16} />
          </button>

          <button
            className={`reader-navbar-toggle ${showChat ? 'reader-navbar-toggle--active' : ''}`}
            onClick={onToggleChat}
            title="Toggle chat panel"
          >
            <PanelRight size={16} />
          </button>

          {/* Maximize/restore */}
          <button className="reader-navbar-toggle" onClick={onToggleMaximize} title={isPdfMaximized ? 'Restore' : 'Maximize PDF'}>
            {isPdfMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <div className="reader-navbar-divider" />

          <button className="reader-navbar-text-btn" onClick={() => navigate('/settings')}>
            <Settings size={15} />
            <span>Settings</span>
          </button>

          <button className="reader-navbar-icon-btn" aria-label="Grid menu">
            <Grid3x3 size={20} />
          </button>

          <div className="navbar-profile-wrap" style={{ position: 'relative' }}>
            <ProgressRingAvatar
              name={user?.full_name || 'S'}
              avatar={user?.avatar}
              percentage={completionPercentage}
              streak={user?.study_streak || 0}
              size={40}
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
