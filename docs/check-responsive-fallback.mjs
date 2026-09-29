import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_PATH+'/index.mjs'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:844,height:390},reducedMotion:'reduce'});
await page.goto(process.env.TEST_URL || 'http://localhost:3000');await page.getByRole('button',{name:'Open navigation'}).click();
const menu=await page.locator('#mobile-nav').evaluate(e=>({bottom:e.getBoundingClientRect().bottom,height:innerHeight,scroll:e.scrollHeight,client:e.clientHeight}));assert(menu.bottom<=menu.height);await page.locator('#mobile-nav a').last().scrollIntoViewIfNeeded();assert(await page.locator('#mobile-nav a').last().isVisible());
await page.close();
const fallback=await browser.newPage({viewport:{width:375,height:812},javaScriptEnabled:false});await fallback.goto(process.env.TEST_URL || 'http://localhost:3000');
await fallback.evaluate(()=>document.fonts.ready); const heading=await fallback.locator('h1').boundingBox();const visual=await fallback.locator('.cake-visual').boundingBox();assert(heading.y+heading.height<=visual.y+1,'Fallback must not cover heading');await fallback.screenshot({path:'docs/previews/responsive/after-375-no-js.png'});await browser.close();console.log('Landscape menu and no-JavaScript mobile hero passed');

