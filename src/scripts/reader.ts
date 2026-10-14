/**
 * Course PDF reader. Each <dialog class="reader"> on the page is driven by one
 * Reader. PDF.js is only downloaded when a reader is about to open.
 *
 * Openers: any element with data-reader-open="<dialog id>" and an optional
 * data-page (a number, or "continue" for the last page read).
 */
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

type Pdfjs = typeof import('pdfjs-dist');

let pdfjsPromise: Promise<Pdfjs> | undefined;

function loadPdfjs(): Promise<Pdfjs> {
  pdfjsPromise ??= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(
    ([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs;
    },
  );
  return pdfjsPromise;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const storage = {
  get(key: string): number | null {
    try {
      const value = Number(localStorage.getItem(key));
      return Number.isInteger(value) && value > 0 ? value : null;
    } catch {
      return null;
    }
  },
  set(key: string, page: number) {
    try {
      localStorage.setItem(key, String(page));
    } catch {
      // Storage can be unavailable (private mode, blocked); remembering is optional.
    }
  },
};

interface Chapter {
  start: number;
  end: number;
  title: string;
  link: HTMLAnchorElement;
}

class Reader {
  readonly dialog: HTMLDialogElement;
  private readonly shell: HTMLElement;
  private readonly desk: HTMLElement;
  private readonly status: HTMLElement;
  private readonly pageInput: HTMLInputElement;
  private readonly where: HTMLElement;
  private readonly tocToggle: HTMLButtonElement;
  private readonly src: string;
  private readonly total: number;
  readonly storageKey: string;
  private readonly chapters: Chapter[];
  private readonly courseTitle: string;

  private doc: PDFDocumentProxy | null = null;
  private loading: Promise<void> | null = null;
  private sheets: HTMLElement[] = [];
  private readonly tasks = new Map<number, RenderTask>();
  private readonly drawnWidth = new Map<number, number>();
  private readonly nearby = new Set<number>();
  private origin: DOMRect | null = null;
  private closing = false;
  openedByKeyboard = false;

  constructor(dialog: HTMLDialogElement) {
    this.dialog = dialog;
    const q = <T extends Element>(selector: string) => dialog.querySelector<T>(selector)!;
    this.shell = q('.shell');
    this.desk = q('[data-desk]');
    this.status = q('[data-status]');
    this.pageInput = q('[data-page-input]');
    this.where = q('[data-chapter]');
    this.tocToggle = q('.toc-toggle');
    this.courseTitle = this.where.textContent ?? '';
    this.src = dialog.dataset.src!;
    this.total = Number(dialog.dataset.pages);
    this.storageKey = dialog.dataset.storageKey!;

    this.chapters = [...dialog.querySelectorAll<HTMLAnchorElement>('a[data-end]')].map((link) => ({
      start: Number(link.dataset.goto),
      end: Number(link.dataset.end),
      title: link.dataset.chapterTitle ?? '',
      link,
    }));

    q<HTMLButtonElement>('[data-close]').addEventListener('click', () => this.close());
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    dialog.addEventListener('close', () => this.afterClose());

    this.pageInput.addEventListener('change', () => {
      const page = Math.min(this.total, Math.max(1, Math.round(Number(this.pageInput.value)) || 1));
      this.goTo(page);
    });

    this.tocToggle.addEventListener('click', () => this.toggleToc());
    dialog.querySelector('.toc')!.addEventListener('click', (event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-goto]');
      if (!link) return;
      event.preventDefault();
      // Glide for short hops; jump straight there when it's more than a few pages away.
      const target = Number(link.dataset.goto);
      const near = Math.abs(target - Number(this.pageInput.value)) <= 3;
      this.goTo(target, near && !reducedMotion() ? 'smooth' : 'auto');
      this.toggleToc(false);
    });
  }

  /** Start fetching PDF.js before the click lands. */
  prefetch() {
    void loadPdfjs();
  }

  open(page: number, origin: DOMRect | null) {
    if (this.dialog.open) return;
    this.origin = origin;
    this.closing = false;
    document.documentElement.classList.add('reader-is-open');
    this.dialog.showModal();
    this.animate('in');
    // Focus the pages so arrow keys scroll them; no ring unless opened by keyboard.
    this.desk.focus({ preventScroll: true, focusVisible: this.openedByKeyboard } as FocusOptions);
    this.setCurrent(page);

    this.loading ??= this.load();
    this.loading.then(() => this.goTo(page)).catch(() => this.showError());
  }

  close() {
    if (!this.dialog.open || this.closing) return;
    this.closing = true;
    const animation = this.animate('out');
    if (animation) animation.finished.then(() => this.dialog.close(), () => this.dialog.close());
    else this.dialog.close();
  }

  private afterClose() {
    document.documentElement.classList.remove('reader-is-open');
    history.replaceState(null, '', location.pathname + location.search);
    // Free page bitmaps; they are redrawn quickly on the next open.
    for (const page of [...this.drawnWidth.keys()]) this.release(page);
    document.dispatchEvent(new CustomEvent('reader:closed', { detail: { id: this.dialog.id } }));
  }

  /** Grow from (or shrink back into) the element that opened the reader. */
  private animate(direction: 'in' | 'out'): Animation | null {
    if (!this.origin || reducedMotion()) return null;
    const { top, right, bottom, left } = this.origin;
    const from = `inset(${top}px ${innerWidth - right}px ${innerHeight - bottom}px ${left}px round 8px)`;
    const to = 'inset(0px 0px 0px 0px round 0px)';
    const keyframes = direction === 'in' ? [{ clipPath: from }, { clipPath: to }] : [{ clipPath: to }, { clipPath: from }];
    return this.dialog.animate(keyframes, {
      duration: direction === 'in' ? 380 : 260,
      easing: direction === 'in' ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : 'cubic-bezier(0.4, 0, 1, 1)',
    });
  }

  private async load() {
    this.status.textContent = 'טוען את הקובץ…';
    const pdfjs = await loadPdfjs();
    const task = pdfjs.getDocument({ url: this.src });
    task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
      if (total) this.status.textContent = `טוען את הקובץ… ${Math.round((loaded / total) * 100)}%`;
    };
    this.doc = await task.promise;
    this.status.textContent = '';
    this.buildSheets();
  }

  private showError() {
    this.loading = null;
    this.status.textContent = 'לא הצלחנו לטעון את הקובץ. אפשר ';
    const link = document.createElement('a');
    link.href = this.src;
    link.textContent = 'לפתוח אותו ישירות';
    this.status.append(link, '.');
  }

  private buildSheets() {
    const fragment = document.createDocumentFragment();
    this.sheets = Array.from({ length: this.total }, (_, i) => {
      const sheet = document.createElement('div');
      sheet.className = 'sheet';
      sheet.dataset.page = String(i + 1);
      sheet.setAttribute('role', 'img');
      sheet.setAttribute('aria-label', `עמוד ${i + 1}`);
      fragment.append(sheet);
      return sheet;
    });
    this.desk.append(fragment);

    // Draw pages within ~1.5 screens of the viewport; drop the rest.
    const drawObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const page = Number((entry.target as HTMLElement).dataset.page);
          if (entry.isIntersecting) {
            this.nearby.add(page);
            void this.draw(page);
          } else {
            this.nearby.delete(page);
            this.release(page);
          }
        }
      },
      { root: this.desk, rootMargin: '150% 0px' },
    );

    // The current page is whichever sheet crosses a line 40% down the view.
    const currentObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.setCurrent(Number((entry.target as HTMLElement).dataset.page));
        }
      },
      { root: this.desk, rootMargin: '-40% 0px -59% 0px' },
    );

    for (const sheet of this.sheets) {
      drawObserver.observe(sheet);
      currentObserver.observe(sheet);
    }

    let resizeTimer: number | undefined;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => this.nearby.forEach((page) => void this.draw(page)), 150);
    }).observe(this.desk);
  }

  private async draw(pageNumber: number) {
    const sheet = this.sheets[pageNumber - 1];
    if (!this.doc || !sheet || !this.dialog.open) return;
    const width = sheet.clientWidth;
    if (!width || this.drawnWidth.get(pageNumber) === width) return;

    this.tasks.get(pageNumber)?.cancel();
    const page = await this.doc.getPage(pageNumber);
    const scale = (width / page.getViewport({ scale: 1 }).width) * Math.min(devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.setAttribute('aria-hidden', 'true');

    const task = page.render({ canvas, viewport });
    this.tasks.set(pageNumber, task);
    try {
      await task.promise;
      // Swap in the finished canvas so a redraw never flashes blank.
      sheet.replaceChildren(canvas);
      sheet.classList.add('is-drawn');
      this.drawnWidth.set(pageNumber, width);
    } catch (error) {
      if ((error as Error)?.name !== 'RenderingCancelledException') console.error(error);
    } finally {
      if (this.tasks.get(pageNumber) === task) this.tasks.delete(pageNumber);
    }
  }

  private release(pageNumber: number) {
    this.tasks.get(pageNumber)?.cancel();
    this.tasks.delete(pageNumber);
    const sheet = this.sheets[pageNumber - 1];
    const canvas = sheet?.querySelector('canvas');
    if (canvas) {
      canvas.width = canvas.height = 0;
      canvas.remove();
    }
    sheet?.classList.remove('is-drawn');
    this.drawnWidth.delete(pageNumber);
  }

  goTo(page: number, behavior: ScrollBehavior = 'auto') {
    this.sheets[page - 1]?.scrollIntoView({ block: 'start', behavior });
    this.setCurrent(page);
  }

  private setCurrent(page: number) {
    this.pageInput.value = String(page);

    const chapter = this.chapters.findLast((c) => c.start <= page);
    this.where.textContent = chapter ? chapter.title : this.courseTitle;
    for (const c of this.chapters) {
      if (c === chapter) c.link.setAttribute('aria-current', 'true');
      else c.link.removeAttribute('aria-current');
    }

    if (this.dialog.open && !this.closing) {
      storage.set(this.storageKey, page);
      history.replaceState(null, '', `#page=${page}`);
    }
  }

  private toggleToc(force?: boolean) {
    const open = this.shell.classList.toggle('toc-open', force);
    this.tocToggle.setAttribute('aria-expanded', String(open));
  }
}

