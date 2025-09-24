import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log configuration (without exposing sensitive data)
console.log('Supabase configuration:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 40)}...` : 'missing',
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
  hasValidUrl: supabaseUrl?.startsWith('https://') && supabaseUrl?.includes('.supabase.co'),
  hasValidKey: supabaseAnonKey?.length > 20,
  environment: import.meta.env.MODE
});

// Create client - will use environment variables from deployment
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token'
  }
});
