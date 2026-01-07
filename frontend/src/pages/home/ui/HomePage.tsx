import { useAuthSignOutMutation, useAuthUser } from '~entities/auth';

export function HomePage() {
  const { user } = useAuthUser();
  const { mutate: signOut, isPending } = useAuthSignOutMutation();

  function handleSignOut() {
    signOut();
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-dark-primary p-4 text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h1 className="mb-4 text-3xl font-bold">Welcome to D&D App</h1>
          {user && (
            <div className="mb-6 flex flex-col gap-2">
              <p className="text-slate-300">
                Signed in as: <span className="font-medium text-white">{user.email}</span>
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 lg:hover:border-white/20 lg:hover:bg-white/10"
          >
            {isPending ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
