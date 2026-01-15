'use client';

import { useState } from 'react';

// Question Modal Component - Must answer correctly to proceed
export default function QuestionModal({ onVerified }: { onVerified: () => void }) {
  const [inputValue, setInputValue] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState('');

  const CORRECT_ANSWER = 'nói xấu người hàn';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = inputValue.trim().toLowerCase();

    if (answer === CORRECT_ANSWER.toLowerCase()) {
      setIsClosing(true);
      setTimeout(() => {
        localStorage.setItem('voting_app_verified', 'true');
        onVerified();
      }, 300);
    } else {
      setError('Dạ sai ròi ạ!');
      setInputValue('');
      // Shake animation
      const form = e.target as HTMLFormElement;
      form.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        form.style.animation = '';
      }, 500);
    }
  };

  return (
    <div className={`dialog-overlay ${isClosing ? 'dialog-closing' : ''}`}>
      <div className={`dialog-container ${isClosing ? 'dialog-content-closing' : ''}`}>
        {/* 장식용 요소들 */}
        <div className="dialog-decoration dialog-decoration-1" />
        <div className="dialog-decoration dialog-decoration-2" />
        <div className="dialog-decoration dialog-decoration-3" />

        <div className="dialog-content">
          <div className="dialog-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>

          <h2 className="dialog-title">Security Question</h2>
          <p className="dialog-subtitle">Nấu xói người hàn là gì?</p>

          <form onSubmit={handleSubmit} className="dialog-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              placeholder="Enter your answer..."
              className="dialog-input"
              autoFocus
            />
            {error && (
              <p className="text-[var(--accent-coral)] text-sm font-medium mt-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="dialog-button"
            >
              Verify
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </form>

          <p className="dialog-note">
            Answer correctly to access the voting app
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}