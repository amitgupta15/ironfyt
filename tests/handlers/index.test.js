'use strict';

const { assert, it } = require('../js-unit-test-library');
const handlers = require('../../handlers');
const dataservice = require('../../data-service');

const tearDown = () => {
  dataservice.create = (dir, file, data, callback) => {};
  dataservice.update = (dir, file, data, callback) => {};
  // dataservice.read = (dir, file, callback) => {};
  dataservice.delete = (dir, file, callback) => {};
};

/** Globally stubbing the data services to avoid any unintentional overwrite of data **/
tearDown();
/** End Data Service Stub **/

it('should only allow get, post, put, and delete http methods', () => {
  assert.ok(handlers.isMethodAllowed('GET'));
  assert.ok(handlers.isMethodAllowed('POST'));
  assert.ok(handlers.isMethodAllowed('PUT'));
  assert.ok(handlers.isMethodAllowed('DELETE'));
  assert.ok(!handlers.isMethodAllowed('SOMETHING'));
});

it("'/' path should have status code 200 and no data", () => {
  // Create variables here and assign inside callback. This way if the callback is not called, these variables will be undefined and the callback error will get caught.
  let _statusCode, _data;
  handlers.default('', (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data, undefined);
});

/**
 * ================== '/api/workouts' Tests ==========================
 *
 */
it("'/api/workouts' path should have status code 405 for a method that is not allowed", () => {
  let _statusCode, _data;
  handlers.workouts({ method: 'notallowed' }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 405);
  assert.strictEqual(_data, 'Method Not Allowed');
});

it("'/api/workouts' path should handle 'get' method", () => {
  let _statusCode, _data;
  handlers.workouts({ method: 'get', query: { id: 1 }, pathname: '/api/workouts' }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  setTimeout(() => {
    assert.strictEqual(_statusCode, 200);
    assert.strictEqual(typeof _data, 'object');
  }, 100);
});

it("'/api/workouts' path should handle invalid id in 'get' method", () => {
  let _statusCode, _data;
  handlers.workouts({ method: 'get', query: { id: 0 }, pathname: '/api/workouts' }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Please provide a valid id' });
});

it("'api/workouts?filter=all should handle a list of all workouts", () => {
  let _statusCode, _data;
  const payload = {
    method: 'get',
    query: { filter: 'all' },
  };
  handlers.workouts(payload, (statusCode, data) => {
    _data = data;
    _statusCode = statusCode;
  });

  assert.strictEqual(_statusCode, 200);
  assert.ok(_data instanceof Object);
});

it("'api/workouts should handle invalid filter criteria", () => {
  let _statusCode, _data;
  const payload = {
    method: 'get',
    query: { filter: 'blabla' },
  };
  handlers.workouts(payload, (statusCode, data) => {
    _data = data;
    _statusCode = statusCode;
  });

  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Invalid filter criteria' });
});

/**
 * ================== '/api/logs' Tests ==========================
 *
 */

it("'/api/logs' path should have status code 405 for a method that is not allowed", () => {
  let _statusCode, _data;
  handlers.logs({ method: 'notallowed' }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 405);
  assert.strictEqual(_data, 'Method Not Allowed');
});

it("'/api/logs' path should handle 'get' method", () => {
  let _statusCode, _data;
  handlers.logs({ method: 'get', query: { id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  setTimeout(() => {
    assert.strictEqual(_statusCode, 200);
    assert.strictEqual(typeof _data, 'object');
  }, 100);
});

it("'/api/logs' path should handle invalid id in 'get' method", () => {
  let _statusCode, _data;
  handlers.logs({ method: 'get', query: { id: 0 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Please provide a valid id' });
});

it("'api/logs?filter=all should handle a list of all logs", () => {
  let _statusCode, _data;
  const payload = {
    method: 'get',
    query: { filter: 'all' },
  };
  handlers.logs(payload, (statusCode, data) => {
    _data = data;
    _statusCode = statusCode;
  });

  assert.strictEqual(_statusCode, 200);
  assert.ok(_data instanceof Object);
});

it("'api/logs should handle invalid filter criteria", () => {
  let _statusCode, _data;
  const payload = {
    method: 'get',
    query: { filter: 'blabla' },
  };
  handlers.workouts(payload, (statusCode, data) => {
    _data = data;
    _statusCode = statusCode;
  });

  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Invalid filter criteria' });
});

/**
 * ================== '/api/users' Tests ==========================
 *
 */

it("'/api/users' METHOD NOT ALLOWED - path should have status code 405 for a method that is not allowed", () => {
  let _statusCode, _data;
  handlers.users({ method: 'notallowed' }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 405);
  assert.strictEqual(_data, 'Method Not Allowed');
});

it("'/api/users' GET - path should handle 'get' method", () => {
  const user = { _id: 1, username: 'amitgupta15@gmail.com', password: null, fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };
  // setUp - Stub the dataservice methods
  dataservice.read = (dir, _id, callback) => {
    _id === 1 ? callback(false, user) : callback('error');
  };
  // End setUp

  handlers.users({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, user);
  });

  //Clean up stub data
  tearDown();
});

it("'/api/users' INVALID GET - path should handle invalid id in 'get' method", () => {
  // setUp - Stub the dataservice methods
  dataservice.read = (dir, _id, callback) => {
    callback('error'); // Invalid request generates error response
  };
  // End setUp

  handlers.users({ method: 'get', query: { id: 0 } }, (statusCode, data) => {
    assert.strictEqual(statusCode, 400);
    assert.deepStrictEqual(data, { error: 'Please provide a valid id' });
  });

  //Clean up stub data
  tearDown();
});

it("'/api/users' INVALID POST - path should handle invalid post request", () => {
  dataservice.create = (dir, _id, buffer, callback) => {};
  let _statusCode, _data;
  // id is missing in the buffer object, so the request is invalid
  const payload = {
    method: 'post',
    buffer: Buffer.from(JSON.stringify({ message: 'missing fields, invalid data' })),
  };
  handlers.users(payload, (statusCode, data) => {
    _data = data;
    _statusCode = statusCode;
  });
  assert.strictEqual(_statusCode, 500);
  assert.deepStrictEqual(_data, { error: 'Missing required fields: _id, username, password, fname, lname, logs, workouts' });
});

it("'/api/users' POST - path should handle a valid post request", () => {
  // Stub dataservice.create method
  dataservice.create = (dir, _id, buffer, callback) => {
    assert.strictEqual(dir, 'users');
    assert.strictEqual(typeof _id, 'number');
    assert.strictEqual(_id, 1);
    assert.strictEqual(buffer.username, 'amitgupta15@gmail.com');
    assert.strictEqual(buffer.password, null);
    assert.strictEqual(buffer.fname, 'Amit');
    assert.strictEqual(buffer.lname, 'Gupta');
    callback(false);
  };
  // End Stub

  const payload = {
    method: 'post',
    buffer: Buffer.from(
      JSON.stringify({ _id: 1, username: 'amitgupta15@gmail.com', password: null, fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] }),
    ),
  };
  handlers.users(payload, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, { message: 'New record created, record ID: 1' });
  });
});

it("'/api/users' INVALID PUT - path should handle an invalid put request", () => {
  //setUp() - stubs for dataservice methods
  const user = { _id: 1, username: 'amitgupta15@gmail.com', fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };
  dataservice.read = (dir, _id, callback) => {
    _id === 1 ? callback(false, user) : callback(true);
  };
  dataservice.update = (dir, _id, buffer, callback) => {
    callback('error'); // simulate error callback
  };
  // End setUp() - stubs for dataservice methods

  const payload = {
    method: 'put',
    buffer: Buffer.from(JSON.stringify({ _id: 1, name: 'something', message: 'Hello World!!!' })),
  };
  handlers.users(payload, (statusCode, data) => {
    assert.deepStrictEqual(data, { error: 'Could not update the user with _id: 1' });
    assert.strictEqual(statusCode, 500);
  });

  // Clean up stubs
  tearDown();
});

it("'api/users' PUT - path should handle a valid put request", () => {
  //setUp() - stubs for dataservice methods
  const user = { _id: 1, username: 'amitgupta15@gmail.com', fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };
  dataservice.read = (dir, _id, callback) => {
    _id === 1 ? callback(false, user) : callback(true);
  };
  dataservice.update = (dir, _id, buffer, callback) => {
    callback(); // No param means successful operation
  };
  // End setUp() - stubs for dataservice methods

  const payload = {
    method: 'put',
    buffer: Buffer.from(JSON.stringify({ ...user, logs: [1, 2] })),
  };

  assert.strictEqual(user.logs.length, 0);
  handlers.users(payload, (statusCode, data) => {
    assert.deepStrictEqual(data, { message: 'User successfully updated, user _id : 1' });
    assert.strictEqual(statusCode, 200);
  });
  assert.strictEqual(user.logs.length, 2);

  //Clean up stubs
  tearDown();
});

/** Helper Functions Tests */
it('should get the latest id for a directory', () => {
  var maxId = handlers.getMaxId('tests');
  assert.strictEqual(typeof maxId, 'number');
});
/**
 * ======= Create record tests. Isolating these tests so that they don't pollute the data directories.=======
 *
 * */

// it("'/api/workouts' path should handle a valid post request", () => {
//   // id is missing in the buffer object, so the request is invalid
//   const handlerData = {
//     method: 'post',
//     buffer: Buffer.from(JSON.stringify({ id: 'test', message: 'hello world' })),
//   };
//   handlers.workouts(handlerData, (statusCode, data) => {
//     assert.strictEqual(statusCode, 200);
//   });
// });

// it("'/api/workouts' path should hand a valid put request", () => {
//   let _statusCode;
//   const handlerData = {
//     method: 'put',
//     buffer: Buffer.from(JSON.stringify({ id: '15', name: 'something', message: 'Hello World!!!' })),
//   };
//   handlers.workouts(handlerData, (statusCode, data) => {
//     _statusCode = statusCode;
//   });

//   setTimeout(() => {
//     assert.strictEqual(_statusCode, 200);
//   }, 100);
// });

it("'/api/logs' POST - path should handle a valid post request", () => {
  const log = {
    user_id: '5',
    date: '2020-05-07T07:00:00.000Z',
    notes: 'Finished Workout',
  };
  // setUp - Stub the dataservices methods
  handlers.getMaxId = (dir) => {
    return 0;
  };
  dataservice.create = (dir, _id, buffer, callback) => {
    callback(); // No param means successful operation
    console.log();
  };
  // End setUp
  const handlerData = {
    method: 'post',
    buffer: Buffer.from(JSON.stringify(log)),
  };
  handlers.logs(handlerData, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, { ...log, id: 1 });
  });

  // Clean up Stubs
  tearDown();
  handlers.getMaxId = {};
});
