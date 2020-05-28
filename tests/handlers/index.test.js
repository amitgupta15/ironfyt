'use strict';

const { assert, it } = require('../js-unit-test-library');
const handlers = require('../../handlers');
const dataservice = require('../../data-service');

const tearDown = () => {
  dataservice.create = (dir, file, data, callback) => {};
  dataservice.update = (dir, file, data, callback) => {};
  dataservice.read = (dir, file, callback) => {};
  dataservice.delete = (dir, file, callback) => {};
  dataservice.list = {};
  dataservice.readSync = {};
};

/** Globally stubbing the data services to avoid any unintentional overwrite of data **/
tearDown();
/** End Data Service Stub **/

it('should only allow [get, post, put, and delete] http methods', () => {
  assert.ok(handlers.isMethodAllowed('GET'));
  assert.ok(handlers.isMethodAllowed('POST'));
  assert.ok(handlers.isMethodAllowed('PUT'));
  assert.ok(handlers.isMethodAllowed('DELETE'));
  assert.ok(!handlers.isMethodAllowed('SOMETHING'));
});

it("'/' path should have status code 200 and no data", () => {
  // Create variables here and assign inside callback. This way if the callback is not called, these variables will be undefined and the callback error will get caught.
  handlers.default('', (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(data, undefined);
  });
});

/**
 * ================== '/api/workouts' Tests ==========================
 *
 */
it("'/api/workouts' WORKOUTS METHODS NOT ALLOWED path should have status code 405 for a method that is not allowed", () => {
  handlers.workouts({ method: 'notallowed' }, (statusCode, data) => {
    assert.strictEqual(statusCode, 405);
    assert.strictEqual(data, 'Method Not Allowed');
  });
});

it("'/api/workouts' WORKOUTS POST path should handle a post request", () => {
  dataservice.list = (dir) => []; // Stub

  // Missing required fields
  dataservice.create = (dir, file, data, callback) => callback('error'); // Stub
  handlers.workouts({ method: 'post', buffer: Buffer.from(JSON.stringify({ message: 'hello world' })) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 500);
    assert.deepStrictEqual(data, { error: 'Missing required fields: name, description' });
  });

  // Server Error
  handlers.workouts({ method: 'post', buffer: Buffer.from(JSON.stringify({ name: 'workout', description: 'description' })) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 400);
    assert.deepStrictEqual(data, { error: 'Could not create a new record with id 1' });
  });

  // Successfully created workout
  dataservice.create = (dir, file, data, callback) => callback(false); // Stub
  handlers.workouts({ method: 'post', buffer: Buffer.from(JSON.stringify({ name: 'workout', description: 'description' })) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, { _id: 1, name: 'workout', description: 'description' });
  });

  //teardown
  tearDown();
});

it("'/api/workouts' WORKOUTS GET path should handle a get request", () => {
  // Successful retrieval of data
  dataservice.read = (dir, file, callback) => callback(false, { _id: 1 }); // Stub
  let _statusCode, _data;
  handlers.workouts({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, { _id: 1 });

  //_id does not exist
  dataservice.read = (dir, file, callback) => (file === 1 ? callback(false) : callback('error')); // Stub
  handlers.workouts({ method: 'get', query: { _id: 0 } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 500);
    assert.deepStrictEqual(data, { error: 'Error reading data with id - 0' });
  });

  // Invalid id
  dataservice.read = (dir, file, callback) => (file === 1 ? callback(false) : callback('error')); // Stub
  handlers.workouts({ method: 'get', query: { id: 'abc' } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 400);
    assert.deepStrictEqual(data, { error: 'Please provide a valid id' });
  });

  //Invalid filter criteria
  handlers.workouts({ method: 'get', query: { filter: 'abc' } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 400);
    assert.deepStrictEqual(data, { error: 'Invalid filter criteria' });
  });

  //Valid filter criteria
  dataservice.list = (dir) => [1]; // Stub
  dataservice.readSync = (dir, file) => ({ _id: file }); // Stub

  handlers.workouts({ method: 'get', query: { filter: 'all' } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, { workouts: [{ _id: 1 }] });
  });

  //tearDown
  tearDown();
});

/**
 * ================== '/api/logs' Tests ==========================
 *
 */

it("'/api/logs' LOGS METHODS NOT ALLOWED path should have status code 405 for a method that is not allowed", () => {
  handlers.logs({ method: 'notallowed' }, (statusCode, data) => {
    assert.strictEqual(statusCode, 405);
    assert.strictEqual(data, 'Method Not Allowed');
  });
});

it("'/api/logs' LOGS POST - path should handle a post request", () => {
  const log = { user_id: '5', date: '2020-05-07T07:00:00.000Z', notes: 'Finished Workout' };

  dataservice.list = (dir) => []; // Stub
  dataservice.create = (dir, _id, buffer, callback) => callback(); // No param means successful operation  // Stub

  //Successful POST
  handlers.logs({ method: 'post', buffer: Buffer.from(JSON.stringify(log)) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, { ...log, _id: 1 });
  });

  //Invalid POST
  handlers.logs({ method: 'post', buffer: Buffer.from(JSON.stringify({ notes: 'Finished Workout' })) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 500);
    assert.deepStrictEqual(data, { error: 'Required fields missing: user_id, date' });
  });

  // Clean up Stubs
  tearDown();
});

