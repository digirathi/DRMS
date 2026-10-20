const {test}=require('node:test');const assert=require('node:assert/strict');const http=require('node:http');const {createServer}=require('../server');
test('preview serves public files and refuses API, source and traversal requests',async()=>{
 const server=createServer({filename:':memory:'});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 const request=(path,method='GET')=>new Promise((resolve,reject)=>{const req=http.request({host:'127.0.0.1',port,path,method},res=>{let body='';res.on('data',x=>body+=x);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));});req.on('error',reject);req.end();});
 try{for(const path of ['/','/professional.css','/preferences.js','/interface.js','/payroll.js'])assert.equal((await request(path)).status,200,path);
 for(const path of ['/server.js','/package.json','/tests/server.test.cjs','/missing.js'])assert.equal((await request(path)).status,404,path);
 for(const path of ['/%2e%2e/server.js','/.env','/assets/..%5cserver.js'])assert.equal((await request(path)).status,403,path);
 assert.equal((await request('/%ZZ')).status,400);assert.equal((await request('/','POST')).status,405);
 const api=await request('/api/v1/auth/me');assert.equal(api.status,401);assert.equal(JSON.parse(api.body).success,false);assert.match(api.headers['content-type'],/json/);
 const head=await request('/','HEAD');assert.equal(head.status,200);assert.equal(head.body,'');
 }finally{await new Promise(r=>server.close(r));}
});
