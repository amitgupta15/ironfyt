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
    .sort({ _id: -1 })
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
  workout.timecap = workout.timecap ? workout.timecap : null;
  workout.reps = workout.reps ? workout.reps : null;
  workout.rounds = workout.rounds ? workout.rounds : null;
  workout.type = workout.type ? workout.type : null;
  workout.user_id = workout.user_id ? new ObjectId(workout.user_id) : null;
  workout.modality = workout.modality ? workout.modality : null;
  delete workout.user;
  if (workout._id && workout._id.length === 24) {
    workout._id = new ObjectId(workout._id);
    workoutsCollection(req).replaceOne({ _id: ObjectId(workout._id) }, workout, function (error, result) {
      if (!error) {
        res(200, { workout: result.ops[0], user });
      } else {
        res(400, { error: `Error updating workout` });
      }
    });
  } else {
    workoutsCollection(req).insertOne(workout, (error, result) => {
      if (!error) {
        res(200, { workout: result.ops[0], user });
      } else {
        res(400, { error: `Error occurred while creating a new workout ${error}` });
      }
    });
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
