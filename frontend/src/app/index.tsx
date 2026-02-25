import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import './i18n';

import { RoutesProvider, TanstackQueryProvider } from './providers';

function startApp() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <Toaster position="top-center" expand={false} richColors />
      <TanstackQueryProvider>
        <RoutesProvider />
      </TanstackQueryProvider>
    </StrictMode>
  );
}

// Start the app
// This allows for async initialization tasks before rendering, such as:
// - Setting up analytics
// - Fetching critical configuration
// - Initializing third-party services
// - Loading user preferences
startApp();
