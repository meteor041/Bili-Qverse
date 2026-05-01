import { readFileSync, writeFileSync } from 'node:fs';
import { transformSync } from '@babel/core';

const htmlFile = 'public/index.html';
const html = readFileSync(htmlFile, 'utf8');
const tweakCode = readFileSync('public/tweaks-panel.jsx', 'utf8');
const inlineMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>\s*<\/body>/);
if (!inlineMatch) throw new Error('inline text/babel script not found');

const appCode = `${tweakCode}\n\n${inlineMatch[1]}`;
const compiled = transformSync(appCode, {
  presets: ['@babel/preset-react'],
  filename: 'app.jsx',
  comments: false,
  compact: false
}).code;

writeFileSync('public/app.js', `${compiled}\n`);

const nextHtml = html
  .replace(/<script src="https:\/\/unpkg\.com\/@babel\/standalone@[^"]+"[^>]*><\/script>\n?/, '')
  .replace(/<script type="text\/babel" src="tweaks-panel\.jsx"><\/script>\n?/, '')
  .replace(/<script type="text\/babel">[\s\S]*?<\/script>\s*<\/body>/, '<script src="/app.js"></script>\n</body>');

writeFileSync(htmlFile, nextHtml);
console.log('built public/app.js and removed browser Babel');
