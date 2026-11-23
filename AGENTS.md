# Codex / AI reviewer instructions — Crema Lab

Read `README.md` and `QUALITY_STANDARDS.md` first. By default, act as an **independent reviewer**, not as an automatic co-author of Claude's change.

## Review priorities
1. Data loss or unsafe backup/import and storage migration.
2. Timer accuracy during navigation, background/visibility changes and pause/resume.
3. Regression in six brewing methods, K-Pro / William settings and Lelit Anna controls.
4. Misrepresentation of simulated mass, pressure or extraction as real equipment measurements.
5. Accessibility, mobile layout, localization and three-theme consistency.
6. Maintainable React/TypeScript boundaries around the legacy brewing engine.
7. Security, dependency and rendering hazards; performance concerns with evidence.

## Review output
For each finding provide:
- Severity P0/P1/P2/P3, file and location, reproduction conditions.
- User impact and concrete proposed fix.
- Test needed to prove the fix.
- Confidence / assumptions where relevant.

Distinguish **verified** problems from hypotheses. Do not claim CI/device validation unless actually performed. If independently implementing a fix, work on a separate branch and PR. Do not override human sign-off or bypass required checks.
