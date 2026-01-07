/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_RUNTIME_MODE: 'development' | 'production';
  readonly VITE_APP_SUPABASE_URL: string;
  readonly VITE_APP_SUPABASE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
