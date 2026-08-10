// XiaoHaibao API - Cloudflare Pages Function
// Handles all /api/* requests

function cors(h) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    ...h,
  }
}

function json(data, status) {
  status = status || 200;
  return new Response(JSON.stringify(data), {
    status,
    headers: cors({ 'Content-Type': 'application/json' }),
  })
}

function err(msg, status) { return json({ error: msg }, status || 400) }

function generateId() { return crypto.randomUUID() }

async function hashPassword(password, salt) {
  var encoder = new TextEncoder();
  var data = encoder.encode(password + salt);
  var hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(function(b) { return b.toString(16).padStart(2, '0') }).join('')
}

async function signToken(payload, secret) {
  var encoder = new TextEncoder();
  var header = { alg: 'HS256', typ: 'JWT' };
  var b64Header = btoa(JSON.stringify(header)).replace(/=+$/, '');
  var p = Object.assign({}, payload, { iat: Date.now() });
  var b64Payload = btoa(JSON.stringify(p)).replace(/=+$/, '');
  var data = encoder.encode(b64Header + '.' + b64Payload);
  var key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  var sig = await crypto.subtle.sign('HMAC', key, data);
  var b64Sig = btoa(String.fromCharCode.apply(null, new Uint8Array(sig))).replace(/=+$/, '');
  return b64Header + '.' + b64Payload + '.' + b64Sig;
}

async function verifyToken(token, secret) {
  try {
    var parts = token.split('.');
    var encoder = new TextEncoder();
    var data = encoder.encode(parts[0] + '.' + parts[1]);
    var key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    var sigBytes = Uint8Array.from(atob(parts[2]), function(c) { return c.charCodeAt(0) });
    var valid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    if (!valid) return null;
    return JSON.parse(atob(parts[1]));
  } catch(e) { return null }
}

// ===== Auth middleware =====
async function authMiddleware(request, env) {
  var authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  var token = authHeader.slice(7);
  return await verifyToken(token, env.JWT_SECRET || 'dev-secret-change-me');
}

function adminCheck(handler) {
  return async function(ctx) {
    if (!ctx.user || ctx.user.role !== 'admin') return err('Admin access required', 403);
    return handler(ctx);
  }
}

