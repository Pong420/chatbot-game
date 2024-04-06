import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY?.trim() || ''
);

export const ERROR_CODE_EMPTY = 'PGRST116';
