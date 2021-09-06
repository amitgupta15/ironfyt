'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const groupwod = require('./../../handlers/groupwod');

console.group('\x1b[33m%s\x1b[0m', 'handlers/groupwod.js Tests');
it('should fetch the latest wod for all the groups', () => {
  let req = {
    options: {
      database: {
        collection: () => {
          return {
            findOne: (params, callback) => {
              callback(false, { email: 'amitgupta15@gmail.com', groups: [1, 2] });
            },
            aggregate: () => {
              return {
                toArray: (callback) => {
                  callback(false, [{ name: 'group 1' }, { name: 'group 2' }]);
                },
              };
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {
      user: {
        _id: 1234,
      },
    },
  };
  groupwod.get(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(response.length, 2);
  });
});

it('should update/insert a new group wod for a given date and group', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ workout_id: '123412341234123412341234', date: Date.now(), group_id: '123412341234123412341235' })),
    options: {
      database: {
        collection: () => {
          return {
            replaceOne: function (params, obj, options, callback) {
              callback(false, { ops: [{ _id: '123' }] });
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {
      user: {
        _id: 1234,
      },
    },
  };
  let _statusCode, _response;
  groupwod.post(req, function (statusCode, response) {
    _statusCode = statusCode;
    _response = response;
  });

  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_response._id, '123');
});
console.groupEnd();
