import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** One page per course. The file name is the course number, e.g. 104031.md. */
const courses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courses' }),
  schema: z.object({
    code: z.string().regex(/^\d{6}$/),
    title: z.string(),
    /** What I did in the course: gave the lectures or the recitations. */
    role: z.enum(['lecturer', 'ta']),
    materials: z
      .array(
        z.object({
          kind: z.enum(['lectures', 'recitations']),
          /** Path under public/, e.g. /Recitations/104031.pdf */
          file: z.string().startsWith('/'),
        }),
      )
      .min(1),
  }),
});

/** Papers. The Markdown body, when present, is the abstract. */
const publications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    journal: z.string(),
    volume: z.number().optional(),
    article: z.number().optional(),
    year: z.number(),
    doi: z.string().optional(),
    url: z.url(),
    arxiv: z.string().optional(),
  }),
});

const localized = z.object({ he: z.string(), en: z.string() });

/** Talks and posters, in src/data/talks.yaml. */
const talks = defineCollection({
  loader: file('./src/data/talks.yaml'),
  schema: z.object({
    kind: z.enum(['conference', 'invited', 'poster']),
    title: z.string(),
    /** YYYY-MM or YYYY-MM-DD */
    date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
    event: localized.optional(),
    eventUrl: z.url().optional(),
    place: localized,
    file: z.string().startsWith('/').optional(),
  }),
});

/** Prose for bilingual pages, e.g. pages/he/about.md and pages/en/about.md. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string() }),
});

export const collections = { courses, publications, talks, pages };
