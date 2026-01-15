'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

// 사용자 이름 입력 다이얼로그 컴포넌트
export default function DisplayNameDialog() {
  const { displayName, setDisplayName, isVerified, isLoading } = useUser();
  const [inputValue, setInputValue] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  // 이름 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsClosing(true);
      setTimeout(() => {
        setDisplayName(inputValue.trim());
      }, 300);
    }
  };

  // 로딩 중이거나 아직 인증되지 않았거나 이미 이름이 있으면 다이얼로그 표시 안함
  if (isLoading || !isVerified || displayName) {
    return null;
  }

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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h2 className="dialog-title">Welcome!</h2>
          <p className="dialog-subtitle">What should we call you?</p>

          <form onSubmit={handleSubmit} className="dialog-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your name..."
              className="dialog-input"
              autoFocus
              maxLength={30}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="dialog-button"
            >
              Let's Go!
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          <p className="dialog-note">
            This name will be shown with your votes and comments
          </p>
        </div>
      </div>
    </div>
  );
}
