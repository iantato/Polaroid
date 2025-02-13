import { NextResponse } from 'next/server';
import { getMusic } from '@/lib/db/queries';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function GET(
  _: Request,
  { params }: RouteParams
) {
  try {
    const result = await getMusic(parseInt(params.id));

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