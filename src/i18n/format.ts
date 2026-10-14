import type { Lang } from './ui';

const locales: Record<Lang, string> = { he: 'he-IL', en: 'en-GB' };

/** Formats 'YYYY-MM' as "May 2021" and 'YYYY-MM-DD' as "21 May 2021". */
export function formatPartialDate(value: string, lang: Lang): string {
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d ?? 1));
  return new Intl.DateTimeFormat(locales[lang], {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    ...(d ? { day: 'numeric' } : {}),
  }).format(date);
}
