import { createClient } from '@supabase/supabase-js';

import { env } from '~shared/config';

/**
 * Supabase client for browser/client-side use.
 * Uses the publishable key (sb_publishable_xxx) which is safe to expose in the frontend.
 * The secret key should NEVER be used in client-side code.
 */
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce',
  },
});

export { supabase };
