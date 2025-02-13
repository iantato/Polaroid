import { getScanned } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const result = await getScanned();
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