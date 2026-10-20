const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');const start=source.indexOf('async function apiRequest('),end=source.indexOf('\nfunction bindEvents()',start);
function api(fetch,mock=false){const ctx={Headers,FormData,AbortSignal,fetch,window:{},appState:{csrfToken:mock?'mock-csrf-token':null},showToast:()=>{}};vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);return ctx.apiRequest;}
test('HTML fallback is never treated as a successful API response',async()=>{await assert.rejects(api(async()=>new Response('<html>site</html>',{headers:{'content-type':'text/html'}}))('/api/v1/test'),/webpage instead of data/);});
test('API validation messages reach the form',async()=>{await assert.rejects(api(async()=>new Response(JSON.stringify({message:'Email already exists'}),{status:400,headers:{'content-type':'application/json'}}))('/api/v1/test'),/Email already exists/);});
test('unknown demo action cannot claim it saved a record',async()=>{await assert.rejects(api(async()=>{},true)('/api/v1/unknown'),/No changes were saved/);});
test('empty 204 response remains valid',async()=>{assert.equal(await api(async()=>new Response(null,{status:204}))('/api/v1/test'),null);});
