import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { initBrewing } from './brewing';
import home from './screens/home.html?raw';
import timer from './screens/timer.html?raw';
import visual from './screens/visual.html?raw';
import grinder from './screens/grinder.html?raw';
import anna from './screens/anna.html?raw';
import service from './screens/service.html?raw';
import steps from './screens/steps.html?raw';
import rating from './screens/rating.html?raw';
import history from './screens/history.html?raw';
import overlays from './screens/overlays.html?raw';
import { Backup } from './Backup';
import espressoPhoto from './espresso.webp';
const timerSplit=timer.indexOf('<div class="actions">');
const timerReadout=timer.slice(0,timerSplit);
const timerControls=timer.slice(timerSplit);

type Screen = 'home' | 'timer' | 'equipment' | 'history' | 'rating';
type Equipment = 'grinder' | 'anna' | 'service';
interface BrewStatus { running: boolean; method: string; seconds: number }
const titles: Record<Screen,string> = {home:'Twoja codzienna kawa',timer:'Czas na dobry napar',equipment:'Twój warsztat',history:'Ostatnie filiżanki',rating:'Jak smakuje?'};
const destinations: {id: Screen; label: string; icon: string}[] = [{id:'home',label:'Kawa',icon:'coffee'},{id:'timer',label:'Parzenie',icon:'timer'},{id:'equipment',label:'Sprzęt',icon:'sliders'},{id:'history',label:'Historia',icon:'history'}];
const paths: Record<string,string> = {coffee:'M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm12 1h2a3 3 0 0 1 0 6h-2M3 22h16M8 2v3m4-3v3',timer:'M9 2h6m-3 0v3m7 0 2 2M12 9v5l3 2M21 14a9 9 0 1 1-18 0 9 9 0 0 1 18 0',sliders:'M3 6h18M3 18h18M8 3v6m8 6v6',history:'M3 4v6h6M3 10a9 9 0 1 1 1 9m8-12v6l4 2',settings:'M3 6h18M3 18h18M8 3v6m8 6v6'};
function Icon({name}: {name:string}) {return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>}
// These fixed fragments belong to the retained brewing engine. Memoization keeps
// React navigation renders from replacing its controls, live SVG or event handlers.
const BrewingPanel = memo(function BrewingPanel({html}: {html:string}) {return <div className="engine-panel" dangerouslySetInnerHTML={{__html:html}}/>});
function initialScreen(): Screen {const hash=location.hash.slice(1);return hash in titles ? hash as Screen : 'home';}
export function App() {
 const [screen,setScreen]=useState<Screen>(initialScreen);
 const [equipment,setEquipment]=useState<Equipment>('grinder');
 const [status,setStatus]=useState<BrewStatus>({running:false,method:'Espresso',seconds:0});
 const engine=useRef<ReturnType<typeof initBrewing> | null>(null);
 const main=useRef<HTMLElement>(null);
 const lastStatus=useRef('');
 const navigate=useCallback((next:string)=>{if(!(next in titles))return;const s=next as Screen;setScreen(s);if(location.hash!==`#${s}`)location.hash=s;requestAnimationFrame(()=>{main.current?.scrollTo(0,0);document.getElementById('screen-title')?.focus({preventScroll:true});});},[]);
 useLayoutEffect(()=>{
  const notify=(value:BrewStatus)=>{const stamp=`${value.running}/${value.method}/${Math.floor(value.seconds)}`;if(stamp!==lastStatus.current){lastStatus.current=stamp;setStatus(value);}};
  engine.current=initBrewing(navigate,notify);
  const change=()=>setScreen(initialScreen());window.addEventListener('hashchange',change);
  return ()=>window.removeEventListener('hashchange',change);
 },[navigate]);
 return <div className="app-shell" data-screen={screen} data-running={status.running}>
  <header className="app-header">
   <button className="brand-button" onClick={()=>navigate('home')} aria-label="Crema Lab — ekran główny"><svg className="bean-logo" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="beanCopper" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0c39f"/><stop offset=".5" stopColor="#c18660"/><stop offset="1" stopColor="#754a32"/></linearGradient></defs><ellipse cx="20" cy="20" rx="12" ry="17" transform="rotate(38 20 20)" fill="url(#beanCopper)"/><path d="M11 33C25 23 16 15 29 7" stroke="var(--bg)" strokeWidth="4" fill="none"/></svg><span>Crema <b>Lab</b></span></button>
   <span id="chip" hidden/>
   <button id="settingsBtn" className="settings-trigger" aria-label="Ustawienia" aria-haspopup="dialog"><Icon name="settings"/></button>
  </header>
  <main ref={main} className="app-content" id="app-content">
   <div className="screen-heading"><p className="overline">{screen==='home'?'ZACZNIJ OD FILIŻANKI':screen==='timer'?status.method:'CREMA LAB'}</p><h1 id="screen-title" tabIndex={-1}>{titles[screen]}</h1>{status.running&&screen!=='timer'&&<button className="live-pill" onClick={()=>navigate('timer')}><span/>Parzenie trwa · {Math.floor(status.seconds)} s →</button>}</div>
   <section hidden={screen!=='home'} aria-label="Wybór kawy" className="screen">
    <BrewingPanel html={home}/>
    <button className="wide-link" onClick={()=>{setEquipment('grinder');navigate('equipment');}}>Dostosuj dawkę i mielenie <span>→</span></button>
    <div className="home-note"><Icon name="coffee"/><p>Twój przepis, Twoje tempo.<br/><span>Ustawienia i historia zostają na tym urządzeniu.</span></p></div>
   </section>
   <section hidden={screen!=='timer'} aria-label="Parzenie" className="screen">
    <BrewingPanel html={timerReadout}/>
    <div className="espresso-stage" hidden={status.method!=='Espresso'}>
     <figure className="espresso-photo"><img src={espressoPhoto} alt="Ilustracja espresso spływającego z kolby do ceramicznej filiżanki" width="1536" height="1024" fetchPriority="high"/><figcaption>Ilustracja parzenia</figcaption></figure>
     <div className="espresso-metrics"><div><span>Filiżanka <small>· szacunek</small></span><strong id="heroMass">≈ 0 g</strong></div><div><span>Ekstrakcja <small>· symulacja</small></span><strong id="heroExtraction">≈ 0%</strong></div></div>
    </div>
    <BrewingPanel html={timerControls}/>
    <button className="wide-link" onClick={()=>engine.current?.finish()}>Zakończ i oceń kawę <span>→</span></button>
    <details className="details-card"><summary>Etapy parzenia <span>+</span></summary><BrewingPanel html={steps}/></details>
    <details className="details-card visual-details"><summary>Podgląd ekstrakcji <span>+</span></summary><p className="subtle">Wizualizacja jest symulacją, nie pomiarem z urządzenia.</p><BrewingPanel html={visual}/></details>
   </section>
   <section hidden={screen!=='equipment'} aria-label="Sprzęt i parametry" className="screen">
    <div className="segment" role="group" aria-label="Wybór sprzętu">{([{id:'grinder',label:'Młynek'},{id:'anna',label:'Lelit Anna'},{id:'service',label:'Serwis'}] as const).map(t=><button key={t.id} aria-pressed={equipment===t.id} onClick={()=>setEquipment(t.id)}>{t.label}</button>)}</div>
    <div hidden={equipment!=='grinder'}><BrewingPanel html={grinder}/></div>
    <div hidden={equipment!=='anna'}><BrewingPanel html={anna}/>{status.method!=='Espresso'&&<p className="notice">Lelit Anna jest dostępna dla espresso. Wybierz espresso na ekranie Kawa.</p>}</div>
    <div hidden={equipment!=='service'}><BrewingPanel html={service}/></div>
    <button className="wide-link" onClick={()=>navigate('timer')}>Wróć do parzenia <span>→</span></button>
   </section>
   <section hidden={screen!=='history'} aria-label="Historia kaw" className="screen"><BrewingPanel html={history}/><Backup/></section>
   <section hidden={screen!=='rating'} aria-label="Ocena kawy" className="screen"><BrewingPanel html={rating}/><button className="wide-link" onClick={()=>navigate('history')}>Zobacz historię <span>→</span></button><button className="wide-link" onClick={()=>navigate('home')}>Przygotuj kolejną kawę <span>→</span></button></section>
  </main>
  <nav className="bottom-nav" aria-label="Nawigacja główna">{destinations.map(d=><button key={d.id} aria-current={screen===d.id?'page':undefined} onClick={()=>navigate(d.id)}><span className="nav-icon"><Icon name={d.icon}/>{d.id==='timer'&&status.running&&<i/>}</span><span>{d.label}</span></button>)}</nav>
  <BrewingPanel html={overlays}/>
 </div>
}
