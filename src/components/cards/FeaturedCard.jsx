import { useNavigate } from 'react-router-dom';
import './featuredcard.css';

/**
 * Colorful gradient card for "Continue Studying" row.
 * Shows the last opened materials with course code, title, and reading progress.
 * Matches NotebookLM's "Featured notebooks" visual style.
 */

const gradients = [
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #6366F1, #8B5CF6)',
  'linear-gradient(135deg, #0D9488, #06B6D4)',
  'linear-gradient(135deg, #EC4899, #F43F5E)',
  'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  'linear-gradient(135deg, #10B981, #059669)',
];

export default function FeaturedCard({ material, index }) {
  const navigate = useNavigate();
  const gradient = gradients[index % gradients.length];
  const progress = material.pageCount > 0
    ? Math.round((material.lastReadPage / material.pageCount) * 100)
    : 0;

  return (
    <button
      className="featured-card"
      style={{ background: gradient }}
      onClick={() => navigate(`/reader/${material.id}`)}
    >
      <div className="featured-card-dept">
        <span className="featured-card-dept-badge">{material.courseCode}</span>
      </div>
      <div className="featured-card-body">
        <h3 className="featured-card-title">{material.title}</h3>
        <div className="featured-card-meta">
          <span>pg {material.lastReadPage}/{material.pageCount}</span>
          <span>·</span>
          <span>{material.readCount} readers</span>
        </div>
      </div>
      <div className="featured-card-progress">
        <div className="featured-card-progress-track">
          <div
            className="featured-card-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
}
