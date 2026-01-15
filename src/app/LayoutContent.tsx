'use client';

import './globals.css';
import { useUser } from '@/contexts/UserContext';
import ModalManager from '@/components/ModalManager';
import SnowfallComponent from '@/components/Snowfall';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { snowfallEnabled } = useUser();
  
  return (
    <html lang="en">
      <body>
        <ModalManager />
        <SnowfallComponent enabled={snowfallEnabled} color="#ffffff" snowflakeCount={150} />
        {children}
      </body>
    </html>
  );
}