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

it('should query a workout for a given id', () => {
  let _verifyToken = workout.verifyToken;
  workout.verifyToken = function (headers, res, callback) {
    callback({});
  };
  let req = {
    method: 'get',
    headers: {
      authorization: 'Bearer aFakeToken',
    },
    options: {
      database: {
        collection: () => {
          return {
            findOne: (option, callback) => {
              callback(false, { name: 'workout 1' });
            },
          };
        },
      },
    },
    query: { _id: '111111111111111111111111' },
  };
  workout.handler(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.code, 0);
    assert.strictEqual(data.data.workout.name, 'workout 1');
  });

  workout.verifyToken = _verifyToken;
});

it('should query all workouts if no id is provided', () => {
  let _verifyToken = workout.verifyToken;
  workout.verifyToken = function (headers, res, callback) {
    callback({});
  };
  let req = {
    method: 'get',
    headers: {
      authorization: 'Bearer aFakeToken',
    },
    options: {
      database: {
        collection: () => {
          return {
            find: () => {
              return {
                toArray: (callback) => {
                  callback(false, [{ name: 'workout 1' }, { name: 'workout 2' }]);
                },
              };
            },
          };
        },
      },
    },
    query: {},
  };
  workout.handler(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.code, 0);
    assert.strictEqual(data.data.workouts.length, 2);
  });

  workout.verifyToken = _verifyToken;
});
console.groupEnd();
