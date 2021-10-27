'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const workout = require('./../../handlers/workout');

console.group('\x1b[33m%s\x1b[0m', 'handlers/workout.js Tests');

it('should query a workout for a given id', () => {
  let req = {
    options: {
      database: {
        collection: () => {
          return {
            aggregate: () => {
              return {
                toArray: (callback) => {
                  callback(false, [{ name: 'workout 1' }]);
                },
                sort: () => {
                  return {};
                },
              };
            },
          };
        },
      },
    },
    query: { _id: '111111111111111111111111' },
    tokenpayload: {},
  };
  let _statusCode, _data;
  workout.get(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });

  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data.workouts[0].name, 'workout 1');
});

it('should query all workouts if no id is provided', () => {
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
                sort: function () {
                  return {};
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
  let _statusCode, _data;
  workout.get(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data.workouts.length, 2);
});

it('should query workouts created by the user and the admin if group_wods flag is set', function () {
  let req = {
    tokenpayload: { user: { _id: '111111111111111111111111', groups: ['222222222222222222222222', '222222222222222222222223'] } },
    query: { group_wods: '1' },
    options: {
      database: {
        collection: (name) => {
          if (name === 'groups') {
            return {
              find: () => {
                return {
                  sort: function () {
                    return {
                      project: function () {
                        return {
                          toArray: function (callback) {
                            callback(false, [{ admins: ['111111111111111111111112', '111111111111111111111113'] }]);
                          },
                        };
                      },
                    };
                  },
                };
              },
            };
          } else if (name === 'workouts') {
            return {
              aggregate: () => {
                return {
                  toArray: (callback) => {
                    callback(false, [{ _id: '1' }, { _id: '2' }]);
                  },
                };
              },
            };
          }
        },
      },
    },
  };
  let _statusCode, _data;
  workout.get(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data.workouts.length, 2);
});

it('should gracefully handle the sitation where user does not belong to any group and group_wods flag is set', function () {
  let req = {
    tokenpayload: { user: { _id: '111111111111111111111111' } }, // No groups specified
    query: { group_wods: '1' },
    options: {
      database: {
        collection: (name) => {
          if (name === 'groups') {
            return {
              find: () => {
                return {
                  sort: function () {
                    return {
                      project: function () {
                        return {
                          toArray: function (callback) {
                            callback(false, [{ admins: ['111111111111111111111112', '111111111111111111111113'] }]);
                          },
                        };
                      },
                    };
                  },
                };
              },
            };
          } else if (name === 'workouts') {
            return {
              aggregate: () => {
                return {
                  toArray: (callback) => {
                    callback(false, [{ _id: '1' }, { _id: '2' }]);
                  },
                };
              },
            };
          }
        },
      },
    },
  };
  let _statusCode, _data;
  workout.get(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data.workouts.length, 2);
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
  let _statusCode, _data;
  workout.post(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data.workout.name, 'workout 1');
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
  let _statusCode, _data;
  workout.post(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data.workout.description, 'run 5 miles');
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
  let _statusCode, _data;
  workout.delete(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data.deletedCount, 1);
});

console.groupEnd();
