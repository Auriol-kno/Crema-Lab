// Palarnia is the only supported visual theme. Normalize older saved themes
// without touching brewing settings, calibration or history.
export const appThemeKey = 'cremalab.theme';
document.documentElement.dataset.theme = 'palarnia';
document.querySelector('meta[name="theme-color"]')?.setAttribute('content','#F5EEE2');
try { localStorage.setItem(appThemeKey,'palarnia'); } catch { /* storage can be unavailable */ }
