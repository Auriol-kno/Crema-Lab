export type Theme = 'palarnia' | 'sage' | 'soft';
export type Density = 'standard' | 'compact';
export type Language = 'pl' | 'en';
export interface Preferences { theme:Theme; density:Density; language:Language }
const key='cremalab.preferences.v1';
const themes:Theme[]=['palarnia','sage','soft'];
export const readPreferences=():Preferences=>{try{const p=JSON.parse(localStorage.getItem(key)||'{}');return {theme:themes.includes(p.theme)?p.theme:'palarnia',density:p.density==='compact'?'compact':'standard',language:p.language==='en'?'en':'pl'};}catch{return {theme:'palarnia',density:'standard',language:'pl'};}};
export function applyPreferences(p:Preferences){const root=document.documentElement;root.dataset.theme=p.theme;root.dataset.density=p.density;root.lang=p.language;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',{palarnia:'#F5EEE2',sage:'#EDF0E2',soft:'#E7E7E5'}[p.theme]);}
export function savePreferences(p:Preferences){applyPreferences(p);try{localStorage.setItem(key,JSON.stringify(p));}catch{}window.dispatchEvent(new CustomEvent('crema:preferences',{detail:p}));}
applyPreferences(readPreferences());
