'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 사용자 컨텍스트 타입 정의
interface UserContextType {
  displayName: string | null;
  setDisplayName: (name: string) => void;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// localStorage 키
const STORAGE_KEY = 'voting_app_display_name';
const VERIFICATION_KEY = 'voting_app_verified';

export function UserProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayNameState] = useState<string | null>(null);
  const [isVerified, setIsVerifiedState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 localStorage에서 이름과 인증 상태 가져오기
  useEffect(() => {
    const storedName = localStorage.getItem(STORAGE_KEY);
    const storedVerified = localStorage.getItem(VERIFICATION_KEY) === 'true';

    if (storedName) {
      setDisplayNameState(storedName);
    }
    setIsVerifiedState(storedVerified);
    setIsLoading(false);
  }, []);

  // 이름 설정 및 localStorage에 저장
  const setDisplayName = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name);
    setDisplayNameState(name);
  };

  // 인증 상태 설정
  const setIsVerified = (verified: boolean) => {
    setIsVerifiedState(verified);
  };

  return (
    <UserContext.Provider value={{ displayName, setDisplayName, isVerified, setIsVerified, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
