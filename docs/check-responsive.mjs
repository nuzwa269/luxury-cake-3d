import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_PATH+'/index.mjs'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
const output='docs/previews/responsive';fs.mkdirSync(output,{recursive:true});
const audit=()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,clippedText:[...document.querySelectorAll('h1,h2,h3,p,a,button,summary')].filter(e=>e.clientWidth && e.scrollWidth>e.clientWidth+2).map(e=>({text:e.textContent,cls:e.className,width:e.clientWidth,scroll:e.scrollWidth})),brokenImages:[...document.images].filter(e=>e.complete&&!e.naturalWidth).map(e=>e.src)});
for(const [width,height] of [[375,812],[390,844],[768,1024],[1440,900]]) {
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<=900,isMobile:width<600,reducedMotion:'no-preference'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TEST_URL||'http://localhost:3000');await page.evaluate(()=>document.fonts.ready);
 await page.locator('[data-scene-state="ready"]').waitFor({timeout:60000});await page.waitForTimeout(1600);
 const checks=[];
 await page.screenshot({path:`${output}/after-${width}-hero.png`});
 if(width<=900){
  const toggle=page.getByRole('button',{name:'Open navigation'});const heroTop=await page.locator('.hero').evaluate(e=>e.getBoundingClientRect().top);
  await toggle.click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('.hero').evaluate(e=>e.getBoundingClientRect().top),heroTop,'Menu must not shift content');
  await page.screenshot({path:`${output}/after-${width}-menu.png`});
  await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');assert(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement));
  await toggle.click();await page.locator('#mobile-nav a[href="#collection"]').click();await page.waitForTimeout(700);assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  const anchor=await page.locator('#collection').evaluate(e=>e.getBoundingClientRect().top);assert(anchor>=78&&anchor<115,`Anchor hidden or misaligned: ${anchor}`);
  checks.push('Menu opens without layout shift; Escape restores focus; section navigation closes menu and clears sticky header');
 }
 for(const [name,selector] of [['collection','.collection'],['product','.product-card'],['craft','.craft-grid'],['cocoa','.ingredient-cocoa'],['hazelnut','.ingredient-hazelnut'],['cream','.ingredient-cream'],['glaze','.ingredient-glaze'],['story','.story-section'],['cta','.final-cta'],['footer','.site-footer']]){
  await page.locator(selector).first().evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-96));await page.waitForTimeout(1700);
  const m=await page.evaluate(audit);assert(m.scrollWidth<=width,`${width} overflow at ${name}`);assert.deepEqual(m.clippedText,[],`${width} clipped text at ${name}`);
  await page.screenshot({path:`${output}/after-${width}-${name}.png`});
 }
 for(const details of await page.locator('.product-details').all()){
  await details.locator('summary').click();await page.waitForTimeout(250);assert(await details.evaluate(e=>e.open));assert((await page.evaluate(audit)).scrollWidth<=width);await details.locator('summary').click();
 }
 checks.push('All sections scrolled and checked; tasting notes expand and collapse');
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(800);
 const reduced=await page.evaluate(audit);assert(reduced.scrollWidth<=width);assert.deepEqual(reduced.clippedText,[]);
 await page.screenshot({path:`${output}/after-${width}-reduced.png`});
 // Decode lazy images before the full-page reference screenshot.
 await page.evaluate(async()=>{await Promise.all([...document.images].map(async img=>{img.loading='eager';try{await img.decode();}catch{}}));});
 await page.screenshot({path:`${output}/after-${width}-full.png`,fullPage:true});
 assert.deepEqual(errors,[]);results.push({width,height,checks,...await page.evaluate(audit),errors});await page.close();console.log(`Passed ${width}x${height}`);
}
// Resize an open menu across the desktop boundary and back.
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto(process.env.TEST_URL||'http://localhost:3000');await page.getByRole('button',{name:'Open navigation'}).click();await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(250);await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
for(const [width,height] of [[320,568],[844,390],[1024,768],[1920,1080]]){await page.setViewportSize({width,height});await page.waitForTimeout(200);const m=await page.evaluate(audit);assert(m.scrollWidth<=width,`Overflow at extra width ${width}`);assert.deepEqual(m.clippedText,[],`Clipped text at extra width ${width}`);results.push({width,height,...m});}
fs.writeFileSync(`${output}/results.json`,JSON.stringify(results,null,2));await browser.close();
