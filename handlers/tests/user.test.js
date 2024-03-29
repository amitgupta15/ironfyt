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
    method: 'post',
    buffer: JSON.stringify({ email: 'amitgupta15@gmail.com', password: 'pp' }),
    options: { database },
  };

  let _statusCode, _data;
  user.login(payload, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 201);
  assert.strictEqual(_data.token, 'A fake token');
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
  assert.strictEqual(_data.message, 'Registration Successful');
});

it('should query a user for a given id', () => {
  let req = {
    options: {
      database: {
        collection: () => {
          return {
            findOne: (option, callback) => {
              callback(false, { name: 'amit' });
            },
          };
        },
      },
    },
    query: { _id: '012345678901234567890123' },
    tokenpayload: {
      user: { _id: '012345678901234567890123' },
    },
  };
  user.get(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(response.user.name, 'amit');
  });
});

it('should query all users if no id is provided', () => {
  let req = {
    options: {
      database: {
        collection: () => {
          return {
            find: () => {
              return {
                toArray: (callback) => {
                  callback(false, [{ name: 'user 1' }, { name: 'user 2' }]);
                },
              };
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {
      user: { role: 'admin' },
    },
  };
  user.get(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.users.length, 2);
  });
});

it('should NOT query all users if the logged in user is not an admin', () => {
  let req = {
    options: {
      database: {
        collection: () => {
          return {
            find: () => {
              return {
                toArray: (callback) => {
                  callback(false, [{ name: 'user 1' }, { name: 'user 2' }]);
                },
              };
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {
      user: { role: 'notadmin' },
    },
  };
  user.get(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(data.error, 'Not Authorized');
  });
});

//Not a good test. Dig deeper to check
it('should edit an existing user', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ _id: '012345678901234567890123', fname: 'amit', lname: 'gupta' })),
    options: {
      database: {
        collection: () => {
          return {
            findOne: (option, callback) => {
              callback(false, { _id: '012345678901234567890123', fname: 'pooja' });
            },
            replaceOne: (_id, data, callback) => {
              callback(false, { ops: [{ fname: 'pooja' }] });
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {
      user: { _id: '012345678901234567890123' },
    },
  };
  user.put(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.updateduser.fname, 'pooja');
  });
});
it('should delete a user', () => {
  let req = {
    options: {
      database: {
        collection: () => {
          return {
            removeOne: (filter, callback) => {
              callback(false, { deletedCount: 1 });
            },
          };
        },
      },
    },
    query: { _id: '012345678901234567890123' },
    tokenpayload: {
      user: { role: 'admin' },
    },
  };
  user.delete(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.deletedCount, 1);
  });
});

console.groupEnd();
