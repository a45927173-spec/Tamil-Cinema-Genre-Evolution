try {
  const nf = require('node-fetch');
  console.log('node-fetch keys:', Object.keys(nf).slice(0,10));
  console.log('typeof nf:', typeof nf);
  console.log('typeof nf.default:', typeof (nf && nf.default));
} catch (e) {
  console.error('error requiring node-fetch:', e.message);
}
try {
  console.log('global.fetch:', typeof global.fetch);
} catch (e) {}
