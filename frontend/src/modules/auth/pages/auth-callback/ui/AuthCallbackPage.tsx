import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { supabase } from '~shared/lib';

export function AuthCallbackPage(): ReactElement {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message);
          return;
        }

        if (session) {
          // Successfully authenticated, redirect to home or dashboard
          navigate('/', { replace: true });
        } else {
          setError('No session found. Please try signing in again.');
        }
      })
      .catch(() => {
        setError('An unexpected error occurred.');
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#191022] p-4 text-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Authentication Error</h2>
          <p className="max-w-sm text-slate-400">{error}</p>
          <button
            type="button"
            onClick={() => { navigate('/sign-in', { replace: true }); }}
            className="mt-2 rounded-lg bg-purple-600 px-6 py-2 font-medium transition-colors hover:bg-purple-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#191022] p-4 text-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
        <p className="text-lg text-slate-300">Completing sign in...</p>
      </div>
    </div>
  );
}

