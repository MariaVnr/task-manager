const test = require('node:test');
const assert = require('node:assert');
const { main } = require('../src/index');

test('smoke: modules auth and tasks load', () => {
  const { auth, tasks } = main();
  assert.strictEqual(typeof auth.getCurrentUserId, 'function');
  assert.strictEqual(typeof tasks.listTasksFor, 'function');
});

test('tasks rejects request without session', () => {
  const { tasks } = main();
  assert.throws(() => tasks.listTasksFor(null), /Unauthorized/);
});

test('tasks returns own list for valid session', () => {
  const { tasks } = main();
  assert.deepStrictEqual(tasks.listTasksFor({ userId: 1 }), []);
});
