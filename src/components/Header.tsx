'use client';

import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import UserMenu from './UserMenu';

interface HeaderProps {
  showBackLink?: boolean;
  backLinkHref?: string;
  backLinkText?: string;
  showNewPollButton?: boolean;
}

export default function Header({
  showBackLink = false,
  backLinkHref = '/polls',
  backLinkText = 'All Polls',
  showNewPollButton = false
}: HeaderProps) {
  const { displayName } = useUser();

  return (
    <header className="border-b-3 border-[var(--border-color)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="heading-primary text-2xl">
          Vote<span className="text-[var(--accent-coral)]">Box</span>
        </Link>
         <div className="flex items-center gap-4">
          {showBackLink && (
            <Link href={backLinkHref} className="nav-link">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              {backLinkText}
            </Link>
          )}
          {showNewPollButton && (
            <Link href="/polls/create" className="btn-primary btn-small">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Poll
            </Link>
          )}
          {displayName && <UserMenu displayName={displayName} />}
        </div>
      </div>
    </header>
  );
}
