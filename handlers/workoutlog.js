'use strict';

const ObjectId = require('mongodb').ObjectID;

const workoutlog = {};

workoutlog.get = (req, res) => {
  let { query, tokenpayload } = req;
  let user = tokenpayload.user;
  if (query._id) {
    if (query._id.length === 24) {
      workoutlogsCollection(req).findOne({ _id: ObjectId(query._id) }, (error, result) => {
        if (!error) {
          res(200, { code: 0, data: { workoutlog: result, user: user } });
        } else {
          res(400, { code: 1, data: { error: `Could not find a workout record for _id ${query._id}` } });
        }
      });
    } else {
      res(400, { code: 1, data: { error: `Invalid workout id` } });
    }
  } else {
    workoutlogsCollection(req)
      .find({})
      .toArray((error, workoutlogs) => {
        if (!error) {
          res(200, { code: 0, data: { workoutlogs, user } });
        } else {
          res(400, { code: 1, data: { error: `Error occurred while retrieving workoutlogs` } });
        }
      });
  }
};

workoutlog.post = (req, res) => {
  res(200, { code: 0, data: { message: 'successfully workout log post request' } });
};

workoutlog.put = (req, res) => {
  res(200, { code: 0, data: { message: 'successfully workout log put request' } });
};

workoutlog.delete = (req, res) => {
  res(200, { code: 0, data: { message: 'successfully workout log delete request' } });
};

let workoutlogsCollection = (req) => {
  let { options } = req;
  return options.database.collection('logs');
};
module.exports = workoutlog;
