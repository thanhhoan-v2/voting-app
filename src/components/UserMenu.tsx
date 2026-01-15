'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

interface UserMenuProps {
  displayName: string;
}

export default function UserMenu({ displayName }: UserMenuProps) {
  const { setDisplayName } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDisplayName(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--accent-sky)] border-2 border-[var(--border-color)] rounded-full hover:shadow-brutal transition-shadow"
      >
        <div className="w-7 h-7 bg-white border-2 border-[var(--border-color)] rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold max-w-[100px] truncate">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border-3 border-[var(--border-color)] rounded-xl shadow-brutal z-50 overflow-hidden animate-scale-in">
          <div className="px-4 py-3 border-b-2 border-[var(--border-color)] bg-gray-50">
            <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
            <p className="text-sm font-semibold truncate">{displayName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--accent-coral)] hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