it("'/api/logs' LOGS GET path should handle unsuccessful (503) database connection", () => {
  let _statusCode, _data;

  // No connection to the database server
  handlers.db = undefined;
  handlers.logs({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 503);
  assert.deepStrictEqual(_data, { error: 'Could not connect to the database server' });

  //tearDown
  handlers.db = undefined;
});

it("'/api/logs' LOGS GET path should handle a successful (200) get request for a given id", () => {
  let _statusCode, _data;
  // Successful connection to the database server
  handlers.db = {
    collection: (collectionName) => {
      return {
        findOne: (filter, callback) => {
          callback(false, { _id: 1, user_id: 1 });
        },
      };
    },
  };
  handlers.logs({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, { _id: 1, user_id: 1 });

  handlers.db = undefined;
});

it("'/api/logs' LOGS GET path should handle an unsuccessful (400) get request for a given id", () => {
  let _statusCode, _data;

  // Unknown database error
  handlers.db = {
    collection: (collectionName) => {
      return {
        findOne: (filter, callback) => {
          callback({ error: 'Some error occurred' });
        },
      };
    },
  };
  handlers.logs({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Some error occurred' });

  //Null result
  handlers.db = {
    collection: (collectionName) => {
      return {
        findOne: (filter, callback) => {
          callback(false, null);
        },
      };
    },
  };
  handlers.logs({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'No record found for _id: 1' });
  handlers.db = undefined;
});

it("'/api/logs' LOGS GET path should handle an unsuccessful (400) get request for all records", () => {
  let _statusCode, _data;
  handlers.db = {
    collection: (collectionName) => {
      return {
        find: (filter, callback) => {
          callback({ error: 'Some error occurred' }, []);
        },
      };
    },
  };
  handlers.logs({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Some error occurred' });
  handlers.db = undefined;
});

it("'/api/logs' LOGS GET path should handle a successful (200) get request for all records", () => {
  let _statusCode, _data;
  handlers.db = {
    collection: (collectionName) => {
      return {
        find: (filter, callback) => {
          callback(false, []);
        },
      };
    },
  };
  handlers.logs({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, []);
  handlers.db = undefined;
});

/**
 * ================== '/api/users' Tests ==========================
 *
 */

it("'/api/users' USERS METHOD NOT ALLOWED - path should have status code 405 for a method that is not allowed", () => {
  handlers.users({ method: 'notallowed' }, (statusCode, data) => {
    assert.strictEqual(statusCode, 405);
    assert.strictEqual(data, 'Method Not Allowed');
  });
});

it("'/api/users' USERS  GET - path should handle get request", () => {
  const user = { _id: 1, username: 'amitgupta15@gmail.com', password: null, fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };

  // Successful GET
  dataservice.read = (dir, _id, callback) => (_id === 1 ? callback(false, user) : callback('error')); // Stub
  handlers.users({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, user);
  });

  // _id not found
  handlers.users({ method: 'get', query: { _id: 0 } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 400);
    assert.deepStrictEqual(data, { error: 'Error reading data with id - 0' });
  });

  // Invalid _id
  handlers.users({ method: 'get', query: { _id: 'abc' } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 400);
    assert.deepStrictEqual(data, { error: 'Please provide a valid id' });
  });

  //Clean up stub data
  tearDown();
});

it("'/api/users' USERS POST - path should handle a post request", () => {
  // Missing required fields
  handlers.users({ method: 'post', buffer: Buffer.from(JSON.stringify({ message: 'missing fields, invalid data' })) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 500);
    assert.deepStrictEqual(data, { error: 'Missing required fields: _id, username, password, fname, lname, logs, workouts' });
  });

  // Successful POST
  const newUser = { _id: 1, username: 'amitgupta15@gmail.com', password: null, fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };
  dataservice.create = (dir, _id, buffer, callback) => callback(false); // Stub
  handlers.users({ method: 'post', buffer: Buffer.from(JSON.stringify(newUser)) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, { message: 'New record created, record ID: 1' });
  });

  tearDown();
});

it("'/api/users' USERS PUT - path should handle a put request", () => {
  const user = { _id: 1, username: 'amitgupta15@gmail.com', fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };

  // Invalid PUT
  dataservice.read = (dir, _id, callback) => (_id === 1 ? callback(false, user) : callback(true)); //Stub
  dataservice.update = (dir, _id, buffer, callback) => callback('error'); // simulate error callback // Stub
  handlers.users({ method: 'put', buffer: Buffer.from(JSON.stringify({ _id: 1, message: 'Hello World!!!' })) }, (statusCode, data) => {
    assert.deepStrictEqual(data, { error: 'Could not update the user with _id: 1' });
    assert.strictEqual(statusCode, 500);
  });

  // Valid PUT
  dataservice.update = (dir, _id, buffer, callback) => callback(); // No param means successful operation
  assert.strictEqual(user.logs.length, 0);
  handlers.users({ method: 'put', buffer: Buffer.from(JSON.stringify({ ...user, logs: [1, 2] })) }, (statusCode, data) => {
    assert.deepStrictEqual(data, { message: 'User successfully updated, user _id : 1' });
    assert.strictEqual(statusCode, 200);
  });
  assert.strictEqual(user.logs.length, 2);

  // Clean up stubs
  tearDown();
});

/** Helper Functions Tests */
it('should get the latest id for a directory', () => {
  dataservice.list = (dir) => []; // Stub

  var maxId = handlers.getMaxId('tests');
  assert.strictEqual(maxId, 0);
});
