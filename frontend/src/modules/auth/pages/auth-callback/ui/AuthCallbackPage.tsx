import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuthUser } from '~entities/auth';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user, error } = useAuthUser();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  function handleBackToSignIn() {
    navigate('/sign-in', { replace: true });
  }

  if (error) {
    const errorMessage = 'Something went wrong. Please try again.';

    return (
      <div className="bg-dark-primary flex min-h-dvh items-center justify-center p-4 text-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Authentication Error</h2>
          <p className="max-w-sm text-slate-400">{errorMessage}</p>
          <button
            type="button"
            onClick={handleBackToSignIn}
            className="mt-2 min-h-11 rounded-lg bg-purple-600 px-6 py-2 font-medium transition-all duration-200 ease-out active:scale-95 active:bg-purple-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-primary flex min-h-dvh items-center justify-center p-4 text-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary/30 border-t-primary h-10 w-10 animate-spin rounded-full border-4" />
        <p className="text-xl font-semibold text-white">Completing sign in...</p>
        <p className="text-sm text-slate-400">Please wait a moment</p>
      </div>
    </div>
  );
}
