import { NextRequest, NextResponse } from 'next/server';
import { getPolls, createPoll } from '@/lib/db-actions';

export async function GET() {
  try {
    const polls = await getPolls();
    return NextResponse.json(polls);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, options, displayName } = await request.json();

    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least 2 options are required' },
        { status: 400 }
      );
    }

    const creatorName = displayName || 'Anonymous';
    const poll = await createPoll(title, description, options, creatorName);
    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({
      error: 'Failed to create poll',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}