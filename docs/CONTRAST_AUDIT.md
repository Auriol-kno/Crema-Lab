# Crema Lab — visual/contrast review, preliminary

Date: 2026-11-24
Review basis: repository CSS and PR #11 diff. **Not an independent Codex-run review and not a physical-device certification.**

## Verified palette calculations

WCAG relative luminance and contrast ratio for `--on-accent` text on `--accent` background:

| Theme | Mode | Contrast ratio | >=4.5:1 |
| --- | --- | ---: | --- |
| Palarnia | Light | 10.12:1 | Yes |
| Palarnia | Dark | 5.45:1 | Yes |
| Kawiarnia | Light | 5.49:1 | Yes |
| Kawiarnia | Dark | 8.90:1 | Yes |
| Soft | Light | 8.37:1 | Yes |
| Soft | Dark | 8.59:1 | Yes |

Ratios are arithmetic calculations from CSS palette tokens at the revision reviewed, not measured pixel-level foreground/background contrast in a browser. They do not validate every application component.

## Review findings

**UI-01 — corrected in PR #11 (P2, confirmed by CI #33):** Compact mode overrode the navigation labels back to 10 px after the normal-mode increase to 11 px. The `appearance.css` override was adjusted. CI verification on the corrected revision is tracked in PR #11.

**UI-02 — needs evidence (P2 candidate):** Kawiarnia theme uses translucent (`--glass`) surfaces and backdrop filters; contrast should be assessed against actual rendered backgrounds including gradients, not only root palette tokens. Verify normal/selected/disabled states, in light and dark modes.

**UI-03 — needs physical-device test (P2 candidate):** Full VoiceOver reading order, Dynamic Type accessibility, safe area handling and real touch ergonomics cannot be certified by the existing Chromium viewport tests alone.

**UI-04 — design debt (P3):** Some supporting labels outside the critical navigation have 9–11 px font sizes. Treat them as candidates for manual readability review; raising all sizes indiscriminately may introduce clipping at 320 px.

## Acceptance checklist

- [x] Calculated opaque foreground/background contrast for primary accent token in six theme/mode combinations.
- [x] Confirmed compact navigation override in code and applied targeted correction.
- [ ] Confirm final CI green for the full PR revision.
- [ ] Record rendered screenshots/pixel-level contrast on translucent Kawiarnia cards.
- [ ] Test VoiceOver and text scaling on actual iPhone.
- [ ] Obtain an independent Codex review and human approval.

No quality score is assigned until the remaining evidence is collected.
