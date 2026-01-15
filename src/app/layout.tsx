import type { Metadata } from 'next';
import './globals.css';
import { UserProvider, useUser } from '@/contexts/UserContext';
import ModalManager from '@/components/ModalManager';
import SnowfallComponent from '@/components/Snowfall';

export const metadata: Metadata = {
  title: 'VoteBox - Make Your Voice Heard',
  description: 'Create polls, vote, and see results in real-time',
};

// Wrapper component to access context
function SnowfallWrapper() {
  const { snowfallEnabled } = useUser();
  return <SnowfallComponent enabled={snowfallEnabled} color="#ffffff" snowflakeCount={150} />;
}

function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ModalManager />
      <SnowfallWrapper />
      {children}
    </>
  );
}

export default function RootLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <LayoutContent {...props} />
        </UserProvider>
      </body>
    </html>
  );
}