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
    'nav.courses': 'קורסים',
    'nav.research': 'מחקר',
    'nav.about': 'אודות',
    'a11y.skip': 'דלג לתוכן',
    'lang.switch': 'Read in English',
    'theme.dark': 'מצב כהה',
    'research.title': 'מחקר',
    'research.intro': 'אני חוקר את המבנה הגיאומטרי של מערכות אופרטורים. כאן מרוכזים המאמרים, ההרצאות והפוסטרים שלי.',
    'research.read': 'למאמר',
    'research.themes': 'במה אני עוסק',
    'research.papers': 'מאמרים ועבודות',
    'research.abstract': 'תקציר',
    'research.bibtex': 'העתקת BibTeX',
    'research.copied': 'הועתק',
    'research.related': 'מחקר קשור שפותח באופן בלתי תלוי:',
    'research.thesis': 'עבודת מוסמך',
    'research.thesisMeta': "עבודת מוסמך, הטכניון, {year}. מנחה: פרופ' אור משה שליט.",
    'research.talks': 'הרצאות ופוסטרים',
    'research.slides': 'שקפים',
    'research.viewPoster': 'לצפייה בפוסטר',
    'research.openPdf': 'לקריאה',
    'talk.conference': 'הרצאה בכנס',
    'talk.invited': 'הרצאה מוזמנת',
    'talk.poster': 'פוסטר',
    'reader.label': 'קריאה: {title}',
    'reader.close': 'סגירת הקורא',
    'reader.chapters': 'פרקים',
    'reader.page': 'עמוד',
    'reader.of': 'מתוך {pages}',
    'reader.download': 'הורדה',
    'reader.pages': 'עמודי הקובץ',
    'reader.pageLabel': 'עמוד {n}',
    'reader.loading': 'טוען את הקובץ…',
    'reader.error': 'לא הצלחנו לטעון את הקובץ. אפשר',
    'reader.errorLink': 'לפתוח אותו ישירות',
    'reader.start': 'התחלת קריאה',
    'reader.continue': 'המשך מעמוד {n}',
    'butterfly.label': 'הפרפר של הופשטטר: הספקטרום של U + U* + V + V* כפונקציה של θ',
    'butterfly.statement': 'כאשר θ = {p}/{q}, כל הצגה אי-פריקה של U ו-V היא מגודל {q}×{q}, ולכן האלגברה שהם יוצרים היא {q}-תת-הומוגנית.',
    'butterfly.statementOne': 'כאשר θ = {p}/{q}, האוניטריים מתחלפים וכל הצגה אי-פריקה היא חד-ממדית: האלגברה קומוטטיבית.',
    'butterfly.caption': 'כל שורה בציור היא הספקטרום של {operator}, כאשר {relation}. גררו על הציור או הזיזו את המחוון כדי לבחור θ.',
    'butterfly.clockCaption': 'הנקודות הן הערכים העצמיים של U, שורשי יחידה. V מעביר כל וקטור עצמי של U לווקטור עצמי אחר וכופל את הערך העצמי ב-{step}; הקווים מחברים כל ערך עצמי לזה שהוא עובר אליו.',
    'about.cv': 'לקורות החיים המלאים (PDF)',
    'about.contactText': 'שאלות על קורס, על המחקר או רעיון לשיתוף פעולה? אשמח לשמוע במייל:',
    'about.photoAlt': 'רן קירי מסביר ליד הלוח',
    'about.glance': 'בקצרה',
    'about.studies': 'לימודים',
    'about.teaching': 'הוראה',
    'about.awardsShort': 'פרסים',
    'about.taught': 'קורסים שלימדתי',
    'about.asLecturer': 'כמרצה',
    'about.asTa': 'כמתרגל',
    'about.how': 'איך אני מלמד',
    'about.writeMe': 'לשליחת מייל',
    'home.eyebrow': 'הפקולטה למתמטיקה, הטכניון',
    'home.lede':
      'שלום, אני רן, דוקטורנט ומרצה למתמטיקה בטכניון. כאן תמצאו את החומרים מהקורסים שלימדתי ותרגלתי, מסודרים לפי פרקים ופתוחים לכולם, וגם קצת על המחקר שלי.',
    'home.toCourses': 'לחומרי הקורסים',
    'home.toResearch': 'על המחקר',
    'home.figureLabel': 'הטווח הנומרי של מטריצה 4×4: קבוצה קמורה, הערכים העצמיים שלה וישרים תומכים',
    'home.figureCaption':
      'הטווח הנומרי {W} של מטריצה 4×4 הוא קבוצה קמורה שמכילה את הערכים העצמיים (בכתום). השפה שלו היא המעטפת של הישרים התומכים. הצביעו על הציור כדי לסובב ישר תומך.',
    'home.coursesTitle': 'חומרי הקורסים',
    'home.coursesIntro': 'סיכומי הרצאות ותרגולים מלאים, עם מפת פרקים וקורא נוח ישר מהדפדפן.',
    'home.coursesNote': '',
    'home.allCourses': 'לכל הקורסים',
    'home.pages': '{n} עמודים',
    'home.researchTitle': 'מחקר',
    'home.researchText':
      'אני חוקר מערכות אופרטורים ואת הגיאומטריה של קבוצות קמורות מטריציות, הכללה של הטווח הנומרי שבציור למעלה.',
    'home.toResearchPage': 'לעמוד המחקר',
    'home.aboutTitle': 'קצת עליי',
    'home.aboutText': 'אני מלמד בטכניון מאז 2018, קודם כמתרגל ובשנים האחרונות גם כמרצה.',
    'home.toAbout': 'עוד עליי',
  },
  en: {
    'site.name': 'Ran Kiri',
    'site.description': 'Course materials and research in mathematics at the Technion.',
    'nav.label': 'Main navigation',
    'nav.courses': 'Courses',
    'nav.research': 'Research',
    'nav.about': 'About',
    'a11y.skip': 'Skip to content',
    'lang.switch': 'לקריאה בעברית',
    'theme.dark': 'Dark mode',
    'research.title': 'Research',
    'research.intro': 'I study the geometric structure of operator systems. Here are my papers, talks and posters.',
    'research.read': 'Read the paper',
    'research.themes': 'What I work on',
    'research.papers': 'Papers and theses',
    'research.abstract': 'Abstract',
    'research.bibtex': 'Copy BibTeX',
    'research.copied': 'Copied',
    'research.related': 'Related work, developed independently:',
    'research.thesis': "Master's thesis",
    'research.thesisMeta': "Master's thesis, Technion, {year}. Advisor: Prof. Orr Moshe Shalit.",
    'research.talks': 'Talks and posters',
    'research.slides': 'Slides',
    'research.viewPoster': 'View the poster',
    'research.openPdf': 'Read',
    'talk.conference': 'Conference talk',
    'talk.invited': 'Invited talk',
    'talk.poster': 'Poster',
    'reader.label': 'Reading: {title}',
    'reader.close': 'Close the reader',
    'reader.chapters': 'Chapters',
    'reader.page': 'Page',
    'reader.of': 'of {pages}',
    'reader.download': 'Download',
    'reader.pages': 'Document pages',
    'reader.pageLabel': 'Page {n}',
    'reader.loading': 'Loading the file…',
    'reader.error': "The file didn't load. You can",
    'reader.errorLink': 'open it directly',
    'reader.start': 'Start reading',
    'reader.continue': 'Continue from page {n}',
    'butterfly.label': 'The Hofstadter butterfly: the spectrum of U + U* + V + V* as a function of θ',
    'butterfly.statement': 'At θ = {p}/{q}, every irreducible representation of U and V is {q} × {q}, so the algebra they generate is {q}-subhomogeneous.',
    'butterfly.statementOne': 'At θ = {p}/{q}, U and V commute and every irreducible representation is one-dimensional: the algebra is commutative.',
    'butterfly.caption': 'Each row is the spectrum of {operator}, where {relation}. Drag across the picture or move the slider to choose θ.',
    'butterfly.clockCaption': 'The dots are the eigenvalues of U, which are roots of unity. V carries each eigenvector of U to another one and multiplies its eigenvalue by {step}; the lines join each eigenvalue to the one it moves to.',
    'about.cv': 'Full CV (PDF)',
    'about.contactText': 'Questions about a course, my research, or an idea for working together? Email me at',
    'about.photoAlt': 'Ran Kiri explaining at the whiteboard',
    'about.glance': 'At a glance',
    'about.studies': 'Studies',
    'about.teaching': 'Teaching',
    'about.awardsShort': 'Awards',
    'about.taught': "Courses I've taught",
    'about.asLecturer': 'As lecturer',
    'about.asTa': 'As teaching assistant',
    'about.how': 'How I teach',
    'about.writeMe': 'Send me an email',
    'home.eyebrow': 'Faculty of Mathematics, Technion',
    'home.lede':
      "Hi, I'm Ran, a PhD student and lecturer in mathematics at the Technion. Here you'll find the materials from the courses I've taught, organised by chapter and open to everyone, and a bit about my research.",
    'home.toCourses': 'Course materials',
    'home.toResearch': 'My research',
    'home.figureLabel': 'The numerical range of a 4 × 4 matrix: a convex set, its eigenvalues and support lines',
    'home.figureCaption':
      'The numerical range {W} of a 4 × 4 matrix is a convex set containing its eigenvalues (amber). Its boundary is the envelope of the support lines. Point at the picture to turn a support line.',
    'home.coursesTitle': 'Course materials',
    'home.coursesIntro': 'Complete lecture and recitation notes, with a chapter map and a reader right in the browser.',
    'home.coursesNote': 'The materials are in Hebrew.',
    'home.allCourses': 'All courses',
    'home.pages': '{n} pages',
    'home.researchTitle': 'Research',
    'home.researchText':
      'I study operator systems and the geometry of matrix convex sets, a generalisation of the numerical range pictured above.',
    'home.toResearchPage': 'Research page',
    'home.aboutTitle': 'About me',
    'home.aboutText': "I've been teaching at the Technion since 2018, first as a teaching assistant and in recent years also as a lecturer.",
    'home.toAbout': 'More about me',
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
