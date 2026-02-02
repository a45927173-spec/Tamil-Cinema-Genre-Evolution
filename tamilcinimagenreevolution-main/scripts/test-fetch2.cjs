let fetch;
try {
  const nf = require('node-fetch');
  fetch = nf.default || nf;
} catch (e) {
  fetch = global.fetch;
}

(async () => {
  try {
    const key = process.argv[2] || process.env.OMDB_API_KEY;
    if (!key) {
      console.error('Usage: OMDB_API_KEY=<your_key> node scripts/test-fetch2.cjs');
      process.exit(2);
    }

    const res = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent('Leo')}&y=2023&apikey=${encodeURIComponent(key)}&plot=short`);
    const j = await res.json();
    console.log('ok', res.ok, 'status', res.status);
    console.log(j);
  } catch (e) {
    console.error('fetch error', e && e.message);
  }
})();