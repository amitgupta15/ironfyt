'use strict';

const dataService = require('../data-service');

// Container object
const handlers = {};
handlers.db = undefined;

/**
 * Check for allowed HTTP method
 * @param method
 */
handlers.isMethodAllowed = (method) => {
  const allowedHttpMethods = ['get', 'post', 'put', 'delete'];
  return allowedHttpMethods.indexOf(method.toLowerCase()) > -1;
};

// Default handler
handlers.default = (data, callback) => {
  callback(200);
};

/**
 * Workouts Handler
 */
handlers.workouts = (data, callback) => {
  const { method } = data;
  if (handlers.isMethodAllowed(method)) {
    _workouts[method](data, callback);
  } else {
    callback(405, 'Method Not Allowed');
  }
};

const _workouts = {};

/**
 * Serves the HTTP Get Request
 * Example:
 * http://localhost:3000/api/workouts?id=1
 * http://localhost:3000/api/workouts?filter=all
 */
_workouts.get = (payload, callback) => {
  const { query } = payload;
  if (!isNaN(parseInt(query._id))) {
    dataService.read('workouts', query._id, (error, data) => {
      if (!error) {
        callback(200, data);
      } else {
        callback(500, { error: `Error reading data with id - ${query._id}` });
      }
    });
  } else if (query.filter) {
    const filter = query.filter;
    if (filter.toLowerCase() === 'all') {
      const ids = dataService.list('workouts');
      const workoutsArray = [];
      ids.forEach((id) => {
        const record = dataService.readSync('workouts', id);
        workoutsArray.push(record);
      });
      callback(200, { workouts: workoutsArray });
    } else {
      callback(400, { error: 'Invalid filter criteria' });
    }
  } else {
    callback(400, { error: 'Please provide a valid id' });
  }
};

_workouts.post = (payload, callback) => {
  let workout = JSON.parse(payload.buffer);
  const _id = handlers.getMaxId('workouts') + 1;
  workout._id = _id;
  const missingRequiredFields = [];
  if (!workout.hasOwnProperty('name')) missingRequiredFields.push('name');
  if (!workout.hasOwnProperty('description')) missingRequiredFields.push('description');
  if (missingRequiredFields.length) {
    callback(500, { error: `Missing required fields: ${missingRequiredFields.join(', ')}` });
  } else {
    dataService.create('workouts', workout._id, workout, (error) => {
      if (!error) {
        callback(200, workout);
      } else {
        callback(400, { error: `Could not create a new record with id ${workout._id}` });
      }
    });
  }
};

/**
 *
 * Logs Handler
 */
handlers.logs = (data, callback) => {
  const { method } = data;
  if (handlers.isMethodAllowed(method)) {
    _logs[method](data, callback);
  } else {
    callback(405, 'Method Not Allowed');
  }
};

const _logs = {};

_logs.get = (payload, callback) => {
  const { query } = payload;
  if (handlers.db) {
    if (query._id) {
      handlers.db.collection('logs').findOne({ _id: parseInt(query._id) }, (error, result) => {
        if (error) {
          callback(400, error);
        } else {
          if (!result) {
            callback(400, { error: `No record found for _id: ${query._id}` });
          } else {
            callback(200, result);
          }
        }
      });
    } else if (Object.keys(query).length === 0) {
      handlers.db.collection('logs').find({}, (error, result) => {
        if (error) {
          callback(400, error);
        } else {
          result.toArray((error, docs) => {
            if (error) {
              callback(400, error);
            } else {
              callback(200, docs);
            }
          });
        }
      });
    } else {
      callback(400, { error: `Invalid request` });
    }
  } else {
    callback(503, { error: 'Could not connect to the database server' });
  }
};

_logs.post = (payload, callback) => {
  let log = JSON.parse(payload.buffer);
  if (handlers.db) {
    handlers.db.collection('logs').countDocuments((error, count) => {
      if (error) {
        callback(400, { error: error });
      } else {
        log._id = count + 1;
        const missingRequiredFields = [];
        if (!log.hasOwnProperty('user_id')) missingRequiredFields.push('user_id');
        if (!log.hasOwnProperty('date')) missingRequiredFields.push('date');

        if (missingRequiredFields.length) {
          callback(500, { error: `Required fields missing: ${missingRequiredFields.join(', ')}` });
        } else {
          handlers.db.collection('logs').insertOne(log, (error, result) => {
            if (error) {
              callback(400, error);
            } else {
              callback(200, result);
            }
          });
        }
      }
    });
  } else {
    callback(503, { error: 'Could not connect to the database server' });
  }
};

