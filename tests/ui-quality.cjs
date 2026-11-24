// Crema Lab Quality Gate: narrow-phone keyboard/touch/navigation smoke tests.
// These tests supplement, but do not replace, physical iPhone VoiceOver review.
const {chromium}=require('@playwright/test');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const url='http://127.0.0.1:4176/Crema-Lab/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4176','--strictPort'],{stdio:'pipe'});
let browser;
(async()=>{
  for(let i=0;i<60;i++){
    try{if((await fetch(url)).ok)break;}catch{}
    if(i===59)throw new Error('Preview did not start');
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}: {})});
  const page=await browser.newPage({viewport:{width:320,height:844},reducedMotion:'reduce'});
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(url);
  await page.locator('nav button').first().waitFor({state:'visible'});
  const size=async loc=>loc.evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height};});
  for(const theme of ['palarnia','bar','soft'])
  for(const language of ['pl','en'])
  for(const density of ['standard','compact']){
    await page.locator('#settingsBtn').click();
    await page.locator('#appTheme').selectOption(theme);
    await page.locator('#appLanguage').selectOption(language);
    await page.locator('#appDensity').selectOption(density);
    await page.locator('#settingsDialog button[type=submit]').click();
    assert.equal(await page.locator('html').getAttribute('lang'),language);
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
    assert.equal(await page.locator('html').getAttribute('data-density'),density);
    const criticalType=await page.evaluate(()=>{
      const px=selector=>{
        const el=document.querySelector(selector);
        return el?parseFloat(getComputedStyle(el).fontSize):null;
      };
      return {nav:px('.bottom-nav button'),tile:px('.tile>div'),preset:px('.presets button small')};
    });
    assert(criticalType.nav>=11,'navigation labels too small: '+theme+'/'+language+'/'+density);
    if(criticalType.tile!==null) assert(criticalType.tile>=11,'coffee parameter labels too small: '+theme+'/'+language+'/'+density);
    if(criticalType.preset!==null) assert(criticalType.preset>=11,'preset supporting labels too small: '+theme+'/'+language+'/'+density);
    const settings=await size(page.locator('#settingsBtn'));
    assert(settings.width>=44&&settings.height>=44,'settings tap target too small: '+theme+'/'+language+'/'+density);
    for(let tab=0;tab<4;tab++){
      const nav=page.locator('nav button').nth(tab);
      const s=await size(nav);
      assert(s.width>=44&&s.height>=44,'navigation tap target too small: '+theme+'/'+language+'/'+density+'/'+tab);
      await nav.click();
      assert(await page.locator('#screen-title').isVisible(),'page heading missing');
      const overflow=await page.evaluate(()=>{const main=document.querySelector('.app-content');return document.documentElement.scrollWidth>innerWidth||main.scrollWidth>main.clientWidth+1;});
      assert(!overflow,'horizontal overflow at 320px: '+theme+'/'+language+'/'+density+'/'+tab);
    }
  }
  // Semantic palette contrast: opaque text/primary action colors only.
  // Translucent glass surfaces need separate screenshot/manual assessment.
  const contrast=(fg,bg)=>{
    const rgba=s=>{
      const hex=s.trim().replace(/^#/,'');
      if(/^([0-9a-f]{6})$/i.test(hex))return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));
      if(/^([0-9a-f]{3})$/i.test(hex))return [...hex].map(ch=>parseInt(ch+ch,16));
      throw new Error('Unsupported palette color '+s);
    };
    const light=s=>rgba(s).map(v=>{const x=v/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    const a=light(fg),b=light(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  };
  for(const theme of ['palarnia','bar','soft'])for(const mode of ['light','dark']){
    await page.locator('#settingsBtn').click();
    await page.locator('#appTheme').selectOption(theme);
    await page.locator('#appMode').selectOption(mode);
    await page.locator('#settingsDialog button[type=submit]').click();
    const palette=await page.evaluate(()=>{
      const style=getComputedStyle(document.documentElement);
      return Object.fromEntries(['--bg','--ink','--accent','--on-accent'].map(k=>[k,style.getPropertyValue(k).trim()]));
    });
    const body=contrast(palette['--ink'],palette['--bg']);
    const action=contrast(palette['--on-accent'],palette['--accent']);
    assert(body>=4.5,'body palette contrast below 4.5: '+theme+'/'+mode+' '+body.toFixed(2));
    assert(action>=4.5,'primary action contrast below 4.5: '+theme+'/'+mode+' '+action.toFixed(2));
  }
  await page.locator('nav button').nth(1).click();
  const main=await size(page.locator('#mainBtn'));
  assert(main.height>=44&&main.width>=44,'main brew control below target');
  assert.deepEqual(pageErrors,[],'browser runtime errors');
  console.log('PASS: 12 theme/language/density states, 6 light/dark palette checks, 4-screen navigation at 320px, touch targets and headings');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill('SIGTERM');});
