import { useState, useEffect } from 'react';
import { Check, X as XIcon, ChevronRight } from 'lucide-react';
import { getQuiz } from '../../api/aiService';
import './quizviewer.css';

/**
 * Quiz Viewer — multiple choice questions with empathetic explanations.
 * Shows one question at a time. Persists via dataRef.
 */
export default function QuizViewer({ materialId, dataRef }) {
  const [questions, setQuestions] = useState(dataRef.current?.questions || []);
  const [loading, setLoading] = useState(!dataRef.current);
  const [currentIndex, setCurrentIndex] = useState(dataRef.current?.currentIndex || 0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(dataRef.current?.score || 0);
  const [completed, setCompleted] = useState(dataRef.current?.completed || false);

  useEffect(() => {
    if (dataRef.current?.questions) return;

    async function loadQuiz() {
      setLoading(true);
      try {
        const data = await getQuiz(materialId);
        setQuestions(data);
        dataRef.current = { questions: data, currentIndex: 0, score: 0, completed: false };
      } catch (err) {
        console.error('Quiz error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [materialId, dataRef]);

  // Persist state
  useEffect(() => {
    if (dataRef.current) {
      dataRef.current = { questions, currentIndex, score, completed };
    }
  }, [questions, currentIndex, score, completed, dataRef]);

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (loading) {
    return (
      <div className="quiz-viewer">
        <div className="quiz-loading">
          <div className="quiz-loading-shimmer skeleton" />
          <p>Generating quiz questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-viewer">
        <p className="quiz-empty">No quiz questions generated yet.</p>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-viewer">
        <div className="quiz-result animate-fade-in-up">
          <span className="quiz-result-emoji">
            {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
          </span>
          <h3 className="quiz-result-title">
            {percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good effort!' : 'Keep studying!'}
          </h3>
          <p className="quiz-result-score">
            You got <strong>{score}</strong> out of <strong>{questions.length}</strong> correct ({percentage}%)
          </p>
          <p className="quiz-result-message">
            {percentage >= 80
              ? "You've clearly mastered this material. Time to move on!"
              : percentage >= 50
              ? "You're on the right track. Review the concepts you missed and try again."
              : "Don't worry — learning takes time. Re-read the material and try the flashcards first."}
          </p>
          <button className="quiz-restart-btn" onClick={restart}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="quiz-viewer">
      {/* Progress */}
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>
      <span className="quiz-counter">
        Question {currentIndex + 1} of {questions.length}
      </span>

      {/* Question */}
      <h3 className="quiz-question">{q.question}</h3>

      {/* Options */}
      <div className="quiz-options">
        {q.options.map((option, i) => {
          let optionClass = 'quiz-option';
          if (showResult) {
            if (i === q.correctAnswer) optionClass += ' quiz-option--correct';
            else if (i === selectedAnswer) optionClass += ' quiz-option--wrong';
            else optionClass += ' quiz-option--dimmed';
          } else if (selectedAnswer === i) {
            optionClass += ' quiz-option--selected';
          }

          return (
            <button
              key={i}
              className={optionClass}
              onClick={() => handleAnswer(i)}
              disabled={showResult}
            >
              <span className="quiz-option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="quiz-option-text">{option}</span>
              {showResult && i === q.correctAnswer && <Check size={16} className="quiz-option-icon quiz-icon-correct" />}
              {showResult && i === selectedAnswer && i !== q.correctAnswer && <XIcon size={16} className="quiz-option-icon quiz-icon-wrong" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className={`quiz-explanation animate-fade-in-up ${selectedAnswer === q.correctAnswer ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {showResult && (
        <button className="quiz-next-btn animate-fade-in-up" onClick={nextQuestion}>
          <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}</span>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
