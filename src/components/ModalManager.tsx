'use client';

import { useUser } from '@/contexts/UserContext';
import DisplayNameDialog from './DisplayNameDialog';
import QuestionModal from './QuestionModal';

export default function ModalManager() {
  const { displayName, isVerified, setIsVerified, isLoading } = useUser();

  // Don't show modals while loading
  if (isLoading) {
    return null;
  }

  return (
    <>
      {!isVerified && !displayName && <QuestionModal onVerified={() => setIsVerified(true)} />}
      <DisplayNameDialog />
    </>
  );
}