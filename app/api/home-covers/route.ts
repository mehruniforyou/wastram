import { NextResponse } from 'next/server';
import { getHomeCovers } from '@/lib/homeCoversStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const covers = await getHomeCovers();
    return NextResponse.json(covers, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
