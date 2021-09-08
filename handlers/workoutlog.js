'use strict';

const ObjectId = require('mongodb').ObjectID;

const workoutlog = {};

let queryParser = (query, res) => {
  let filter = {};
  if (Object.keys(query).length) {
    for (let key in query) {
      if (key === '_id' || key === 'workout_id' || key === 'user_id') {
        if (query[key].length !== 24) {
          res(400, { message: `Invalid ID : ${key}` });
          return;
        } else {
          try {
            filter[key] = ObjectId(query[key]);
          } catch (error) {
            res(400, { message: 'Invalid Object ID' });
            return;
          }
        }
      }
      if (key === 'startdate') {
        let date = new Date(query[key]);
        filter['date'] = { ...filter['date'], $gte: date };
      }
      if (key === 'enddate') {
        let date = new Date(query[key]);
        filter['date'] = { ...filter['date'], $lte: date };
      }
      if (key === 'date') {
        let date = new Date(query[key]);
        filter['date'] = date;
      }
    }
  }
  return filter;
};
workoutlog.get = (req, res) => {
  let { query, tokenpayload } = req;
  let user = tokenpayload.user;
  let filter = {};
  filter = queryParser(query, res);
  workoutlogsCollection(req)
    .aggregate([
      {
        $match: filter,
      },
      {
        $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' },
      },
      {
        $lookup: { from: 'workouts', localField: 'workout_id', foreignField: '_id', as: 'workout' },
      },
      {
        $sort: { date: -1 },
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
  workoutlog.date = workoutlog.date ? new Date(workoutlog.date) : new Date();
  workoutlog.duration = workoutlog.duration ? workoutlog.duration : null;
  workoutlog.load = workoutlog.load ? workoutlog.load : null;
  workoutlog.rounds = workoutlog.rounds ? workoutlog.rounds : null;
  workoutlog.notes = workoutlog.notes ? workoutlog.notes : null;
  delete workoutlog.user;
  delete workoutlog.workout;
  if (workoutlog._id && workoutlog._id.length === 24) {
    workoutlog._id = new ObjectId(workoutlog._id);
    workoutlogsCollection(req).replaceOne({ _id: ObjectId(workoutlog._id) }, workoutlog, function (error, result) {
      if (!error) {
        res(200, { workoutlog: result.ops[0], user });
      } else {
        res(400, { error: `Error updating workout log` });
      }
    });
  } else {
    workoutlogsCollection(req).insertOne(workoutlog, (error, result) => {
      if (!error) {
        res(200, { workoutlog: result.ops[0], user });
      } else {
        res(400, { error: `Error occurred while creating a new workout log ${error}` });
      }
    });
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
