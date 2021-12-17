'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const movement = require('./../../handlers/movement');
const ObjectId = require('mongodb').ObjectID;

console.group('\x1b[33m%s\x1b[0m', 'handlers/movement.js Tests');

it('should query by _id or by the given parameter successfully', () => {
  let _param;
  let req = {
    query: {},
    tokenpayload: { user: {} },
    options: {
      database: {
        collection: () => {
          return {
            aggregate: (param) => {
              _param = param;
              return {
                sort: () => {
                  return {
                    toArray: (callback) => {
                      callback();
                    },
                  };
                },
              };
            },
          };
        },
      },
    },
  };

  req.query = {
    _id: '123456789012345678901234',
  };
  let _statusCode, _data;
  movement.get(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(JSON.stringify(_param[0]), '{"$match":{"_id":"123456789012345678901234"}}');

  req.query = {
    primary: 'true',
  };
  movement.get(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(JSON.stringify(_param[0]), '{"$match":{"primary":true}}');
});
console.groupEnd();
