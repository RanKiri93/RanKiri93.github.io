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
export const coursesWithGlyph = new Set(['104031', '104136', '104168', '104214', '104215', '104281', '104285', '104295']);

/** Strip a leading "3. " from bookmark titles when it matches our own numbering. */
export function chapterTitle(title: string, index: number): string {
  const match = /^(\d+)\.\s*/.exec(title);
  return match && Number(match[1]) === index + 1 ? title.slice(match[0].length) : title;
}

export function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
