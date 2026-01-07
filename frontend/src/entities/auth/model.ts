import type { AuthError, Session, User } from '@supabase/supabase-js';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { supabase } from '~shared/lib';

// Query Keys
const AUTH_QUERY_KEYS = {
  all: ['auth'],
  session: ['auth', 'session'],
} as const;

// Mutation Keys
const AUTH_MUTATION_KEYS = {
  getSession: ['auth', 'getSession'] as const,
  signInWithOAuth: ['auth', 'signInWithOAuth'] as const,
  signOut: ['auth', 'signOut'] as const,
} as const;

interface SignInWithOAuthParams {
  provider: 'google';
  redirectTo?: string;
}

interface SignInWithOAuthResponse {
  error: AuthError | null;
}

interface SignOutResponse {
  error: AuthError | null;
}

interface GetSessionResponse {
  session: Session | null;
  error: AuthError | null;
}

interface AuthSessionData {
  session: Session | null;
  user: User | null;
}

/**
 * Hook to get the current auth session using TanStack Query.
 * This will automatically cache and refetch the session as needed.
 */
function useAuthSessionQuery(): UseQueryResult<AuthSessionData, Error> {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.session,
    queryFn: () => {
      return supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          throw error;
        }
        return {
          session: data.session,
          user: data.session?.user ?? null,
        };
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to sign in with OAuth provider (Google, etc.).
 */
function useAuthSignInWithOAuthMutation() {
  return useMutation({
    mutationKey: AUTH_MUTATION_KEYS.signInWithOAuth,
    mutationFn: (params: SignInWithOAuthParams) =>
      supabase.auth.signInWithOAuth({
        provider: params.provider,
        options: {
          redirectTo: params.redirectTo ?? `${window.location.origin}/auth/callback`,
        },
      }),
  });
}

/**
 * Hook to sign out the current user.
 */
function useAuthSignOutMutation(): UseMutationResult<SignOutResponse, Error, void, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: AUTH_MUTATION_KEYS.signOut,
    mutationFn: (): Promise<SignOutResponse> => {
      return supabase.auth.signOut().then(({ error }) => {
        return { error };
      });
    },
    onSuccess: () => {
      // Clear the session cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, {
        session: null,
        user: null,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to get the current user from the session query.
 * This is a convenience hook that extracts the user from the session.
 */
function useAuthUser(): { user: User | null; isLoading: boolean; error: Error | null } {
  const { data, isLoading, error } = useAuthSessionQuery();

  return {
    user: data?.user ?? null,
    isLoading,
    error,
  };
}

/**
 * Hook to listen to auth state changes and update the query cache.
 * This should be used at the app root level to keep the auth state in sync.
 */
function useAuthStateListener(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, {
        session,
        user: session?.user ?? null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
}

export {
  AUTH_QUERY_KEYS,
  AUTH_MUTATION_KEYS,
  useAuthSessionQuery,
  useAuthSignInWithOAuthMutation,
  useAuthSignOutMutation,
  useAuthUser,
  useAuthStateListener,
};
export type { SignInWithOAuthParams, SignInWithOAuthResponse, SignOutResponse, GetSessionResponse };
