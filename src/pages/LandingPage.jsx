import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { ArrowRight } from 'lucide-react';
import './landingpage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content animate-fade-in-up">
        <span className="landing-badge">Faculty of Physical Sciences</span>
        <h1 className="landing-title">
          <span className="landing-title-icon">📖</span>
          PhySci Hub
        </h1>
        <p className="landing-subtitle">
          Your centralized learning platform. Access lecture materials, get AI-powered summaries, flashcards, and quizzes — all in one place.
        </p>
        <div className="landing-actions">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
        <p className="landing-note">
          An initiative by <strong>Buhari</strong>
        </p>
      </div>
    </div>
  );
}
