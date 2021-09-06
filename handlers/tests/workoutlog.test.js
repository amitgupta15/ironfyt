'use strict';
const { ObjectID } = require('bson');
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
    assert.strictEqual(response.workoutlogs.length, 2);
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
    assert.strictEqual(response.workoutlog.notes, 'some notes');
  });
});

it('should edit an existing workout log', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ _id: '012345678901234567890123', notes: 'workout 2' })),
    options: {
      database: {
        collection: () => {
          return {
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
  workoutlog.post(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(response.workoutlog.notes, 'workout 1');
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
    assert.strictEqual(data.deletedCount, 1);
  });
});

it('should accept valid filter parameters', function () {
  let req = {
    query: {
      user_id: '012345678901234567891234',
      startdate: '2020-01-01T00:00:00.000Z',
      enddate: '2020-01-31T23:59:59.000Z',
    },
    tokenpayload: {},
    options: {
      database: {
        collection: () => {
          return {
            aggregate: (args) => {
              let match = args[0]['$match'];
              assert.strictEqual(JSON.stringify(match.user_id), '"012345678901234567891234"');
              assert.strictEqual(JSON.stringify(match.date), '{"$gte":"2020-01-01T00:00:00.000Z","$lte":"2020-01-31T23:59:59.000Z"}');
              return {
                toArray: (callback) => {
                  callback(false, []);
                },
              };
            },
          };
        },
      },
    },
  };

  workoutlog.get(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.workoutlogs.length, 0);
  });
});

console.groupEnd();
