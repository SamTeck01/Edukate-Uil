import { useState, useEffect } from 'react';
import { getSummary } from '../../api/aiService';
import './summaryview.css';

/**
 * Summary View — AI-generated 3-paragraph summary with streaming.
 * Persists via dataRef so content survives bottom sheet close/open.
 */
export default function SummaryView({ materialId, dataRef }) {
  const [summary, setSummary] = useState(dataRef.current || '');
  const [loading, setLoading] = useState(!dataRef.current);

  useEffect(() => {
    if (dataRef.current) return; // Already loaded

    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      try {
        const result = await getSummary(materialId, (chunk) => {
          if (!cancelled) setSummary(chunk);
        });
        if (!cancelled) {
          setSummary(result);
          dataRef.current = result;
        }
      } catch (err) {
        if (!cancelled) setSummary('Failed to generate summary. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSummary();
    return () => { cancelled = true; };
  }, [materialId, dataRef]);

  return (
    <div className="summary-view">
      <div className="summary-header">
        <span className="summary-icon">📝</span>
        <h3 className="summary-title">AI Summary</h3>
      </div>

      {loading && !summary ? (
        <div className="summary-skeleton">
          <div className="summary-skeleton-line skeleton" style={{ width: '90%' }} />
          <div className="summary-skeleton-line skeleton" style={{ width: '100%' }} />
          <div className="summary-skeleton-line skeleton" style={{ width: '75%' }} />
          <div className="summary-skeleton-line skeleton" style={{ width: '85%' }} />
          <div className="summary-skeleton-line skeleton" style={{ width: '60%' }} />
        </div>
      ) : (
        <div className="summary-content">
          {summary.split('\n\n').map((paragraph, i) => (
            <p key={i} className="summary-paragraph animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              {paragraph}
            </p>
          ))}
          {loading && <span className="summary-cursor" />}
        </div>
      )}
    </div>
  );
}
