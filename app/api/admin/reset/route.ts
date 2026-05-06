// app/api/admin/reset/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'school-admin-2025';

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    
    // Count votes before deleting
    const before = await db.all('SELECT COUNT(*) as total FROM votes');
    const totalBefore = before[0]?.total || 0;

    // Delete all votes
    await db.run('DELETE FROM votes');

    return NextResponse.json({ 
      success: true, 
      message: `Successfully cleared ${totalBefore} votes. Database is ready for a new election.`
    });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== (process.env.ADMIN_SECRET || 'school-admin-2025')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const result = await db.all('SELECT COUNT(*) as total FROM votes');
    return NextResponse.json({ totalVotes: result[0]?.total || 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check database' }, { status: 500 });
  }
}