// ===== Route Handlers =====
var handlers = {

  'POST:/api/auth/sign-up': async function(ctx) {
    var body = await ctx.request.json();
    if (!body.email || !body.password) return err('Email and password required');
    var existing = await ctx.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(body.email).first();
    if (existing) return err('Email already registered', 409);
    var id = generateId();
    var salt = generateId();
    var passwordHash = await hashPassword(body.password, salt);
    await ctx.env.DB.prepare('INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)').bind(id, body.email, passwordHash + ':' + salt, body.name || body.email.split('@')[0], 'user').run();
    var token = await signToken({ sub: id, email: body.email, role: 'user' }, ctx.env.JWT_SECRET || 'dev-secret-change-me');
    return json({ user: { id: id, email: body.email, name: body.name, role: "user" }, token: token });
  },

  'POST:/api/auth/sign-in': async function(ctx) {
    var body = await ctx.request.json();
    if (!body.email || !body.password) return err('Email and password required');
    var user = await ctx.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(body.email).first();
    if (!user) return err('Invalid email or password', 401);
    var p = user.password_hash.split(':');
    var inputHash = await hashPassword(body.password, p[1]);
    if (inputHash !== p[0]) return err('Invalid email or password', 401);
    var token = await signToken({ sub: user.id, email: user.email, role: user.role }, ctx.env.JWT_SECRET || "dev-secret-change-me");
    return json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token: token });
  },

  'GET:/api/works': async function(ctx) {
    if (!ctx.user) return err('Please login', 401);
    var url = new URL(ctx.request.url);
    var cat = url.searchParams.get('category');
    var q = 'SELECT * FROM works WHERE user_id = ?';
    var params = [ctx.user.sub];
    if (cat) { q += ' AND category = ?'; params.push(cat) }
    q += " ORDER BY created_at DESC LIMIT 50";
    var rows = await ctx.env.DB.prepare(q).bind(params[0], params[1] || '').all();
    return json(rows.results);
  },

  'POST:/api/works': async function(ctx) {
    if (!ctx.user) return err('Please login', 401);
    var body = await ctx.request.json();
    var id = generateId();
    await ctx.env.DB.prepare('INSERT INTO works (id, user_id, title, category, ratio, content, plan_data, result_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, ctx.user.sub, body.title || 'Untitled', body.category || 'life', body.ratio || '3:4', body.content || '', body.planData ? JSON.stringify(body.planData) : null, body.resultUrl || null, body.resultUrl ? 'completed' : 'pending').run();
    return json({ id: id, status: body.resultUrl ? 'completed' : 'pending' }, 201);
  },

  'DELETE:/api/works': async function(ctx) {
    if (!ctx.user) return err('Please login', 401);
    var url = new URL(ctx.request.url);
    var id = url.searchParams.get('id');
    if (!id) return err('Missing work ID');
    await ctx.env.DB.prepare('DELETE FROM works WHERE id = ? AND user_id = ?').bind(id, ctx.user.sub).run();
    return json({ success: true });
  },

  'GET:/api/settings': async function(ctx) {
    if (!ctx.user) return err('Please login', 401);
    var dbUser = await ctx.env.DB.prepare('SELECT deepseek_key, image2_key, credit_balance FROM users WHERE id = ?').bind(ctx.user.sub).first();
    return json({
      deepseekConfigured: !!(dbUser && dbUser.deepseek_key),
      image2Configured: !!(dbUser && dbUser.image2_key),
      creditBalance: (dbUser && dbUser.credit_balance) || 0,
    });
  },

  'POST:/api/settings/deepseek': async function(ctx) {
    if (!ctx.user) return err('Please login', 401);
    var body = await ctx.request.json();
    if (!body.key) return err('Key required');
    await ctx.env.DB.prepare('UPDATE users SET deepseek_key = ?, updated_at = datetime(\"now\") WHERE id = ?').bind(body.key, ctx.user.sub).run();
    return json({ success: true });
  },

  'POST:/api/settings/image2': async function(ctx) {
    if (!ctx.user) return err('Please login', 401);
    var body = await ctx.request.json();
    if (!body.key) return err('Key required');
    await ctx.env.DB.prepare('UPDATE users SET image2_key = ?, updated_at = datetime(\"now\") WHERE id = ?').bind(body.key, ctx.user.sub).run();
    return json({ success: true });
  },

  'GET:/api/admin/overview': adminCheck(async function(ctx) {
    var tu = await ctx.env.DB.prepare("SELECT COUNT(DISTINCT user_id) as c FROM ai_logs WHERE date(created_at) = date('now')").first();
    var tg = await ctx.env.DB.prepare("SELECT COUNT(*) as c FROM ai_logs WHERE date(created_at) = date('now') AND status = 'success'").first();
    var tot = await ctx.env.DB.prepare('SELECT COUNT(*) as c FROM users').first();
    var tw = await ctx.env.DB.prepare('SELECT COUNT(*) as c FROM works').first();
    return json({ today: { activeUsers: (tu && tu.c) || 0, generations: (tg && tg.c) || 0 }, totalUsers: (tot && tot.c) || 0, totalWorks: (tw && tw.c) || 0 });
  }),

  'GET:/api/admin/users': adminCheck(async function(ctx) {
    var url = new URL(ctx.request.url);
    var s = url.searchParams.get('search') || '';
    var q, p;
    if (s) {
      q = 'SELECT id, email, name, role, credit_balance, agent_id, created_at FROM users WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT 100';
      p = ['%' + s + '%', '%' + s + '%'];
    } else {
      q = 'SELECT id, email, name, role, credit_balance, agent_id, created_at FROM users ORDER BY created_at DESC LIMIT 100';
      p = [];
    }
    var stmt = ctx.env.DB.prepare(q);
    for (var i = 0; i < p.length; i++) stmt = stmt.bind(p[i]);
    var rows = await stmt.all();
    return json(rows.results);
  }),

  'GET:/api/admin/codes': adminCheck(async function(ctx) {
    var rows = await ctx.env.DB.prepare('SELECT * FROM invite_codes ORDER BY created_at DESC LIMIT 50').all();
    return json(rows.results);
  }),

  'POST:/api/admin/codes': adminCheck(async function(ctx) {
    var body = await ctx.request.json();
    var id = generateId();
    var code = 'SEAL' + Math.random().toString(36).substring(2, 8).toUpperCase();
    await ctx.env.DB.prepare('INSERT INTO invite_codes (id, code, created_by, max_uses) VALUES (?, ?, ?, ?)').bind(id, code, ctx.user.sub, body.maxUses || 1).run();
    return json({ id: id, code: code, maxUses: body.maxUses || 1 }, 201);
  }),

  'DELETE:/api/admin/codes': adminCheck(async function(ctx) {
    var url = new URL(ctx.request.url);
    var id = url.searchParams.get('id');
    if (!id) return err('Missing code ID');
    await ctx.env.DB.prepare('UPDATE invite_codes SET active = 0 WHERE id = ?').bind(id).run();
    return json({ success: true });
  }),
};

// ===== Main Export =====
export async function onRequest(context) {
  var request = context.request;
  var env = context.env;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors() });
  var url = new URL(request.url);
  var path = url.pathname;
  var method = request.method;
  var user = await authMiddleware(request, env);
  var routeKey = method + ":" + path;
  var handler = handlers[routeKey];
  if (!handler) return json({ message: "XiaoHaibao API v0.1", routes: Object.keys(handlers).sort() }, 404);
  try {
    return await handler({ request: request, env: env, user: user });
  } catch(e) {
    return err("Internal error: " + e.message, 500);
  }
}