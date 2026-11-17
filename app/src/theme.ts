export const appThemes = { cafe:'#FAF1E5', bar:'#14100F', studio:'#101126' };
export type Theme = keyof typeof appThemes;
export const appThemeKey = 'cremalab.theme';
export function applyAppTheme(value: string | null) {
 const theme: Theme = value && value in appThemes ? value as Theme : 'cafe';
 document.documentElement.dataset.theme = theme;
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content', appThemes[theme]);
}
try { applyAppTheme(localStorage.getItem(appThemeKey)); } catch { applyAppTheme('cafe'); }
