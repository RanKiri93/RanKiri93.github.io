import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** One page per course. The file name is the course number, e.g. 104031.md. */
const courses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courses' }),
  schema: z.object({
    code: z.string().regex(/^\d{6}$/),
    title: z.string(),
    /** English name, used on English pages (the course pages themselves are Hebrew). */
    titleEn: z.string(),
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

/** Papers and theses. The Markdown body, when present, is the abstract (LaTeX allowed). */
const publications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publications' }),
  schema: z.object({
    kind: z.enum(['article', 'thesis']),
    title: z.string(),
    /** Title with LaTeX for BibTeX, when it contains symbols such as Λ. */
    titleTex: z.string().optional(),
    authors: z.array(z.string()).min(1),
    journal: z.string().optional(),
    volume: z.number().optional(),
    article: z.number().optional(),
    institution: z.string().optional(),
    advisor: z.string().optional(),
    year: z.number(),
    doi: z.string().optional(),
    url: z.url().optional(),
    arxiv: z.string().optional(),
    /** A PDF in public/, read in the site's reader. */
    file: z.string().startsWith('/').optional(),
    related: z
      .array(z.object({ authors: z.string(), title: z.string(), year: z.number(), url: z.url() }))
      .default([]),
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
    /** Poster PDF in public/. */
    file: z.string().startsWith('/').optional(),
    /** Preview image of the poster, in public/. */
    thumbnail: z.string().startsWith('/').optional(),
    /** Slides PDF in public/. */
    slides: z.string().startsWith('/').optional(),
  }),
});

/** Prose for bilingual pages, e.g. pages/he/about.md and pages/en/about.md. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), lede: z.string().optional() }),
});

export const collections = { courses, publications, talks, pages };
