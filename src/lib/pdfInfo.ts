/**
 * Build-time PDF reading: page count, page shape and the bookmark outline,
 * so course pages can show a chapter map without any hand-written data.
 */
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { getDocument, type PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

export interface OutlineItem {
  title: string;
  /** 1-based first page */
  page: number;
  /** 1-based last page (the page before the next item starts) */
  endPage: number;
  items: OutlineItem[];
}

export interface PdfInfo {
  pages: number;
  /** height / width of the first page */
  aspect: number;
  bytes: number;
  outline: OutlineItem[];
}

type RawOutline = Awaited<ReturnType<PDFDocumentProxy['getOutline']>>;

const cache = new Map<string, Promise<PdfInfo>>();

/** `publicPath` is the URL path of a file in public/, e.g. /Lectures/104214.pdf */
export function getPdfInfo(publicPath: string): Promise<PdfInfo> {
  let info = cache.get(publicPath);
  if (!info) {
    info = load(publicPath);
    cache.set(publicPath, info);
  }
  return info;
}

async function load(publicPath: string): Promise<PdfInfo> {
  const file = join(process.cwd(), 'public', publicPath);
  const [buffer, { size }] = await Promise.all([readFile(file), stat(file)]);
  const task = getDocument({
    data: new Uint8Array(buffer),
    verbosity: 0,
  });
  const doc = await task.promise;

  try {
    const [first, raw] = await Promise.all([doc.getPage(1), doc.getOutline()]);
    const { width, height } = first.getViewport({ scale: 1 });
    const outline = await resolveOutline(doc, raw ?? [], doc.numPages);
    return { pages: doc.numPages, aspect: height / width, bytes: size, outline };
  } finally {
    await task.destroy();
  }
}

async function resolveOutline(doc: PDFDocumentProxy, raw: RawOutline, lastPage: number): Promise<OutlineItem[]> {
  const starts = await Promise.all(raw.map((item) => pageOf(doc, item.dest)));
  const items: OutlineItem[] = [];
  for (let i = 0; i < raw.length; i++) {
    const page = starts[i];
    if (page === null) continue;
    const next = starts.slice(i + 1).find((p): p is number => p !== null);
    const endPage = Math.max(page, next !== undefined ? next - 1 : lastPage);
    items.push({
      title: raw[i].title.trim(),
      page,
      endPage,
      items: await resolveOutline(doc, raw[i].items ?? [], endPage),
    });
  }
  return items;
}

async function pageOf(doc: PDFDocumentProxy, dest: string | unknown[] | null): Promise<number | null> {
  const explicit = typeof dest === 'string' ? await doc.getDestination(dest) : dest;
  const ref = explicit?.[0];
  if (ref == null) return null;
  if (typeof ref === 'number') return ref + 1;
  return (await doc.getPageIndex(ref as Parameters<PDFDocumentProxy['getPageIndex']>[0])) + 1;
}
