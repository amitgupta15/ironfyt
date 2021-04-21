'use strict';

const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const handler = require('./../../handlers/index');

console.group('\x1b[33m%s\x1b[0m', 'handlers/index.js Tests');

it('should handle the default route', () => {
  handler.default({}, (statusCode, data) => {
    assert.strictEqual(statusCode, 302);
    assert.strictEqual(data, 'index.html');
  });
});

console.groupEnd();
