# IQRA Institute

## AI Study Assistant setup

The AI Study Assistant calls Gemini only from server-side API routes. Its required environment variable is:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
```

Copy `.env.example` to `.env` for local development and set a real key. Do not use a `VITE_` prefix: Vite exposes those values to browsers. `.env` is ignored by Git.

### Deploy with GitHub and Vercel

1. Push this repository to GitHub.
2. In Vercel, select **Add New → Project**, import the GitHub repository, and accept the detected Vite settings.
3. In the project’s **Settings → Environment Variables**, add `GEMINI_API_KEY` with the Google AI Studio key. Select Production, Preview, and Development as appropriate.
4. Redeploy the project. Vercel runs `npm run build` and deploys the server-side `api/ai/chat.ts` function automatically.
5. Open the deployed site, press the floating sparkle button, ask a question, and confirm an answer is returned.

Do not deploy the AI feature only to GitHub Pages: GitHub Pages hosts static files and cannot run the `/api/ai/chat` server function. GitHub should be used as the source repository; Vercel should host the live application.
