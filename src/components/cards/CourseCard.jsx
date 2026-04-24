import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import './coursecard.css';

/**
 * Course card matching NotebookLM's notebook cards exactly.
 * Warm cream background, large icon, bold title (2 lines truncated),
 * date + material count metadata, 3-dot menu always visible.
 */
export default function CourseCard({ course, onClick }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(course);
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  // Format a fake date for now (from mock data)
  const formatDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  };

  return (
    <div className="course-card card-hover" onClick={handleClick}>
      {/* 3-dot menu — always visible like NotebookLM */}
      <button
        className="course-card-dots"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        aria-label="Course options"
      >
        <MoreVertical size={18} />
      </button>

      {showMenu && (
        <>
          <div className="course-card-menu-backdrop" onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }} />
          <div className="course-card-menu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowMenu(false)}>Add to reading notebook</button>
            <button onClick={() => setShowMenu(false)}>Share</button>
            <button onClick={() => setShowMenu(false)}>Course info</button>
          </div>
        </>
      )}

      {/* Large icon area */}
      <div className="course-card-icon-area">
        <span className="course-card-icon">{course.icon}</span>
      </div>

      {/* Title — bold, 2 lines max, truncated */}
      <h3 className="course-card-title">{course.title}</h3>

      {/* Metadata — date + material count */}
      <p className="course-card-meta">
        {formatDate()} · {course.materialCount} source{course.materialCount !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

/**
 * Dashed card for "Create Reading Notebook" — matches NotebookLM's "Create new notebook"
 */
export function CreateNotebookCard({ onClick }) {
  return (
    <button className="course-card course-card--create card-hover" onClick={onClick}>
      <div className="course-card-create-plus">
        <span>+</span>
      </div>
      <p className="course-card-create-text">Create reading notebook</p>
    </button>
  );
}
