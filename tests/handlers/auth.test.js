'use strict';

const { assert, it } = require('../../vendor/nodejs-unit-test-library');
const auth = require('./../../handlers/auth');

console.group('\x1b[33m%s\x1b[0m', 'handlers/auth.js Tests');

// auth testing
it("'/api/auth'should only allow GET method", function () {
  let _statusCode, _data;
  let payload = {
    method: 'get',
    buffer: JSON.stringify({ email: 'amitgupta15@gmail.com', password: 'password' }),
  };
  auth.login(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 201);
  console.log(_data);
  auth.login({ method: 'post' }, (statusCode, data) => {
    _statusCode = statusCode;
  });
  assert.strictEqual(_statusCode, 405);
});

it("'/api/auth'should authenticate a valid user", function () {});

console.groupEnd();
