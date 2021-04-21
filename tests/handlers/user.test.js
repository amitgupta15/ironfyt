'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const user = require('../../handlers/user');

console.group('\x1b[33m%s\x1b[0m', 'handlers/user.js Tests');

let bcrypt, compare, hash, jwt, sign;
$test.setUp = () => {
  bcrypt = require('bcrypt');
  compare = bcrypt.compare;
  hash = bcrypt.hash;

  jwt = require('jsonwebtoken');
  sign = jwt.sign;
};

$test.tearDown = () => {
  bcrypt.compare = compare;
  bcrypt.hash = hash;
  jwt.sign = sign;
};

// login
it('user.login() should not allow POST method', function () {
  let _statusCode, _data;
  let payload = {
    method: 'post',
  };
  user.login(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 405);
});

it('user.login() should handle a valid login request', function () {
  //stub bcrypt.compare
  bcrypt.compare = function (stringOne, hashedString, callback) {
    callback(false, true); //callback(error, success)
  };
  jwt.sign = function (obj, key) {
    return 'A fake token';
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
    buffer: JSON.stringify({ email: 'amitgupta15@gmail.com', password: 'pp' }),
    options: { database },
  };

  let _statusCode, _data;
  user.login(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 201);
  assert.strictEqual(_data.data.token, 'A fake token');
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
  user.register(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 201);
  assert.strictEqual(_data.data.message, 'Registration Successful');
});
console.groupEnd();
