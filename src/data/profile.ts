import type { Lang } from '../i18n/ui';

type Localized = Record<Lang, string>;

export const email = 'rankiri@campus.technion.ac.il';
export const cvUrl = '/CV.pdf';

/** Academic profiles shown next to the email (e.g. Google Scholar, ORCID). Empty: hidden. */
export const profiles: { label: string; url: string }[] = [
  { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=Ws0L2ocAAAAJ' },
  { label: 'ORCID', url: 'https://orcid.org/0000-0002-7631-0713' },
];

/** "How I teach", in Ran's own words; paragraphs separated by blank lines. null: the section is hidden. */
export const teachingApproach: Localized | null = {
  he: `תמיד ראיתי במתמטיקה מקור לסדר וליופי רב.

בהוראה חשוב לי קודם כול לשכנע את הסטודנטים והסטודנטיות שאני מאמין גדול בתהליך הלמידה עצמו. טעויות, סיעור מוחות והתמודדות עם האינטואיציה (גם שלי!) הם חלק בלתי נפרד מהלמידה, ואני שם עליהם דגש בהרצאות, בתרגולים ובשיעורי הבית.

עבודה עצמאית הכרחית כדי להטמיע את החומר, גם כשהמתמטיקה מאתגרת ולפעמים אף מלחיצה. כאן התפקיד שלי הוא להיות זמין. אני מאמין שנוכחות זמינה ומסבירת פנים של המרצה משרה ביטחון בכיתה כולה, רק מעצם היותה שם, וכך מחזקת את תחושת המסוגלות גם בעבודה העצמאית.

לבסוף, המתמטיקה איננה רק כלי מופשט. היא נמצאת בכל עולמות המדע והטכנולוגיה, ואפילו בחיי היום-יום (לפעמים במקומות מפתיעים). היכן שאפשר, אני מקפיד להראות שימושים של המתמטיקה בעולם האמיתי, כדי לתת תשובה נוספת לשאלה "למה?".

אני מאמין שהשילוב של כל אלה הופך את הלמידה לחוויה מאתגרת, מגרה אינטלקטואלית ואפילו מהנה.`,
  en: `I have always seen mathematics as a source of order and great beauty.

When I teach, the first thing I want my students to know is that I truly believe in the learning process itself. Mistakes, brainstorming and wrestling with intuition (mine included!) are an inseparable part of learning, and I give them a central place in lectures, recitations and homework.

Independent work is essential for really taking in the material, even when mathematics is challenging and sometimes stressful. Here my part is to be available. I believe that an approachable, available lecturer gives the whole class confidence just by being there, and so builds a sense of capability for the independent work too.

Finally, mathematics is not only an abstract tool. It runs through all of science and technology, and even everyday life (sometimes in surprising places). Wherever I can, I show how mathematics is used in the real world, to give one more answer to the question "why?".

I believe that together, all of this makes learning challenging, intellectually stimulating, and even fun.`,
};

/**
 * Career timeline. Dates are fractional years: Technion's winter semester is
 * roughly Oct–Feb (≈ .8–.1) and spring Mar–Jul (≈ .2–.55). `to: null` means
 * ongoing.
 */
export interface Span {
  label: Localized;
  from: number;
  to: number | null;
}

export interface Mark {
  at: number;
  /** Which award in `awards` below this mark belongs to. */
  award: number;
}

export const timeline: {
  studies: Span[];
  teaching: Span[][];
  awardSpans: (Span & { award: number })[];
  awardMarks: Mark[];
} = {
  studies: [
    { label: { he: 'תואר ראשון', en: 'BSc' }, from: 2016.8, to: 2020.55 },
    { label: { he: 'תואר שני', en: 'MSc' }, from: 2020.8, to: 2022.6 },
    { label: { he: 'דוקטורט', en: 'PhD' }, from: 2022.85, to: null },
  ],
  // Each inner list is one track; tracks may overlap in time.
  teaching: [
    [{ label: { he: 'מתרגל', en: 'Teaching assistant' }, from: 2018.8, to: null }],
    [
      // Grader for three semesters from 2018, overlapping the first year as TA.
      { label: { he: 'בודק תרגילים', en: 'Grader' }, from: 2018.2, to: 2019.55 },
      { label: { he: 'מרצה', en: 'Lecturer' }, from: 2023.2, to: null },
    ],
  ],
  // Szego prizes: three runs of four consecutive semesters each (ugportal lists).
  awardSpans: [
    { label: { he: 'Szego ‏×4', en: 'Szego ×4' }, from: 2018.8, to: 2020.55, award: 0 },
    { label: { he: 'Szego ‏×4', en: 'Szego ×4' }, from: 2021.2, to: 2023.1, award: 0 },
    { label: { he: 'Szego ‏×4', en: 'Szego ×4' }, from: 2023.8, to: 2025.55, award: 0 },
  ],
  awardMarks: [
    // The thesis prize is for 2022–23; drawn early in that year so it clears the Spring 2023 dot.
    { at: 2022.95, award: 2 },
    { at: 2023.4, award: 1 },
    { at: 2024.4, award: 1 },
    { at: 2024.95, award: 1 },
    { at: 2025.4, award: 1 },
  ],
};

/** `shape` is the award's marker on the timeline; awards without one aren't drawn there. */
export const awards: { title: Localized; detail: Localized; url?: string; shape?: 'band' | 'dot' | 'diamond' }[] = [
  {
    title: { he: 'פרס Sandor Szego למצוינות בהוראה', en: 'Sandor Szego Prize for Excellence in Teaching' },
    detail: {
      he: 'הוענק 12 פעמים: חורף תשע"ט–אביב תש"ף, אביב תשפ"א–חורף תשפ"ג וחורף תשפ"ד–אביב תשפ"ה.',
      en: 'Awarded twelve times: Winter 2018–19 to Spring 2020, Spring 2021 to Winter 2022–23, and Winter 2023–24 to Spring 2025.',
    },
    url: 'https://ugportal.technion.ac.il/%D7%94%D7%95%D7%A8%D7%90%D7%94-%D7%95%D7%91%D7%97%D7%99%D7%A0%D7%95%D7%AA/%D7%9E%D7%AA%D7%A8%D7%92%D7%9C%D7%99%D7%9D-%D7%9E%D7%A6%D7%98%D7%99%D7%99%D7%A0%D7%99%D7%9D/',
    shape: 'band',
  },
  {
    title: { he: 'פרס מרצה מצטיין', en: 'Outstanding Lecturer Award' },
    detail: {
      he: 'אביב תשפ"ה, חורף תשפ"ה ואביב תשפ"ד; ציון לשבח באביב תשפ"ג.',
      en: 'Spring 2025, Winter 2024–25 and Spring 2024; commendation in Spring 2023.',
    },
    url: 'https://promoteach.technion.ac.il/lecturer-excellence-2-3/',
    shape: 'dot',
  },
  {
    title: {
      he: 'פרס הקרן לעידוד המצוינות במתמטיקה',
      en: 'Fund for the Promotion of Excellence in Mathematics Prize',
    },
    detail: { he: 'עבור עבודת מגיסטר מצטיינת, תשפ"ג.', en: "For an outstanding master's thesis, 2022–23." },
    shape: 'diamond',
  },
  {
    title: { he: 'מלגת מרים ואהרון גוטווירט', en: 'Miriam and Aaron Gutwirth Fellowship' },
    detail: { he: 'במהלך לימודי הדוקטורט.', en: 'During my doctoral studies.' },
  },
];

/** Courses I taught that don't have a page with materials (yet). */
export const otherCoursesTaught: { title: Localized; role: 'lecturer' | 'ta' }[] = [
  { title: { he: 'מבוא לאנליזה פונקציונלית', en: 'Introduction to Functional Analysis' }, role: 'ta' },
  { title: { he: 'אנליזה ממשית', en: 'Real Analysis' }, role: 'ta' },
  { title: { he: 'פונקציות מרוכבות והתמרות אינטגרליות', en: 'Complex Functions and Integral Transforms' }, role: 'ta' },
];
