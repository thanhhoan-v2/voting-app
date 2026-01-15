import { getPolls } from '@/lib/db-actions';
import Link from 'next/link';
import Header from '@/components/Header';

export default async function PollsPage() {
  const polls = await getPolls();

  // 배경색 순환
  const cardColors = ['card-yellow', 'card-mint', 'card-lavender', ''];

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header showNewPollButton />

      <div className="container mx-auto px-4 py-12">
        {/* 페이지 타이틀 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-fade-in">
          <div>
            <h1 className="heading-primary text-4xl md:text-5xl mb-4">
              Active Polls
            </h1>
            <p className="text-body text-lg flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-[var(--accent-mint)] rounded-full border-2 border-[var(--border-color)]" />
              {polls.length} {polls.length === 1 ? 'poll' : 'polls'} available
            </p>
          </div>
        </div>

        {polls.length === 0 ? (
          /* 빈 상태 */
          <div className="text-center py-20 animate-scale-in">
            <div className="card-static card-lavender max-w-md mx-auto p-12">
              <div className="w-24 h-24 mx-auto bg-white border-3 border-[var(--border-color)] rounded-full flex items-center justify-center mb-6 shadow-brutal">
                <svg className="w-12 h-12 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="heading-secondary text-2xl mb-4">No polls yet</h2>
              <p className="text-body mb-8">
                Create the first poll and start collecting votes!
              </p>
              <Link href="/polls/create" className="btn-coral">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create First Poll
              </Link>
            </div>
          </div>
        ) : (
          /* 폴 그리드 */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll: any, index: number) => (
              <Link
                key={poll.id}
                href={`/polls/${poll.id}`}
                className={`card ${cardColors[index % cardColors.length]} p-6 animate-scale-in opacity-0 block`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="status-badge status-live">
                    Active
                  </span>
                  <span className="vote-badge">
                    {poll.total_votes} {Number(poll.total_votes) === 1 ? 'vote' : 'votes'}
                  </span>
                </div>

                <h2 className="heading-secondary text-xl mb-3 line-clamp-2">
                  {poll.title}
                </h2>

                {poll.description && (
                  <p className="text-body text-sm mb-6 line-clamp-2">
                    {poll.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t-2 border-[var(--border-color)]">
                  <div className="flex items-center gap-2 text-body text-sm">
                    <div className="w-6 h-6 bg-[var(--accent-sky)] border-2 border-[var(--border-color)] rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{poll.created_by_username?.charAt(0).toUpperCase() || 'A'}</span>
                    </div>
                    <span>{poll.created_by_username || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--text-primary)] font-semibold text-sm">
                    Vote
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
