# Crema Lab — UI/UX acceptance matrix v1.0

**Status:** test plan; not an assertion that all scenarios pass.  
**Applies to:** Palarnia, Kawiarnia, Soft; light/dark/system; PL/EN; standard/compact.

## Automated regression matrix

| Dimension | Values | Check |
| --- | --- | --- |
| Theme | Palarnia / Kawiarnia / Soft | CSS token consistency; states selected, pressed, disabled |
| Color mode | Light / dark / system | contrast and platform scheme switching |
| Language | Polish / English | no cut-off translations; correct button labels |
| Density | Standard / compact | readable text and actionable controls |
| Width | 320 / 375 / 390 / 430 CSS px | no horizontal overflow and no overlapping sticky controls |
| Critical screens | Coffee / Brewing / Equipment / History | primary action visible and route accessible |

Existing `tests/mobile.cjs` already covers a major part of the responsive matrix; `tests/features.cjs` checks theme/day-night and selected controls. Reuse those rather than building redundant tests.

## Manual iPhone audit (required before production release)

| ID | Scenario | Acceptance criterion | Evidence |
| --- | --- | --- | --- |
| UX-01 | New user begins first espresso | Can choose method, grinder and brewing flow without explanation | Screen recording |
| UX-02 | Brewer handles timer with one hand | Start / pause / resume / reset discoverable and large enough for reliable touch | Screen recording |
| UX-03 | Settings changed while brewing | Timer and brewing values remain intact | Before/after screenshots |
| UX-04 | Phone locked and unlocked | Alerts and timer status match documented behavior; no false live values | Screen recording + notes |
| UX-05 | Screen reader | VoiceOver announces tabs, actions, states, warnings and dialogs meaningfully | VoiceOver session notes |
| UX-06 | Larger display text | Text remains readable without clipping or lost actions | Screenshots at large text settings |
| UX-07 | Dark mode | Functional contrast and focus/selection indicators across themes | Comparative screenshots |
| UX-08 | Invalid backup import | Error understandable; original coffee history intact | Recording plus browser test |
| UX-09 | Offline launch | Core brew flow and stored data accessible, offline status clear | Airplane-mode test |
| UX-10 | First-time empty history | Clear empty state and next action | Screenshot |

## Visual design criteria

1. Centralized spacing/typography/colors and repeatable component shapes within each theme.
2. Clear hierarchy: method choice, brew state, main timer, primary action, secondary controls.
3. WCAG 2.2 AA contrast targets: generally 4.5:1 for normal text, 3:1 for large text and essential non-text controls, with applicable exceptions.
4. Minimum effective touch target of 44x44 CSS px for major interactive controls (our product target, not a blanket legal standard).
5. Language and density changes must not erase coffee data or reset an active brew.
6. Errors and warnings must identify next recovery action, not rely on color only.
7. Visual simulation (pressure, mass, extraction) must be unambiguously distinguished from measured physical values.

## Evidence and scoring

- Provide screenshots per critical screen/theme, plus edge cases (error/empty/active timer).
- File findings with severity P0–P3, steps to reproduce, screenshot, and owner.
- Assess visual UI and UX separately; each must meet >=85% threshold with no blocking defects.
- Mark all manual iPhone checks **NOT VERIFIED** until tested on actual hardware.
- Keep theme redesigns separate from stability/security PRs.
