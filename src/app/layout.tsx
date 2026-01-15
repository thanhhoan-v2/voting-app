import type { Metadata } from 'next';
import { UserProvider } from '@/contexts/UserContext';
import LayoutContent from './LayoutContent';

export const metadata: Metadata = {
  title: 'VoteBox - Make Your Voice Heard',
  description: 'Create polls, vote, and see results in real-time',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}