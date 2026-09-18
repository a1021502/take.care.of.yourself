import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'index.html',
  'css/core.css',
  'css/components.css',
  'css/features/dbt-cards.css',
  'css/features/answer-book.css',
  'css/features/tarot.css',
  'js/core/storage.js',
  'js/core/state.js',
  'js/core/feature-registry.js',
  'js/core/audio.js',
  'js/core/pet.js',
  'js/core/router.js',
  'js/data/icons.js',
  'js/data/features.js',
  'js/data/moods.js',
  'js/features/dbt-cards.js',
  'js/features/answer-book.js',
  'js/features/tarot.js',
  'js/app.js'
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing: ${file}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if ((html.match(/<style\b/gi) || []).length !== 0) throw new Error('index.html still contains inline <style>.');
if ((html.match(/<script\s*>/gi) || []).length !== 0) throw new Error('index.html still contains an inline <script>.');
for (const ref of html.matchAll(/(?:src|href)="(\.\/[^\"]+)"/g)) {
  const rel = ref[1];
  if (rel.startsWith('./js/') || rel.startsWith('./css/')) {
    if (!fs.existsSync(path.join(root, rel.slice(2)))) throw new Error(`Broken asset reference: ${rel}`);
  }
}
console.log('Static structure validation: PASS');
