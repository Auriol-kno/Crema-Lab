// Verifies compatible older backup files really restore (not just pass a JSON validator).
const {chromium}=require('@playwright/test');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const url='http://127.0.0.1:4177/Crema-Lab/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4177','--strictPort'],{stdio:'pipe'});
let browser;
(async()=>{
  for(let i=0;i<60;i++){
    try{if((await fetch(url)).ok)break;}catch{}
    if(i===59)throw Error('Preview did not start');
    await new Promise(r=>setTimeout(r,250));
  }
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}: {})});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(url);
  await page.locator('#tabs button').first().waitFor({state:'attached'});
  const original={
    method:'espresso',
    params:{espresso:{dose:19,ratio:2,temp:94,grind:3.8}},
    lelit:{dial:5.5,time:8,rate:2.4,fineLower:true},
    hist:[]
  };
  const legacy={app:'Crema Lab',version:1,data:{
    'cremalab.iphone.v3':null,
    'cremalab.iphone.v2':JSON.stringify(original),
    'cremalab.theme':'palarnia'
    // v1 backup: preference, coffee and photo keys did not exist yet
  }};
  await page.locator('nav button').nth(3).click();
  await page.locator('.backup summary').click();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('.backup input[type="file"]').setInputFiles({
    name:'crema-legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))
  });
  await page.waitForFunction(()=>localStorage.getItem('cremalab.iphone.v2')!==null);
  await page.waitForTimeout(400);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('cremalab.iphone.v2')||'null'));
  assert.deepEqual(stored,original,'legacy data was not retained');
  await page.reload();
  await page.locator('#tabs button').first().waitFor({state:'attached'});
  const active=await page.evaluate(()=>{
    const raw=JSON.parse(localStorage.getItem('cremalab.iphone.v3')||'null');
    return raw?.params?.espresso?.dose??null;
  });
  assert.equal(active,19,'legacy dose was lost during automatic v2-to-v3 migration');
  await page.reload();
  await page.locator('#tabs button').first().waitFor({state:'attached'});
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('cremalab.iphone.v3')).params.espresso.dose),19,'legacy dose did not persist after another reload');
  assert.equal(await page.locator('#tabs button').count(),6,'app did not boot after legacy restore');
  console.log('PASS: restore of legacy v2 backup without newer optional keys');
})().catch(err=>{console.error(err);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill('SIGTERM');});
