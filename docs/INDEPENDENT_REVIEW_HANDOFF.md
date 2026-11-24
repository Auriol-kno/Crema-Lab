# Crema Lab PR #11 — Independent review handoff

**Review target:** https://github.com/Auriol-kno/Crema-Lab/pull/11  
**Base:** `main` | **Head:** `quality/quality-gate-v1`

**Current verified CI evidence:** GitHub Actions [App checks #36](https://github.com/Auriol-kno/Crema-Lab/actions/runs/45297237501) finished SUCCESS: install, build, test, screenshots artifact. Follow-up commits require their own green CI before acceptance.

> This document is a handoff for Codex or another independent reviewer. It is **not** proof that Codex was run or approved this PR.

## Review instructions for Codex

Perform a skeptical read-only review of PR #11 relative to `main`. Do not assume implementation is correct because CI passes. Report reproducible findings with severity P0/P1/P2/P3, file and line location, user impact, exploit/regression conditions, proposed fix, and missing tests. Separate confirmed defects from hypotheses. Do not silently apply fixes or merge.

### Required focus

1. `app/src/Backup.tsx`: import validator type/range handling, compatibility with prior backups, storage partial-write rollback, `null` / absent keys, history and photos, prototype-pollution edge cases, unsafe/malformed user data, quota failure. Carefully examine `safe()` and deeply nested imported values.
2. `tests/backup-negative.cjs`: whether tests actually exercise their claimed failure modes, including seeded storage and transient write failures; identify missing valid-backup compatibility checks and permanent-failure cases.
3. `app/src/app.css`, `app/src/appearance.css`, `tests/ui-quality.cjs`: screen width 320 px; compact label sizing; tap targets; real effective contrast on translucent `--glass` backgrounds; selected/disabled/focus states; theme/language combinations.
4. `QUALITY_STANDARDS.md`, `CLAUDE.md`, `AGENTS.md`: ensure requirements are achievable, evidence-based, and do not create false claims about protection already being enforced.
5. Verify no accidental changes to timer, grinding, Lelit Anna, six brewing methods, publishing assets, or persisted data schema.

### Questions reviewer must answer

- Can a valid-looking backup place unusable out-of-range settings into `localStorage` or trigger a runtime fault?
- If `localStorage` fails permanently mid-restore, can the user lose a previously valid record? Is the rollback behavior communicated accurately?
- Is any UI contrast check relying only on CSS token pairs when the user sees translucent backgrounds or gradients?
- Are all mandatory touch and readability criteria measured for the elements actually visible in the compact layout?
- Is every claimed quality gate traceable to an automatic check or documented manual acceptance?

## Acceptance result format

| Check | Result (PASS / FAIL / NOT VERIFIED / N/A) | Evidence |
| --- | --- | --- |
| Build and regression tests | | |
| Backup import / existing-data preservation | | |
| Legacy backup compatibility | | |
| UI contrast including translucent cards | | |
| Accessibility / iPhone device behavior | | |
| No P0/P1 defects | | |
| GitHub branch restrictions / approvals | | |
| Human product sign-off | | |

Do not assign final 0–100 score or recommend merge while mandatory evidence is unavailable.

## Verified observations from prior static review

- Main action palette variables for all three themes in light/dark exceeded 4.5:1 by arithmetic contrast calculations; this does not validate rendered glass cards.
- Compact navigation font-size regression was caught by CI and subsequently corrected; #36 successful.
- A single injected `localStorage` write exception is covered by a browser test; permanent write failure / browser process interruption has not been certified.
- Physical iPhone VoiceOver and background/audio behavior have not been verified here.

## Output requested

Create a review report grouped by severity and a short final verdict: **APPROVE**, **REQUEST CHANGES** or **INSUFFICIENT EVIDENCE**. Link results to PR #11. Keep independent review distinct from implementer and human product approval.
