import postgres from 'npm:postgres@3.4.9';
import {createCloudBackend} from './cloud-backend.mjs';
import {createDatabase} from './postgres-adapter.mjs';
import {createNativeAuth} from './native-auth.mjs';
import {matchesHash} from './secrets.mjs';

const url=Deno.env.get('SUPABASE_URL')!;
const secretKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default;
const publishableKey=JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')||'{}').default||Deno.env.get('SUPABASE_ANON_KEY');
const sql=postgres(Deno.env.get('SUPABASE_DB_URL')!,{max:2,prepare:false,idle_timeout:20,connect_timeout:10,
 types:{numeric:{to:1700,from:[1700,20],serialize:String,parse:Number},dates:{to:1082,from:[1082],serialize:String,parse:(s:string)=>s},instants:{to:1184,from:[1184],serialize:String,parse:(s:string)=>new Date(s).toISOString()},jsonStrings:{to:3802,from:[114,3802],serialize:String,parse:(s:string)=>JSON.stringify(JSON.parse(s))}}});
const json=(status:number,value:unknown)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});

// verify_jwt is disabled only at the platform gateway: this API authenticates
// its private Node gateway token, then validates each user's Supabase Auth
// session and current employee role. No browser/service key grants HR access.
Deno.serve(async request=>{
 if(request.method!=='POST')return json(405,{success:false,message:'Method not allowed.'});
 const gatewayToken=request.headers.get('authorization')?.replace(/^Bearer /,'')||'';
 if(gatewayToken.length<40||gatewayToken.length>256)return json(401,{success:false,message:'Gateway authentication required.'});
 let connection:any,db:any;
 try{
  connection=await sql.reserve();await connection.unsafe('set search_path = hrms_private, pg_catalog');
  const [credential]=await connection.unsafe('select secret_hash from hrms_private.gateway_settings where id=1');
  if(!credential||!matchesHash(gatewayToken,credential.secret_hash))return json(401,{success:false,message:'Gateway authentication required.'});
  const raw=await request.text();if(new TextEncoder().encode(raw).length>1800000)return json(413,{success:false,message:'Request too large.'});const envelope=JSON.parse(raw);
  if(typeof envelope.path!=='string'||!envelope.path.startsWith('/api/')||!['GET','POST','PUT','DELETE','HEAD'].includes(envelope.method))return json(400,{success:false,message:'Invalid API request.'});
  const status=envelope.mailStatus||{};const mailer={status:()=>({configured:status.configured===true,sender:status.sender||null,websiteUrl:status.websiteUrl||null,issues:Array.isArray(status.issues)?status.issues:[]}),publicOrigin:status.websiteUrl?new URL(status.websiteUrl).origin:null};
  db=createDatabase(connection);const nativeAuth=createNativeAuth({url,secretKey,publishableKey,gatewayToken});
  const core=createCloudBackend({db,nativeAuth,mailer,gatewayToken});
  const req={url:envelope.path,method:envelope.method,headers:envelope.headers||{},socket:{remoteAddress:envelope.ip||'',localAddress:envelope.localAddress||'',encrypted:envelope.secure===true},async *[Symbol.asyncIterator](){yield envelope.body||'';}};
  let code=200,body='',headers:Record<string,string>={};const res={setHeader:(k:string,v:string)=>{headers[k]=v;},writeHead:(n:number,h:Record<string,string>)=>{code=n;headers={...headers,...h};},end:(v:string)=>{body=v||'';}};
  await core.handle(req,res);
  return json(200,{status:code,headers,body});
 }catch(e){console.error('HRMS request failed',{code:e?.code||'REQUEST_ERROR'});return json(503,{success:false,message:'Supabase could not complete this request. Retry shortly.'});}
 finally{if(db)await db.finish();if(connection)await connection.release();}
});
