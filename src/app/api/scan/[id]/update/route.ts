import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { SQL_QUERIES } from '@/lib/db/utility';

export async function POST( request: Request, { params }: {params: Promise<{ slug: string }>}) {
  try {
    const { slug } = await params;
    const pool = getPool();
    await pool.query(SQL_QUERIES.UPDATE_SCANNED, [slug]);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update polaroid'
    }, { status: 500 });
  }
}