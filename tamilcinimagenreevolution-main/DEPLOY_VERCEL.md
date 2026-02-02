Deploying to Vercel

Steps I recommend (one-time):

1. Create a GitHub repository and push the project (if not already done):

```bash
git init
git remote add origin <YOUR_REPO_URL>
git branch -M main
git add .
git commit -m "Prepare project for deployment"
git push -u origin main
```

2. Go to https://vercel.com and click **Import Project** → **Import Git Repository** → select your repo.

3. For Build Settings use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci` (default)

4. Set environment variables (Project Settings → Environment Variables):
   - Set `OMDB_API_KEY` in the Vercel Dashboard (optional). **Do not commit this key to your repository.**
   - Add the client keys the app needs (these must be prefixed with `VITE_` so Vite exposes them to the browser):
     - `VITE_SUPABASE_URL` (e.g. `https://...supabase.co`)
     - `VITE_SUPABASE_PUBLISHABLE_KEY` (publishable key only — do not add a service-role key here)

   **Security note:** Add keys in the Vercel Dashboard (or with `vercel env add`) and rotate any key that may have been accidentally exposed. If you have accidentally committed `.env` (or any secret) to your repo, remove it from your git history using one of these methods:

   - Simple removal and stop tracking:
     ```bash
     git rm --cached .env
     git commit -m "Remove .env"
     git push
     ```

   - To purge from history (choose one):
     - BFG Repo-Cleaner:
       ```bash
       bfg --delete-files .env
       git reflog expire --expire=now --all && git gc --prune=now --aggressive
       git push --force
       ```
     - Or `git filter-repo`:
       ```bash
       git filter-repo --invert-paths --path .env
       git push --force
       ```

5. Vercel will run a build and publish the site; you will get a preview URL and a production URL.

Optional: Use the Vercel CLI to manage the project from your machine:

```bash
npm i -g vercel
vercel login
vercel link # link this directory to a Vercel project
vercel env add OMDB_API_KEY production
vercel --prod # deploy current state to production
```

Notes:
- `vercel.json` is included in the repo and sets the output to `dist` for compatibility with Vite.
- If you want, I can add a tiny GitHub Action that triggers a Vercel redeploy via API on certain events — say the word and I’ll implement it.
