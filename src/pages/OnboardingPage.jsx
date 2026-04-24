import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../components/shared/Button';
import { useApp } from '../context/AppContext';
import usePageMeta from '../hooks/usePageMeta';
import './onboardingpage.css';

const levels = [100, 200, 300, 400, 500];

const DEPT_STYLES = {
  'dept-csc': { icon: '💻', color: '#3b82f6' },
  'dept-phy': { icon: '⚛️', color: '#8b5cf6' },
  'dept-chm': { icon: '🧪', color: '#10b981' },
  'dept-mth': { icon: '📐', color: '#f59e0b' }
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { completeOnboarding, departments } = useApp();

  usePageMeta({
    title: 'Get Started — Edukate UIL',
    description: 'Select your department and level to personalize your Edukate UIL experience.',
  });

  const [step, setStep] = useState(1); // 1: department, 2: level
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleContinue = () => {
    if (step === 1 && selectedDept) {
      setStep(2);
    } else if (step === 2 && selectedLevel) {
      completeOnboarding(selectedDept, selectedLevel);
      navigate('/dashboard');
    }
  };

  return (
    <div className="onboarding-page">
      <div className="auth-bg-blob auth-bg-blob--1" />
      <div className="auth-bg-blob auth-bg-blob--2" />
      
      <div className="onboarding-card animate-fade-in-up">
        {/* Progress dots */}
        <div className="onboarding-progress">
          <div className={`onboarding-dot ${step >= 1 ? 'onboarding-dot--active' : ''}`} />
          <div className={`onboarding-dot ${step >= 2 ? 'onboarding-dot--active' : ''}`} />
        </div>

        {step === 1 ? (
          <>
            <h1 className="onboarding-title">What's your department?</h1>
            <p className="onboarding-subtitle">
              We'll show materials relevant to your courses.
            </p>

            <div className="onboarding-options">
              {departments.map(dept => {
                const style = DEPT_STYLES[dept.id] || { icon: '📚', color: '#64748b' };
                return (
                  <button
                    key={dept.id}
                    className={`onboarding-option ${selectedDept === dept.id ? 'onboarding-option--selected' : ''}`}
                    onClick={() => setSelectedDept(dept.id)}
                    style={{ '--dept-color': style.color }}
                  >
                    <span className="onboarding-option-icon">{style.icon}</span>
                    <div className="onboarding-option-text">
                      <span className="onboarding-option-name">{dept.name}</span>
                      <span className="onboarding-option-code">{dept.code}</span>
                    </div>
                    {selectedDept === dept.id && (
                      <div className="onboarding-option-check">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>

        ) : (
          <>
            <h1 className="onboarding-title">What level are you?</h1>
            <p className="onboarding-subtitle">
              This helps us filter the right courses for you.
            </p>

            <div className="onboarding-levels">
              {levels.map(lvl => (
                <button
                  key={lvl}
                  className={`onboarding-level ${selectedLevel === lvl ? 'onboarding-level--selected' : ''}`}
                  onClick={() => setSelectedLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="onboarding-actions">
          {step === 2 && (
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={step === 1 ? !selectedDept : !selectedLevel}
            onClick={handleContinue}
          >
            {step === 2 ? 'Get Started' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
