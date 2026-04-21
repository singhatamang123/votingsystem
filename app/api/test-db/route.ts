// app/api/test-db/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    console.log('🧪 Testing database connection...');
    const db = await getDb();
    
    // Try a simple query
    await db.exec('SELECT 1');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful!',
      env: {
        has_database_url: !!process.env.DATABASE_URL,
        has_postgres_url: !!process.env.POSTGRES_URL,
        is_postgres: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
      }
    });
  } catch (error: any) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      env: {
        has_database_url: !!process.env.DATABASE_URL,
        has_postgres_url: !!process.env.POSTGRES_URL
      }
    }, { status: 500 });
  }
}
