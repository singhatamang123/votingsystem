// app/api/vote/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { voterId, candidateId, category } = await req.json();

    if (!voterId || !candidateId || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();

    // Check if the voter has already voted in this category
    const existingVote = await db.get(
      'SELECT * FROM votes WHERE voter_id = ? AND category = ?',
      [voterId, category]
    );

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted in this category' },
        { status: 400 }
      );
    }

    // Record the vote
    await db.run(
      'INSERT INTO votes (voter_id, candidate_id, category) VALUES (?, ?, ?)',
      [voterId, candidateId, category]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const voterId = searchParams.get('voterId');

  if (!voterId) {
    return NextResponse.json({ error: 'Missing voterId' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const votes = await db.all('SELECT category, candidate_id FROM votes WHERE voter_id = ?', [voterId]);
    
    return NextResponse.json({ votes });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
