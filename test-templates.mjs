/* Validates every file in templates/ so a bad one can't ship silently. */
import fs from 'fs';
import path from 'path';

const dir = new URL('./templates/', import.meta.url);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
let fails = 0;
const seen = new Map();

const bad = (file, msg) => { fails++; console.log(' FAIL ', file, '-', msg); };

for (const file of files) {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(new URL(file, dir), 'utf8'));
  } catch (e) {
    bad(file, `not valid JSON (${e.message})`);
    continue;
  }
  const id = raw.id || path.basename(file, '.json');
  if (!raw.name) bad(file, 'missing "name"');
  if (!Array.isArray(raw.categories) || !raw.categories.filter((c) => String(c).trim()).length) {
    bad(file, 'needs at least one non-empty category');
  }
  if (raw.order !== undefined && !Number.isFinite(raw.order)) bad(file, '"order" must be a number');
  if (seen.has(id)) bad(file, `duplicate id "${id}", also in ${seen.get(id)}`);
  seen.set(id, file);
  if (!fails) console.log('  ok  ', file.padEnd(24), `${raw.categories.length} categories`);
}

console.log(fails ? `\n${fails} problem(s)` : `\n${files.length} templates, all valid`);
process.exit(fails ? 1 : 0);
