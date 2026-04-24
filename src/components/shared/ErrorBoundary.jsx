import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Crash Caught by Boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content animate-scale-in">
            <div className="error-boundary__icon">
              <AlertCircle size={48} />
            </div>
            <h1>Something went wrong</h1>
            <p>
              Buhari's system encountered an unexpected error. Don't worry, your academic progress is safe.
            </p>
            <div className="error-boundary__actions">
              <Button variant="primary" onClick={this.handleReset}>
                <RotateCcw size={18} />
                Return to Dashboard
              </Button>
            </div>
          </div>
          
          <style>{`
            .error-boundary {
              height: 100vh;
              width: 100vw;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--surface);
              color: var(--text);
              padding: var(--space-6);
              text-align: center;
            }
            .error-boundary__content {
              max-width: 400px;
            }
            .error-boundary__icon {
              color: var(--danger);
              margin-bottom: var(--space-4);
              display: flex;
              justify-content: center;
            }
            .error-boundary h1 {
              font-family: var(--font-display);
              font-size: var(--text-2xl);
              font-weight: 800;
              margin-bottom: var(--space-2);
            }
            .error-boundary p {
              color: var(--text-secondary);
              margin-bottom: var(--space-8);
              line-height: 1.6;
            }
            .error-boundary__actions {
              display: flex;
              justify-content: center;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
