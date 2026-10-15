/** Hebrew labels for course data; course pages are Hebrew-only. */
export const materialLabel = {
  lectures: 'הרצאות',
  recitations: 'תרגולים',
} as const;

export const roleHeading = {
  lecturer: 'קורסים שלימדתי',
  ta: 'קורסים שתרגלתי',
} as const;

/** Courses that have a generated picture (see components/CourseGlyph.astro). */
export const coursesWithGlyph = new Set([
  '104031',
  '104136',
  '104165',
  '104168',
  '104214',
  '104215',
  '104221',
  '104273',
  '104281',
  '104285',
  '104295',
]);

/** Keeps a bit of math left-to-right inside a Hebrew title. */
const ltr = (math: string) => `\u2066${math}\u2069`;

/**
 * Bookmark titles that lost their math: PDF bookmarks are plain text, so
 * symbols set in a math font drop out. By PDF path, then by the title exactly
 * as it is in the PDF.
 */
export const bookmarkFixes: Record<string, Record<string, string>> = {
  '/Lectures/104214.pdf': {
    'תכונות של התמרת פוריה ב-cG': `תכונות של התמרת פוריה ב-${ltr('𝒢(ℝ)')}`,
    'נוסחאות היפוך והתמרת פוריה ב-cG2': `נוסחאות היפוך והתמרת פוריה ב-${ltr('𝒢²(ℝ)')}`,
    'קונבולוציה ב-cG': `קונבולוציה ב-${ltr('𝒢(ℝ)')}`,
  },
  '/Lectures/104215.pdf': {
    'העשרה - נגזרות חלקיות לפי z,': `העשרה - נגזרות חלקיות לפי ${ltr('z, z̄')}`,
  },
  '/Recitations/104165.pdf': {
    'מידה, -אלגברה': 'מידה, σ-אלגברה',
    'תרגיל - העמקה בתכונות של -אלגבראות': 'תרגיל - העמקה בתכונות של σ-אלגבראות',
    'תרגיל - הפרדה ב–אלגבראות': 'תרגיל - הפרדה ב-σ-אלגבראות',
    'תרגיל - קבוצות -מדידות': 'תרגיל - קבוצות μ*-מדידות',
    'תרגיל - סדרות mu-קושי': 'תרגיל - סדרות μ-קושי',
  },
};

/** Strip a leading "3. " from bookmark titles when it matches our own numbering. */
export function chapterTitle(title: string, index: number): string {
  const match = /^(\d+)\.\s*/.exec(title);
  return match && Number(match[1]) === index + 1 ? title.slice(match[0].length) : title;
}

export function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
