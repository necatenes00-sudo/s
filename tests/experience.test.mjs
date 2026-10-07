import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const base=process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
await test('Routes, filters, services, enquiry download, film and mobile navigation',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/','/projects/','/services/','/about/','/contact/','/projects/limon/','/projects/seyban-performance/','/projects/ciger-tarim/','/projects/demir-digital/']) {
  const response=await page.goto(base+route);assert.equal(response.status(),200,route);assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route);
 }
 await page.goto(base+'/projects/');await page.getByRole('button',{name:'Hospitality',exact:true}).click();assert.equal(await page.locator('.interior-project-grid > .interior-project').count(),1);
 await page.goto(base+'/services/');assert.equal(await page.locator('.interior-service').count(),7);await page.locator('.interior-service').first().getByRole('button').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.interior-service').first().getByRole('button').getAttribute('aria-expanded'),'true');
 await page.goto(base+'/contact/');await page.getByRole('button',{name:'Prepare enquiry'}).click();assert.equal(await page.locator('[aria-invalid="true"]').count(),7);
 await page.locator('[name="name"]').fill('Test Name');await page.locator('[name="company"]').fill('Test Studio');await page.locator('[name="email"]').fill('test@example.com');
 for(const field of ['projectType','budget','timeline'])await page.locator(`[name="${field}"]`).selectOption({index:1});await page.locator('[name="details"]').fill('A distinctive digital experience for our independent creative studio.');await page.getByRole('button',{name:'Prepare enquiry'}).click();assert.match(await page.getByRole('link',{name:'Open email app'}).getAttribute('href'),/^mailto:/);const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download project brief'}).click();assert.equal((await download).suggestedFilename(),'demir-digital-project-brief.txt');
 await page.goto(base+'/');await page.getByRole('button',{name:'Play Demir Digital design study film'}).click();await page.waitForFunction(()=>document.querySelector('video')?.currentTime>0);await page.getByRole('button',{name:'Close showreel'}).click();assert.equal(await page.locator('dialog').getAttribute('open'),null);
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation',{name:'Expanded navigation'}).getByRole('link',{name:/Contact/}).click();await page.waitForURL('**/contact/**');assert.equal(await page.locator('main h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.setViewportSize({width:320,height:740});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);await page.close();
});
await test('WebGL and scroll-driven hero operate in full-motion mode',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(base+'/');await page.waitForSelector('[data-renderer="webgl"]',{timeout:20000});await page.waitForTimeout(2500);assert.ok(await page.locator('.pin-spacer').count()>0);await page.evaluate(()=>window.scrollTo(0,700));await page.waitForTimeout(1200);const opacity=await page.locator('.hero-line-a').evaluate(el=>getComputedStyle(el).opacity);assert.ok(Number(opacity)<1);await page.close();
});
}finally{await browser.close();}
