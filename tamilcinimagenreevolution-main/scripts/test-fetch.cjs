const fetch = require('node-fetch');
const key = process.argv[2];
if (!key) { console.error('Usage: node scripts/test-fetch.cjs <OMDB_KEY>'); process.exit(2); }
(async () => {
  const res = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent('Leo')}&y=2023&apikey=${key}&plot=short`);
  const j = await res.json();
  console.log('status', res.status);
  console.log(JSON.stringify(j, null, 2));
})();
