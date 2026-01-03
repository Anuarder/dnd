const RUNTIME_MODE = import.meta.env.VITE_APP_RUNTIME_MODE;

export const env = {
  API_URL: import.meta.env.VITE_APP_API_URL as string,
  IS_PROD_RUNTIME: RUNTIME_MODE === 'production',
  IS_DEV_RUNTIME: RUNTIME_MODE === 'development',
  SUPABASE_URL: import.meta.env.VITE_APP_SUPABASE_URL as string,
  SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_APP_SUPABASE_PUBLISHABLE_KEY as string,
};
