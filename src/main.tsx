import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// GitHub Pages is static, so AI requests must be sent to the Vercel serverless API.
// On Vercel itself, same-origin /api/ai/* requests continue to work normally.
const VERCEL_AI_ORIGIN = 'https://iqra-institute-8o0y58pex-abulques263-3307.vercel.app';
const originalFetch = window.fetch.bind(window);

window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const isAiRequest = rawUrl.startsWith('/api/ai/') || rawUrl.includes('/api/ai/');

  if (isAiRequest) {
    const targetUrl = rawUrl.startsWith('http')
      ? rawUrl
      : `${VERCEL_AI_ORIGIN}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;

    if (input instanceof Request) {
      return originalFetch(new Request(targetUrl, input), init);
    }
    return originalFetch(targetUrl, init);
  }

  return originalFetch(input, init);
}) as typeof window.fetch;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
