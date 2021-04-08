'use strict';

const { assert, it } = require('../../vendor/nodejs-unit-test-library');
const handlers = require('../../handlers');

it('should only allow [get, post, put, and delete] http methods', () => {
  assert.ok(handlers.isMethodAllowed('GET'));
  assert.ok(handlers.isMethodAllowed('POST'));
  assert.ok(handlers.isMethodAllowed('PUT'));
  assert.ok(handlers.isMethodAllowed('DELETE'));
  assert.ok(!handlers.isMethodAllowed('SOMETHING'));
});

it("'/' path should have status code 302 and string path data for default redirect", () => {
  // Create variables here and assign inside callback. This way if the callback is not called, these variables will be undefined and the callback error will get caught.
  handlers.default('', (statusCode, data) => {
    assert.strictEqual(statusCode, 302);
    assert.strictEqual(data, '/public/index.html');
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

it("'/api/workouts' WORKOUTS POST path should handle unsuccessful (503) database connection", () => {
  let _statusCode, _data;

  // No connection to the database server
  handlers.db = undefined;
  handlers.workouts({ method: 'post', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 503);
  assert.deepStrictEqual(_data, { error: 'Could not connect to the database server' });
});

it("'/api/workouts' WORKOUTS POST path should handle unsuccessful (400) collection count attempt", () => {
  let _statusCode, _data;

  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'workouts') {
        return {
          countDocuments: (cb) => {
            cb('error');
          },
        };
      }
    },
  };
  handlers.workouts({ method: 'post', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'error' });

  handlers.db = undefined;
});
it("'/api/workouts' WORKOUTS POST - path should handle a successful (200) post request", () => {
  let _statusCode, _data;
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'workouts') {
        return {
          countDocuments: (cb) => {
            cb(false, 0); // 0 Documents in the collection
          },
          insertOne: (doc, cb) => {
            if (doc) {
              cb(false, { ops: [doc] });
            } else {
              cb(true, 'no doc');
            }
          },
        };
      }
    },
  };
  const workout = { name: 'workout 1', description: 'some workout' };
  handlers.workouts({ method: 'post', buffer: Buffer.from(JSON.stringify(workout)) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, { _id: 1, description: 'some workout', name: 'workout 1' });

  handlers.db = undefined;
});
it("'/api/workouts' WORKOUTS GET path should handle unsuccessful (503) database connection", () => {
  let _statusCode, _data;
  handlers.db = undefined;
  handlers.workouts({ method: 'get' }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 503);
  assert.deepStrictEqual(_data, { error: 'Could not connect to the database server' });
});

it("'/api/workouts' WORKOUTS GET path should handle a successful (200) get request for a given id", () => {
  let _statusCode, _data;
  // Successful connection to the database server
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'workouts') {
        return {
          findOne: (filter, callback) => {
            callback(false, { _id: 1, user_id: 1 });
          },
        };
      }
    },
  };
  handlers.workouts({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, { _id: 1, user_id: 1 });

  handlers.db = undefined;
});

