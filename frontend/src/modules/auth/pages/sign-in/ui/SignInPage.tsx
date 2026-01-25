import { motion } from 'motion/react';

import { useAuthSignInWithOAuthMutation } from '~entities/auth';

import AuthImage from './assets/auth-image.jpg';

function GoogleIcon() {
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

export function SignInPage() {
  const { isPending, error, mutateAsync } = useAuthSignInWithOAuthMutation();

  function handleGoogleSignIn() {
    mutateAsync({
      provider: 'google',
    }).catch((err) => {
      const error = new Error('ERROR_SIGN_IN_WITH_GOOGLE', { cause: err });
      console.error(error);
      throw error;
    });
  }

  return (
    <div className="bg-dark-primary flex min-h-dvh items-center justify-center p-4 text-center text-pretty text-white">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glow-effect from-dark-secondary to-dark-primary relative max-w-[400px] overflow-hidden rounded-2xl border border-white/5 bg-linear-to-b shadow-2xl"
        >
          <img
            width="400"
            height="400"
            src={AuthImage}
            className="max-w-full object-cover object-center"
            alt="Mystical purple hooded figure holding a glowing magical die in a dark fantasy setting"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col gap-2"
        >
          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-white">
            Your Journey Awaits
          </h1>

          <p className="text-lg leading-relaxed font-normal text-slate-400">
            Step into a world of endless possibilities. The realm is calling.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          className="flex w-full max-w-[320px] flex-col gap-3"
        >
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="group relative flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 active:scale-95 active:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <GoogleIcon />
            )}
            <span>{isPending ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <p className="font-medium">Failed to sign in</p>
              <p className="mt-1 text-xs text-red-300">Something went wrong. Please try again.</p>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
          className="max-w-[280px] text-xs text-slate-500"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </div>
    </div>
  );
}
