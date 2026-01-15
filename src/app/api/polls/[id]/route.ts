import { NextRequest, NextResponse } from 'next/server';
import { getPollById, hasUserVoted, getComments, getUserVoteInfo } from '@/lib/db-actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const displayName = searchParams.get('displayName');

    const pollId = parseInt(resolvedParams.id);

    console.log(`[${Date.now() - startTime}ms] Starting fetch for poll ${pollId}`);

    // Fetch data in parallel for better performance
    const dataStartTime = Date.now();
    const [poll, comments] = await Promise.all([
      getPollById(pollId),
      getComments(pollId)
    ]);
    console.log(`[${Date.now() - dataStartTime}ms] Data fetch completed`);

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Check vote status and get vote info only if displayName is provided
    let votedOptionId = null;
    let voteInfo = null;
    if (displayName) {
      votedOptionId = await hasUserVoted(pollId, displayName);
      voteInfo = await getUserVoteInfo(pollId, displayName);
    }

    const totalTime = Date.now() - startTime;
    console.log(`[${totalTime}ms] Total request completed`);
    
    return NextResponse.json({
      poll,
      hasVoted: votedOptionId !== null,
      votedOptionId,
      voteInfo,
      comments
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[${totalTime}ms] Error fetching poll:`, error);
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
  }
}