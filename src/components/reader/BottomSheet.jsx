import { useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import './bottomsheet.css';

/**
 * Bottom Sheet — slides up from bottom on mobile.
 *
 * On mobile: FULL SCREEN with ← back arrow (like NotebookLM quiz/sources)
 * On tablet: half-height sheet with drag handle
 * On desktop: side panel (used by ReaderPage inline, not this component)
 *
 * Content persists when closed/reopened (handled by parent via refs).
 */
export default function BottomSheet({ children, onClose, title = '' }) {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Touch drag to dismiss (for tablet half-sheet mode)
  const onTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e) => {
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    const delta = currentY.current - startY.current;
    if (delta > 120) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
  }, [onClose]);

  return (
    <>
      {/* Backdrop — tablet/desktop only, mobile is fullscreen */}
      <div className="bottom-sheet-backdrop" onClick={onClose} />

      {/* Sheet */}
      <div
        className="bottom-sheet"
        ref={sheetRef}
      >
        {/* Header — ← back arrow + title (mobile), drag handle (tablet) */}
        <div className="bottom-sheet-header">
          {/* Mobile: back arrow */}
          <button className="bottom-sheet-back" onClick={onClose} aria-label="Back">
            <ArrowLeft size={20} />
          </button>

          <h2 className="bottom-sheet-title">{title}</h2>

          {/* Mobile: close X (right side, optional) */}
          <button className="bottom-sheet-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Drag handle — tablet only */}
        <div
          className="bottom-sheet-drag"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="bottom-sheet-handle" />
        </div>

        {/* Content */}
        <div className="bottom-sheet-content">
          {children}
        </div>
      </div>
    </>
  );
}
