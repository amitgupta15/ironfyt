'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const workout = require('./../../handlers/workout');

console.group('\x1b[33m%s\x1b[0m', 'handlers/workout.js Tests');

let verifyToken;
$test.setUp = () => {
  verifyToken = workout.verifyToken;
  workout.verifyToken = function (headers, res, callback) {
    callback({});
  };
};

$test.tearDown = () => {
  workout.verifyToken = verifyToken;
};

it('should query a workout for a given id', () => {
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
    tokenpayload: {},
  };
  workout.get(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.code, 0);
    assert.strictEqual(data.data.workout.name, 'workout 1');
  });
});

it('should query all workouts if no id is provided', () => {
  let req = {
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
    tokenpayload: {},
  };
  workout.get(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.code, 0);
    assert.strictEqual(data.data.workouts.length, 2);
  });
});
it('should create a new workout', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ name: 'worout 1', description: 'some description' })),
    options: {
      database: {
        collection: () => {
          return {
            insertOne: (data, callback) => {
              callback(false, { ops: [{ name: 'workout 1' }] });
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {},
  };
  workout.post(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.code, 0);
    assert.strictEqual(data.data.workout.name, 'workout 1');
  });
});
it('should edit an existing workout', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ _id: '012345678901234567890123', name: 'workout 2', description: 'some description' })),
    options: {
      database: {
        collection: () => {
          return {
            findOne: (option, callback) => {
              callback(false, { _id: '012345678901234567890123', name: 'workout 1' });
            },
            replaceOne: (_id, data, callback) => {
              callback(false, { ops: [{ name: 'workout 1', description: 'run 5 miles' }] });
            },
          };
        },
      },
    },
    query: {},
    tokenpayload: {},
  };
  workout.put(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.data.workout.description, 'run 5 miles');
  });
});
it('should delete a workout', () => {
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
  workout.delete(req, function (statusCode, data) {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data.data.deletedCount, 1);
  });
});
console.groupEnd();
