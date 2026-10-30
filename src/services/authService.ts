import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  async signUp(email: string, password: string):Promise<{ user: User | null; error: Error | null }> {
    if (!supabase) return { user: null, error: new Error('Supabase가 설정되지 않았습니다.') };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { user: null, error };
    return { user: data.user, error: null };
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    if (!supabase) return { user: null, error: new Error('Supabase가 설정되지 않았습니다.') };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error };
    return { user: data.user, error: null };
  },

  async signOut(): Promise<{ error: Error | null }> {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<User | null> {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    if (!supabase) return { unsubscribe: () => {} };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },
};
