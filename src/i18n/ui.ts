import { getRelativeLocaleUrl } from 'astro:i18n';

export const languages = {
  he: 'עברית',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'he';

export const dir: Record<Lang, 'rtl' | 'ltr'> = {
  he: 'rtl',
  en: 'ltr',
};

export const ui = {
  he: {
    'site.name': 'רן קירי',
    'site.description': 'חומרי לימוד, סיכומים ומחקר במתמטיקה בטכניון.',
    'nav.label': 'ניווט ראשי',
    'nav.home': 'בית',
    'nav.courses': 'קורסים',
    'nav.research': 'מחקר',
    'nav.about': 'אודות',
    'a11y.skip': 'דלג לתוכן',
    'lang.switch': 'Read in English',
    'research.title': 'מחקר',
    'research.intro': 'אני חוקר את המבנה הגיאומטרי של מערכות אופרטורים. כאן מרוכזים המאמרים, ההרצאות והפוסטרים שלי.',
    'research.publications': 'מאמרים',
    'research.conferences': 'הרצאות בכנסים',
    'research.invited': 'הרצאות מוזמנות',
    'research.posters': 'פוסטרים',
    'research.read': 'למאמר',
    'research.poster': 'לפוסטר (PDF)',
    'about.education': 'השכלה',
    'about.awards': 'פרסים ומלגות',
    'about.cv': 'לקורות החיים המלאים (PDF)',
    'about.contact': 'יצירת קשר',
    'about.contactText': 'שאלות על קורס, על המחקר או רעיון לשיתוף פעולה? אשמח לשמוע במייל:',
  },
  en: {
    'site.name': 'Ran Kiri',
    'site.description': 'Course materials and research in mathematics at the Technion.',
    'nav.label': 'Main navigation',
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.research': 'Research',
    'nav.about': 'About',
    'a11y.skip': 'Skip to content',
    'lang.switch': 'לקריאה בעברית',
    'research.title': 'Research',
    'research.intro': 'I study the geometric structure of operator systems. Here are my papers, talks and posters.',
    'research.publications': 'Papers',
    'research.conferences': 'Conference talks',
    'research.invited': 'Invited talks',
    'research.posters': 'Posters',
    'research.read': 'Read the paper',
    'research.poster': 'View the poster (PDF)',
    'about.education': 'Education',
    'about.awards': 'Awards and fellowships',
    'about.cv': 'Full CV (PDF)',
    'about.contact': 'Get in touch',
    'about.contactText': 'Questions about a course, my research, or an idea for working together? Email me at',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)['he'];

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first && first in languages ? (first as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key];
}

/** Locale-aware link to a page, e.g. localePath('en', 'research/') -> '/en/research/'. */
export function localePath(lang: Lang, path = ''): string {
  return getRelativeLocaleUrl(lang, path);
}

/** The same page in the other language, assuming it has a translation. */
export function alternatePath(url: URL, target: Lang): string {
  const current = getLangFromUrl(url);
  const rest =
    current === defaultLang
      ? url.pathname.replace(/^\//, '')
      : url.pathname.replace(new RegExp(`^/${current}/?`), '');
  return localePath(target, rest);
}
