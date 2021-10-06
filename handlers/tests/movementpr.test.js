'use strict';
const $test = require('../../vendor/nodejs-unit-test-library');
const { assert, it } = $test;
const movementpr = require('./../../handlers/movementpr');

console.group('\x1b[33m%s\x1b[0m', 'handlers/movementpr.js Tests');

it('should check for user_id and movement name before creating a new movement personal record', () => {
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
  };
  movementpr.post(req, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 200);
});

it('should get all movement personal records', () => {
  let _statusCode, _data;

  movementpr.get({}, function (statusCode, data) {
    _statusCode = statusCode;
    _data = data;
  });
  assert.equal(_statusCode, 200);
  assert.equal(_data, 'Get');
});
console.groupEnd();
