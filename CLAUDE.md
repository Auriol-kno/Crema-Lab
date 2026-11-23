# Claude Code — Crema Lab project instructions

Read `README.md` and `QUALITY_STANDARDS.md` before changing application code.

## Context
- React 19 + TypeScript + Vite PWA; source entrypoint `app/index.html`.
- `app/src/App.tsx` hosts navigation; `app/src/brewing.js` is the legacy brewing engine with typed interface in `brewing.d.ts`.
- Styles are layered CSS, with separate Palarnia/Kawiarnia/Soft themes.
- Equipment behavior covers K-Pro, William and Lelit Anna; no real equipment telemetry.
- `README.md` documents storage keys and migrations. Protect them.
- Root `index.html` and `assets/` are generated publishing outputs: do not hand-edit to implement features.

## Working agreement
1. Start from an issue and state acceptance criteria and risks before coding.
2. Use a feature branch; avoid unrelated cleanup.
3. Write/extend tests for changed behavior, especially timer, grinders, history and backup.
4. Preserve functionality, current data, localization and all three UI themes.
5. Run `npm ci`, `npm run build`, `npm test` as appropriate; record actual outcomes. Never fabricate a passing result.
6. For UI changes, capture browser screenshots and request real-iPhone validation when needed.
7. For any user-visible device metrics, distinguish measured data from simulation.
8. Open a PR with a risk summary, proof of tests and remaining limitations; request independent Codex review.
9. Do not merge or release without human product approval.

Review and acceptance requirements are in `QUALITY_STANDARDS.md`.
