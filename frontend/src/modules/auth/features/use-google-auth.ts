import { AuthError, Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '~shared/lib';

interface UseGoogleAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

function useGoogleAuth(): UseGoogleAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback((): Promise<void> => {
    setIsLoading(true);
    setError(null);

    return supabase.auth
      .signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      .then(({ error: authError }) => {
        if (authError) {
          setError(authError);
        }
      })
      .catch((err: AuthError) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const signOut = useCallback((): Promise<void> => {
    setIsLoading(true);

    return supabase.auth
      .signOut()
      .then(({ error: authError }) => {
        if (authError) {
          setError(authError);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    user,
    session,
    isLoading,
    error,
    signInWithGoogle,
    signOut,
  };
}

export { useGoogleAuth };
export type { UseGoogleAuthReturn };

