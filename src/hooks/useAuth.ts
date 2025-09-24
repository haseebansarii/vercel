import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { mockAuth, MockUser } from '../lib/mockAuth';

export function useAuth() {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    const testSupabaseConnection = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Check if we have valid Supabase configuration
      const hasValidConfig = supabaseUrl && 
                            supabaseAnonKey && 
                            supabaseUrl.startsWith('https://') && 
                            !supabaseUrl.includes('placeholder') &&
                            supabaseAnonKey.length > 20 &&
                            !supabaseAnonKey.includes('placeholder');

      if (!hasValidConfig) {
        console.log('Invalid Supabase configuration, using mock auth');
        return false;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('Supabase connection successful');
        return true;
      } catch (error: any) {
        console.log('Supabase connection failed, using mock auth:', error.message);
        return false;
      }
    };

    const initializeAuth = async () => {
      const connected = await testSupabaseConnection();
      setIsSupabaseConnected(connected);
      
      if (connected) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
          
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              console.log('Auth state changed:', event);
              setUser(session?.user ?? null);
              setLoading(false);
            }
          );

          setLoading(false);
          return () => subscription.unsubscribe();
        } catch (error) {
          console.error('Failed to get Supabase session:', error);
          setIsSupabaseConnected(false);
          const { unsubscribe } = mockAuth.onAuthStateChange((mockUser) => {
            setUser(mockUser);
            setLoading(false);
          });
          setLoading(false);
          return unsubscribe;
        }
      } else {
        console.log('Using mock auth');
        const { unsubscribe } = mockAuth.onAuthStateChange((mockUser) => {
          setUser(mockUser);
          setLoading(false);
        });

        setLoading(false);
        return unsubscribe;
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string) => {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (isSupabaseConnected) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        
        if (error) {
          throw error;
        }
        
        // Check if user was automatically signed in (email confirmation disabled)
        if (data.user && data.session) {
          return { user: data.user, session: data.session, needsConfirmation: false };
        } else if (data.user && !data.session) {
          return { user: data.user, session: null, needsConfirmation: true };
        } else {
          throw new Error('Failed to create user account');
        }
      } catch (error: any) {
        console.error('Supabase sign-up failed:', error);
        throw error;
      }
    } else {
      await mockAuth.signUp(email, password);
      return { user: mockAuth.getCurrentUser(), session: null, needsConfirmation: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConnected) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          throw error;
        }
        
        return { user: data.user, session: data.session };
      } catch (error: any) {
        console.error('Supabase sign-in failed:', error);
        throw error;
      }
    } else {
      await mockAuth.signIn(email, password);
      return { user: mockAuth.getCurrentUser(), session: null };
    }
  };

  const signOut = async () => {
    if (isSupabaseConnected) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      } catch (error: any) {
        console.error('Supabase sign-out failed:', error);
        throw error;
      }
    } else {
      await mockAuth.signOut();
    }
  };

  const isAdmin = user?.email === 'admin@dintalk.com' || user?.email === 'admin@trustntrust.gh';

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isSupabaseConnected,
  };
}
