'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_key = process.env.JWT_KEY;

const workout = {};

workout.handler = (req, callback) => {
  let allowedMethods = ['get', 'post', 'put'];
  let method = req.method.toLowerCase();
  let headers = req.headers;
  if (allowedMethods.indexOf(method) < 0) {
    callback(405, { code: 1, data: { error: 'Method not allowed' } });
  } else {
    //check for valid token
    if (headers.authorization) {
      let [type, token] = headers.authorization.split(' ');
      if (type === 'Bearer') {
        try {
          let tokenpayload = jwt.verify(token, jwt_key);
          req.tokenpayload = tokenpayload;
          _workout[method](req, callback);
        } catch (error) {
          callback(401, { code: 1, message: 'Invalid or expired token' });
        }
      } else {
        callback(401, { code: 1, data: { error: 'Unauthorized request' } });
      }
    } else {
      callback(401, { code: 1, data: { error: 'Unauthorized request' } });
    }
  }
};

let _workout = {};
_workout.get = (req, callback) => {
  callback(200, { code: 0, data: { ...req.tokenpayload, message: 'successfully executed get request' } });
};

_workout.post = (req, callback) => {
  callback(200, { code: 0, data: { ...req.tokenpayload, message: 'successfully executed post request' } });
};

_workout.put = (req, callback) => {
  callback(200, { code: 0, data: { ...req.tokenpayload, message: 'successfully executed put request' } });
};

module.exports = workout;
