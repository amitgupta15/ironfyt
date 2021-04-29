'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const workoutlog = require('./../../handlers/workoutlog');

console.group('\x1b[33m%s\x1b[0m', 'handlers/workoutlog.js Tests');

it('should query all workouts logs if no id is provided', () => {
  let req = {
    options: {
      database: {
        collection: () => {
          return {
            aggregate: () => {
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
    tokenpayload: {},
  };
  workoutlog.get(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(response.code, 0);
    assert.strictEqual(response.data.workoutlogs.length, 2);
  });
});

it('should create a new workout log', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ date: Date.now(), notes: 'some notes' })),
    options: {
      database: {
        collection: () => {
          return {
            insertOne: (data, callback) => {
              callback(false, { ops: [{ notes: 'some notes' }] });
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {},
  };
  workoutlog.post(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(response.code, 0);
    assert.strictEqual(response.data.workoutlog.notes, 'some notes');
  });
});

it('should edit an existing workout log', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ _id: '012345678901234567890123', notes: 'workout 2' })),
    options: {
      database: {
        collection: () => {
          return {
            findOne: (option, callback) => {
              callback(false, { _id: '012345678901234567890123', name: 'workout 1' });
            },
            replaceOne: (_id, data, callback) => {
              callback(false, { ops: [{ notes: 'workout 1' }] });
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {},
  };
  workoutlog.put(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(response.data.workoutlog.notes, 'workout 1');
  });
});

it('should delete a workout log', () => {
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
    tokenpayload: {},
  };
  workoutlog.delete(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.data.deletedCount, 1);
  });
});

console.groupEnd();
