import { createClient } from '@supabase/supabase-js';

// Fallback to empty strings so it compiles even if the user hasn't set them up yet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sjrztdksdxwrbjgqfkbr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcnp0ZGtzZHh3cmJqZ3Fma2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDE3NjgsImV4cCI6MjA5ODQ3Nzc2OH0.4pmQv_KNvMJ2CPa4V1Poz12SzuBc7iRBxMXfQG-mghY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
