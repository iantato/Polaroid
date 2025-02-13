import { getById } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params;
      const result = await getById(parseInt(id));
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