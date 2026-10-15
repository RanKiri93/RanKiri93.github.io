# Site rework: open items

Things waiting on Ran before the new site (branch `astro-rework`) goes live.
Tick them off here as they're done.

## Before going live

- [x] Replace `public/CV.pdf` with a cleaned version: now built from `cv/cv.tex`
      (no ID number or date of birth; awards, paper year, IWOTA 2025 updated).
- [ ] **Proofread the new CV** (`cv/cv.tex` → `public/CV.pdf`). Check: the reserve-duty days (199, as of Jan 2025); the research-interests line;
      whether to keep the GPAs. Rebuild with `latexmk -pdf cv.tex` and copy
      `cv.pdf` to `public/CV.pdf`.
- [ ] The old CV with the ID number is still in git history (and on the live
      site until the merge). Decide whether to scrub it from history.
- [ ] Review the research texts (math and wording), both languages:
      `src/content/pages/he/research.md` and `src/content/pages/en/research.md`.
- [ ] Review the English About bio and award names: `src/content/pages/en/about.md`,
      `src/data/profile.ts`.

## Content to send

- [ ] **MSc thesis PDF** → put in `public/research/`; it gets a "read" link on the
      Research page (`file:` in `src/content/publications/msc-thesis.md`).
- [x] Talk slides for IWOTA 2025, IWOTA 2023 and "What is a UCP Map?" 2021 →
      `public/research/*-slides.pdf`, linked from the Research page and the CV.
- [x] Copenhagen 2022 removed from the talks (attended only; the CV lists it
      under "Conferences attended").
- [x] Slides shrunk to one page per frame (17/17/25 pages), bookmarks kept.
      For a new talk: `node tools/slides-handout.mjs talk.pdf
      public/research/<name>-slides.pdf "Title"`, then add `slides:` in
      `src/data/talks.yaml`.

## Nice to have

- [ ] Fix bookmark titles that lost their math in the PDFs (e.g. "תכונות של התמרת
      פוריה ב-cG" in 104214), via small per-title overrides.
- [ ] Reader: clickable links inside PDFs, and text selection/search.

## Still to build

- [x] Home page: hero with the numerical-range picture, course cards, research
      and about teasers (`src/components/HomePage.astro`).
- [ ] Review the home page texts in both languages (`home.*` in
      `src/i18n/ui.ts`), especially the picture caption and the research line.
- [x] Switch the GitHub Actions deploy from Hugo to Astro
      (`.github/workflows/deploy.yaml`; builds on `astro-rework`, deploys only
      from `main` to the `gh-pages` branch).
- [ ] Commit everything on `astro-rework` (much of the work is still
      uncommitted) and push it; the Actions tab should show a green build.
- [ ] Remove the old Hugo files (`content/`, `layouts/`, `themes/` + the
      `.gitmodules` entry, `static/`, `archetypes/`, `assets/`, `data/`,
      `i18n/`, `hugo.toml`), then merge `astro-rework` into `main`.
- [ ] After the merge: check the Actions run, then the live site.
