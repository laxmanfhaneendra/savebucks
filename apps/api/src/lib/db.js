/**
 * Database Abstraction Layer
 * 
 * This module provides a unified interface for database operations.
 * Currently uses Supabase, but can be switched to direct PostgreSQL (pg) 
 * by changing the DB_PROVIDER environment variable.
 * 
 * Supported providers:
 * - 'supabase' (default): Uses Supabase client
 * - 'postgres': Uses pg Pool directly
 */

import { createClient } from '@supabase/supabase-js';

const DB_PROVIDER = process.env.DB_PROVIDER || 'supabase';

let dbClient = null;
let pgPool = null;

/**
 * Initialize database connection
 */
export async function initDatabase() {
  if (DB_PROVIDER === 'postgres') {
    // Dynamic import for pg to avoid loading if not needed
    const { default: pg } = await import('pg');
    const { Pool } = pg;
    
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: true },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    
    // Test connection
    const client = await pgPool.connect();
    console.log('[DB] Connected to PostgreSQL');
    client.release();
    
    return pgPool;
  } else {
    // Supabase
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
    }
    
    dbClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
    
    console.log('[DB] Connected to Supabase');
    return dbClient;
  }
}

/**
 * Get the database client
 * For Supabase: returns Supabase client
 * For Postgres: returns pg Pool
 */
export function getDb() {
  if (DB_PROVIDER === 'postgres') {
    if (!pgPool) throw new Error('Database not initialized. Call initDatabase() first.');
    return pgPool;
  } else {
    if (!dbClient) {
      // Auto-initialize for backward compatibility
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
      dbClient = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });
    }
    return dbClient;
  }
}

/**
 * Get the raw Supabase admin client (for auth operations)
 * This is always Supabase regardless of DB_PROVIDER
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE for auth');
  }
  
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

/**
 * Check which provider is being used
 */
export function getDbProvider() {
  return DB_PROVIDER;
}

/**
 * Close database connections
 */
export async function closeDatabase() {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
  dbClient = null;
}

/**
 * Query helper that works with both providers
 * 
 * @example
 * // Simple select
 * const deals = await query('deals').select('*').eq('status', 'approved');
 * 
 * // With Postgres, you'd use:
 * // const { rows } = await db.query('SELECT * FROM deals WHERE status = $1', ['approved']);
 */
export function query(table) {
  const db = getDb();
  
  if (DB_PROVIDER === 'postgres') {
    // Return a query builder for PostgreSQL
    return new PostgresQueryBuilder(db, table);
  } else {
    // Return Supabase query builder
    return db.from(table);
  }
}

/**
 * Simple PostgreSQL Query Builder (Supabase-compatible interface)
 * This allows gradual migration - same API works with both
 */
class PostgresQueryBuilder {
  constructor(pool, table) {
    this.pool = pool;
    this.table = table;
    this._select = '*';
    this._where = [];
    this._params = [];
    this._order = null;
    this._limit = null;
    this._offset = null;
  }

  select(columns = '*') {
    this._select = columns;
    return this;
  }

  eq(column, value) {
    this._params.push(value);
    this._where.push(`${column} = $${this._params.length}`);
    return this;
  }

  neq(column, value) {
    this._params.push(value);
    this._where.push(`${column} != $${this._params.length}`);
    return this;
  }

  gt(column, value) {
    this._params.push(value);
    this._where.push(`${column} > $${this._params.length}`);
    return this;
  }

  gte(column, value) {
    this._params.push(value);
    this._where.push(`${column} >= $${this._params.length}`);
    return this;
  }

  lt(column, value) {
    this._params.push(value);
    this._where.push(`${column} < $${this._params.length}`);
    return this;
  }

  lte(column, value) {
    this._params.push(value);
    this._where.push(`${column} <= $${this._params.length}`);
    return this;
  }

  like(column, pattern) {
    this._params.push(pattern);
    this._where.push(`${column} LIKE $${this._params.length}`);
    return this;
  }

  ilike(column, pattern) {
    this._params.push(pattern);
    this._where.push(`${column} ILIKE $${this._params.length}`);
    return this;
  }

  in(column, values) {
    const placeholders = values.map((_, i) => `$${this._params.length + i + 1}`);
    this._params.push(...values);
    this._where.push(`${column} IN (${placeholders.join(', ')})`);
    return this;
  }

  order(column, { ascending = true } = {}) {
    this._order = `${column} ${ascending ? 'ASC' : 'DESC'}`;
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  range(from, to) {
    this._offset = from;
    this._limit = to - from + 1;
    return this;
  }

  async then(resolve, reject) {
    try {
      const result = await this._execute();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  async _execute() {
    let sql = `SELECT ${this._select} FROM ${this.table}`;
    
    if (this._where.length > 0) {
      sql += ` WHERE ${this._where.join(' AND ')}`;
    }
    
    if (this._order) {
      sql += ` ORDER BY ${this._order}`;
    }
    
    if (this._limit !== null) {
      sql += ` LIMIT ${this._limit}`;
    }
    
    if (this._offset !== null) {
      sql += ` OFFSET ${this._offset}`;
    }

    try {
      const { rows } = await this.pool.query(sql, this._params);
      return { data: rows, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Insert operation
  async insert(data) {
    const records = Array.isArray(data) ? data : [data];
    if (records.length === 0) return { data: null, error: null };

    const columns = Object.keys(records[0]);
    const values = records.map(record => Object.values(record));
    
    const placeholders = values.map((row, rowIdx) => 
      `(${row.map((_, colIdx) => `$${rowIdx * columns.length + colIdx + 1}`).join(', ')})`
    ).join(', ');

    const sql = `INSERT INTO ${this.table} (${columns.join(', ')}) VALUES ${placeholders} RETURNING *`;
    
    try {
      const { rows } = await this.pool.query(sql, values.flat());
      return { data: rows, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update operation
  async update(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
    
    let sql = `UPDATE ${this.table} SET ${setClause}`;
    const params = [...values];
    
    if (this._where.length > 0) {
      // Adjust parameter indices for WHERE clause
      const whereClause = this._where.map((w, i) => 
        w.replace(/\$(\d+)/, (_, n) => `$${parseInt(n) + values.length}`)
      ).join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...this._params);
    }
    
    sql += ' RETURNING *';

    try {
      const { rows } = await this.pool.query(sql, params);
      return { data: rows, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Delete operation
  async delete() {
    let sql = `DELETE FROM ${this.table}`;
    
    if (this._where.length > 0) {
      sql += ` WHERE ${this._where.join(' AND ')}`;
    }
    
    sql += ' RETURNING *';

    try {
      const { rows } = await this.pool.query(sql, this._params);
      return { data: rows, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Single record
  async single() {
    this._limit = 1;
    const result = await this._execute();
    return {
      data: result.data?.[0] || null,
      error: result.error
    };
  }

  // Maybe single (no error if not found)
  async maybeSingle() {
    return this.single();
  }
}

// Export for backward compatibility
export { getDb as makeAdminClient };
