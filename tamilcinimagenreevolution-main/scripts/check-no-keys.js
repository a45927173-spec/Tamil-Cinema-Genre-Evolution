#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORES = ['node_modules', '.git', 'dist', 'public/posters', 'public/posters/'];

const HEX_LONG = /[0-9a-f]{20,}/i; // heuristic for long hex strings
const APIKEY_ASSIGN = /(apikey|OMDB_API_KEY)[\s:=]+(?:(?:"|')?([A-Za-z0-9\-_.]{8,})(?:"|')?)/i;

let found = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (IGNORES.some(i => full.includes(i))) continue;
    if (e.isDirectory()) {
      walk(full);
      continue;
    }
    if (e.isFile()) {
      // skip binary-ish files
      if (/\.(png|jpe?g|gif|ico|wasm|exe|dll)$/.test(e.name)) continue;
      try {
        const txt = fs.readFileSync(full, 'utf8');
        let m;
        if ((m = APIKEY_ASSIGN.exec(txt))) {
          // if the value is a placeholder like <YOUR_...> skip
          const val = m[2] || '';
          if (!/^<.*>$/.test(val) && val.length >= 8) {
            found.push({file: full, reason: `Found ${m[1]} assignment with non-empty value`});
          }
        }
        const hex = HEX_LONG.exec(txt);
        if (hex) {
          // don't flag short keys; only flag long hex-looking sequences
          found.push({file: full, reason: `Found long hex-like string: ${hex[0].slice(0,24)}...`});
        }
      } catch (err) {
        // ignore read errors for now
      }
    }
  }
}

walk(ROOT);

if (found.length) {
  console.error('Potential secrets found:');
  for (const f of found) console.error('-', f.file, '\n   ->', f.reason);
  console.error('\nIf these are false positives, inspect and ignore them explicitly.\nOtherwise rotate the keys and remove them from history.');
  process.exit(1);
}

console.log('No obvious secrets found.');
process.exit(0);
