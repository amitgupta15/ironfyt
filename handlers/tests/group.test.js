'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const group = require('./../../handlers/group');

it('should handle get request with group id and date', function () {
  let req = {
    tokenpayload: {},
    options: {
      database: {
        collection: function () {
          return {
            aggregate: function () {
              return {
                toArray: function (callback) {
                  callback(false, ['record 1', 'record 2']);
                },
              };
            },
          };
        },
      },
    },
    query: {},
  };

  group.get(req, function (statusCode, message) {
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(message.error, 'Invalid group query');
  });

  req.query = {
    _id: '123412341234123412341234',
    date: '2021-01-01T00:00.000Z',
  };

  group.get(req, function (statusCode, result) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(result.length, 2);
  });
});
