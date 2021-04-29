'use strict';

const ObjectId = require('mongodb').ObjectID;

const workoutlog = {};

workoutlog.get = (req, res) => {
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
  workoutlogsCollection(req)
    .aggregate([
      {
        $match: query,
      },
      {
        $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' },
      },
      {
        $lookup: { from: 'workouts', localField: 'workout_id', foreignField: '_id', as: 'workout' },
      },
    ])
    .toArray((error, workoutlogs) => {
      if (!error) {
        res(200, { workoutlogs, user });
      } else {
        res(400, { error: `Error occurred while retrieving workoutlogs` });
      }
    });
};

workoutlog.post = (req, res) => {
  let { tokenpayload, buffer } = req;
  let user = tokenpayload.user;
  let workoutlog;
  try {
    workoutlog = JSON.parse(buffer);
  } catch (error) {
    res(400, { error: 'Invalid Workout Log data' });
  }
  workoutlog.user_id = workoutlog.user_id ? new ObjectId(workoutlog.user_id) : null;
  workoutlog.workout_id = workoutlog.workout_id ? new ObjectId(workoutlog.workout_id) : null;
  workoutlog.date = workoutlog.date ? new Date(workoutlog.date) : Date.now();
  workoutlog.duration = workoutlog.duration ? workoutlog.duration : null;
  workoutlog.load = workoutlog.load ? workoutlog.load : null;
  workoutlog.rounds = workoutlog.rounds ? workoutlog.rounds : null;
  workoutlog.notes = workoutlog.notes ? workoutlog.notes : null;

  workoutlogsCollection(req).insertOne(workoutlog, (error, result) => {
    if (!error) {
      res(200, { workoutlog: result.ops[0], user });
    } else {
      res(400, { error: `Error occurred while creating a new workout log ${error}` });
    }
  });
};

workoutlog.put = (req, res) => {
  let { tokenpayload, buffer } = req;
  let user = tokenpayload.user;
  let wolog;
  try {
    wolog = JSON.parse(buffer);
  } catch (error) {
    res(400, { error: 'Invalid Workout Log data' });
  }
  if (wolog._id && wolog._id.length === 24) {
    workoutlogsCollection(req).findOne({ _id: ObjectId(wolog._id) }, (error, workoutlog) => {
      if (!error) {
        if (workoutlog) {
          if (wolog.user_id) workoutlog.user_id = new ObjectId(wolog.user_id);
          if (wolog.workout_id) workoutlog.workout_id = new ObjectId(wolog.workout_id);
          if (wolog.date) workoutlog.date = new Date(wolog.date);
          if (wolog.duration) workoutlog.duration = wolog.duration;
          if (wolog.load) workoutlog.load = wolog.load;
          if (wolog.rounds) workoutlog.rounds = wolog.rounds;
          if (wolog.notes) workoutlog.notes = wolog.notes;

          workoutlogsCollection(req).replaceOne({ _id: ObjectId(wolog._id) }, workoutlog, function (error, result) {
            if (!error) {
              res(200, { workoutlog: result.ops[0], user });
            } else {
              res(400, { error: `Error updating workout log` });
            }
          });
        } else {
          res(400, { error: `Workout log not found for ID ${_id}` });
        }
      } else {
        res(400, { error: 'Error occurred while retrieving existing record' });
      }
    });
  } else {
    res(400, { error: 'Invalid or missing workout log id' });
  }
};

workoutlog.delete = (req, res) => {
  let { query, tokenpayload } = req;
  if (query._id && query._id.length === 24) {
    workoutlogsCollection(req).removeOne({ _id: ObjectId(query._id) }, (error, result) => {
      if (!error) {
        res(200, { deletedCount: result.deletedCount, user: tokenpayload.user });
      } else {
        res(400, { error: `Could not delete the workout log record` });
      }
    });
  } else {
    res(400, { error: `Please provide a valid workout log id to delete` });
  }
};

let workoutlogsCollection = (req) => {
  let { options } = req;
  return options.database.collection('logs');
};
module.exports = workoutlog;
