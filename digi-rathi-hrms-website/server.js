const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const ROOT = __dirname;
const {createBackend}=require('./backend');
const {createSupabaseProxy,loadSupabaseEnvironment}=require('./supabase-proxy'),{createMailer}=require('./mailer');
const TYPES = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
const PUBLIC = new Set(['index.html','app.js','workflows.js','payroll.js','styles.css','professional.css','preferences.js','interface.js','domain.js','modules.js','attendance-workflow.js','payroll-workflow.js','dates.js','modules.css','workplace.js','workplace.css','employee-domain.js','employee-workspace.js','employee-workspace.css','employee-payroll.js','employee-payroll.css','attendance-policy.js','attendance-policy-ui.js','attendance-policy.css','local-backend-ui.js','notifications-ui.js','notifications.css','supabase-ui.js','supabase.css']);
async function handleRequest(req,res,backend) {
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-cache');
  const reply=(code,message)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({success:false,message}));};
  if(req.url.split('?')[0].startsWith('/api/')){await backend.handle(req,res);return;}
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');reply(405,'Method not allowed.');return;}
  let pathname;try{pathname=decodeURIComponent(req.url.split('?')[0]);}catch{reply(400,'Invalid URL.');return;}
  if(pathname.startsWith('/api/')){reply(400,'Use the API path without encoded route characters.');return;}
  if(pathname.includes('\0')||pathname.includes('\\')||pathname.split('/').some(p=>p==='..'||p.startsWith('.'))){reply(403,'Access denied.');return;}
  let relative=pathname.replace(/^\/+/, '')||'index.html';if(!path.extname(relative))relative='index.html';
  if(!PUBLIC.has(relative)&&!relative.startsWith('assets/')){reply(404,'File not found.');return;}
  const file=path.resolve(ROOT,relative);if(!file.startsWith(ROOT+path.sep)){reply(403,'Access denied.');return;}
  const type=TYPES[path.extname(file).toLowerCase()];if(!type){reply(404,'File not found.');return;}
  try{const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':type,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);}catch{reply(404,'File not found.');}
}
function createServer(options={}){const cloud=options.provider==='supabase'||options.filename===undefined&&process.env.HRMS_BACKEND==='supabase';const backend=cloud?createSupabaseProxy({...options,mailer:options.mailer||createMailer()}):createBackend(options);const server=http.createServer((req,res)=>handleRequest(req,res,backend).catch(()=>{if(!res.headersSent)res.writeHead(500);res.end('Server error');}));server.on('listening',()=>{if(options.runJobs===true||options.filename===undefined&&options.runJobs!==false)backend.startJobs();});server.on('close',()=>backend.close());return server;}
if(require.main===module){require('./mailer').loadMailEnvironment();loadSupabaseEnvironment();const port=Number(process.env.PORT||4174),host=process.env.HOST||'127.0.0.1';const server=createServer();server.on('error',e=>{console.error(`Cannot start HRMS preview: ${e.message}`);process.exitCode=1;});server.listen(port,host,()=>console.log(`HRMS frontend: http://${host}:${port}`));}
module.exports={createServer,handleRequest};
