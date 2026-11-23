# Crema Lab — Quality Gate v1.0

> Status: proposed baseline. This file does not certify that any tests have passed.
> Scope: React 19 / TypeScript / Vite PWA for iPhone; six brewing methods, Lelit Anna, grinders, coffee history, settings and backup.

## Principles

- Correctness, data preservation, usability and maintainability take precedence over shipping speed.
- Changes to brewing, grinders, Lelit logic or stored data must preserve existing behavior unless an explicit, documented product decision says otherwise.
- No agent may claim tests were run without a link to a CI run or an exact local command and recorded outcome.
- An AI review is supplementary: production merge/release is accepted by a human.
- A score never overrides a failed blocking check. Mark untested checks **NOT VERIFIED**, not PASS.

## Quality score (100 points)

| Dimension | Weight | Minimum within dimension | Evidence |
| --- | ---: | ---: | --- |
| Visual design and UI consistency | 20 | 85% | screenshots per theme, mode, language and critical viewport |
| UX and accessibility | 20 | 85% | scripted user journeys, keyboard/VoiceOver review |
| Functionality | 20 | 80% | acceptance test matrix and regression results |
| Architecture | 15 | 80% | module boundaries, dependency and PR review |
| Reliability | 15 | 80% | automated checks, restart/offline/storage testing |
| Performance and security | 10 | 80% | device/browser measurements and security checks |

**Product acceptance target:** weighted score >=85/100, each dimension above its minimum, all applicable blocking checks passing, no unresolved P0/P1. Scores are assigned from evidence by the reviewer and product owner; unavailable data means *not yet assessed*, not zero defects.

## Defect severity

- **P0:** data loss, serious security breach, unusable application — always block.
- **P1:** critical functional regression, unsafe or misleading device status, frequent crash — block.
- **P2:** degraded functionality with workaround — document decision and remediation.
- **P3:** cosmetic / low-impact — schedule as appropriate.

## Gates

- **G0 Ready:** issue contains purpose, UX behavior, acceptance criteria, impacted state/storage and rollback considerations.
- **G1 Implementation:** branch-scoped change; tests updated; no unrelated refactor; existing storage keys and migrations respected.
- **G2 Automated:** clean `npm ci`, `npm run build`, `npm test` on the relevant environment; no unresolved automated security finding rated high/critical. The existing build script includes publishing assets, so check its effects before running locally.
- **G3 Independent review:** Codex or a different reviewer inspects diff, test coverage, data compatibility and accessibility; implementer resolves major findings. A review authored by AI is not a substitute for human approval.
- **G4 Product verification:** screenshot walkthroughs and manual iPhone Safari checks; real-device audio/speech, screen-lock/background recovery, persistent data and backup restore. Automated browser tests cannot certify hardware behavior.
- **G5 Release:** release notes, checked deployment artifacts, rollback plan, owner approval, post-release smoke test.

## Crema Lab acceptance checklist

### UI consistency
- All three themes (Palarnia, Kawiarnia, Soft), light/dark/system, standard/compact and PL/EN have no clipping or overlap at widths 320, 375, 390 and 430px.
- Main start/stop actions remain reachable; touch targets >=44x44 CSS pixels where applicable.
- Loading, empty, error, disabled and selected states are understandable without reliance on color alone.

### UX
- First-time user can select coffee, brewing method, grinder and start a guided brew.
- Time continues appropriately while navigating; changing settings does not inadvertently reset brewing.
- Accessibility labels, focus order, visible focus and dynamic text are examined; avoid presenting static visual checks as VoiceOver proof.

### Functionality and data safety
- Six brewing methods, guidance, alerts, K-Pro, William calibration, Lelit Anna PID/warmup/milk instructions, rating and history work as specified.
- Backup export/import covers coffee records, photos and preferences; invalid backups are rejected and replacement requires clear confirmation.
- Regression checks preserve legacy `localStorage` data keys (`cremalab.iphone.v3`, migration from `cremalab.iphone.v2`, `cremalab.theme`, `cremalab.preferences.v1`, `cremalab.coffees.v1`, `cremalab.photos.v1`).
- **Simulated pressure/extraction/mass must never be mislabeled as physical sensor readings.** The app is not connected to the coffee equipment.

### Reliability and performance
- Navigation, pause/resume, tab sleep, offline launch, backup/restore and app restart have explicit smoke tests.
- Mobile performance is measured on a named device/browser and network condition; set numerical budgets only after establishing the baseline.
- Do not claim active timing survives a full page reload: current documentation says it does not.

### Security
- No keys, passwords or tokens in source, fixtures, logs or PR attachments.
- Audit dependencies and user-supplied data import validation; review photo handling and generated HTML entrypoints.
- Keep minimal data collection and disclose storage behavior.

## Evidence attached to each PR

- What changed and why; linked issue; risk level.
- G0–G5 table with PASS/FAIL/NOT VERIFIED/NOT APPLICABLE.
- Commands executed and their output (or CI run URLs).
- Screenshots/video for UI changes, including tested combinations.
- Data migration/backup impact and explicit test results.
- Independent review findings with disposition.
- Remaining risks and owner acceptance.

## Roles

**Claude Code:** implement on a dedicated branch, write tests, document decisions, disclose untested behavior.  
**Codex:** independent change review, question assumptions, identify regressions and security/performance risk; propose changes on separate branches when needed.  
**GitHub:** preserve traceability through PRs, checks, discussions and protected main branch (protection is configured separately).  
**Human owner:** final acceptance, release decision and UX sign-off.

Do not automatically merge this document or related implementation PRs. CI, branch rules and external reviewers must be configured and verified separately.
