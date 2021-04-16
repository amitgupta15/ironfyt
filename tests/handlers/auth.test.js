'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const auth = require('./../../handlers/auth');

console.group('\x1b[33m%s\x1b[0m', 'handlers/auth.js Tests');
let bcrypt, compare, hash;
$test.setUp = () => {
  bcrypt = require('bcrypt');
  compare = bcrypt.compare;
  hash = bcrypt.hash;
};

$test.tearDown = () => {
  bcrypt.compare = compare;
  bcrypt.hash = hash;
};

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
  //stub bcrypt.compare
  bcrypt.compare = function (stringOne, hashedString, callback) {
    callback(false, true); //callback(error, success)
  };

  //create a dummy database connection with relevant dummy methods to provide data to the test
  let database = {
    collection: () => {
      return {
        findOne: (filter, callback) => {
          if (filter.email === 'amitgupta15@gmail.com') {
            callback(false, { email: 'amitgupta15@gmail.com', password: '$2b$13$vFbCw1C/OYpUpyoJkVptO.dRuZZAW7lOCYKCXnZbeilQ0TLph27YG' }); //password: 'password'
          } else {
            callback('User not found');
          }
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
  assert.strictEqual(_data.token, 'A fake token');
  assert.strictEqual(_data.user.email, 'amitgupta15@gmail.com');
});

it('should register a user', function () {
  //stub the bcrypt.hash method
  bcrypt.hash = (password, saltRounds, callback) => {
    callback(false, 'hashedpassword');
  };

  //create a dummy database connection with relevant dummy methods to provide data to the test
  let database = {
    collection: () => {
      return {
        findOne: (filter, callback) => {
          callback(false, null);
        },
        insertOne: (doc, callback) => {
          callback(false, doc);
        },
      };
    },
  };
  // create a dummy payload
  let payload = {
    method: 'post',
    buffer: JSON.stringify({ email: 'amitgupta15@gmail.com', password: 'password' }),
    options: { database },
  };
  let _statusCode, _data;
  auth.register(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data, 'Registration Successful');
});
console.groupEnd();
