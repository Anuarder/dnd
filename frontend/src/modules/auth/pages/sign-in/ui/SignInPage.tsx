import { ReactElement } from 'react';

import Image from '~shared/assets/image.jpg';

import { useGoogleAuth } from '~auth/features';

function GoogleIcon(): ReactElement {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function SignInPage(): ReactElement {
  const { signInWithGoogle, isLoading, error, user } = useGoogleAuth();

  function handleGoogleSignIn(): void {
    signInWithGoogle();
  }

  if (user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#191022] p-4 text-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-purple-500/50 bg-linear-to-b from-[#2a1f36] to-[#191022] shadow-xl">
            {user.user_metadata.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name || 'User avatar'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-purple-300">
                {(user.user_metadata.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-bold text-white">
              Welcome, {user.user_metadata.full_name || 'Adventurer'}!
            </h2>
            <p className="text-slate-400">{user.email}</p>
          </div>
          <p className="text-lg text-emerald-400">✓ Successfully signed in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#191022] p-4 text-center text-pretty text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="glow-effect relative max-w-[400px] overflow-hidden rounded-2xl border border-white/5 bg-linear-to-b from-[#2a1f36] to-[#191022] shadow-2xl">
          <img
            width="400"
            height="400"
            src={Image}
            className="max-w-full"
            alt="Mystical purple hooded figure holding a glowing magical die in a dark fantasy setting"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-white">
            Master the Realm
          </h1>

          <p className="text-lg leading-relaxed font-normal text-slate-400">
            As a Dungeon Master, you hold the keys to the universe.
          </p>
        </div>

        <div className="flex w-full max-w-[320px] flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="group relative flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-purple-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <GoogleIcon />
            )}
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {error && (
            <p className="text-sm text-red-400">Failed to sign in. Please try again.</p>
          )}
        </div>

        <p className="max-w-[280px] text-xs text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
