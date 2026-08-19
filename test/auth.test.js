const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');
const { hashPassword, verifyPassword } = require('../auth');

test('passwords are hashed and verifiable', () => {
  const hashed = hashPassword('correct horse battery staple');
  assert.match(hashed, /^scrypt\$/);
  assert.equal(verifyPassword('correct horse battery staple', hashed).valid, true);
  assert.equal(verifyPassword('wrong password', hashed).valid, false);
});

test('legacy plaintext passwords are accepted only for upgrade', () => {
  const result = verifyPassword('legacy-password', 'legacy-password');
  assert.equal(result.valid, true);
  assert.equal(result.needsUpgrade, true);
});

test('protected routes reject unauthenticated requests', async () => {
  const server = app.listen(0);
  try {
    const address = server.address();
    const base = `http://127.0.0.1:${address.port}`;
    const users = await fetch(`${base}/api/users`);
    const create = await fetch(`${base}/api/products`, { method: 'POST' });
    assert.equal(users.status, 401);
    assert.equal(create.status, 401);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
