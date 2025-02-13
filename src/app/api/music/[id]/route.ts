import { NextRequest, NextResponse } from 'next/server';
import { getMusic } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const result = await getMusic(parseInt(context.params.id));

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch polaroids'
    }, { status: 500 });
  }
}