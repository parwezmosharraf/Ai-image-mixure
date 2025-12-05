Vercel-ready deployment
1) Install Vercel CLI (optional): npm i -g vercel
2) Set environment variable OPENAI_API_KEY in Vercel project dashboard (do NOT commit the key).
3) From the project root (this folder), run: vercel deploy --prod
4) The site will be available as a Vercel URL. The serverless function at /api/generate will call OpenAI's Images Edits endpoint.

Notes:
- OpenAI key must be added in Project Settings -> Environment Variables on Vercel.
- This function uses Edge runtime and FormData.
- If you want local testing, Vercel CLI can emulate environment variables.
