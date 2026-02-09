/**
 * Supabase Client - Backward Compatible
 * 
 * This file now re-exports from the database abstraction layer.
 * Existing code continues to work, but you can switch providers via DB_PROVIDER env var.
 */

import { getDb, getSupabaseAdmin, initDatabase } from './db.js';

// Re-export for backward compatibility
export function makeAdminClient() {
  return getDb();
}

// Export Supabase-specific client (for auth operations)
export { getSupabaseAdmin, initDatabase };

