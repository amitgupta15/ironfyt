'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const movementpr = require('./../../handlers/movementpr');

console.group('\x1b[33m%s\x1b[0m', 'handlers/movementpr.js Tests');

it('should check for user_id and movement name before creating a new movement personal record', () => {
  let options = {
    database: {
      collection: (name) => {
        return {
          insertOne: function (obj, callback) {
            callback(false, { ops: [] });
          },
        };
      },
    },
  };
  let _statusCode, _data;
  //Movement name is missing, so the post call should return 400
  let req = {
    buffer: Buffer.from(JSON.stringify({ user_id: '123456789123456789123456', pr: [{ reps: 1, load: 135, unit: 'lbs', date: new Date() }] })),
  };
  movementpr.post(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 400);
  assert.equal(_data, 'Missing required data. Please make sure to include user_id and movement name');

  //user_id is missing, so the post call should return 400
  req = {
    buffer: Buffer.from(JSON.stringify({ movement: 'Bench Press', pr: [{ reps: 1, load: 135, unit: 'lbs', date: new Date() }] })),
  };
  movementpr.post(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 400);
  assert.equal(_data, 'Missing required data. Please make sure to include user_id and movement name');

  //movement name and user_id are missing, so the post call should return 400
  req = {
    buffer: Buffer.from(JSON.stringify({ pr: [{ reps: 1, load: 135, unit: 'lbs', date: new Date() }] })),
  };
  movementpr.post(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 400);
  assert.equal(_data, 'Missing required data. Please make sure to include user_id and movement name');

  //user_id and movement name provided. post call should return 200;
  req = {
    buffer: Buffer.from(JSON.stringify({ user_id: '123456789123456789123456', movement: 'Bench Press', pr: [{ reps: 1, load: 135, unit: 'lbs', date: new Date() }] })),
    options,
  };
  movementpr.post(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 200);
});

it('should create a new workout if no _id is provided, otherwise it should update the existing workout', () => {
  let options = {
    database: {
      collection: (name) => {
        return {
          replaceOne: function (params, obj, callback) {
            callback(false, { ops: [{ _id: '123' }] });
          },
          insertOne: function (obj, callback) {
            callback(false, { ops: [{ _id: '456' }] });
          },
        };
      },
    },
  };
  let _statusCode, _data;
  //No _id. post call should return 200 with a new record;
  let req = {
    buffer: Buffer.from(JSON.stringify({ user_id: '123456789123456789123456', movement: 'Bench Press', pr: [{ reps: 1, load: 135, unit: 'lbs', date: new Date() }] })),
    options,
  };
  movementpr.post(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 200);
  assert.equal(_data.movementpr._id, '456');

  //Existing _id. Post should update the record and return 200
  req = {
    buffer: Buffer.from(JSON.stringify({ _id: '123456789123456789123459', user_id: '123456789123456789123456', movement: 'Bench Press', pr: [{ reps: 1, load: 135, unit: 'lbs', date: new Date() }] })),
    options,
  };
  movementpr.post(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 200);
  assert.equal(_data.movementpr._id, '123');
});

it('should get all movement personal records', () => {
  let _statusCode, _data;
  let req = {
    query: {
      user_id: '123456789123456789123456',
    },
    options: {
      database: {
        collection: () => {
          return {
            aggregate: () => {
              return {
                sort: () => {
                  return {
                    toArray: (callback) => {
                      callback(false, 'response');
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

  movementpr.get(req, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 200);
  assert.equal(_data, 'response');
});
console.groupEnd();
