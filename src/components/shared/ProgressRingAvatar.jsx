import './progressringavatar.css';

/**
 * W3Schools-inspired circular progress ring avatar.
 * Shows completion percentage as an SVG ring around the user's initial/avatar,
 * with a streak fire badge overlaid bottom-right.
 */
export default function ProgressRingAvatar({
  name = '',
  avatar = null,
  percentage = 0,
  streak = 0,
  size = 40,
  onClick,
}) {
  const strokeWidth = 3;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0;
  const offset = circumference - (safePercent / 100) * circumference;
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const fontSize = size * 0.4;

  return (
    <button
      className="progress-ring-avatar"
      style={{ width: size, height: size }}
      onClick={onClick}
      aria-label={`Profile: ${name}, ${percentage}% complete, ${streak} day streak`}
      type="button"
    >
      {/* SVG Progress Ring */}
      <svg
        className="progress-ring-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background ring */}
        <circle
          className="progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress ring */}
        <circle
          className="progress-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Avatar content */}
      <div className="progress-ring-content">
        {avatar ? (
          <img src={avatar} alt={name} className="progress-ring-image" />
        ) : (
          <span className="progress-ring-initial" style={{ fontSize }}>
            {initial}
          </span>
        )}
      </div>

      {/* Streak badge */}
      {streak > 0 && (
        <div className="progress-ring-streak" aria-hidden="true">
          <span className="streak-fire">🔥</span>
          <span className="streak-count">{streak}</span>
        </div>
      )}
    </button>
  );
}
