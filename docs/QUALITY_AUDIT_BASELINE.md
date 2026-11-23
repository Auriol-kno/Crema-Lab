# Crema Lab — initial Quality Gate audit (2026-11-24)

**Scope:** repository-based static inspection and GitHub Actions checks; not a real-device usability/security certification.

## Verified project baseline

- React 19, TypeScript 5.9, Vite 7, Playwright; build via `npm run build` and test via `npm test`.
- The build script runs TypeScript and Vite, then `scripts/publish.mjs`, which copies generated output to root deployment files. Do not run/push publishing changes unintentionally.
- GitHub Actions **App checks / verify** runs `npm ci`, `npm run build`, Playwright browser installation, `npm test`, and artifact upload.
- Existing browser tests exercise themes, responsive behavior, navigation, timer, history and alerts. Presence of these tests does not prove all physical iPhone behaviors.
- Project documentation explicitly states pressure, extraction and mass visuals are simulated and physical equipment is not connected.

## Observations / backlog

| ID | Priority | Observation | Required verification |
| --- | --- | --- | --- |
| CL-QA-01 | P2 candidate | `app/src/Backup.tsx` calls `markBackup()` immediately after triggering a download; this confirms download initiation, not that user actually retained a recoverable file. May lead to a misleading backup recency reminder. | Test canceled/incomplete save on iOS Safari; make status text precise, consider manual user confirmation of saved copy |
| CL-QA-02 | P2 candidate | `restore` attempts rollback of partial `localStorage` writes after an error, but rollback writes are not themselves protected. Atomicity of restore is not guaranteed on storage/quota failures. | Simulate quota and storage exceptions; document recovery path and test partial failure |
| CL-QA-03 | P1/P2 risk to evaluate | Older `brewing.js` merges imported persisted `params` and `lelit` into state. Imported backup validator checks structures at a broad level, but numeric bounds/type constraints of every brewing and machine parameter are not fully established in this review. | Adversarial backup tests: negative/huge values, nested unexpected properties, `__proto__`, NaN handling; identify actual reachable impacts before assigning severity |
| CL-QA-04 | Device-only | README states background/locked iPhone, speech/audio and full page reload timer continuity are not fully verified. | Safari iPhone test matrix: lock/unlock, app switch, PWA launch, interruptions, audio permissions |
| CL-QA-05 | UX/a11y | Existing viewport and theme tests exist; no complete VoiceOver and dynamic type acceptance evidence reviewed. | Physical iPhone accessibility walkthrough, contrast and focus order checks |
| CL-QA-06 | Operational | Existing GitHub Actions verification is real, but branch protection/required check configuration was not inspected or changed. | Configure required checks and human review on `main` after confirming actual job names |

**Do not treat candidate findings as reproduced bugs.** This is a static-audit backlog to be validated.

## CI evidence for PR #11

- Workflow run: https://github.com/Auriol-kno/Crema-Lab/actions/runs/45292649001
- Observed in progress during audit: `npm ci` and `npm run build` successful; Playwright installed; `npm test` running. Final result not yet verified at time of writing.

## Next acceptance milestones

1. Confirm CI result and artifact screenshots for PR #11.
2. Verify backup import/export edge cases with automated tests and an actual iPhone.
3. Review UI/UX in all themes, density and language combinations.
4. Record measured baseline for loading, interactions and accessibility.
5. Obtain independent Codex review, then human signoff before merge.

No production source files were modified by this audit.
