'use strict';

const ObjectId = require('mongodb').ObjectID;
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
    workout.verifyToken(headers, callback, (tokenpayload) => {
      req.tokenpayload = tokenpayload;
      _workout[method](req, callback);
    });
  }
};

let _workout = {};
_workout.get = (req, callback) => {
  let { query, options, tokenpayload } = req;
  let user = tokenpayload.user;
  let database = options.database;
  if (query._id) {
    if (query._id.length === 24) {
      database.collection('workouts').findOne({ _id: ObjectId(query._id) }, (error, result) => {
        if (!error) {
          callback(200, { code: 0, data: { workout: result, user: user } });
        } else {
          callback(400, { code: 1, data: { error: `Could not find a workout record for _id ${query._id}` } });
        }
      });
    } else {
      callback(400, { code: 1, data: { error: `Invalid workout id` } });
    }
  } else {
    database
      .collection('workouts')
      .find({})
      .toArray((error, workouts) => {
        if (!error) {
          callback(200, { code: 0, data: { workouts, user } });
        } else {
          callback(400, { code: 1, data: { error: `Error occurred while retrieving workouts` } });
        }
      });
  }
};

_workout.post = (req, callback) => {
  let { options, tokenpayload, buffer } = req;
  let user = tokenpayload.user;
  let database = options.database;
  let workout;
  try {
    workout = JSON.parse(buffer);
    let missingRequiredFields = [];
    if (!workout.hasOwnProperty('name')) missingRequiredFields.push('name');
    if (!workout.hasOwnProperty('description')) missingRequiredFields.push('description');
    if (missingRequiredFields.length) {
      callback(400, { code: 1, data: { error: `Missing required fields: ${missingRequiredFields.join(', ')}` } });
    } else {
      database.collection('workouts').insertOne(workout, (error, result) => {
        if (!error) {
          callback(200, { code: 0, data: { workout: result.ops[0], user } });
        } else {
          callback(400, { code: 1, data: { error: `Error occurred while creating a new workouts ${error}` } });
        }
      });
    }
  } catch (error) {
    callback(400, { code: 1, data: { error: 'Invalid Workout data' } });
  }
};

_workout.put = (req, callback) => {
  callback(200, { code: 0, data: { ...req.tokenpayload, message: 'successfully executed put request' } });
};

workout.verifyToken = (headers, res, callback) => {
  if (headers.authorization) {
    let [type, token] = headers.authorization.split(' ');
    if (type === 'Bearer') {
      try {
        let tokenpayload = jwt.verify(token, jwt_key);
        callback(tokenpayload);
      } catch (error) {
        res(401, { code: 1, message: 'Invalid or expired token' });
      }
    } else {
      res(401, { code: 1, data: { error: 'Unauthorized request' } });
    }
  } else {
    res(401, { code: 1, data: { error: 'Unauthorized request' } });
  }
};
module.exports = workout;
