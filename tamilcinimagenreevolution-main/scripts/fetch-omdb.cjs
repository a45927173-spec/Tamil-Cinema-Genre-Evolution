#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
// node-fetch v3 uses ESM default export when required in CJS; detect and use default when necessary
let fetch;
try {
  const nf = require('node-fetch');
  fetch = nf.default || nf;
} catch (e) {
  // fallback to global fetch if available
  fetch = global.fetch;
}

async function main() {
  const apiKey = process.argv[2] || process.env.OMDB_API_KEY;
  if (!apiKey) {
    console.error('Usage: node scripts/fetch-omdb.cjs <OMDB_API_KEY>');
    process.exit(2);
  }

  const moviesTsPath = path.resolve('./src/data/movies.ts');
  const outPath = path.resolve('./src/data/movies.enriched.json');

  const content = fs.readFileSync(moviesTsPath, 'utf-8');

  const regex = /\{([\s\S]*?)\}\s*,?/g;
  const entries = [];
  const csvStart = content.indexOf('const csvMovieData = [');
  if (csvStart === -1) {
    console.error('Could not find csvMovieData array in movies.ts');
    process.exit(1);
  }
  const csvSlice = content.slice(csvStart);
  let match;
  while ((match = regex.exec(csvSlice)) !== null) {
    const block = match[1];
    const titleMatch = /title:\s*"([^"]+)"/.exec(block);
    const yearMatch = /year:\s*(\d{4})/.exec(block);
    if (titleMatch && yearMatch) {
      entries.push({ title: titleMatch[1], year: parseInt(yearMatch[1], 10) });
    }
  }

  console.log(`Found ${entries.length} movies to fetch`);

  const result = {};
  let success = 0;
  let notFound = 0;

  for (let i = 0; i < entries.length; i++) {
    const { title, year } = entries[i];
    const id = (i + 1).toString();
    const q = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=${apiKey}&plot=full`;
    try {
      if (i > 0) await new Promise((res) => setTimeout(res, 300));
      const res = await fetch(q);
      const data = await res.json();
      if (data && data.Response === 'True') {
        const runtimeMin = (data.Runtime && data.Runtime !== 'N/A') ? parseInt(data.Runtime.split(' ')[0], 10) : undefined;
        const languages = (data.Language && data.Language !== 'N/A') ? data.Language.split(',').map(s => s.trim()) : undefined;
        const actors = (data.Actors && data.Actors !== 'N/A') ? data.Actors.split(',').map(s => s.trim()) : undefined;
        result[id] = {
          synopsis: data.Plot && data.Plot !== 'N/A' ? data.Plot : undefined,
          runtimeMinutes: runtimeMin,
          languages,
          imdbId: data.imdbID,
          castList: actors,
          imdbRating: data.imdbRating && data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : undefined,
          poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : undefined,
        };
        success++;
        if (success % 100 === 0) console.log(`Fetched ${success} movies...`);
      } else {
        notFound++;
      }
    } catch (err) {
      console.error(`Error fetching ${title} (${year}):`, err.message || err);
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
  // Also write to public so the dev server can serve it directly
  const publicOut = path.resolve('./public/movies.enriched.json');
  try {
    fs.writeFileSync(publicOut, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`Also wrote public file: ${publicOut}`);
  } catch (e) {
    // ignore
  }
  console.log(`Finished. Success: ${success}, Not found/failed: ${notFound}. Output: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
