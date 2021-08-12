'use strict';
const { ObjectId } = require('mongodb');
const $test = require('../../vendor/nodejs-unit-test-library');
const pr = require('./../../handlers/personalrecord');
const { assert, it } = $test;

console.group('\x1b[33m%s\x1b[0m', 'handlers/personalrecord.js Tests');
it('should insert a new PR', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ _id: '123456789012345678901234', user_id: '555555555555555555555555', workout_id: '999999999999999999999999', date: Date.now(), duration: { hours: 0, minutes: 10, seconds: 0 }, notes: 'some notes' })),
    options: {
      database: {
        collection: (collectionName) => {
          if (collectionName === 'personalrecords') {
            return {
              findOne: (data, callback) => {
                callback(false, null);
              },
              replaceOne: ({}, record, {}, callback) => {
                callback(false, { ops: [record] });
              },
            };
          }
        },
      },
    },
    query: {},
    tokenpayload: {},
  };
  pr.post(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
  });
});

it('should update a PR', () => {
  let req = {
    buffer: Buffer.from(JSON.stringify({ _id: '123456789012345678901234', user_id: '555555555555555555555555', workout_id: '999999999999999999999999', date: Date.now(), duration: { hours: 0, minutes: 10, seconds: 0 }, notes: 'some notes' })),
    options: {
      database: {
        collection: (collectionName) => {
          if (collectionName === 'personalrecords') {
            return {
              findOne: (data, callback) => {
                callback(false, { workoutlog_id: '999999999999999999999999' });
              },
              replaceOne: ({}, record, {}, callback) => {
                callback(false, { ops: [record] });
              },
            };
          }
          if (collectionName === 'logs') {
            return {
              findOne: (data, callback) => {
                callback(false, { _id: '999999999999999999999999', duration: { hours: 0, minutes: 0, seconds: 0 } });
              },
            };
          }
          if (collectionName === 'workouts') {
            return {
              findOne: (data, callback) => {
                callback(false, { _id: '999999999999999999999999', type: 'For Time' });
              },
            };
          }
        },
      },
    },
    query: {},
    tokenpayload: {},
  };
  pr.post(req, function (statusCode, response) {
    assert.strictEqual(statusCode, 200);
  });
});

it('should test for "For Time" PR', () => {
  let currPR = { duration: { hours: 1, minutes: 10, seconds: 30 } };
  let newLog = { duration: { hours: 1, minutes: 11, seconds: 30 } };
  assert.strictEqual(pr.isNewForTimePR(currPR, newLog), true);

  newLog = { duration: { hours: 1, minutes: 0, seconds: 30 } };
  assert.strictEqual(pr.isNewForTimePR(currPR, newLog), false);
});
it('should test for "For Reps", "AMRAP", "Tabata" PR', () => {
  //Case where only rounds are provided
  let currPR = { roundinfo: [{ rounds: 5, load: null, unit: null }], totalreps: null };
  let newLog = { roundinfo: [{ rounds: 6, load: null, unit: null }], totalreps: null };
  assert.strictEqual(pr.isNewRepsAndRoundsPR(currPR, newLog), true);

  //Case where multiple rounds are provided
  currPR = {
    roundinfo: [
      { rounds: 5, load: null, unit: null },
      { rounds: 5, load: null, unit: null },
    ],
    totalreps: 300,
  };
  newLog = {
    roundinfo: [
      { rounds: 6, load: null, unit: null },
      { rounds: 5, load: null, unit: null },
    ],
    totalreps: 200,
  };
  assert.strictEqual(pr.isNewRepsAndRoundsPR(currPR, newLog), true);

  //Case where multiple rounds and load are provided
  currPR = {
    roundinfo: [
      { rounds: 5, load: 130, unit: null },
      { rounds: 5, load: 120, unit: null },
    ],
    totalreps: null,
  };
  newLog = {
    roundinfo: [
      { rounds: 5, load: 135, unit: null },
      { rounds: 5, load: 100, unit: null },
    ],
    totalreps: null,
  };
  assert.strictEqual(pr.isNewRepsAndRoundsPR(currPR, newLog), false);

  //Case where same multiple rounds and load are provided, with totalreps
  currPR = {
    roundinfo: [
      { rounds: 5, load: 130, unit: null },
      { rounds: 5, load: 130, unit: null },
    ],
    totalreps: 100,
  };
  newLog = {
    roundinfo: [
      { rounds: 5, load: 130, unit: null },
      { rounds: 5, load: 130, unit: null },
    ],
    totalreps: 110,
  };
  assert.strictEqual(pr.isNewRepsAndRoundsPR(currPR, newLog), true);

  //Case where only total reps are provided
  currPR = {
    roundinfo: [
      { rounds: null, load: null, unit: null },
      { rounds: null, load: null, unit: null },
    ],
    totalreps: 100,
  };
  newLog = {
    roundinfo: [
      { rounds: null, load: null, unit: null },
      { rounds: null, load: null, unit: null },
    ],
    totalreps: 90,
  };
  assert.strictEqual(pr.isNewRepsAndRoundsPR(currPR, newLog), false);
});

it('should test for "For Load" PR', () => {
  let prMovements = {
    movements: [
      { reps: 10, load: 135 },
      { reps: 10, load: 145 },
    ],
  };
  let newMovements = {
    movements: [
      { reps: 10, load: 135 },
      { reps: 10, load: 155 },
    ],
  };
  assert.strictEqual(pr.isNewForLoadPR(prMovements, newMovements), true);
});

it('should get PR successfully', () => {
  let req = {
    options: {
      database: {
        collection: function (collectionName) {
          if (collectionName === 'personalrecords') {
            return {
              aggregate: function () {
                return {
                  toArray: function (callback) {
                    callback(false, []);
                  },
                };
              },
            };
          }
        },
      },
    },
    query: {
      workout_id: '123412341234123412341234',
      user_id: '999999999999999999999999',
    },
  };
  let _statusCode;
  pr.get(req, (statusCode, data) => {
    _statusCode = statusCode;
  });
  assert.strictEqual(_statusCode, 200);
});
console.groupEnd();
