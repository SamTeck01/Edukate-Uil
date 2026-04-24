import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';
import { getSummary } from '../../api/aiService';
import './summaryview.css';

export default function SummaryView({ materialId, dataRef, contextText }) {
  const [summary, setSummary] = useState(dataRef.current || '');
  const [loading, setLoading] = useState(!dataRef.current);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechInstance, setSpeechInstance] = useState(null);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      setSpeechInstance(utterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (dataRef.current) return;

    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      try {
        const result = await getSummary(materialId, contextText, (chunk) => {
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
        <div className="summary-header-left">
          <span className="summary-icon">📝</span>
          <h3 className="summary-title">AI Summary</h3>
        </div>
        {summary && !loading && (
          <button 
            className={`summary-audio-btn ${isSpeaking ? 'summary-audio-btn--playing' : ''}`}
            onClick={toggleSpeech}
            title={isSpeaking ? "Stop listening" : "Listen to summary"}
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isSpeaking ? "Stop" : "Listen"}</span>
          </button>
        )}
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
