const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root=path.join(__dirname,'..');
let checks=0;
function ok(value,msg){assert.ok(value,msg);checks++;}
function eq(actual,expected,msg){assert.equal(actual,expected,msg);checks++;}
function page(rel){
 const html=fs.readFileSync(path.join(root,rel),'utf8');
 const els={};
 for(const m of html.matchAll(/<input\b([^>]+)>/g)){
  const id=m[1].match(/\bid="([^"]+)"/)[1];
  els[id]={value:m[1].match(/\bvalue="([^"]*)"/)?.[1]||'',textContent:'',addEventListener(){}};
 }
 const document={getElementById(id){return els[id]??=( {textContent:'',value:'',addEventListener(){}} );}};
 const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
 const ctx=vm.createContext({document,Intl,Number,Math,Object});
 if(script)vm.runInContext(script,ctx);
 return {html,els,run(values){for(const [id,v]of Object.entries(values))document.getElementById(id).value=String(v);vm.runInContext(rel==='index.html'?'calc()':'update()',ctx);return rel==='index.html'?[els.time.textContent,els.details.textContent]:[els.label.textContent,els.answer.textContent,els.detail.textContent];}};
}
let p=page('index.html');
eq(p.run({goal:1000,start:100,monthly:150,rate:0})[0],'6 mos','saving without interest');
eq(p.run({goal:1000,start:1000})[0],'Goal reached!','already reached');
ok(p.run({goal:1000,start:0,monthly:0,rate:5})[0].includes('Not reached'),'zero capital cannot grow');
ok(p.run({start:'',monthly:150})[0].includes('Check'),'blank start rejected');
ok(p.run({start:0,monthly:-1})[0].includes('Check'),'negative contribution rejected');
eq(p.run({goal:121,start:100,monthly:0,rate:120})[0],'Check your inputs','rate limit');
eq(p.run({goal:121,start:100,monthly:0,rate:12})[0],'1 yr 8 mos','interest-only whole-month crossing');
p=page('emergency-fund/index.html');
eq(p.run({monthly:2400,months:3,saved:1200})[1],'$7,200.00','emergency target');
eq(p.run({monthly:2400,months:3,saved:9000})[2],'Remaining to save: $0.00','no negative gap');
ok(p.run({months:121})[0].includes('Check'),'coverage bound');
p=page('debt-payoff/index.html');
eq(p.run({balance:1000,apr:0,payment:300})[1],'4 months','reduced final payment');
eq(p.run({balance:1000,apr:0,payment:300})[2],'Estimated interest: $0.00','no overpayment');
eq(p.run({balance:1200,apr:12,payment:12})[0],'Payment too low','interest-only payment');
eq(p.run({balance:1200,apr:12,payment:100})[1],'13 months','classroom debt example');
eq(p.run({balance:0,apr:12,payment:0})[1],'0 months','zero debt');
eq(p.run({balance:0.01,apr:0,payment:0.01})[1],'1 month','small final payment');
ok(p.run({balance:1000,apr:0,payment:0})[0].includes('too low'),'zero payment rejected');
p=page('compound-interest/index.html');
eq(p.run({principal:1000,monthly:100,rate:0,years:1})[1],'$2,200.00','compound zero rate');
const reference=1000*(1.005)**12+100*(((1.005)**12-1)/0.005);
eq(p.run({principal:1000,monthly:100,rate:6,years:1})[1],new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(reference),'compound matches independent annuity formula');
eq(p.run({years:0})[1],'$1,000.00','zero time');
ok(p.run({years:101})[0].includes('Check'),'time bound');
p=page('christmas-savings/index.html');
eq(p.run({budget:600,saved:150,weeks:9})[1],'$50.00','weekly plan');
eq(p.run({budget:100,saved:0,weeks:3})[1],'$33.34','round up avoids savings shortfall');
eq(p.run({budget:100,saved:200,weeks:3})[1],'$0.00','already saved enough');
ok(p.run({weeks:1.5})[0].includes('Check'),'fractional deposit count rejected');
ok(p.run({weeks:0})[0].includes('Check'),'zero weeks rejected');
p=page('budget-percentages/index.html');
eq(p.run({income:4000,housing:1200,food:600,transport:500,other:2000})[0],'Over income by','overspending label');
eq(p.run({income:4000,housing:1200,food:600,transport:500,other:2000})[1],'$300.00','overspending amount');
ok(p.run({income:4000,housing:1200,food:600,transport:500,other:1700})[2].includes('Housing: 30.0%'),'percentage');
ok(p.run({income:0})[0].includes('Check'),'zero denominator rejected');
p=page('grocery-budget/index.html');
eq(p.run({monthly:780,people:3})[1],'$180.00','weekly conversion');
ok(p.run({monthly:780,people:3})[2].includes('$260.00'),'per person');
ok(p.run({people:0})[0].includes('Check'),'zero household rejected');
ok(p.run({people:1.5})[0].includes('Check'),'fractional household rejected');
const pages=['index.html',...['emergency-fund','debt-payoff','compound-interest','christmas-savings','budget-percentages','grocery-budget','learning-activities'].map(d=>`${d}/index.html`)];
const base='https://everydollargrows.github.io/everydollargrows-financial-tools/';
const titles=new Set,descriptions=new Set;
for(const rel of pages){
 const p=page(rel),url=base+(rel==='index.html'?'':rel.replace('index.html',''));
 eq((p.html.match(/<link rel="canonical"/g)||[]).length,1,`${rel} one canonical`);
 ok(p.html.includes(`rel="canonical" href="${url}"`),`${rel} self canonical`);
 ok(!/noindex/i.test(p.html),`${rel} no noindex`);
 ok(p.html.includes('name="viewport"'),`${rel} viewport`);
 ok(p.html.includes('min(100%,230px)'),`${rel} shrinking grid`);
 ok(p.html.includes(':focus-visible'),`${rel} visible focus`);
 ok(p.html.includes('class="skip"'),`${rel} skip link`);
 titles.add(p.html.match(/<title>(.*?)<\/title>/)[1]);descriptions.add(p.html.match(/name="description" content="([^"]+)"/)[1]);
 for(const a of p.html.matchAll(/href="([^"]+)"/g)){
  if(/^(https?:|#)/.test(a[1]))continue;
  const u=new URL(a[1],url);ok(u.pathname.startsWith('/everydollargrows-financial-tools/'),'stay in project');
  const local=u.pathname.replace('/everydollargrows-financial-tools/','');
  ok(fs.existsSync(path.join(root,local.endsWith('/')?local+'index.html':local)),`internal link ${a[1]}`);
 }
 if(rel!=='learning-activities/index.html'){
  const first=Object.keys(p.els)[0];
  ok(p.run({[first]:''}).join(' ').includes('Check'),`${rel} blank rejected`);
  ok(p.run({[first]:'Infinity'}).join(' ').includes('Check'),`${rel} nonfinite rejected`);
  ok(p.run({[first]:1e99}).join(' ').includes('Check'),`${rel} magnitude rejected`);
 }
}
eq(titles.size,8,'unique titles');eq(descriptions.size,8,'unique descriptions');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
eq((sitemap.match(/<loc>/g)||[]).length,8,'eight sitemap resources');
for(const rel of pages)ok(sitemap.includes(base+(rel==='index.html'?'':rel.replace('index.html',''))),'sitemap canonical included');
console.log(`${checks} regression checks passed: seven calculators, edge cases, metadata and navigation.`);