/** Show "continue from page N" and the progress mark for each reader. */
function syncProgress(reader: Reader) {
  const page = storage.get(reader.storageKey);
  const id = reader.dialog.id;
  for (const button of document.querySelectorAll<HTMLElement>(`[data-reader-open="${id}"][data-page="continue"]`)) {
    const label = button.querySelector('[data-label]') ?? button;
    label.textContent = page && page > 1 ? `המשך מעמוד ${page}` : 'התחלת קריאה';
  }
  const map = document.querySelector<HTMLElement>(`[data-map-for="${id}"]`);
  const mark = map?.querySelector<HTMLElement>('[data-progress]');
  if (map && mark && page && page > 1) {
    mark.hidden = false;
    mark.style.insetInlineStart = `${((page - 1) / Number(map.dataset.pages)) * 100}%`;
  }
}

let initialized = false;

export function initReaders() {
  if (initialized) return;
  initialized = true;

  const readers = new Map<string, Reader>();
  for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog.reader')) {
    const reader = new Reader(dialog);
    readers.set(dialog.id, reader);
    syncProgress(reader);
  }

  const openerOf = (target: EventTarget | null) =>
    (target as Element | null)?.closest?.<HTMLElement>('[data-reader-open]') ?? null;

  document.addEventListener('click', (event) => {
    const opener = openerOf(event.target);
    if (!opener || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const reader = readers.get(opener.dataset.readerOpen!);
    if (!reader) return;
    event.preventDefault();
    // A click with no pointer position came from the keyboard (Enter on a link).
    reader.openedByKeyboard = event.detail === 0;
    const requested = opener.dataset.page;
    const page = requested === 'continue' ? (storage.get(reader.storageKey) ?? 1) : Number(requested) || 1;
    reader.open(page, opener.getBoundingClientRect());
  });

  for (const type of ['pointerenter', 'focusin'] as const) {
    document.addEventListener(
      type,
      (event) => {
        const opener = openerOf(event.target);
        if (opener) readers.get(opener.dataset.readerOpen!)?.prefetch();
      },
      { capture: true, passive: true },
    );
  }

  document.addEventListener('reader:closed', (event) => {
    const reader = readers.get((event as CustomEvent<{ id: string }>).detail.id);
    if (reader) syncProgress(reader);
  });

  // Links like /courses/104214/#page=80 open the reader at that page.
  const match = /^#page=(\d+)$/.exec(location.hash);
  const first = readers.values().next().value;
  if (match && first) first.open(Number(match[1]), null);
}
