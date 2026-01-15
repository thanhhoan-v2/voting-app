'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';

interface PollOption {
  id: number;
  option_text: string;
  vote_count: number;
  image_url?: string;
  map_url?: string;
  added_by_name?: string;
}

interface Comment {
  id: number;
  display_name: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
}

interface Poll {
  id: number;
  title: string;
  description: string;
  created_by_username: string;
  options: PollOption[];
}

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { displayName } = useUser();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState<number | null>(null);
  const [voteInfo, setVoteInfo] = useState<any>(null);

  // 새 옵션 추가 상태
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');
  const [newOptionImage, setNewOptionImage] = useState('');
  const [newOptionMapUrl, setNewOptionMapUrl] = useState('');
  const optionFileRef = useRef<HTMLInputElement>(null);

  // 댓글 상태
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState('');
  const commentFileRef = useRef<HTMLInputElement>(null);

  // 폴 데이터 가져오기
  useEffect(() => {
    fetchPoll();
  }, [resolvedParams.id, displayName]);

  const fetchPoll = async () => {
    try {
      const url = displayName
        ? `/api/polls/${resolvedParams.id}?displayName=${encodeURIComponent(displayName)}`
        : `/api/polls/${resolvedParams.id}`;

      const response = await fetch(url);
      const data = await response.json();
      setPoll(data.poll);
      setComments(data.comments || []);
      setHasVoted(data.hasVoted);
      setVotedOptionId(data.votedOptionId);
      setVoteInfo(data.voteInfo);
    } catch (error) {
      console.error('Error fetching poll:', error);
    } finally {
      setLoading(false);
    }
  };

  // 투표 처리 (optimistic update)
  const handleVote = async (optionId: number) => {
    if (!displayName || !poll) {
      alert('Please enter your name first');
      return;
    }

    // 이전 상태 저장
    const prevPoll = poll;
    const prevVotedOptionId = votedOptionId;
    const prevHasVoted = hasVoted;

    // Optimistic update - 즉시 UI 업데이트
    const updatedOptions = poll.options.map(opt => {
      let newVoteCount = Number(opt.vote_count);
      if (opt.id === optionId) newVoteCount += 1;
      if (prevVotedOptionId && opt.id === prevVotedOptionId) newVoteCount -= 1;
      return { ...opt, vote_count: newVoteCount };
    });
    setPoll({ ...poll, options: updatedOptions });
    setHasVoted(true);
    setVotedOptionId(optionId);

    // 백그라운드에서 API 호출
    try {
      const response = await fetch(`/api/polls/${resolvedParams.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, displayName }),
      });

      if (!response.ok) {
        // 실패 시 롤백
        setPoll(prevPoll);
        setVotedOptionId(prevVotedOptionId);
        setHasVoted(prevHasVoted);
        const data = await response.json();
        console.error('Vote error:', data);
        alert(`Error voting: ${data.details || data.error}`);
      }
    } catch (error) {
      // 에러 시 롤백
      setPoll(prevPoll);
      setVotedOptionId(prevVotedOptionId);
      setHasVoted(prevHasVoted);
      console.error('Vote error:', error);
      alert('Error voting');
    }
  };

  // 투표 삭제 (재투표 가능하게 함)
  const handleDeleteVote = async () => {
    if (!confirm('Are you sure you want to change your vote? You can vote again.')) return;

    // 이전 상태 저장
    const prevPoll = poll;
    const prevVotedOptionId = votedOptionId;
    const prevHasVoted = hasVoted;

    // Optimistic update - 투표 제거
    const updatedOptions = poll!.options.map(opt => {
      let newVoteCount = Number(opt.vote_count);
      if (opt.id === prevVotedOptionId) newVoteCount -= 1;
      return { ...opt, vote_count: newVoteCount };
    });
    setPoll({ ...poll!, options: updatedOptions });
    setHasVoted(false);
    setVotedOptionId(null);

    // 백그라운드에서 API 호출
    try {
      const response = await fetch(`/api/polls/${resolvedParams.id}/vote`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      });

      if (!response.ok) {
        // 실패 시 롤백
        setPoll(prevPoll);
        setVotedOptionId(prevVotedOptionId);
        setHasVoted(prevHasVoted);
        alert('Error changing vote');
      }
    } catch (error) {
      // 에러 시 롤백
      setPoll(prevPoll);
      setVotedOptionId(prevVotedOptionId);
      setHasVoted(prevHasVoted);
      alert('Error changing vote');
    }
  };

  // 새 옵션 추가 (optimistic update)
  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionText.trim() || !displayName || !poll) return;
    
    // 지도 URL 유효성 검사
    if (newOptionMapUrl && !isValidMapUrl(newOptionMapUrl)) {
      alert('Please enter a valid Google Maps URL');
      return;
    }

    // Optimistic option 생성
    const tempId = Date.now();
    const optimisticOption: PollOption = {
      id: tempId,
      option_text: newOptionText,
      vote_count: 0,
      image_url: newOptionImage || undefined,
      map_url: newOptionMapUrl || undefined,
      added_by_name: displayName,
    };

    // 이전 상태 저장
    const prevPoll = poll;
    const savedText = newOptionText;
    const savedImage = newOptionImage;
    const savedMapUrl = newOptionMapUrl;

    // 즉시 UI 업데이트
    setPoll({ ...poll, options: [...poll.options, optimisticOption] });
    setNewOptionText('');
    setNewOptionImage('');
    setNewOptionMapUrl('');
    setShowAddOption(false);

    // 백그라운드에서 API 호출
    try {
      const response = await fetch(`/api/polls/${resolvedParams.id}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionText: savedText,
          imageUrl: savedImage || null,
          mapUrl: savedMapUrl || null,
          displayName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 실제 옵션으로 교체
        setPoll(prev => prev ? {
          ...prev,
          options: prev.options.map(opt => opt.id === tempId ? { ...data, vote_count: 0 } : opt)
        } : null);
      } else {
        // 실패 시 롤백
        setPoll(prevPoll);
        setNewOptionText(savedText);
        setNewOptionImage(savedImage);
        setNewOptionMapUrl(savedMapUrl);
        setShowAddOption(true);
        alert('Error adding option');
      }
    } catch (error) {
      // 에러 시 롤백
      setPoll(prevPoll);
      setNewOptionText(savedText);
      setNewOptionImage(savedImage);
      setNewOptionMapUrl(savedMapUrl);
      setShowAddOption(true);
      alert('Error adding option');
    }
  };

  // 댓글 추가 (optimistic update)
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!commentText.trim() && !commentImage) || !displayName) return;

    // Optimistic comment 생성
    const tempId = Date.now();
    const optimisticComment: Comment = {
      id: tempId,
      display_name: displayName,
      content: commentText || null,
      image_url: commentImage || null,
      created_at: new Date().toISOString(),
    };

    // 이전 상태 저장
    const prevComments = comments;
    const savedText = commentText;
    const savedImage = commentImage;

    // 즉시 UI 업데이트
    setComments([optimisticComment, ...comments]);
    setCommentText('');
    setCommentImage('');

    // 백그라운드에서 API 호출
    try {
      const response = await fetch(`/api/polls/${resolvedParams.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          content: savedText || null,
          imageUrl: savedImage || null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 실제 댓글로 교체
        setComments(prev => prev.map(c => c.id === tempId ? data : c));
      } else {
        // 실패 시 롤백
        setComments(prevComments);
        setCommentText(savedText);
        setCommentImage(savedImage);
        alert('Error adding comment');
      }
    } catch (error) {
      // 에러 시 롤백
      setComments(prevComments);
      setCommentText(savedText);
      setCommentImage(savedImage);
      alert('Error adding comment');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    // Optimistic update - remove from UI immediately
    const prevComments = comments;
    setComments(prevComments.filter(c => c.id !== commentId));

    try {
      const response = await fetch(`/api/polls/${resolvedParams.id}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          displayName
        }),
      });

      if (!response.ok) {
        // 실패 시 롤백
        setComments(prevComments);
        alert('Error deleting comment');
      }
    } catch (error) {
      // 에러 시 롤백
      setComments(prevComments);
      alert('Error deleting comment');
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Google Maps URL 변환 함수
  const convertToEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Google Maps URL에서 좌표 추출
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      const [, lat, lng] = match;
      // OpenStreetMap 사용 (더 간단한 임베딩)
      return `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng)-0.01},${parseFloat(lat)-0.01},${parseFloat(lng)+0.01},${parseFloat(lat)+0.01}&layer=mapnik&marker=${lat},${lng}`;
    }
    
    // 이미 embed URL이면 그대로 반환
    if (url.includes('/embed/')) {
      return url;
    }
    
    // Google Maps 좌표가 있는지 확인
    const coordMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (coordMatch) {
      const [, lat, lng] = coordMatch;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng)-0.01},${parseFloat(lat)-0.01},${parseFloat(lng)+0.01},${parseFloat(lat)+0.01}&layer=mapnik&marker=${lat},${lng}`;
    }
    
    // 기본적으로 OpenStreetMap으로 시도
    return `https://www.openstreetmap.org/export/embed.html?bbox=-0.01,-0.01,0.01,0.01&layer=mapnik`;
  };

  // Google Maps URL 유효성 검사
  const isValidMapUrl = (url: string) => {
    if (!url) return true; // 빈 값은 허용
    return url.includes('maps.google.com') || url.includes('google.com/maps') || url.includes('openstreetmap.org');
  };

  // 시간 포맷
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <div className="flex items-center justify-center min-h-screen">
          <div className="card-static p-12 text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-body text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // 폴 없음
  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <div className="flex items-center justify-center min-h-screen">
          <div className="card-static card-coral p-12 text-center max-w-md">
            <div className="w-20 h-20 mx-auto bg-white border-3 border-[var(--border-color)] rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="heading-secondary text-2xl mb-4 text-white">Poll not found</h2>
            <p className="text-white/80 mb-6">This poll doesn't exist or has been removed</p>
            <Link href="/polls" className="btn-primary">
              Back to Polls
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + Number(option.vote_count), 0);

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header showBackLink backLinkHref="/polls" backLinkText="All Polls" />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* 폴 정보 카드 */}
        <div className="card-static p-8 mb-8 animate-fade-in">
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <span className="status-badge status-live">Active</span>
            <span className="vote-badge">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
          </div>

          <h1 className="heading-primary text-3xl md:text-4xl mb-4">
            {poll.title}
          </h1>

          {poll.description && (
            <p className="text-body text-lg mb-6">
              {poll.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <div className="w-8 h-8 bg-[var(--accent-sky)] border-2 border-[var(--border-color)] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {poll.created_by_username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <span>Created by {poll.created_by_username || 'Anonymous'}</span>
          </div>
        </div>

        {/* 투표 섹션 */}
        <div className="mb-8">
          <h2 className="heading-secondary text-2xl mb-6 flex items-center gap-3">
            {hasVoted ? (
              <>
                <span className="w-8 h-8 bg-[var(--accent-mint)] border-2 border-[var(--border-color)] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Results
                <span className="text-sm font-normal text-[var(--text-muted)]">(click to change vote)</span>
              </>
            ) : (
              <>
                <span className="w-8 h-8 bg-[var(--accent-yellow)] border-2 border-[var(--border-color)] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                Cast your vote
              </>
            )}
          </h2>

          <div className="space-y-4">
            {poll.options.map((option, index) => {
              const percentage = totalVotes > 0 ? (Number(option.vote_count) / totalVotes) * 100 : 0;
              const isVoted = votedOptionId === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={!displayName || isVoted}
                  className={`vote-option w-full text-left ${isVoted ? 'voted' : ''} animate-scale-in opacity-0`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* 결과 바 */}
                  {hasVoted && (
                    <div
                      className="vote-bar"
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                   <div className="relative z-10">
                     {/* 이미지가 있으면 표시 */}
                     {option.image_url && (
                       <img
                         src={option.image_url}
                         alt={option.option_text}
                         className="vote-option-image"
                       />
                     )}

                     {/* 지도 URL이 있으면 표시 */}
                     {option.map_url && isValidMapUrl(option.map_url) && (
                       <div className="mb-3">
                         <iframe
                           src={convertToEmbedUrl(option.map_url)}
                           width="100%"
                           height="200"
                           style={{ border: 0 }}
                           allowFullScreen
                           loading="lazy"
                           referrerPolicy="no-referrer-when-downgrade"
                           className="rounded-lg border-2 border-[var(--border-color)]"
                           title="Map Location"
                         />
                         <p className="text-xs text-[var(--text-muted)] mt-1">
                           📍 Location added
                         </p>
                       </div>
                     )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 border-2 border-[var(--border-color)] rounded-full flex items-center justify-center ${isVoted ? 'bg-[var(--text-primary)]' : 'bg-white'}`}>
                          {isVoted && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-body text-lg font-medium">
                          {option.option_text}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasVoted && (
                          <span className="heading-secondary text-lg">
                            {percentage.toFixed(0)}%
                          </span>
                        )}
                        <span className="vote-badge">
                          {option.vote_count}
                        </span>
                      </div>
                    </div>

                    {option.added_by_name && (
                      <p className="text-xs text-[var(--text-muted)] mt-2 ml-9">
                        Added by {option.added_by_name}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 투표 변경 */}
          {hasVoted && (
            <div className="text-center mt-4">
              <button
                onClick={handleDeleteVote}
                className="text-sm text-[var(--accent-coral)] hover:text-red-600 underline hover:no-underline transition-colors"
                title="Change your vote"
              >
                Change your vote
              </button>
            </div>
          )}

          {/* 새 옵션 추가 */}
          <div className="mt-6">
            {!showAddOption ? (
              <button
                onClick={() => setShowAddOption(true)}
                className="btn-secondary w-full"
                disabled={!displayName}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add New Option
              </button>
            ) : (
              <form onSubmit={handleAddOption} className="card-static card-lavender p-6">
                <h3 className="heading-secondary text-lg mb-4">Add New Option</h3>
                  <input
                    type="text"
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    placeholder="Enter option text..."
                    className="input-field mb-4"
                    required
                  />

                  <input
                    type="url"
                    value={newOptionMapUrl}
                    onChange={(e) => setNewOptionMapUrl(e.target.value)}
                    placeholder="Paste Google Maps share link (optional)..."
                    className="input-field mb-4"
                  />
                  <p className="text-xs text-[var(--text-muted)] mb-4">
                    📍 Paste any Google Maps link - we'll convert it to an interactive map
                  </p>

                  {newOptionImage ? (
                  <div className="image-preview mb-4">
                    <img src={newOptionImage} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setNewOptionImage('');
                        if (optionFileRef.current) optionFileRef.current.value = '';
                      }}
                      className="image-preview-remove"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className="image-upload-zone mb-4"
                    onClick={() => optionFileRef.current?.click()}
                  >
                    <svg className="w-6 h-6 mx-auto mb-1 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-[var(--text-muted)]">Add image (optional)</p>
                  </div>
                )}
                <input
                  ref={optionFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, setNewOptionImage);
                  }}
                />

                <div className="flex gap-3">
                  <button type="submit" className="btn-mint flex-1">
                    Add Option
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddOption(false);
                      setNewOptionText('');
                      setNewOptionImage('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 투표 완료 메시지 */}
        {hasVoted && voteInfo && (
          <div className="card-static card-mint p-6 mb-8 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white border-2 border-[var(--border-color)] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="heading-secondary text-lg">Vote submitted!</h3>
                <p className="text-body text-sm mb-2">You voted for: <span className="font-semibold">{voteInfo.option_text}</span></p>
                
                {/* 투표한 옵션의 지도가 있으면 표시 */}
                {voteInfo.map_url && isValidMapUrl(voteInfo.map_url) && (
                  <div className="mb-4">
                    <p className="text-sm text-[var(--text-muted)] mb-2">Your voted location:</p>
                    <iframe
                      src={convertToEmbedUrl(voteInfo.map_url)}
                      width="100%"
                      height="150"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg border-2 border-[var(--border-color)]"
                      title="Voted Location"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Voted {formatTime(voteInfo.created_at)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 댓글 섹션 */}
        <div className="mb-8">
          <h2 className="heading-secondary text-2xl mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[var(--accent-lavender)] border-2 border-[var(--border-color)] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            Comments ({comments.length})
          </h2>

          {/* 댓글 입력 */}
          <form onSubmit={handleAddComment} className="card-static p-6 mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="textarea-field mb-4"
              rows={3}
            />

            {commentImage ? (
              <div className="image-preview mb-4">
                <img src={commentImage} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setCommentImage('');
                    if (commentFileRef.current) commentFileRef.current.value = '';
                  }}
                  className="image-preview-remove"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                className="image-upload-zone mb-4"
                onClick={() => commentFileRef.current?.click()}
              >
                <svg className="w-6 h-6 mx-auto mb-1 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-[var(--text-muted)]">Add image (optional)</p>
              </div>
            )}
            <input
              ref={commentFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, setCommentImage);
              }}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                Posting as: <span className="font-semibold">{displayName || 'Anonymous'}</span>
              </p>
              <button
                type="submit"
                disabled={(!commentText.trim() && !commentImage) || !displayName}
                className="btn-coral btn-small"
              >
                Post Comment
              </button>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="comment-card animate-scale-in opacity-0"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="flex gap-3">
                    <div className="comment-avatar flex-shrink-0">
                      {comment.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="heading-secondary text-sm">{comment.display_name}</span>
                          <span className="text-xs text-[var(--text-muted)]">{formatTime(comment.created_at)}</span>
                        </div>
                        {comment.display_name === displayName && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-[var(--accent-coral)] hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors opacity-70 hover:opacity-100"
                            title="Delete comment"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {comment.content && (
                        <p className="text-body text-sm whitespace-pre-wrap">{comment.content}</p>
                      )}
                      {comment.image_url && (
                        <img src={comment.image_url} alt="Comment" className="comment-image" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
