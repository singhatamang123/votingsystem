// lib/db.ts

import { neon } from '@neondatabase/serverless';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const isPostgres = !!process.env.DATABASE_URL;

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
    // Postgres (Neon) implementation
    const sql = neon(process.env.DATABASE_URL!);
    
    dbInstance = {
      all: async (query: string, params: any[] = []) => {
        // Convert ? to $1, $2, etc for Postgres
        let i = 1;
        const pgQuery = query.replace(/\?/g, () => `$${i++}`);
        return await sql(pgQuery, params);
      },
      get: async (query: string, params: any[] = []) => {
        let i = 1;
        const pgQuery = query.replace(/\?/g, () => `$${i++}`);
        const results = await sql(pgQuery, params);
        return results[0] || null;
      },
      run: async (query: string, params: any[] = []) => {
        let i = 1;
        const pgQuery = query.replace(/\?/g, () => `$${i++}`);
        await sql(pgQuery, params);
      },
      exec: async (query: string) => {
        await sql(query);
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
  } else {
    // SQLite implementation
    const sqliteDb = await open({
      filename: path.join(process.cwd(), 'voting.db'),
      driver: sqlite3.Database,
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
