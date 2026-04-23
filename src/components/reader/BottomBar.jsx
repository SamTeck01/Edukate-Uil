import { FileText as SourcesIcon, MessageCircle, BookOpen } from 'lucide-react';
import './bottombar.css';

/**
 * Mobile bottom tab bar for Reader page.
 * Three tabs: Sources | Viewer | Chat
 * Matches NotebookLM's mobile bottom navigation exactly.
 *
 * Auto-hides when scrolling the PDF up, reappears when scrolling down.
 */
export default function BottomBar({ activeTab, onTabChange, visible = true }) {
  const tabs = [
    { id: 'sources', label: 'Sources', icon: SourcesIcon },
    { id: 'viewer', label: 'Viewer', icon: BookOpen },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <nav className={`reader-bottom-bar ${visible ? '' : 'reader-bottom-bar--hidden'}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`reader-bottom-tab ${activeTab === tab.id ? 'reader-bottom-tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <tab.icon size={20} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
