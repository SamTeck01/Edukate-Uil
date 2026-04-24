import { useState, useEffect } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFlashcards } from '../../api/aiService';
import './flashcardviewer.css';

/**
 * Flashcard Viewer — interactive 3D flip cards.
 * Navigate with arrows, click/tap to flip. Persists via dataRef.
 */
export default function FlashcardViewer({ materialId, dataRef, contextText }) {
  const [cards, setCards] = useState(dataRef.current || []);
  const [loading, setLoading] = useState(!dataRef.current);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (dataRef.current) return;

    async function loadCards() {
      setLoading(true);
      try {
        const data = await getFlashcards(materialId, contextText);
        setCards(data);
        dataRef.current = data;
      } catch (err) {
        console.error('Flashcards error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [materialId, dataRef]);

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(i => i + 1), 150);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(i => i - 1), 150);
    }
  };

  const flip = () => setIsFlipped(f => !f);

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="flashcard-viewer">
        <div className="flashcard-loading">
          <div className="flashcard-loading-card skeleton" />
          <p>Generating flashcards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flashcard-viewer">
        <p className="flashcard-empty">No flashcards generated yet.</p>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="flashcard-viewer">
      {/* Progress */}
      <div className="flashcard-progress">
        <span className="flashcard-counter">
          {currentIndex + 1} / {cards.length}
        </span>
        <button className="flashcard-restart" onClick={restart} aria-label="Restart">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Card */}
      <div className="flashcard-stage" onClick={flip}>
        <div className={`flashcard-card ${isFlipped ? 'flashcard-card--flipped' : ''}`}>
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-label">Question</span>
            <p className="flashcard-text">{card.question}</p>
            <span className="flashcard-hint">Tap to reveal</span>
          </div>
          <div className="flashcard-face flashcard-back">
            <span className="flashcard-label">Answer</span>
            <p className="flashcard-text">{card.answer}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flashcard-nav">
        <button
          className="flashcard-nav-btn"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dot indicators */}
        <div className="flashcard-dots">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`flashcard-dot ${i === currentIndex ? 'flashcard-dot--active' : ''} ${i < currentIndex ? 'flashcard-dot--done' : ''}`}
            />
          ))}
        </div>

        <button
          className="flashcard-nav-btn"
          onClick={goNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
