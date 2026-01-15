import { createTables } from '@/lib/db-actions';
import Link from 'next/link';

export default async function Home() {
  await createTables();

  return (
    <div className="min-h-screen bg-gradient-warm relative overflow-hidden">
      {/* 장식용 도형들 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--accent-yellow)] border-3 border-[var(--border-color)] rounded-full opacity-60 animate-float" />
      <div className="absolute top-40 right-20 w-20 h-20 bg-[var(--accent-coral)] border-3 border-[var(--border-color)] rounded-lg rotate-12 opacity-60 animate-float delay-200" />
      <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-[var(--accent-mint)] border-3 border-[var(--border-color)] rounded-full opacity-60 animate-float delay-300" />
      <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-[var(--accent-lavender)] border-3 border-[var(--border-color)] rounded-lg -rotate-6 opacity-60 animate-float delay-100" />

      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        {/* 메인 히어로 섹션 */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-6">
            <span className="status-badge status-live text-sm px-4 py-2">
              Live & Ready
            </span>
          </div>

          <h1 className="heading-primary text-6xl md:text-8xl mb-6">
            Vote<span className="text-[var(--accent-coral)]">Box</span>
          </h1>

          <p className="text-body text-xl md:text-2xl mb-4 max-w-xl mx-auto">
            Create polls, share opinions, and make decisions together.
          </p>
          <p className="text-body text-lg text-[var(--text-muted)]">
            No login required — just pick a name and start voting!
          </p>
        </div>

        {/* 기능 카드들 */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full mb-12 px-4">
          <div className="card card-yellow p-6 animate-scale-in opacity-0 delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="w-14 h-14 bg-white border-3 border-[var(--border-color)] rounded-xl flex items-center justify-center mb-4 shadow-brutal">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="heading-secondary text-lg mb-2">Create Polls</h3>
            <p className="text-body text-sm">Ask any question and add as many options as you want</p>
          </div>

          <div className="card card-mint p-6 animate-scale-in opacity-0 delay-200" style={{ animationFillMode: 'forwards' }}>
            <div className="w-14 h-14 bg-white border-3 border-[var(--border-color)] rounded-xl flex items-center justify-center mb-4 shadow-brutal">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="heading-secondary text-lg mb-2">Vote & Comment</h3>
            <p className="text-body text-sm">Cast your vote and share thoughts with images</p>
          </div>

          <div className="card card-lavender p-6 animate-scale-in opacity-0 delay-300" style={{ animationFillMode: 'forwards' }}>
            <div className="w-14 h-14 bg-white border-3 border-[var(--border-color)] rounded-xl flex items-center justify-center mb-4 shadow-brutal">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="heading-secondary text-lg mb-2">See Results</h3>
            <p className="text-body text-sm">Watch votes come in with real-time updates</p>
          </div>
        </div>

        {/* CTA 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0 delay-400" style={{ animationFillMode: 'forwards' }}>
          <Link href="/polls" className="btn-primary text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View All Polls
          </Link>
          <Link href="/polls/create" className="btn-coral text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create New Poll
          </Link>
        </div>
      </div>
    </div>
  );
}
