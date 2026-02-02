Enriching movies with OMDb

This project supports fetching movie synopses and metadata from the OMDb API and writing the results to `src/data/movies.enriched.json`.

Usage:

1. Add your OMDb key to the environment (recommended):

```bash
# Unix/macOS
OMDB_API_KEY=<YOUR_OMDB_KEY> npm run fetch:omdb

# PowerShell
$env:OMDB_API_KEY='<YOUR_OMDB_KEY>'; npm run fetch:omdb
```

2. Or pass your key as argument:

```bash
npm run fetch:omdb -- <YOUR_OMDB_KEY>

> **Security note:** Never paste real API keys into committed files or documentation. Use a `.env` file locally (ignored by git) or set environment variables in your deployment (Vercel environment variables). If a key has been accidentally committed, rotate it immediately.
```

Notes:
- The script will look for titles & years in `src/data/movies.ts` and query OMDb for each movie.
- Output file: `src/data/movies.enriched.json` (maps movie `id` to enrichment data).
- The Movie detail page dynamically loads this file and will show synopsis, runtime, languages, cast, and a direct IMDb link when available.

If you want, I can run the fetch and commit the generated JSON file to the repo — confirm and I'll run it now.