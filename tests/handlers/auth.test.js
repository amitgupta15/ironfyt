'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const auth = require('./../../handlers/auth');

console.group('\x1b[33m%s\x1b[0m', 'handlers/auth.js Tests');

// login
it('auth.login() should not allow POST method', function () {
  let _statusCode, _data;
  let payload = {
    method: 'post',
  };
  auth.login(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 405);
});

it('auth.login() should handle a valid login request', function () {
  //Import bcrypt library
  let bcrypt = require('bcrypt');
  //temporarily store the bcrypt.compare method in a temp variable so that the overridden method can be restored at the end of the test
  let _compare = bcrypt.compare;
  //Override the bcrypt.compare method
  bcrypt.compare = function (string, encryptedString, callback) {
    callback(false, true);
  };
  //create a dummy database connection with relevant dummy methods to provide data to the test
  let database = {
    collection: () => {
      return {
        findOne: (filter, callback) => {
          callback(false, { username: 'amitgupta15@gmail.com', password: '$2b$13$vFbCw1C/OYpUpyoJkVptO.dRuZZAW7lOCYKCXnZbeilQ0TLph27YG' }); //password: 'password'
        },
      };
    },
  };
  // create a dummy payload
  let payload = {
    method: 'get',
    buffer: JSON.stringify({ email: 'amitgupta15@gmail.com', password: 'password' }),
    options: { database },
  };

  let _statusCode, _data;
  auth.login(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 201);

  //restore the stubbed method
  bcrypt.compare = _compare;
});

console.groupEnd();
