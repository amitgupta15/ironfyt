'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const workoutlog = require('./../../handlers/workoutlog');

console.group('\x1b[33m%s\x1b[0m', 'handlers/workoutlog.js Tests');

it('should query a workout log for a given id', () => {
  let req = {
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
    tokenpayload: {},
  };
  workoutlog.get(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.code, 0);
    // assert.strictEqual(data.data.workout.name, 'workout 1');
  });
});

console.groupEnd();
