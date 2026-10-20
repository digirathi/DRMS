import {asyncMap,asyncFilter,asyncFind,asyncSome,asyncEvery,asyncEach} from './async-tools.mjs';
import {Buffer} from 'node:buffer'; import crypto from 'node:crypto'; import net from 'node:net'; import P from './attendance-policy.mjs'; import D from './domain.mjs'; import {createNotifications} from './cloud-notifications.mjs'; import {createHR} from './hr-transactions.mjs'; import {createExtensions} from './extensions.mjs';
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const token = () => crypto.randomBytes(32).toString('base64url');
const error = (status, message) => {
  throw Object.assign(new Error(message), {
    status
  });
};
const check = (ok, message, status = 400) => {
  if (!ok) error(status, message);
};
function loginId(value){const id=String(value||'').trim().toLowerCase();check(/^[a-z][a-z0-9._-]{2,63}$/.test(id),'Use a login ID with 3–64 characters: letters, numbers, dots, underscores or hyphens. Start with a letter.');return id;}
function createCloudBackend({
  db,
  nativeAuth,
  mailer,
  gatewayToken,
  now = () => Date.now()
}) {
  const date = () => P.companyDate(now()),
    monthStart = () => date().slice(0, 7) + '-01';
  const get = async (sql, ...v) => await db.prepare(sql).get(...v),
    all = async (sql, ...v) => await db.prepare(sql).all(...v),
    run = async (sql, ...v) => await db.prepare(sql).run(...v);
  const tx = async fn => await db.transaction(fn);
  const audit = async (actor, action, target, detail) => await run('INSERT INTO audit(actor,action,target,detail,at) VALUES(?,?,?,?,?)', actor || null, action, target, JSON.stringify(detail), new Date(now()).toISOString());
  const policyAt = async (day = date()) => {
    const row = await get("SELECT * FROM policies WHERE kind='late' AND effective<=? ORDER BY effective DESC,id DESC LIMIT 1", day);
    return row ? {
      ...JSON.parse(row.payload),
      version: row.id,
      effective: row.effective
    } : {
      ...P.defaults,
      version: 0,
      effective: monthStart()
    };
  };
  const office = async () => {
    const r = await get("SELECT * FROM policies WHERE kind='office' ORDER BY id DESC LIMIT 1");
    return r ? {
      ...JSON.parse(r.payload),
      version: r.id
    } : {
      requireGps: false,
      requireIp: false,
      lat: 0,
      lng: 0,
      radiusMeters: 150,
      maxAccuracyMeters: 100,
      ips: [],
      version: 0
    };
  };
  const weekend = async () => {
    const r = await get("SELECT * FROM policies WHERE kind='weekend' ORDER BY id DESC LIMIT 1");
    return r ? JSON.parse(r.payload) : [{
      effective: '2000-01-01',
      pattern: 'ALL',
      fifth: false
    }];
  };
  const employee = async r => ({
    id: r.id,
    backendId: r.id,
    name: r.name,
    fullName: r.name,
    employeeId: r.id,
    employeeCode: r.id,
    email: r.email,
    dept: r.department,
    department: r.department,
    designation: r.designation,
    role: D.accessRole(r.role),
    shift: r.shift,
    status: r.active ? 'Active' : 'Inactive',
    monthlyGross: r.monthly_gross,
    version: r.version,
    attendance: 'Not Started',
    accountState: (await get('SELECT must_change_password FROM accounts WHERE employee_id=?', r.id))?.must_change_password ? 'PASSWORD_SETUP' : (await get('SELECT employee_id FROM accounts WHERE employee_id=?', r.id)) ? 'ACTIVE' : 'INVITED',
    mailDelivery: (await get('SELECT status,attempted_at,sent_at,error_code FROM onboarding_mail WHERE employee_id=?', r.id)) || null
  });
  const safeEmployee = async (r, actor) => {
    const p = await employee(r);
    if (actor.role === 'EMPLOYEE' && actor.id !== r.id) delete p.monthlyGross;
    return p;
  };
  const permissions = r => ['ATTENDANCE_READ_SELF', 'ATTENDANCE_CLOCK', 'LEAVE_APPLY', 'DOCUMENT_READ_SELF', ...(r === 'EMPLOYEE' ? [] : ['EMPLOYEE_READ', 'ATTENDANCE_READ_ALL', 'PAYROLL_READ', 'REPORT_EXPORT']), ...(r === 'SUPER_ADMIN' ? ['SETTINGS_UPDATE', 'EMPLOYEE_CREATE'] : [])];
  const me = async r => {
    const pending = !!(await get('SELECT must_change_password FROM accounts WHERE employee_id=?', r.id))?.must_change_password;
    return {
      userId: r.id,
      employeeId: r.id,
      employeeCode: r.id,
      displayName: r.name,
      email: r.email,
      roles: [r.role],
      permissions: pending ? [] : permissions(r.role),
      loginId: (await get('SELECT login_id FROM accounts WHERE employee_id=?',r.id))?.login_id||null,
      mustChangePassword: pending
    };
  };
  const record = r => r ? {
    id: r.id,
    employeeId: r.employee_id,
    date: r.date,
    checkInAt: r.check_in,
    checkOutAt: r.check_out,
    clockIn: new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(Date.parse(r.check_in)),
    clockOut: r.check_out ? new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(Date.parse(r.check_out)) : '',
    mode: r.mode,
    workMode: r.mode,
    verification: r.verification,
    shift: r.shift,
    status: r.check_out ? 'COMPLETED' : 'CLOCKED_IN',
    version: r.version
  } : null;
  const notifications = createNotifications({
    db,
    mailer,
    now,
    gatewayToken,
    check,
    tx,
    audit
  });
  const hr = createHR({
    db,
    now,
    check,
    tx,
    audit,
    notifications,
    policyAt,
    weekend,
    record,
    holidays: async () => await all('SELECT * FROM holidays')
  });
  const extensions = createExtensions({
    db,
    now,
    check,
    tx,
    audit,
    person: async id => await get('SELECT * FROM employees WHERE id=?', id),
    nativeAuth
  });
  async function setLoginId(id,value){const alias=loginId(value);check(!await get('SELECT employee_id FROM accounts WHERE lower(login_id)=? AND employee_id<>?',alias,id)&&!await get('SELECT id FROM employees WHERE lower(id)=? AND id<>?',alias,id),'This login ID is unavailable.',409);await run('UPDATE accounts SET login_id=? WHERE employee_id=?',alias,id);return alias;}
  const attempts = new Map();
  async function limit(key) {
    const hashed = hash(key),
      tick = Math.floor(now() / 600000);
    await run('DELETE FROM auth_limits WHERE tick<?', tick - 1);
    const prior = await get('INSERT INTO auth_limits(key_hash,tick,attempts) VALUES(?,?,1) ON CONFLICT(key_hash) DO UPDATE SET tick=excluded.tick,attempts=CASE WHEN auth_limits.tick=excluded.tick THEN auth_limits.attempts+1 ELSE 1 END RETURNING attempts', hashed, tick);
    check(prior.attempts <= 15, 'Too many attempts. Retry in 10 minutes.', 429);
  }
  async function setPassword(id, password, {
    temporary = false
  } = {}) {
    check(typeof password === 'string' && password.length >= 12 && password.length <= 128, 'Use a password with 12–128 characters.');
    const employee = await get('SELECT * FROM employees WHERE id=?', id);
    check(employee, 'Employee not found.', 404);
    const userId = await nativeAuth.password({
      ...employee,
      password
    });
    await run('UPDATE employees SET auth_user_id=? WHERE id=?', userId, id);
    await run('INSERT INTO accounts(employee_id,salt,password_hash,must_change_password,temp_expires,credential_version) VALUES(?,?,?,?,?,1) ON CONFLICT(employee_id) DO UPDATE SET salt=excluded.salt,password_hash=excluded.password_hash,must_change_password=excluded.must_change_password,temp_expires=excluded.temp_expires,credential_version=accounts.credential_version+1', id, null, temporary ? hash(password) : null, temporary ? 1 : 0, temporary ? now() + 24 * 3600000 : null);
  }
  async function issueWelcome(actor, target) {
    const temporaryPassword = 'DR!' + token().slice(0, 22),
      attempt = crypto.randomUUID(),
      configured = mailer.status().configured,
      expiresAt = now() + 24 * 3600000;
    await tx(async () => {
      const existing = await get('SELECT * FROM accounts WHERE employee_id=?', target.id),
        previous = await get('SELECT * FROM onboarding_mail WHERE employee_id=?', target.id);
      check(!existing || existing.must_change_password, 'This account is already active. Welcome emails cannot reset an active password.', 409);
      check(!previous || now() - previous.attempted_at >= 60000 || previous.status === 'NOT_CONFIGURED' && configured, 'Wait one minute before resending this welcome email.', 429);
      await setPassword(target.id, temporaryPassword, {
        temporary: true
      });
      await run('DELETE FROM sessions WHERE employee_id=?', target.id);
      await run('UPDATE invitations SET used=1 WHERE employee_id=?', target.id);
      await run('INSERT INTO onboarding_mail(employee_id,status,attempt_id,attempted_at,sent_at,error_code) VALUES(?,?,?,?,NULL,NULL) ON CONFLICT(employee_id) DO UPDATE SET status=excluded.status,attempt_id=excluded.attempt_id,attempted_at=excluded.attempted_at,sent_at=NULL,error_code=NULL', target.id, configured ? 'PENDING' : 'NOT_CONFIGURED', attempt, now());
      await notifications.welcome(target, {
        name: target.name,
        email: target.email,
        employeeId: target.id,
        role: D.accessRole(target.role),
        temporaryPassword,
        expiresAt,
        attempt
      });
      await audit(actor.id, 'WELCOME_CREDENTIAL_QUEUED', target.id, {
        expiresAt: new Date(expiresAt).toISOString()
      });
    });
    return {
      status: configured ? 'PENDING' : 'NOT_CONFIGURED',
      message: configured ? 'Employee saved in Supabase. Welcome email queued for secure delivery.' : 'Employee saved in Supabase. Configure Gmail before the queued welcome email can be delivered.'
    };
  }
  async function session(req) {
    const raw = String(req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('dr_session='))?.slice(11);
    if (!raw) return null;
    let s = await get('SELECT * FROM sessions WHERE token_hash=? AND expires>?', hash(raw), now());
    if (!s) return null;
    const actor = await get('SELECT * FROM employees WHERE id=? AND active=1', s.employee_id),
      account = actor && (await get('SELECT * FROM accounts WHERE employee_id=?', actor.id));
    if (!actor || !account || account.credential_version !== s.credential_version) return null;
    let nativeTokens;
    try {
      nativeTokens = nativeAuth.unseal(s.auth_tokens);
      if (nativeTokens.expires_at * 1000 <= now() + 30000) {
        nativeTokens = await nativeAuth.refresh(nativeTokens.refresh_token);
        await run('UPDATE sessions SET auth_tokens=? WHERE token_hash=?', nativeAuth.seal(nativeTokens), s.token_hash);
      }
      const user = await nativeAuth.verify(nativeTokens.access_token);
      if (user.id !== actor.auth_user_id) return null;
    } catch {
      await run('DELETE FROM sessions WHERE token_hash=?', s.token_hash);
      return null;
    }
    return {
      ...s,
      actor,
      nativeTokens
    };
  }
  async function signedIn(req) {
    const s = await session(req);
    check(s, 'Please login again.', 401);
    return s;
  }
  const admin = actor => check(actor.role !== 'EMPLOYEE', 'You do not have permission to access this action.', 403);
  const superAdmin = actor => check(actor.role === 'SUPER_ADMIN', 'Only Super Admin can change company attendance policies.', 403);
  const mayManage = (actor, target) => check(target && D.canAdminister(actor.role, actor.id, {
    id: target.id,
    role: target.role
  }), 'Only Super Admin can manage administrator records. You cannot review your own correction.', 403);
  async function startSession(res, actor, req) {
    const t = token(),
      pending = (await me(actor)).mustChangePassword,
      seconds = pending ? 900 : 28800;
    check(actor.nativeSession, 'Sign in again to start a Supabase session.', 401);
    await run('DELETE FROM sessions WHERE expires<=?', now());
    const account = await get('SELECT credential_version FROM accounts WHERE employee_id=?', actor.id);
    await run('INSERT INTO sessions(token_hash,employee_id,csrf,expires,auth_tokens,credential_version) VALUES(?,?,?,?,?,?)', hash(t), actor.id, token(), now() + seconds * 1000, nativeAuth.seal(actor.nativeSession), account.credential_version);
    const publicUrl = mailer.publicOrigin ? new URL(mailer.publicOrigin) : null,
      secure = req?.socket.encrypted || publicUrl?.protocol === 'https:' && req?.headers.host === publicUrl.host;
    res.setHeader('Set-Cookie', `dr_session=${t}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${seconds}${secure ? '; Secure' : ''}`);
    return await me(actor);
  }
  function values(v) {
    const name = String(v.name || '').trim(),
      email = String(v.email || '').trim().toLowerCase(),
      shift = String(v.shift || '09:00 AM - 06:00 PM').trim(),
      role = v.role || 'EMPLOYEE',
      gross = Number(v.monthlyGross || 0);
    check(name.length >= 2 && name.length <= 100, 'Enter a name with 2–100 characters.');
    check(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254, 'Enter a valid email.');
    check(['HR_ADMIN', 'EMPLOYEE'].includes(role), 'Choose HR Admin or Employee access.');
    const times = shift.match(/\d{1,2}:\d{2}(?:\s*[AP]M)?/gi);
    check(times?.length === 2 && times.every(x => P.time(x) !== null) && P.time(times[0]) !== P.time(times[1]), 'Enter a valid shift, for example 09:00 AM - 06:00 PM.');
    check(Number.isFinite(gross) && gross >= 0 && gross <= 10000000, 'Enter a valid monthly gross salary.');
    return {
      name,
      email,
      shift,
      role,
      gross,
      department: String(v.department || 'General').trim().slice(0, 100),
      designation: String(v.designation || 'Employee').trim().slice(0, 100)
    };
  }
  async function body(req) {
    check((req.headers['content-type'] || '').split(';')[0] === 'application/json', 'Send JSON data.', 415);
    let text = '';
    for await (const chunk of req) {
      text += chunk;
      check(Buffer.byteLength(text) <= (req.url.startsWith('/api/v1/profile/image') ? 1500000 : 32768), 'Request too large.', 413);
    }
    try {
      return JSON.parse(text || '{}');
    } catch {
      error(400, 'Invalid JSON.');
    }
  }
  async function handle(req, res) {
    const url = new URL(req.url, 'http://local'),
      route = url.pathname,
      method = req.method,
      ip = String(req.socket.remoteAddress || '').replace(/^::ffff:/, '');
    const reply = (code, data) => {
      res.writeHead(code, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify(data));
    };
    try {
      const host = req.headers.host;
      check(host && !/[\s/\\]/.test(host), 'Invalid host.', 400);
      const hostname = new URL('http://' + host).hostname;
      check(['localhost', '127.0.0.1', '[::1]', String(req.socket.localAddress || '').replace(/^::ffff:/, ''), mailer.publicOrigin ? new URL(mailer.publicOrigin).hostname : null].includes(hostname), 'Host is not allowed.', 403);
      check(!req.headers.origin || req.headers.origin === `http://${host}` || req.socket.encrypted && req.headers.origin === `https://${host}` || mailer.publicOrigin && host === new URL(mailer.publicOrigin).host && req.headers.origin === mailer.publicOrigin, 'Requests must come from this HRMS website.', 403);
      if (route === '/api/v1/setup' && method === 'GET') return reply(200, {
        provider: 'SUPABASE',
        required: !(await get('SELECT employee_id FROM accounts LIMIT 1')),
        localOnly: ['127.0.0.1', '::1'].includes(ip)
      });
      if (route === '/api/v1/setup' && method === 'POST') {
        await limit('setup:' + ip);
        check(['127.0.0.1', '::1'].includes(ip), 'Initial setup must be completed on this computer.', 403);
        const v = await body(req),
          x = values({
            ...v,
            role: 'EMPLOYEE'
          });
        if(v.loginId)loginId(v.loginId);
        const actor = await tx(async () => {
          check(!(await get('SELECT employee_id FROM accounts LIMIT 1')), 'Initial setup is already complete.', 409);
          const id = 'EMP-' + crypto.randomUUID();
          await run('INSERT INTO employees(id,name,email,role,department,designation,shift) VALUES(?,?,?,?,?,?,?)', id, x.name, x.email, 'SUPER_ADMIN', x.department, 'Super Admin', x.shift);
          await setPassword(id, v.password,{temporary:v.temporary===true});
          if(v.loginId)await setLoginId(id,v.loginId);
          await audit(id, 'SETUP', id, {});
          return await get('SELECT * FROM employees WHERE id=?', id);
        });
        actor.nativeSession = await nativeAuth.login(actor.email, v.password);
        return reply(201, await startSession(res, actor, req));
      }
      if (route === '/api/v1/auth/login' && method === 'POST') {
        await limit('login:' + ip);
        const v = await body(req),
          id = String(v.email || '').toLowerCase().trim(),
          r = await get('SELECT e.*,a.must_change_password,a.temp_expires FROM employees e JOIN accounts a ON e.id=a.employee_id WHERE (e.email=? OR a.login_id=? OR (a.login_id IS NULL AND lower(e.id)=?)) AND e.active=1', id, id, id);
        check(r && typeof v.password === 'string' && v.password.length <= 128, 'Email or password is incorrect.', 401);
        check(!r.must_change_password || r.temp_expires > now(), 'Your temporary password expired. Ask HR to resend the welcome email.', 401);
        r.nativeSession = await nativeAuth.login(r.email, v.password);
        return reply(200, await startSession(res, r, req));
      }
      if (route === '/api/v1/accounts/activate' && method === 'POST') {
        await limit('activate:' + ip);
        const v = await body(req),
          actor = await tx(async () => {
            const invitation = await get('SELECT * FROM invitations WHERE token_hash=? AND used=0 AND expires>?', hash(String(v.token || '')), now());
            check(invitation, 'This invitation expired or has already been used.', 400);
            check((await get('SELECT active FROM employees WHERE id=?', invitation.employee_id))?.active, 'This employee account is inactive.', 403);
            await setPassword(invitation.employee_id, v.password);
            await run('UPDATE invitations SET used=1 WHERE token_hash=?', invitation.token_hash);
            await audit(invitation.employee_id, 'ACCOUNT_ACTIVATED', invitation.employee_id, {});
            return await get('SELECT * FROM employees WHERE id=?', invitation.employee_id);
          });
        return reply(201, await startSession(res, actor, req));
      }
      if (route === '/api/internal/health' && method === 'GET') {
        await nativeAuth.health();
        return reply(200, {
          provider: 'SUPABASE',
          database: true,
          auth: true
        });
      }
      if (route === '/api/internal/email/claim' && method === 'POST') {
        await body(req);
        return reply(200, {
          messages: await notifications.claim()
        });
      }
      if (route === '/api/internal/email/complete' && method === 'POST') {
        const v = await body(req);
        await notifications.complete(v);
        return reply(200, {
          success: true
        });
      }
      if (route === '/api/v1/auth/forgot-password' && method === 'POST') {
        await limit('recovery:' + ip);
        const v = await body(req),
          email = String(v.email || '').toLowerCase().trim();
        check(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email address.');
        check(mailer.status().configured && mailer.publicOrigin, 'Email recovery is not configured. Contact Super Admin.', 503);
        const target = await get('SELECT * FROM employees WHERE email=? AND active=1', email);
        if (target) await tx(async () => {
          const previous = await get('SELECT created_at FROM password_resets WHERE employee_id=? ORDER BY created_at DESC LIMIT 1', target.id);
          if (previous && now() - previous.created_at < 60000) return;
          const resetToken = token(),
            expires = now() + 1800000;
          await run('UPDATE password_resets SET used=1 WHERE employee_id=?', target.id);
          await run('INSERT INTO password_resets(token_hash,employee_id,expires,used,created_at) VALUES(?,?,?,0,?)', hash(resetToken), target.id, expires, now());
          await notifications.recovery(target, {
            name: target.name,
            email: target.email,
            resetUrl: mailer.publicOrigin + '/?token=' + resetToken,
            expiresAt: expires,
            tokenHash: hash(resetToken)
          });
          await audit(target.id, 'PASSWORD_RECOVERY_REQUESTED', target.id, {});
        });
        return reply(200, {
          success: true,
          message: 'If an active account matches, recovery instructions have been queued.'
        });
      }
      if (route === '/api/v1/auth/reset-password' && method === 'POST') {
        await limit('reset:' + ip);
        const v = await body(req);
        check(typeof v.token === 'string' && v.token.length >= 40 && typeof v.newPassword === 'string' && v.newPassword.length >= 12 && v.newPassword.length <= 128, 'Use a valid reset link and a new password with 12–128 characters.');
        await tx(async () => {
          const reset = await get('SELECT * FROM password_resets WHERE token_hash=? AND used=0 AND expires>?', hash(v.token), now());
          check(reset, 'This recovery link expired or has already been used. Request a new link.');
          check((await get('SELECT active FROM employees WHERE id=?', reset.employee_id))?.active, 'This account is inactive.', 403);
          await setPassword(reset.employee_id, v.newPassword);
          await run('UPDATE password_resets SET used=1 WHERE employee_id=?', reset.employee_id);
          await run('DELETE FROM sessions WHERE employee_id=?', reset.employee_id);
          await audit(reset.employee_id, 'PASSWORD_RECOVERY_COMPLETED', reset.employee_id, {});
        });
        return reply(200, {
          success: true
        });
      }
      const s = await signedIn(req),
        a = s.actor;
      if (route.startsWith('/api/admin/leave/') && a.role !== 'SUPER_ADMIN') return reply(403, {
        success: false,
        message: 'You do not have permission to access leave management.'
      });
      if (!['GET', 'HEAD'].includes(method)) check(req.headers['x-csrf-token'] === s.csrf, 'Your session changed. Refresh and retry.', 403);
      if (route === '/api/v1/auth/me' && method === 'GET') return reply(200, await me(a));
      if (route === '/api/v1/auth/csrf' && method === 'GET') return reply(200, {
        headerName: 'X-CSRF-Token',
        token: s.csrf
      });
      if (route === '/api/v1/auth/logout' && method === 'POST') {
        await nativeAuth.logout(s.nativeTokens.access_token);
        await run('DELETE FROM sessions WHERE token_hash=?', s.token_hash);
        res.setHeader('Set-Cookie', 'dr_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
        return reply(200, {
          success: true
        });
      }
      if (route === '/api/v1/auth/change-password' && method === 'POST') {
        const v = await body(req),
          account = await get('SELECT * FROM accounts WHERE employee_id=?', a.id);
        check(account?.must_change_password, 'Your password has already been set.', 409);
        check(account.temp_expires > now(), 'Your temporary password expired. Ask HR to resend the welcome email.', 401);
        check(typeof v.password === 'string' && v.password.length >= 12 && v.password.length <= 128, 'Use a password with 12–128 characters.');
        check(v.password === v.confirm, 'Passwords do not match.');
        check(hash(v.password) !== account.password_hash, 'Choose a new password different from the temporary password.');
        await tx(async () => {
          const latest = await get('SELECT credential_version FROM accounts WHERE employee_id=?', a.id);
          check(latest.credential_version === account.credential_version, 'Your credentials changed. Sign in again.', 409);
          if(v.loginId)await setLoginId(a.id,v.loginId);
          await setPassword(a.id, v.password);
          await run('DELETE FROM sessions WHERE employee_id=?', a.id);
          await audit(a.id, 'FIRST_LOGIN_PASSWORD_SET', a.id, {});
        });
        a.nativeSession = await nativeAuth.login(a.email, v.password);
        return reply(200, await startSession(res, a, req));
      }
      const account = await get('SELECT must_change_password,temp_expires FROM accounts WHERE employee_id=?', a.id);
      check(!account?.must_change_password, 'Set a new password before accessing the dashboard.', 403);

      if(route==='/api/v1/auth/credentials'&&method==='PUT'){
        await limit('credentials:'+a.id);const v=await body(req),previous=await get('SELECT * FROM accounts WHERE employee_id=?',a.id);
        check(typeof v.currentPassword==='string'&&v.currentPassword.length<=128,'Enter your current password.',400);
        const verified=await nativeAuth.login(a.email,v.currentPassword),alias=v.loginId?loginId(v.loginId):previous.login_id,newPassword=String(v.newPassword||'');
        check(alias!==previous.login_id||newPassword,'Change your login ID or enter a new password.');
        if(newPassword){check(newPassword.length>=12&&newPassword.length<=128,'Use a password with 12–128 characters.');check(newPassword===v.confirm,'Passwords do not match.');check(newPassword!==v.currentPassword,'Choose a password different from your current password.');}
        await tx(async()=>{const latest=await get('SELECT credential_version FROM accounts WHERE employee_id=?',a.id);check(latest.credential_version===previous.credential_version,'Your credentials changed. Sign in again.',409);if(alias)await setLoginId(a.id,alias);if(newPassword)await setPassword(a.id,newPassword);else await run('UPDATE accounts SET credential_version=credential_version+1 WHERE employee_id=?',a.id);await run('DELETE FROM sessions WHERE employee_id=?',a.id);await audit(a.id,'ACCOUNT_CREDENTIALS_CHANGED',a.id,{loginIdChanged:alias!==previous.login_id,passwordChanged:!!newPassword});});
        a.nativeSession=newPassword?await nativeAuth.login(a.email,newPassword):verified;return reply(200,await startSession(res,a,req));
      }
      if (await extensions.handle({
        route,
        method,
        url,
        a,
        body: async () => await body(req),
        reply
      })) return;
      if (await hr.handle({
        route,
        method,
        url,
        a,
        body: async () => await body(req),
        reply
      })) return;
      if (route === '/api/v1/settings/email-status' && method === 'GET') {
        admin(a);
        return reply(200, mailer.status());
      }
      if (route === '/api/v1/local/bootstrap' && method === 'GET') {
        const staff = (await all('SELECT * FROM employees ORDER BY name')).filter(r => a.role !== 'EMPLOYEE' || r.id === a.id),
          records = await all(a.role === 'EMPLOYEE' ? 'SELECT * FROM attendance WHERE employee_id=? ORDER BY date DESC' : 'SELECT * FROM attendance ORDER BY date DESC', ...(a.role === 'EMPLOYEE' ? [a.id] : []));
        const latest = await get("SELECT * FROM policies WHERE kind='late' ORDER BY id DESC LIMIT 1");
        return reply(200, {
          provider: 'SUPABASE',
          extra: await extensions.bootstrap(a),
          hr: await hr.bootstrap(a),
          emailStatus: a.role === 'EMPLOYEE' ? {
            configured: mailer.status().configured
          } : mailer.status(),
          employees: await asyncMap(staff, async r => await safeEmployee(r, a)),
          policy: await policyAt(),
          policyRevision: latest?.id || 0,
          editablePolicy: latest ? {
            ...JSON.parse(latest.payload),
            effective: latest.effective,
            version: latest.id
          } : await policyAt(),
          office: await office(),
          weekendSchedules: await weekend(),
          records: [...records.map(record), ...(await hr.bootstrap(a)).absences.map(r => ({
            id: 'leave-' + r.request_id + '-' + r.date,
            employeeId: r.employee_id,
            date: r.date,
            status: 'ON_LEAVE',
            clockIn: '',
            clockOut: '',
            mode: 'LEAVE',
            verification: 'APPROVED_LEAVE'
          }))],
          observedIp: ip,
          corrections: (await all(a.role === 'EMPLOYEE' ? 'SELECT * FROM corrections WHERE employee_id=? ORDER BY created_at DESC' : 'SELECT * FROM corrections ORDER BY created_at DESC', ...(a.role === 'EMPLOYEE' ? [a.id] : []))).map(r => ({
            ...r,
            original: JSON.parse(r.original),
            proposed: JSON.parse(r.proposed)
          }))
        });
      }
      if (route === '/api/v1/employees/onboard' && method === 'POST') {
        admin(a);
        const v = await body(req),
          x = values(v);
        check(a.role === 'SUPER_ADMIN' || x.role === 'EMPLOYEE', 'Only Super Admin can assign HR Admin access.', 403);
        const id = 'EMP-' + crypto.randomUUID();
        await tx(async () => {
          check(!(await get('SELECT id FROM employees WHERE email=?', x.email)), 'This email already has an employee account.', 409);
          await run('INSERT INTO employees(id,name,email,role,department,designation,shift,monthly_gross) VALUES(?,?,?,?,?,?,?,?)', id, x.name, x.email, x.role, x.department, x.designation, x.shift, x.gross);
          await audit(a.id, 'EMPLOYEE_CREATED', id, {
            name: x.name,
            role: x.role
          });
        });
        const target = await get('SELECT * FROM employees WHERE id=?', id),
          emailDelivery = await issueWelcome(a, target);
        return reply(201, {
          employee: await employee(target),
          emailDelivery
        });
      }
      const welcomeRoute = route.match(/^\/api\/v1\/employees\/([^/]+)\/welcome-email$/);
      if (welcomeRoute && method === 'POST') {
        admin(a);
        await body(req);
        const target = await get('SELECT * FROM employees WHERE id=?', welcomeRoute[1]);
        mayManage(a, target);
        return reply(200, {
          emailDelivery: await issueWelcome(a, target)
        });
      }
      const inviteRoute = route.match(/^\/api\/v1\/employees\/([^/]+)\/invite$/);
      if (inviteRoute && method === 'POST') {
        admin(a);
        await body(req);
        const target = await get('SELECT * FROM employees WHERE id=?', inviteRoute[1]);
        mayManage(a, target);
        check(!(await get('SELECT employee_id FROM accounts WHERE employee_id=?', target.id)), 'This employee already activated their account.', 409);
        const invitation = token();
        await tx(async () => {
          await run('UPDATE invitations SET used=1 WHERE employee_id=?', target.id);
          await run('INSERT INTO invitations VALUES(?,?,?,0)', hash(invitation), target.id, now() + 48 * 3600000);
          await audit(a.id, 'ACTIVATION_LINK_REISSUED', target.id, {});
        });
        return reply(201, {
          invitationToken: invitation
        });
      }
      if (route === '/api/v1/attendance/policy' && method === 'PUT') {
        superAdmin(a);
        const v = await body(req),
          p = P.policy(v),
          effective = D.isoDate(v.effective);
        check(effective && effective.endsWith('-01') && effective >= monthStart(), 'Choose the first day of the current or a future month.');
        const note = D.reason(v.reason);
        await tx(async () => {
          const latest = await get("SELECT id FROM policies WHERE kind='late' ORDER BY id DESC LIMIT 1");
          check(Number(v.expectedVersion) === (latest?.id || 0), 'The policy changed. Reload before saving.', 409);
          await run("INSERT INTO policies(kind,effective,payload) VALUES('late',?,?)", effective, JSON.stringify(p));
          await audit(a.id, 'ATTENDANCE_POLICY_CHANGED', 'company', {
            ...p,
            effective,
            reason: note
          });
        });
        return reply(200, {
          ...p,
          effective,
          version: (await get("SELECT id FROM policies WHERE kind='late' ORDER BY id DESC LIMIT 1")).id
        });
      }
      if (route === '/api/v1/attendance/office' && method === 'PUT') {
        superAdmin(a);
        const v = await body(req),
          o = P.office(v),
          note = D.reason(v.reason);
        check(o.requireGps || o.requireIp, 'Enable GPS or office IP verification.');
        check(o.ips.every(x => net.isIP(x)), 'Enter valid IPv4 or IPv6 addresses, separated by commas.');
        await tx(async () => {
          check(Number(v.expectedVersion) === (await office()).version, 'The office settings changed. Reload before saving.', 409);
          await run("INSERT INTO policies(kind,effective,payload) VALUES('office',?,?)", date(), JSON.stringify(o));
          await audit(a.id, 'OFFICE_VERIFICATION_CHANGED', 'company', {
            ...o,
            reason: note
          });
        });
        return reply(200, await office());
      }
      if (route === '/api/v1/attendance/today' && method === 'GET') return reply(200, record(await get('SELECT * FROM attendance WHERE employee_id=? AND check_out IS NULL ORDER BY date DESC LIMIT 1', a.id)) || record(await get('SELECT * FROM attendance WHERE employee_id=? AND date=?', a.id, date())) || {
        checkInAt: null,
        checkOutAt: null,
        status: (await hr.fullLeave(a.id, date())) ? 'ON_LEAVE' : 'NOT_STARTED'
      });
      if (route === '/api/v1/attendance/clock-in' && method === 'POST') {
        const v = await body(req);
        check(['OFFICE', 'WFH'].includes(v.mode), 'Choose WFO or WFH.');
        const verification = v.mode === 'WFH' ? 'NOT_REQUIRED' : P.verifyOffice(await office(), v.position, ip, now());
        const result = await tx(async () => {
          check(!(await hr.fullLeave(a.id, date())), 'You are on approved full-day leave. Request cancellation before clocking in.', 409);
          check(!(await get('SELECT id FROM attendance WHERE employee_id=? AND (date=? OR check_out IS NULL)', a.id, date())), 'A shift is already recorded or still open. Request a correction if needed.', 409);
          const id = crypto.randomUUID();
          await run('INSERT INTO attendance(id,employee_id,date,check_in,mode,verification,shift) VALUES(?,?,?,?,?,?,?)', id, a.id, date(), new Date(now()).toISOString(), v.mode, verification, a.shift);
          await audit(a.id, 'CLOCK_IN', id, {
            mode: v.mode,
            verification
          });
          return record(await get('SELECT * FROM attendance WHERE id=?', id));
        });
        return reply(201, result);
      }
      if (route === '/api/v1/attendance/clock-out' && method === 'POST') {
        await body(req);
        const result = await tx(async () => {
          const r = await get('SELECT * FROM attendance WHERE employee_id=? AND check_out IS NULL', a.id);
          check(r, 'There is no active shift to clock out.', 409);
          check(now() - Date.parse(r.check_in) <= 86400000, 'This shift is older than 24 hours. Request an attendance correction.', 409);
          await run('UPDATE attendance SET check_out=?,version=version+1 WHERE id=? AND check_out IS NULL', new Date(now()).toISOString(), r.id);
          await audit(a.id, 'CLOCK_OUT', r.id, {});
          return record(await get('SELECT * FROM attendance WHERE id=?', r.id));
        });
        return reply(200, result);
      }
      if (route === '/api/v1/attendance/corrections' && method === 'POST') {
        const v = await body(req),
          p = D.correction(v),
          reason = D.reason(v.reason),
          id = crypto.randomUUID();
        await tx(async () => {
          check(!(await get("SELECT id FROM corrections WHERE employee_id=? AND date=? AND status='PENDING_REVIEW'", a.id, p.date)), 'A correction is already awaiting review for this day.', 409);
          const r = await get('SELECT * FROM attendance WHERE employee_id=? AND date=?', a.id, p.date),
            original = record(r) || {};
          await run('INSERT INTO corrections(id,employee_id,date,record_version,original,proposed,reason,created_at) VALUES(?,?,?,?,?,?,?,?)', id, a.id, p.date, r?.version || 0, JSON.stringify(original), JSON.stringify(p), reason, new Date(now()).toISOString());
          await audit(a.id, 'CORRECTION_REQUESTED', id, {
            date: p.date,
            reason
          });
        });
        return reply(201, {
          id,
          status: 'PENDING_REVIEW'
        });
      }
      const decision = route.match(/^\/api\/v1\/attendance\/corrections\/([^/]+)\/decision$/);
      if (decision && method === 'POST') {
        admin(a);
        const v = await body(req),
          note = D.reason(v.note);
        check(['APPROVED', 'REJECTED'].includes(v.decision), 'Approve or reject this request.');
        await tx(async () => {
          const c = await get('SELECT * FROM corrections WHERE id=?', decision[1]);
          check(c, 'Correction not found.', 404);
          mayManage(a, await get('SELECT * FROM employees WHERE id=?', c.employee_id));
          check(c.status === 'PENDING_REVIEW' && c.version === Number(v.version), 'This request has already changed. Reload before deciding.', 409);
          const r = await get('SELECT * FROM attendance WHERE employee_id=? AND date=?', c.employee_id, c.date);
          if (v.decision === 'APPROVED') {
            check(!(await hr.fullLeave(c.employee_id, c.date)), 'This date has approved full-day leave. Resolve the leave before correcting attendance.', 409);
            check((r?.version || 0) === c.record_version, 'Attendance changed after this request. Ask the employee to resubmit.', 409);
            const p = D.correction(JSON.parse(c.proposed)),
              person = await get('SELECT * FROM employees WHERE id=?', c.employee_id),
              inside = new Date(c.date + 'T' + p.clockIn + ':00+05:30').toISOString(),
              outside = new Date(c.date + 'T' + p.clockOut + ':00+05:30').toISOString();
            check(!(await get('SELECT id FROM attendance WHERE employee_id=? AND check_out IS NULL AND date<>?', c.employee_id, c.date)), 'Resolve the other open shift first.', 409);
            if (r) await run("UPDATE attendance SET check_in=?,check_out=?,mode=?,verification='MANUALLY_CORRECTED',version=version+1 WHERE id=?", inside, outside, p.workMode, r.id);else await run('INSERT INTO attendance(id,employee_id,date,check_in,check_out,mode,verification,shift) VALUES(?,?,?,?,?,?,?,?)', crypto.randomUUID(), c.employee_id, c.date, inside, outside, p.workMode, 'MANUALLY_CORRECTED', person.shift);
          }
          await run('UPDATE corrections SET status=?,decision_note=?,version=version+1 WHERE id=?', v.decision, note, c.id);
          await audit(a.id, 'CORRECTION_' + v.decision, c.id, {
            note
          });
        });
        return reply(200, {
          success: true
        });
      }
      if (route === '/api/v1/payroll/attendance-preview' && method === 'GET') {
        admin(a);
        const month = Number(url.searchParams.get('month')),
          year = Number(url.searchParams.get('year'));
        check(Number.isInteger(month) && month >= 1 && month <= 12 && Number.isInteger(year) && year >= 2020 && year <= 2100, 'Choose a valid payroll month and year.');
        const p = await policyAt(`${year}-${String(month).padStart(2, '0')}-01`),
          records = (await all('SELECT * FROM attendance')).map(record);
        for (const c of await all("SELECT employee_id,date FROM corrections WHERE status='PENDING_REVIEW'")) records.filter(r => r.employeeId === c.employee_id && r.date === c.date).forEach(r => r.correctionStatus = 'PENDING_REVIEW');
        const schedules = await weekend(),
          leaves = (await hr.bootstrap(a)).requests.filter(r => ['APPROVED', 'CANCELLATION_REQUESTED'].includes(r.status));
        return reply(200, {
          month,
          year,
          policy: p,
          status: 'DRAFT_PREVIEW',
          items: (await all('SELECT * FROM employees WHERE active=1')).map(x => {
            const r = P.monthly({
                employeeId: x.id,
                records,
                month,
                year,
                shift: x.shift,
                policy: p,
                excludedDates: leaves.filter(r => r.employee_id === x.id).flatMap(r => r.dates),
                isOff: day => D.weekOff(day, schedules),
                now: now()
              }),
              days = new Date(year, month, 0).getDate();
            return {
              employeeId: x.id,
              name: x.name,
              monthlyGross: x.monthly_gross,
              ...r,
              lateDeduction: Math.round(x.monthly_gross * r.deductionDays / days)
            };
          })
        });
      }
      error(503, 'This module is not connected to the local backend yet. No changes were saved.');
    } catch (err) {
      reply(err.status || 400, {
        success: false,
        message: err.status || !/SQLITE|constraint|database/i.test(err.message) ? err.message : 'The record could not be saved. Check for duplicate information.'
      });
    }
  }
  return {
    handle
  };
}
export { createCloudBackend };