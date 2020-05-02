'use strict';

const { assert, it } = require('../js-unit-test-library');
const handlers = require('../../handlers');

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

it("'/api/users' path should have status code 405 for a method that is not allowed", () => {
  let _statusCode, _data;
  handlers.users({ method: 'notallowed' }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 405);
  assert.strictEqual(_data, 'Method Not Allowed');
});

it("'/api/users' path should handle 'get' method", () => {
  let _statusCode, _data;
  handlers.users({ method: 'get', query: { id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  setTimeout(() => {
    assert.strictEqual(_statusCode, 200);
    assert.strictEqual(typeof _data, 'object');
  }, 100);
});

it("'/api/users' path should handle invalid id in 'get' method", () => {
  let _statusCode, _data;
  handlers.users({ method: 'get', query: { id: 0 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Please provide a valid id' });
});

it("'/api/users' path should handle invalid post request", () => {
  let _statusCode, _data;
  // id is missing in the buffer object, so the request is invalid
  const handlerData = {
    method: 'post',
    buffer: Buffer.from(JSON.stringify({ message: 'hello world' })),
  };
  handlers.users(handlerData, (statusCode, data) => {
    _data = data;
    _statusCode = statusCode;
  });
  assert.strictEqual(_statusCode, 500);
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

// it("'/api/logs' path should handle a valid post request", () => {
//   // id is missing in the buffer object, so the request is invalid
//   const handlerData = {
//     method: 'post',
//     buffer: Buffer.from(JSON.stringify({ id: 'test', message: 'hello world' })),
//   };
//   handlers.logs(handlerData, (statusCode, data) => {
//     assert.strictEqual(statusCode, 200);
//   });
// });

// it("'/api/users' path should handle a valid post request", () => {
//   // id is missing in the buffer object, so the request is invalid
//   const handlerData = {
//     method: 'post',
//     buffer: Buffer.from(JSON.stringify({ id: '1', username: 'amitgupta15@gmail.com', password: null, fname: 'Amit', lname: 'Gupta', logs: [] })),
//   };
//   handlers.users(handlerData, (statusCode, data) => {
//     assert.strictEqual(statusCode, 200);
//   });
// });
