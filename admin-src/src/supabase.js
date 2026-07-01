import { createClient } from '@supabase/supabase-js';

// Fallback to empty strings so it compiles even if the user hasn't set them up yet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
