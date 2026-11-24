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
  await page.locator('nav button').nth(3).click();
  await page.locator('.backup summary').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.backup-actions button').first().click()]);
  const valid=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
  assert.equal(valid.app,'Crema Lab');
  const snapshot=()=>page.evaluate(()=>Object.fromEntries(['cremalab.iphone.v3','cremalab.iphone.v2','cremalab.theme','cremalab.preferences.v1','cremalab.coffees.v1','cremalab.photos.v1'].map(k=>[k,localStorage.getItem(k)])));
  const before=await snapshot();
  let confirmCount=0;
  page.on('dialog',async dialog=>{confirmCount++;await dialog.dismiss();});
  const cases=[
    ['invalid JSON', '{not json'],
    ['wrong application', JSON.stringify({...valid,app:'Other App'})],
    ['wrong version', JSON.stringify({...valid,version:999})],
    ['missing data', JSON.stringify({...valid,data:null})],
    ['invalid theme', JSON.stringify({...valid,data:{...valid.data,'cremalab.theme':'unknown'}})],
    ['bad preferences', JSON.stringify({...valid,data:{...valid.data,'cremalab.preferences.v1':JSON.stringify({theme:'broken',density:'standard',language:'pl',mode:'system'})}})],
    ['invalid method', JSON.stringify({...valid,data:{...valid.data,'cremalab.iphone.v3':JSON.stringify({method:'invalid',params:{},lelit:{}})}})],
    ['malformed coffee store', JSON.stringify({...valid,data:{...valid.data,'cremalab.coffees.v1':'{bad'}})],
    ['negative espresso dose', JSON.stringify({...valid,data:{...valid.data,'cremalab.iphone.v3':JSON.stringify({...JSON.parse(valid.data['cremalab.iphone.v3']),params:{...JSON.parse(valid.data['cremalab.iphone.v3']).params,espresso:{...JSON.parse(valid.data['cremalab.iphone.v3']).params.espresso,dose:-15}}})}})],
    ['enormous grinder rate', JSON.stringify({...valid,data:{...valid.data,'cremalab.iphone.v3':JSON.stringify({...JSON.parse(valid.data['cremalab.iphone.v3']),lelit:{...JSON.parse(valid.data['cremalab.iphone.v3']).lelit,rate:1e100}})}})],
    ['non-numeric grinder dial', JSON.stringify({...valid,data:{...valid.data,'cremalab.iphone.v3':JSON.stringify({...JSON.parse(valid.data['cremalab.iphone.v3']),lelit:{...JSON.parse(valid.data['cremalab.iphone.v3']).lelit,dial:'5.5'}})}}]
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
  assert.deepEqual(errors,[],'page runtime errors');
  console.log('PASS: 11 invalid backup cases rejected without confirmation or storage mutation');
})().catch(err=>{console.error(err);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill('SIGTERM');});
