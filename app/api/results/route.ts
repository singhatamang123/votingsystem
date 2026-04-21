// app/api/results/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { CANDIDATES } from '@/lib/candidates';

export async function GET() {
  try {
    const db = await getDb();
    
    // Get vote counts grouped by candidate
    const counts = await db.all(`
      SELECT candidate_id, COUNT(*) as vote_count 
      FROM votes 
      GROUP BY candidate_id
    `);

    // Map counts to candidate objects
    const results = CANDIDATES.map(c => {
      const countObj = counts.find(count => count.candidate_id === c.id);
      return {
        ...c,
        voteCount: countObj ? countObj.vote_count : 0
      };
    });

    // Determine winners
    const winners: any = {
      school_prefect: null,
      school_vice_prefect: null,
      houses: {
        Yellow: { captain: null, vice_captain: null },
        Green: { captain: null, vice_captain: null },
        Blue: { captain: null, vice_captain: null },
        Red: { captain: null, vice_captain: null }
      }
    };

    // School Prefect Winner
    const prefectCandidates = results.filter(c => c.role === 'school_prefect');
    winners.school_prefect = prefectCandidates.sort((a, b) => b.voteCount - a.voteCount)[0];

    // School Vice Prefect Winner
    const vicePrefectCandidates = results.filter(c => c.role === 'school_vice_prefect');
    winners.school_vice_prefect = vicePrefectCandidates.sort((a, b) => b.voteCount - a.voteCount)[0];

    // House Winners (Captain & Vice Captain for each house)
    const houses = ['Yellow', 'Green', 'Blue', 'Red'] as const;
    houses.forEach(house => {
      const captains = results.filter(c => c.house === house && c.role === 'captain');
      const viceCaptains = results.filter(c => c.house === house && c.role === 'vice_captain');
      
      winners.houses[house].captain = captains.sort((a, b) => b.voteCount - a.voteCount)[0];
      winners.houses[house].vice_captain = viceCaptains.sort((a, b) => b.voteCount - a.voteCount)[0];
    });

    return NextResponse.json({ winners, allResults: results });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
