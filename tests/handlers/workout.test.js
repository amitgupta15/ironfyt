'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const workout = require('./../../handlers/workout');

console.group('\x1b[33m%s\x1b[0m', 'handlers/workout.js Tests');

let jwt, verify;
$test.setUp = () => {
  jwt = require('jsonwebtoken');
  verify = jwt.verify;
};

$test.tearDown = () => {
  jwt.verify = verify;
};

it('should check for a valid token before allowing a request to go through', () => {
  jwt.verify = (token, key) => {
    return true;
  };
  let req = {
    method: 'get',
    headers: {
      authorization: 'Bearer aFakeToken',
    },
  };
  workout.handler(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
  });
});
console.groupEnd();
