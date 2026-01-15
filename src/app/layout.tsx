import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import ModalManager from '@/components/ModalManager';

export const metadata: Metadata = {
  title: 'VoteBox - Make Your Voice Heard',
  description: 'Create polls, vote, and see results in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ModalManager />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}