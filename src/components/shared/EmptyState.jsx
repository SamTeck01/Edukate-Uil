import React from 'react';
import './emptystate.css';

export default function EmptyState({ title, description, icon, imageUrl, actionLabel, onAction }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-illustration">
        {imageUrl ? <img src={imageUrl} alt="" className="empty-state-img" /> : (icon || '📚')}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && (
        <button className="empty-state-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export const Skeleton = ({ width, height, radius, className = '' }) => (
  <div 
    className={`skeleton ${className}`} 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      borderRadius: radius || '4px' 
    }} 
  />
);
