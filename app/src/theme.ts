export const appThemes = { palarnia:'#F5EEE2', cafe:'#FAF1E5', bar:'#171614', studio:'#101126' };
export type Theme = keyof typeof appThemes;
export const appThemeKey = 'cremalab.theme';
export function applyAppTheme(value: string | null) {
 const theme: Theme = value && Object.prototype.hasOwnProperty.call(appThemes,value) ? value as Theme : 'palarnia';
 document.documentElement.dataset.theme = theme;
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content', appThemes[theme]);
}
// Apply the requested art direction once. Subsequent user theme choices persist.
try {
 if(localStorage.getItem('cremalab.palarnia-design')!=='1') {
  localStorage.setItem(appThemeKey,'palarnia');
  localStorage.setItem('cremalab.palarnia-design','1');
 }
 applyAppTheme(localStorage.getItem(appThemeKey));
} catch { applyAppTheme('palarnia'); }
