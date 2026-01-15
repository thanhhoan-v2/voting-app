import { NextRequest, NextResponse } from 'next/server';
import { addPollOption } from '@/lib/db-actions';

// 폴 옵션 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { optionText, imageUrl, displayName } = await request.json();

    if (!optionText) {
      return NextResponse.json(
        { error: 'Option text is required' },
        { status: 400 }
      );
    }

    if (!displayName) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    const option = await addPollOption(
      parseInt(resolvedParams.id),
      optionText,
      imageUrl || null,
      displayName
    );
    return NextResponse.json(option, { status: 201 });
  } catch (error) {
    console.error('Error adding option:', error);
    return NextResponse.json({ error: 'Failed to add option' }, { status: 500 });
  }
}
