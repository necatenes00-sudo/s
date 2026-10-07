import { build } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const result = await build({
  root,
  configFile: false,
  logLevel: 'warn',
  build: {
    write: false,
    copyPublicDir: false,
    cssCodeSplit: false,
    sourcemap: false,
    minify: true,
    lib: {
      entry: resolve(root, 'src/main.js'),
      name: 'DemirDigital',
      formats: ['iife'],
      fileName: () => 'standalone.js',
    },
  },
});

const files = (Array.isArray(result) ? result : [result]).flatMap(output => output.output);
const scripts = files.filter(file => file.type === 'chunk');
const styles = files.filter(file => file.type === 'asset' && file.fileName.endsWith('.css'));
if (scripts.length !== 1 || styles.length !== 1 || files.length !== 2) {
  throw new Error(`Standalone build emitted unexpected files: ${files.map(file => file.fileName).join(', ')}`);
}
if (scripts[0].imports.length || scripts[0].dynamicImports.some(path => path !== scripts[0].fileName)) {
  throw new Error('Standalone JavaScript must not import additional files.');
}
const css = String(styles[0].source);
const cssUrls = [...css.matchAll(/url\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/g)].map(match => match[1] ?? match[2] ?? match[3]);
if (cssUrls.some(url => !url.startsWith('data:'))) throw new Error('Styles include external assets.');

let html = await readFile(resolve(root, 'index.html'), 'utf8');
const assetPaths = [...html.matchAll(/(?:src|href)="(\/(?:projects\/[^"<>]+\.svg|favicon\.svg))"/g)].map(match => match[1]);
for (const path of new Set(assetPaths)) {
  const data = await readFile(resolve(root, 'public', path.slice(1)));
  html = html.replaceAll(`"${path}"`, `"data:image/svg+xml;base64,${data.toString('base64')}"`);
}
// Escape HTML closing tags without changing JavaScript string semantics.
const js = scripts[0].code.replace(/<\/script/gi, '<\\/script');
html = html.replace('</head>', () => `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>\n</head>`);
html = html.replace('<script type="module" src="/src/main.js"></script>', () => `<script>${js}</script>`);
if (/<(?:script|img)[^>]+src="\//.test(html) || /href="\/favicon\.svg"/.test(html)) {
  throw new Error('Unresolved local asset reference in standalone HTML.');
}
const destination = resolve(root, 'downloads/index.html');
await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Created downloads/index.html (${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB), with scripts, fonts and images embedded.`);
