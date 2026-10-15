/**
 * Shrink Beamer slides to one page per frame, for the site's PDF reader.
 *
 *   node tools/slides-handout.mjs talk.pdf public/research/talk-slides.pdf ["PDF title"]
 *
 * Beamer gives every overlay step of a frame the same page label (the frame
 * number), and the last step shows the whole frame, so we keep the last page
 * of each label. The bookmarks are carried over (the reader builds its
 * chapter list from them). Needs pdflatex with pdfpages (e.g. MiKTeX).
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const [input, output, title] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: node tools/slides-handout.mjs <slides.pdf> <out.pdf> ["PDF title"]');
  process.exit(1);
}

const doc = await getDocument({ data: new Uint8Array(readFileSync(input)), verbosity: 0 }).promise;
const labels = await doc.getPageLabels();
if (!labels) {
  console.error(`${input} has no page labels; is it a Beamer PDF? Leaving it as it is.`);
  process.exit(1);
}

// Original page (1-based) kept for each frame, and the new page of each original page.
const kept = [];
const newPage = [];
labels.forEach((label, i) => {
  if (labels[i + 1] !== label) kept.push(i + 1);
  newPage[i + 1] = kept.length + (labels[i + 1] !== label ? 0 : 1);
});

const bookmarks = [];
async function walk(items, level) {
  for (const item of items ?? []) {
    const dest = typeof item.dest === 'string' ? await doc.getDestination(item.dest) : item.dest;
    if (dest) {
      const page = newPage[(await doc.getPageIndex(dest[0])) + 1];
      // Beamer repeats a section's bookmark on each of its subsections' frames; keep one.
      const last = bookmarks.at(-1);
      if (!(last && last.title === item.title && last.level === level)) bookmarks.push({ title: item.title, page, level });
    }
    await walk(item.items, level + 1);
  }
}
await walk(await doc.getOutline(), 0);

const tex = (s) => s.replace(/[\\{}#%&~^_$]/g, (c) => (c === '\\' ? '\\textbackslash{}' : `\\${c}`));
const dir = mkdtempSync(join(tmpdir(), 'handout-'));
copyFileSync(input, join(dir, 'in.pdf'));
writeFileSync(
  join(dir, 'out.tex'),
  String.raw`\documentclass{article}
\usepackage{pdfpages}
\usepackage[unicode, pdfencoding=auto]{hyperref}
\usepackage{bookmark}
\hypersetup{pdftitle={${tex(title ?? (await doc.getMetadata()).info?.Title ?? '')}}}
\begin{document}
\includepdf[pages={${kept.join(',')}}, fitpaper]{in.pdf}
${bookmarks.map((b) => String.raw`\bookmark[page=${b.page}, level=${b.level}]{${tex(b.title)}}`).join('\n')}
\end{document}
`,
);
execFileSync('pdflatex', ['-interaction=nonstopmode', 'out.tex'], { cwd: dir, stdio: 'ignore' });
copyFileSync(join(dir, 'out.pdf'), resolve(output));
rmSync(dir, { recursive: true, force: true });

console.log(`${input}: ${labels.length} pages → ${kept.length} frames, ${bookmarks.length} bookmarks → ${output}`);