/**
 * User Handler
 */
handlers.users = (data, callback) => {
  const { method } = data;
  if (handlers.isMethodAllowed(method)) {
    _users[method](data, callback);
  } else {
    callback(405, 'Method Not Allowed');
  }
};

const _users = {};

_users.get = (payload, callback) => {
  const { query } = payload;
  if (handlers.db) {
    if (query._id) {
      handlers.db.collection('users').findOne({ _id: parseInt(query._id) }, (error, result) => {
        if (error) {
          callback(400, error);
        } else {
          if (!result) {
            callback(400, { error: `No record found for _id: ${query._id}` });
          } else {
            callback(200, result);
          }
        }
      });
    } else if (Object.keys(query).length === 0) {
      handlers.db.collection('users').find({}, (error, result) => {
        if (error) {
          callback(400, error);
        } else {
          result.toArray((error, docs) => {
            if (error) {
              callback(400, error);
            } else {
              callback(200, docs);
            }
          });
        }
      });
    } else {
      callback(400, { error: `Invalid request` });
    }
  } else {
    callback(503, { error: 'Could not connect to the database server' });
  }
};

_users.post = (payload, callback) => {
  let user;
  try {
    user = JSON.parse(payload.buffer);
  } catch (error) {
    callback(500, { error: error });
  }
  if (user && handlers.db) {
    handlers.db.collection('users').countDocuments((error, count) => {
      if (error) {
        callback(400, { error: error });
      } else {
        user._id = count + 1;
        const missingRequiredFields = [];
        if (!user.hasOwnProperty('username')) missingRequiredFields.push('username');
        if (!user.hasOwnProperty('password')) missingRequiredFields.push('password');
        if (!user.hasOwnProperty('fname')) missingRequiredFields.push('fname');
        if (!user.hasOwnProperty('lname')) missingRequiredFields.push('lname');
        if (!user.hasOwnProperty('logs')) missingRequiredFields.push('logs');
        if (!user.hasOwnProperty('workouts')) missingRequiredFields.push('workouts');

        if (missingRequiredFields.length) {
          callback(500, { error: `Required fields missing: ${missingRequiredFields.join(', ')}` });
        } else {
          handlers.db.collection('users').insertOne(user, (error, result) => {
            if (error) {
              callback(400, error);
            } else {
              callback(200, result);
            }
          });
        }
      }
    });
  } else {
    callback(503, { error: 'Could not connect to the database server' });
  }
};

_users.put = (payload, callback) => {
  const buffer = JSON.parse(payload.buffer);
  const _id = buffer._id ? buffer._id : false;
  const username = typeof buffer.username === 'string' && buffer.username.trim().length > 0 ? buffer.username.trim() : false;
  const password = buffer.password !== undefined ? buffer.password : null;
  const fname = buffer.fname !== undefined ? buffer.fname : null;
  const lname = buffer.lname !== undefined ? buffer.lname : null;
  const logs = buffer.logs !== undefined && buffer.logs instanceof Array ? buffer.logs : [];
  const workouts = buffer.workouts !== undefined && buffer.workouts instanceof Array ? buffer.workouts : [];

  if (_id) {
    dataService.read('users', _id, (error, user) => {
      if (!error && user) {
        user.username = username;
        user.password = password;
        user.fname = fname;
        user.lname = lname;
        user.logs = logs;
        user.workouts = workouts;

        dataService.update('users', _id, user, (error) => {
          if (!error) {
            callback(200, { message: `User successfully updated, user _id : ${_id}` });
          } else {
            callback(500, { error: `Could not update the user with _id: ${_id}` });
          }
        });
      } else {
        callback(400, { error: `User with id ${_id} not found` });
      }
    });
  } else {
    callback(400, { error: `Please provide a valid _id` });
  }
};

/** Helper Functions */
handlers.getMaxId = function (dir) {
  if (dir) {
    var ids = dataService.list(dir);
    return ids.length;
  } else {
    return false;
  }
};
module.exports = handlers;
