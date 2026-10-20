import {Buffer} from 'node:buffer';
import crypto from 'node:crypto';
const key=secret=>crypto.createHash('sha256').update(secret).digest();
export function seal(value,secret){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key(secret),iv);const ciphertext=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return ['v1',iv.toString('base64url'),cipher.getAuthTag().toString('base64url'),ciphertext.toString('base64url')].join('.');}
export function unseal(value,secret){const [version,iv,tag,data]=String(value).split('.');if(version!=='v1')throw Error('Unsupported private envelope.');const decipher=crypto.createDecipheriv('aes-256-gcm',key(secret),Buffer.from(iv,'base64url'));decipher.setAuthTag(Buffer.from(tag,'base64url'));return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data,'base64url')),decipher.final()]).toString('utf8'));}
export function matchesHash(secret,hash){const computed=crypto.createHash('sha256').update(String(secret)).digest('hex');return typeof hash==='string'&&hash.length===64&&crypto.timingSafeEqual(Buffer.from(computed),Buffer.from(hash));}
