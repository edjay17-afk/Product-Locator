const crypto = require('crypto');

const SESSION_COOKIE = 'pl_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const developmentSecret = crypto.randomBytes(32).toString('hex');

function getSessionSecret() {
  const configured = process.env.SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set to at least 32 characters in production.');
  }
  return developmentSecret;
}

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value) {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

function hashPassword(password) {
  const clean = String(password || '');
  if (!clean) throw new Error('Password cannot be empty.');
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(clean, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password, stored) {
  const clean = String(password || '');
  const value = String(stored || '');
  if (!clean || !value) return { valid: false, needsUpgrade: false };

  if (!value.startsWith('scrypt$')) {
    const supplied = Buffer.from(clean);
    const existing = Buffer.from(value);
    const valid = supplied.length === existing.length && crypto.timingSafeEqual(supplied, existing);
    return { valid, needsUpgrade: valid };
  }

  const [, salt, expectedHex] = value.split('$');
  if (!salt || !expectedHex) return { valid: false, needsUpgrade: false };
  const actual = crypto.scryptSync(clean, salt, 64, { N: 16384, r: 8, p: 1 });
  const expected = Buffer.from(expectedHex, 'hex');
  return {
    valid: actual.length === expected.length && crypto.timingSafeEqual(actual, expected),
    needsUpgrade: false
  };
}

function createSession(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: String(user.id),
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function readCookies(header) {
  return String(header || '').split(';').reduce((cookies, part) => {
    const separator = part.indexOf('=');
    if (separator <= 0) return cookies;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function readSession(req) {
  const token = readCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  const [encoded, providedSignature] = token.split('.');
  if (!encoded || !providedSignature) return null;

  const expectedSignature = sign(encoded);
  const supplied = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encoded));
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

function setSessionCookie(res, req, user) {
  const secure = process.env.NODE_ENV === 'production' || req.secure ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(createSession(user))}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure}`);
}

function clearSessionCookie(res, req) {
  const secure = process.env.NODE_ENV === 'production' || req.secure ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`);
}

function requireAuth(req, res, next) {
  const user = readSession(req);
  if (!user) return res.status(401).json({ success: false, error: 'Authentication required.' });
  req.user = user;
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

module.exports = {
  SESSION_TTL_SECONDS,
  clearSessionCookie,
  createSession,
  hashPassword,
  requireAuth,
  requireRole,
  readSession,
  setSessionCookie,
  verifyPassword
};
