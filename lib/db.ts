// lib/db.ts

import { neon } from '@neondatabase/serverless';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const isPostgres = !!dbUrl;

// Unified database interface
export interface DbInterface {
  all: (query: string, params?: any[]) => Promise<any[]>;
  get: (query: string, params?: any[]) => Promise<any>;
  run: (query: string, params?: any[]) => Promise<void>;
  exec: (query: string) => Promise<void>;
}

let dbInstance: DbInterface | null = null;

export async function getDb(): Promise<DbInterface> {
  if (dbInstance) return dbInstance;

  if (isPostgres) {
    console.log('🔌 Connecting to Cloud Postgres (Neon)...');
    try {
      const sql = neon(dbUrl!);
      
      dbInstance = {
        all: async (query: string, params: any[] = []) => {
          let i = 1;
          const pgQuery = query.replace(/\?/g, () => `$${i++}`);
          return await (sql as any)(pgQuery, params);
        },
        get: async (query: string, params: any[] = []) => {
          let i = 1;
          const pgQuery = query.replace(/\?/g, () => `$${i++}`);
          const results = await (sql as any)(pgQuery, params);
          return results[0] || null;
        },
        run: async (query: string, params: any[] = []) => {
          let i = 1;
          const pgQuery = query.replace(/\?/g, () => `$${i++}`);
          await (sql as any)(pgQuery, params);
        },
        exec: async (query: string) => {
          await (sql as any)(query);
        }
      };

      // Initialize Postgres table
      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS votes (
          voter_id TEXT NOT NULL,
          candidate_id TEXT NOT NULL,
          category TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (voter_id, category)
        )
      `);
      console.log('✅ Postgres initialized successfully');
    } catch (err: any) {
      console.error('❌ Postgres connection error:', err.message);
      throw err;
    }
  } else {
    // If we are on Vercel but missing DATABASE_URL, this is an error
    if (process.env.VERCEL) {
      throw new Error('❌ Missing DATABASE_URL or POSTGRES_URL environment variable on Vercel.');
    }

    console.log('📁 Using local SQLite database...');
    // Dynamic import for SQLite to avoid Vercel build errors
    const sqlite3 = await import('sqlite3');
    const { open } = await import('sqlite');

    // SQLite implementation
    const sqliteDb = await open({
      filename: path.join(process.cwd(), 'voting.db'),
      driver: sqlite3.default.Database,
    });

    dbInstance = {
      all: (query: string, params: any[] = []) => sqliteDb.all(query, params),
      get: (query: string, params: any[] = []) => sqliteDb.get(query, params),
      run: async (query: string, params: any[] = []) => {
        await sqliteDb.run(query, params);
      },
      exec: (query: string) => sqliteDb.exec(query),
    };

    // Initialize SQLite table
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS votes (
        voter_id TEXT NOT NULL,
        candidate_id TEXT NOT NULL,
        category TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (voter_id, category)
      )
    `);
  }

  return dbInstance;
}
