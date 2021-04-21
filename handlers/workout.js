'use strict';

const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_key = process.env.JWT_KEY;

const workout = {};
let workoutCollection;
workout.handler = (req, res) => {
  let allowedMethods = ['get', 'post', 'put', 'delete'];
  let { method, headers, options } = req;
  method = method.toLowerCase();
  workoutCollection = options.database.collection('workouts');
  if (allowedMethods.indexOf(method) < 0) {
    res(405, { code: 1, data: { error: 'Method not allowed' } });
  } else {
    //check for valid token
    workout.verifyToken(headers, res, (tokenpayload) => {
      req.tokenpayload = tokenpayload;
      _workout[method](req, res);
    });
  }
};

let _workout = {};
_workout.get = (req, res) => {
  let { query, tokenpayload } = req;
  let user = tokenpayload.user;
  if (query._id) {
    if (query._id.length === 24) {
      workoutCollection.findOne({ _id: ObjectId(query._id) }, (error, result) => {
        if (!error) {
          res(200, { code: 0, data: { workout: result, user: user } });
        } else {
          res(400, { code: 1, data: { error: `Could not find a workout record for _id ${query._id}` } });
        }
      });
    } else {
      res(400, { code: 1, data: { error: `Invalid workout id` } });
    }
  } else {
    workoutCollection.find({}).toArray((error, workouts) => {
      if (!error) {
        res(200, { code: 0, data: { workouts, user } });
      } else {
        res(400, { code: 1, data: { error: `Error occurred while retrieving workouts` } });
      }
    });
  }
};

_workout.post = (req, res) => {
  let { tokenpayload, buffer } = req;
  let user = tokenpayload.user;
  let workout;
  try {
    workout = JSON.parse(buffer);
    let missingRequiredFields = [];
    if (!workout.hasOwnProperty('name')) missingRequiredFields.push('name');
    if (!workout.hasOwnProperty('description')) missingRequiredFields.push('description');
    if (missingRequiredFields.length) {
      res(400, { code: 1, data: { error: `Missing required fields: ${missingRequiredFields.join(', ')}` } });
    } else {
      workoutCollection.insertOne(workout, (error, result) => {
        if (!error) {
          res(200, { code: 0, data: { workout: result.ops[0], user } });
        } else {
          res(400, { code: 1, data: { error: `Error occurred while creating a new workouts ${error}` } });
        }
      });
    }
  } catch (error) {
    res(400, { code: 1, data: { error: 'Invalid Workout data' } });
  }
};

_workout.put = (req, res) => {
  let { tokenpayload, buffer } = req;
  let user = tokenpayload.user;
  try {
    let wo = JSON.parse(buffer);
    if (wo._id) {
      workoutCollection.findOne({ _id: ObjectId(wo._id) }, (error, workout) => {
        if (!error) {
          if (workout) {
            if (wo.name) workout.name = wo.name;
            if (wo.description) workout.description = wo.description;
            if (wo.user_id) workout.user_id = wo.user_id;
            if (wo.type) workout.type = wo.type;
            if (wo.rounds) workout.rounds = wo.rounds;
            if (wo.timecap) workout.timecap = wo.timecap;
            workoutCollection.replaceOne({ _id: ObjectId(wo._id) }, workout, function (error, result) {
              res(200, { code: 0, data: { workout: result.ops[0], user } });
            });
          } else {
            res(400, { code: 1, data: { error: `Workout not found for ID ${_id}` } });
          }
        } else {
          res(400, { code: 1, data: { error: 'Error occurred while retrieving existing record' } });
        }
      });
    } else {
      res(400, { code: 1, data: { error: 'Invalid or missing workout id' } });
    }
  } catch (error) {
    res(400, { code: 1, data: { error: 'Invalid Workout data' } });
  }
};

_workout.delete = (req, res) => {
  let { query, tokenpayload } = req;
  if (query._id && query._id.length === 24) {
    workoutCollection.removeOne({ _id: ObjectId(query._id) }, (error, result) => {
      if (!error) {
        res(200, { code: 0, data: { deletedCount: result.deletedCount, user: tokenpayload.user } });
      } else {
        res(400, { code: 1, data: { error: `Could not delete the workout record` } });
      }
    });
  } else {
    res(400, { code: 1, data: { error: `Please provide a valid workout id to delete` } });
  }
};

workout.verifyToken = (headers, res, next) => {
  if (headers.authorization) {
    let [type, token] = headers.authorization.split(' ');
    if (type === 'Bearer') {
      try {
        let tokenpayload = jwt.verify(token, jwt_key);
        next(tokenpayload);
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
