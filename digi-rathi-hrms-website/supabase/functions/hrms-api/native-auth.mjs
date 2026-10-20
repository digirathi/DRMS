import {seal,unseal} from './secrets.mjs';
export function createNativeAuth({url,secretKey,publishableKey,gatewayToken,fetcher=fetch}){
 async function request(path,{body,method='GET',token=secretKey,admin=false}={}){const r=await fetcher(url+'/auth/v1'+path,{method,headers:{apikey:admin?secretKey:publishableKey,...(token!==publishableKey?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});let data;try{data=await r.json();}catch{data={};}if(!r.ok){const e=new Error(path.startsWith('/token')?'Email or password is incorrect.':r.status===429?'Supabase rate limit reached. Retry shortly.':'Supabase authentication could not complete this action.');e.status=r.status===429?429:path.startsWith('/token')?401:400;throw e;}if(data.access_token&&!data.expires_at)data.expires_at=Math.floor(Date.now()/1000)+Number(data.expires_in||3600);return data;}
 return {
  health:async()=>{await request('/admin/users?page=1&per_page=1',{admin:true});return true;},
  seal:value=>seal(value,gatewayToken),unseal:value=>unseal(value,gatewayToken),
  async password(employee){const body={password:employee.password,email_confirm:true,app_metadata:{hrms:true}};if(employee.auth_user_id){await request('/admin/users/'+employee.auth_user_id,{method:'PUT',body,admin:true});return employee.auth_user_id;}const user=await request('/admin/users',{method:'POST',body:{...body,email:employee.email},admin:true});return user.id;},
  login:(email,password)=>request('/token?grant_type=password',{method:'POST',body:{email,password},token:publishableKey}),
  refresh:refresh_token=>request('/token?grant_type=refresh_token',{method:'POST',body:{refresh_token},token:publishableKey}),
  verify:accessToken=>request('/user',{token:accessToken}),
  logout:async accessToken=>{try{await request('/logout?scope=local',{method:'POST',token:accessToken});}catch{}},
  recover:(email,redirectTo)=>request('/recover?redirect_to='+encodeURIComponent(redirectTo),{method:'POST',body:{email},token:publishableKey}),
  async signedImage(bucket,path){if(!path)return null;const r=await fetcher(url+'/storage/v1/object/sign/'+bucket+'/'+path.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{apikey:secretKey,Authorization:'Bearer '+secretKey,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:1800})});if(!r.ok)return null;const result=await r.json();return result.signedURL?url+'/storage/v1'+result.signedURL:null;},
  async uploadImage(bucket,path,bytes,mime){const r=await fetcher(url+'/storage/v1/object/'+bucket+'/'+path.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{apikey:secretKey,Authorization:'Bearer '+secretKey,'Content-Type':mime,'x-upsert':'false'},body:bytes});if(!r.ok)throw Object.assign(Error('Image upload could not be saved.'),{status:400});return path;}
 };
}
