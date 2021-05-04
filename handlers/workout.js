'use strict';

const ObjectId = require('mongodb').ObjectID;

const workout = {};
workout.get = (req, res) => {
  let { query, tokenpayload } = req;
  let user = tokenpayload.user;
  if (Object.keys(query).length) {
    for (let key in query) {
      if (query[key].length !== 24) {
        res(400, { error: `Invalid ID : ${key}` });
        return;
      } else {
        try {
          query[key] = ObjectId(query[key]);
        } catch (error) {
          res(400, { error: 'Invalid Object ID' });
          return;
        }
      }
    }
  }
  workoutsCollection(req)
    .aggregate([
      {
        $match: query,
      },
      {
        $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' },
      },
    ])
    .toArray((error, workouts) => {
      if (!error) {
        res(200, { workouts, user });
      } else {
        res(400, { error: `Error occurred while retrieving workouts` });
      }
    });
};

workout.post = (req, res) => {
  let { tokenpayload, buffer } = req;
  let user = tokenpayload.user;
  let workout;
  try {
    workout = JSON.parse(buffer);
  } catch (error) {
    res(400, { error: 'Invalid Workout data' });
  }
  let missingRequiredFields = [];
  if (!workout.hasOwnProperty('name')) missingRequiredFields.push('name');
  if (!workout.hasOwnProperty('description')) missingRequiredFields.push('description');
  if (missingRequiredFields.length) {
    res(400, { error: `Missing required fields: ${missingRequiredFields.join(', ')}` });
  } else {
    workout.timecap = workout.timecap ? workout.timecap : null;
    workout.rounds = workout.rounds ? workout.rounds : null;
    workout.type = workout.type ? workout.type : null;
    workout.user_id = workout.user_id ? new ObjectId(workout.user_id) : null;
    workoutsCollection(req).insertOne(workout, (error, result) => {
      if (!error) {
        res(200, { workout: result.ops[0], user });
      } else {
        res(400, { error: `Error occurred while creating a new workout ${error}` });
      }
    });
  }
};

workout.put = (req, res) => {
  let { tokenpayload, buffer } = req;
  let user = tokenpayload.user;
  try {
    let wo = JSON.parse(buffer);
    if (wo._id && wo._id.length === 24) {
      workoutsCollection(req).findOne({ _id: ObjectId(wo._id) }, (error, workout) => {
        if (!error) {
          if (workout) {
            if (wo.name) workout.name = wo.name;
            if (wo.description) workout.description = wo.description;
            if (wo.user_id) workout.user_id = new ObjectId(wo.user_id);
            if (wo.type) workout.type = wo.type;
            if (wo.rounds) workout.rounds = wo.rounds;
            if (wo.timecap) workout.timecap = wo.timecap;
            workoutsCollection(req).replaceOne({ _id: ObjectId(wo._id) }, workout, function (error, result) {
              if (!error) {
                res(200, { workout: result.ops[0], user });
              } else {
                res(400, { error: `Error updating workout` });
              }
            });
          } else {
            res(400, { error: `Workout not found for ID ${_id}` });
          }
        } else {
          res(400, { error: 'Error occurred while retrieving existing record' });
        }
      });
    } else {
      res(400, { error: 'Invalid or missing workout id' });
    }
  } catch (error) {
    res(400, { error: 'Invalid Workout data' });
  }
};

workout.delete = (req, res) => {
  let { query, tokenpayload } = req;
  if (query._id && query._id.length === 24) {
    workoutsCollection(req).removeOne({ _id: ObjectId(query._id) }, (error, result) => {
      if (!error) {
        res(200, { deletedCount: result.deletedCount, user: tokenpayload.user });
      } else {
        res(400, { error: `Could not delete the workout record` });
      }
    });
  } else {
    res(400, { error: `Please provide a valid workout id to delete` });
  }
};

let workoutsCollection = (req) => {
  let { options } = req;
  return options.database.collection('workouts');
};
module.exports = workout;
