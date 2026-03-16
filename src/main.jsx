import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root introuvable.');
}

const root = createRoot(container, {
  onUncaughtError(error, errorInfo) {
    console.error('[React] Uncaught error', error);
    if (errorInfo?.componentStack) {
      console.error('[React] Component stack:', errorInfo.componentStack);
    }
  },
  onCaughtError(error, errorInfo) {
    console.error('[React] Caught error', error);
    if (errorInfo?.componentStack) {
      console.error('[React] Component stack:', errorInfo.componentStack);
    }
  },
  onRecoverableError(error, errorInfo) {
    console.warn('[React] Recoverable error', error, errorInfo);
  },
});

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