it("'/api/workouts' WORKOUTS GET path should handle an unsuccessful (400) get request for a given id", () => {
  let _statusCode, _data;
  // Successful connection to the database server
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'workouts') {
        return {
          findOne: (filter, callback) => {
            callback(false, { _id: 1, user_id: 1 });
          },
        };
      }
    },
  };
  handlers.workouts({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, { _id: 1, user_id: 1 });

  handlers.db = undefined;
});
it("'/api/workouts' WORKOUTS GET path should handle invalid url query (400)", () => {
  let _statusCode, _data;
  // Stub the mongoDB response
  //For this test, it is enough to have a handlers.db Object
  handlers.db = {};
  //End Stub
  // fname is invalid query, should send 400 statuscode
  handlers.workouts({ method: 'get', query: { fname: 'Amit' } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Invalid request' });
});
it("'/api/workouts' WORKOUTS GET path should handle an unsuccessful (400) get request for all records", () => {
  let _statusCode, _data;
  //Stub the MongoDB response object
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'workouts') {
        return {
          find: (filter, callback) => {
            callback({ error: 'Some error occurred' }, []);
          },
        };
      }
    },
  };
  //End stub
  //Call the method that makes MongoDB call, store result in temp variables
  handlers.workouts({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  //assert
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Some error occurred' });

  //reset the response object
  handlers.db = undefined;
});
it("'/api/workouts' WORKOUTS GET path should handle a successful (200) get request for all records", () => {
  let _statusCode, _data;
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'workouts') {
        return {
          find: (filter, callback) => {
            callback(false, {
              toArray: (cb) => cb(false, [{ _id: 1 }, { _id: 2 }]),
            });
          },
        };
      }
    },
  };
  handlers.workouts({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data.length, 2);
  handlers.db = undefined;
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

it("'/api/logs' LOGS POST path should handle unsuccessful (503) database connection", () => {
  let _statusCode, _data;

  // No connection to the database server
  handlers.db = undefined;
  handlers.logs({ method: 'post', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 503);
  assert.deepStrictEqual(_data, { error: 'Could not connect to the database server' });

  //tearDown
  handlers.db = undefined;
});
it("'/api/logs' LOGS POST path should handle unsuccessful (400) collection count attempt", () => {
  let _statusCode, _data;
  //Stub the call to MongoDB
  handlers.db = {
    collection: (collectionName) => {
      return {
        countDocuments: (callback) => {
          callback(true); //callback with error
        },
      };
    },
  };
  //End stub

  handlers.logs({ method: 'post', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: true }); // Error

  //tearDown
  handlers.db = undefined;
});

it("'/api/logs' LOGS POST - path should handle a successful (200) post request", () => {
  const log = { user_id: '5', date: '2020-05-07T07:00:00.000Z', notes: 'Finished Workout' };
  let _statusCode, _data;
  // Stub MongoDB call
  handlers.db = {
    collection: (collectionName) => {
      return {
        countDocuments: (callback) => {
          callback(false, 0); //No error, 0 documents
        },
        insertOne: (data, callback) => {
          callback(false, { ops: [data] });
        },
      };
    },
  };
  // End Stub

  //Successful POST
  handlers.logs({ method: 'post', buffer: Buffer.from(JSON.stringify(log)) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, { ...log, _id: 1 });

  //Invalid POST
  handlers.logs({ method: 'post', buffer: Buffer.from(JSON.stringify({ notes: 'Finished Workout' })) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 500);
  assert.deepStrictEqual(_data, { error: 'Required fields missing: user_id, date' });

  // Clean up Stubs
  handlers.db = undefined;
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
it("'/api/logs' LOGS GET path should handle invalid url query (400)", () => {
  let _statusCode, _data;
  // Stub the mongoDB response
  //For this test, it is enough to have a handlers.db Object
  handlers.db = {};
  //End Stub
  // fname is invalid query, should send 400 statuscode
  handlers.logs({ method: 'get', query: { fname: 'Amit' } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Invalid request' });
});

it("'/api/logs' LOGS GET path should handle an unsuccessful (400) get request for all records", () => {
  let _statusCode, _data;
  //Stub the MongoDB response object
  handlers.db = {
    collection: (collectionName) => {
      return {
        find: (filter, callback) => {
          callback({ error: 'Some error occurred' }, []);
        },
      };
    },
  };
  //End stub
  //Call the method that makes MongoDB call, store result in temp variables
  handlers.logs({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  //assert
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Some error occurred' });

  //reset the response object
  handlers.db = undefined;
});

it("'/api/logs' LOGS GET path should handle a successful (200) get request for all records", () => {
  let _statusCode, _data;
  handlers.db = {
    collection: (collectionName) => {
      return {
        find: (filter, callback) => {
          callback(false, {
            toArray: (cb) => cb(false, [{ _id: 1 }, { _id: 2 }]),
          });
        },
      };
    },
  };
  handlers.logs({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data.length, 2);
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

it("'/api/users' USERS PUT - path should handle unsuccessful (503) database connection", () => {
  let _statusCode, _data;

  // No connection to the database server
  handlers.db = undefined;
  handlers.users({ method: 'put', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 503);
  assert.deepStrictEqual(_data, { error: 'Could not connect to the database server' });

  //tearDown
  handlers.db = undefined;
});
it("'/api/users' USERS PUT - path should handle unsuccessful (400) update attempt - no id", () => {
  let _statusCode, _data;

  // No connection to the database server
  handlers.db = {};
  handlers.users({ method: 'put', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Please provide a valid user id' });

  //tearDown
  handlers.db = undefined;
});
it("'/api/users' USERS PUT - path should handle a successful (200) post request", () => {
  let _statusCode, _data;
  const user = { _id: 1, username: 'amitgupta15@gmail.com', password: null, fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'users') {
        return {
          findOne: (filter, cb) => {
            filter['_id'] === 1 ? cb(false, user) : cb(true, { error: 'wrong id' });
          },
          replaceOne: (filter, data, cb) => {
            filter['_id'] === 1 ? cb(false, data) : cb(true, { error: 'could not update. wrong id.' });
          },
        };
      } else {
        return {};
      }
    },
  };
  handlers.users({ method: 'put', buffer: Buffer.from(JSON.stringify({ ...user, password: 'amit' })) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.strictEqual(_data['password'], 'amit');

  handlers.db = undefined;
});

it("'/api/users' USERS POST path should handle unsuccessful (503) database connection", () => {
  let _statusCode, _data;

  // No connection to the database server
  handlers.db = undefined;
  handlers.users({ method: 'post', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 503);
  assert.deepStrictEqual(_data, { error: 'Could not connect to the database server' });

  //tearDown
  handlers.db = undefined;
});

it("'/api/users' USERS POST path should handle unsuccessful (400) collection count attempt", () => {
  let _statusCode, _data;
  //Stub the call to MongoDB
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'users') {
        return {
          countDocuments: (callback) => {
            callback(true); //callback with error
          },
        };
      }
    },
  };
  //End stub

  handlers.users({ method: 'post', buffer: Buffer.from(JSON.stringify({})) }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: true }); // Error

  //tearDown
  handlers.db = undefined;
});

it("'/api/users' USERS POST - path should handle a successful (200) post request", () => {
  const user = { username: 'amitgupta15@gmail.com', password: null, fname: 'Amit', lname: 'Gupta', logs: [], workouts: [] };
  let _statusCode, _data;
  // Stub MongoDB call
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'users') {
        return {
          countDocuments: (callback) => {
            callback(false, 0); //No error, 0 documents
          },
          insertOne: (data, callback) => {
            callback(false, {});
          },
        };
      }
    },
  };
  // End Stub

  //Successful POST
  handlers.users({ method: 'post', buffer: Buffer.from(JSON.stringify(user)) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 200);
    assert.deepStrictEqual(data, {});
  });

  //Invalid POST
  handlers.users({ method: 'post', buffer: Buffer.from(JSON.stringify({ notes: 'Finished Workout' })) }, (statusCode, data) => {
    assert.strictEqual(statusCode, 500);
    assert.deepStrictEqual(data, { error: 'Required fields missing: username, password, fname, lname, logs, workouts' });
  });

  // // Clean up Stubs
  handlers.db = undefined;
});

it("'/api/users' USERS  GET - path should handle unsuccessful (503) database connection", () => {
  let _statusCode, _data;

  // No connection to the database server
  handlers.db = undefined;
  handlers.users({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 503);
  assert.deepStrictEqual(_data, { error: 'Could not connect to the database server' });

  //tearDown
  handlers.db = undefined;
});
it("'/api/users' USERS GET path should handle a successful (200) get request for a given id", () => {
  let _statusCode, _data;
  // Successful connection to the database server
  handlers.db = {
    collection: (collectionName) => {
      return {
        findOne: (filter, callback) => {
          callback(false, { _id: 1 });
        },
      };
    },
  };
  handlers.users({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data, { _id: 1 });

  handlers.db = undefined;
});

it("'/api/users' USERS GET path should handle an unsuccessful (400) get request for a given id", () => {
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
  handlers.users({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
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
  handlers.users({ method: 'get', query: { _id: 1 } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'No record found for _id: 1' });
  handlers.db = undefined;
});
it("'/api/users' USERS GET path should handle invalid url query (400)", () => {
  let _statusCode, _data;
  // Stub the mongoDB response
  //For this test, it is enough to have a handlers.db Object
  handlers.db = {};
  //End Stub
  // fname is invalid query, should send 400 statuscode
  handlers.users({ method: 'get', query: { fname: 'Amit' } }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Invalid request' });
});

it("'/api/users' USERS GET path should handle an unsuccessful (400) get request for all records", () => {
  let _statusCode, _data;
  //Stub the MongoDB response object
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'users') {
        return {
          find: (filter, callback) => {
            callback({ error: 'Some error occurred' }, []);
          },
        };
      }
    },
  };
  //End stub
  //Call the method that makes MongoDB call, store result in temp variables
  handlers.users({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  //assert
  assert.strictEqual(_statusCode, 400);
  assert.deepStrictEqual(_data, { error: 'Some error occurred' });

  //reset the response object
  handlers.db = undefined;
});

it("'/api/users' USERS GET path should handle a successful (200) get request for all records", () => {
  let _statusCode, _data;
  handlers.db = {
    collection: (collectionName) => {
      if (collectionName === 'users') {
        return {
          find: (filter, callback) => {
            callback(false, {
              toArray: (cb) => cb(false, [{ _id: 1 }, { _id: 2 }]),
            });
          },
        };
      }
    },
  };
  handlers.users({ method: 'get', query: {} }, (statusCode, data) => {
    _statusCode = statusCode;
    _data = data;
  });
  assert.strictEqual(_statusCode, 200);
  assert.deepStrictEqual(_data.length, 2);
  handlers.db = undefined;
});

/** Helper Functions Tests */
// it('should get the latest id for a directory', () => {
//   dataservice.list = (dir) => []; // Stub

//   var maxId = handlers.getMaxId('tests');
//   assert.strictEqual(maxId, 0);
// });
