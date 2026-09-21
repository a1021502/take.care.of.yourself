import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jokes = fs.readFileSync(path.join(root, 'js/features/jokes.js'), 'utf8');
const dataText = fs.readFileSync(path.join(root, 'js/features/jokes-data.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const requiredSnippets = [
  'function humanDelay(',
  'function queueFriendMessages(',
  'function finishDirectJoke(',
  'isRiddleJoke(joke) || !isSessionActive',
  "phase: 'opening'",
  "phase: 'reaction'",
  'showTyping(container, friend)',
  'window.currentFeatureCleanup'
];
for (const snippet of requiredSnippets) {
  if (!jokes.includes(snippet)) throw new Error(`Missing expected v6.2 snippet: ${snippet}`);
}

const db = Function(`"use strict"; let window={}; ${dataText}; return window.SAFE_SPACE_JOKES_DB;`)();
if (!db || !Array.isArray(db.jokes) || !Array.isArray(db.friends)) throw new Error('Jokes DB failed to parse');
if (db.jokes.length !== 500) throw new Error(`Expected 500 jokes, got ${db.jokes.length}`);
if (db.friends.length !== 10) throw new Error(`Expected 10 friends, got ${db.friends.length}`);
const kinds = [...new Set(db.jokes.map(j => j.kind))].sort();
console.log('Jokes DB:', db.jokes.length, 'records; friends:', db.friends.length, 'records; kinds:', kinds.join(', '));
for (const f of ['js/features/jokes.js','js/features/jokes-data.js','css/features/jokes.css']) {
  if (!fs.existsSync(path.join(root,f))) throw new Error(`Missing ${f}`);
}
if (!html.includes('./js/features/jokes-data.js') || !html.includes('./js/features/jokes.js')) throw new Error('index.html missing jokes script references');
if (!html.includes('./css/features/jokes.css')) throw new Error('index.html missing jokes css reference');
console.log('v6.2 focused validation: PASS');
