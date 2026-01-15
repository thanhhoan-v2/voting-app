import { NextRequest, NextResponse } from 'next/server';
import { getComments, addComment, deleteComment } from '@/lib/db-actions';

// 댓글 목록 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const comments = await getComments(parseInt(resolvedParams.id));
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// 댓글 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { displayName, content, imageUrl } = await request.json();

    if (!displayName) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    if (!content && !imageUrl) {
      return NextResponse.json(
        { error: 'Content or image is required' },
        { status: 400 }
      );
    }

    const comment = await addComment(
      parseInt(resolvedParams.id),
      displayName,
      content || null,
      imageUrl || null
    );
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}

// 댓글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { commentId, displayName } = await request.json();

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    if (!displayName) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    const deletedComment = await deleteComment(commentId, displayName);
    if (!deletedComment) {
      return NextResponse.json(
        { error: 'Comment not found or not authorized to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedComment });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
