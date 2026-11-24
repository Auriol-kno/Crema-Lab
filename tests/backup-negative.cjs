// Quality Gate: negative backup-import cases. Uses a real browser and the built Vite preview.
const { chromium } = require('@playwright/test');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const url = 'http://127.0.0.1:4175/Crema-Lab/';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { stdio: 'pipe' });
let browser;
const errors = [];
server.stderr.on('data', data => errors.push(String(data)));
(async () => {
  for(let i=0;i<60;i++) {
    try { if((await fetch(url)).ok) break; } catch {}
    if(i===59) throw new Error('Preview did not start: '+errors.join(''));
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}: {})});
  const page=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.locator('#tabs button').first().waitFor({state:'attached'});
  // Fresh installs may not yet have an engine snapshot: seed a realistic persisted state.
  await page.evaluate(()=>{
    localStorage.setItem('cremalab.iphone.v3',JSON.stringify({
      method:'espresso',params:{espresso:{dose:18,ratio:2,temp:93,grind:3.6}},
      lelit:{dial:5.5,time:7.2,rate:2.5,fineLower:true},hist:[]
    }));
  });
  await page.reload();
  await page.locator('#tabs button').first().waitFor({state:'attached'});
  await page.locator('nav button').nth(3).click();
  await page.locator('.backup summary').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.backup-actions button').first().click()]);
  const valid=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
  assert.equal(valid.app,'Crema Lab');
  const snapshot=()=>page.evaluate(()=>Object.fromEntries(['cremalab.iphone.v3','cremalab.iphone.v2','cremalab.theme','cremalab.preferences.v1','cremalab.coffees.v1','cremalab.photos.v1'].map(k=>[k,localStorage.getItem(k)])));
  const before=await snapshot();
  let confirmCount=0;
  let acceptDialogs=false;
  page.on('dialog',async dialog=>{confirmCount++;if(acceptDialogs)await dialog.accept();else await dialog.dismiss();});
  const modifiedEngine=(edit)=>{
    const engine=JSON.parse(valid.data['cremalab.iphone.v3']);
    edit(engine);
    return JSON.stringify({...valid,data:{...valid.data,'cremalab.iphone.v3':JSON.stringify(engine)}});
  };
  const cases=[
    ['invalid JSON', '{not json'],
    ['wrong application', JSON.stringify({...valid,app:'Other App'})],
    ['wrong version', JSON.stringify({...valid,version:999})],
    ['missing data', JSON.stringify({...valid,data:null})],
    ['invalid theme', JSON.stringify({...valid,data:{...valid.data,'cremalab.theme':'unknown'}})],
    ['bad preferences', JSON.stringify({...valid,data:{...valid.data,'cremalab.preferences.v1':JSON.stringify({theme:'broken',density:'standard',language:'pl',mode:'system'})}})],
    ['invalid method', modifiedEngine(engine=>{engine.method='invalid';})],
    ['malformed coffee store', JSON.stringify({...valid,data:{...valid.data,'cremalab.coffees.v1':'{bad'}})],
    ['negative espresso dose', modifiedEngine(engine=>{engine.params.espresso.dose=-15;})],
    ['enormous grinder rate', modifiedEngine(engine=>{engine.lelit.rate=1e100;})],
    ['non-numeric grinder dial', modifiedEngine(engine=>{engine.lelit.dial='5.5';})],
    ['prototype pollution payload', modifiedEngine(engine=>{engine.lelit=JSON.parse('{"dial":5.5,"time":7.2,"rate":2.5,"__proto__":{"isAdmin":true}}');})]
  ];
  for(const [name,payload] of cases){
    await page.reload();
    await page.locator('nav button').nth(3).click();
    await page.locator('.backup summary').click();
    const currentDialogs=confirmCount;
    await page.locator('.backup input[type="file"]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(payload)});
    await page.getByRole('status').filter({hasText:/Nie można wczytać kopii/}).waitFor({state:'visible'});
    assert.equal(confirmCount,currentDialogs,'invalid backup unexpectedly requested confirmation: '+name);
    assert.deepEqual(await snapshot(),before,'invalid backup modified stored data: '+name);
  }
  // Simulate a one-off storage write failure after the first imported key changed.
  // Existing data should be restored, not left partially replaced.
  await page.reload();
  await page.locator('nav button').nth(3).click();
  await page.locator('.backup summary').click();
  const original=await snapshot();
  const changed=modifiedEngine(engine=>{engine.params.espresso.dose=19;});
  await page.evaluate(()=>{
    const originalSet=Storage.prototype.setItem, originalRemove=Storage.prototype.removeItem;
    let injected=false;
    Storage.prototype.setItem=function(key,value){
      if(key==='cremalab.theme'&&!injected){injected=true;throw new Error('Simulated storage failure');}
      return originalSet.call(this,key,value);
    };
    Storage.prototype.removeItem=function(key){
      if(key==='cremalab.theme'&&!injected){injected=true;throw new Error('Simulated storage failure');}
      return originalRemove.call(this,key);
    };
  });
  acceptDialogs=true;
  await page.locator('.backup input[type="file"]').setInputFiles({
    name:'write-failure.json',mimeType:'application/json',buffer:Buffer.from(changed)
  });
  await page.getByRole('status').filter({hasText:/Nie można wczytać kopii/}).waitFor({state:'visible'});
  assert.deepEqual(await snapshot(),original,'partial import changed existing data after transient storage error');
  acceptDialogs=false;
  assert.deepEqual(errors,[],'page runtime errors');
  console.log('PASS: 12 invalid backup cases and transient storage write failure preserve existing data');
})().catch(err=>{console.error(err);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill('SIGTERM');});
