const test = require('node:test');
const assert = require('node:assert');
const { main } = require('../src/index');

test('smoke: application entrypoint loads', () => {
  assert.strictEqual(main(), 'task-manager');
});
