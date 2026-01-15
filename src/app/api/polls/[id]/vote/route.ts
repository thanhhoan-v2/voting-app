import { NextRequest, NextResponse } from 'next/server';
import { vote, deleteVote } from '@/lib/db-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { optionId, displayName } = await request.json();

    if (!optionId) {
      return NextResponse.json(
        { error: 'Option ID is required' },
        { status: 400 }
      );
    }

    if (!displayName) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    const voteCount = await vote(parseInt(resolvedParams.id), optionId, displayName);
    return NextResponse.json({ voteCount });
  } catch (error) {
    console.error('Error voting:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to vote', details: errorMessage }, { status: 500 });
  }
}

// 투표 삭제 (재투표 가능하게 함)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { displayName } = await request.json();

    if (!displayName) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    const deletedVote = await deleteVote(parseInt(resolvedParams.id), displayName);
    if (!deletedVote) {
      return NextResponse.json(
        { error: 'Vote not found or not authorized to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedVote });
  } catch (error) {
    console.error('Error deleting vote:', error);
    return NextResponse.json({ error: 'Failed to delete vote' }, { status: 500 });
  }
}