'use strict';

const ObjectId = require('mongodb').ObjectID;

const groupwod = {};

groupwod.get = (req, res) => {
  let { tokenpayload, options } = req;

  let user = tokenpayload.user;
  let database = options.database;
  database.collection('users').findOne({ _id: new ObjectId(user._id) }, function (error, result) {
    if (error) {
      res(400, { error });
    } else {
      let groups = result.groups ? result.groups : [];
      let user_id = result._id;
      database
        .collection('groupwod')
        .aggregate([
          // Match the groups the user belongs to
          { $match: { group_id: { $in: groups } } },
          // Sort by date in descending order to bring the most recent dates at the top
          { $sort: { date: -1 } },
          // Group by group_id and get the first date, workout_id and group_id for each group
          {
            $group: {
              _id: '$group_id',
              date: { $first: '$date' },
              workout_id: { $first: '$workout_id' },
              group_id: { $first: '$group_id' },
            },
          },
          {
            $lookup: {
              from: 'groups',
              localField: 'group_id',
              foreignField: '_id',
              as: 'group',
            },
          },
          {
            $lookup: {
              from: 'workouts',
              localField: 'workout_id',
              foreignField: '_id',
              as: 'workout',
            },
          },
          {
            $lookup: {
              from: 'personalrecords',
              let: { group_workout_id: '$workout_id' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$workout_id', '$$group_workout_id'] }, { $eq: ['$user_id', new ObjectId(user_id)] }] } } },
                {
                  $lookup: {
                    from: 'logs',
                    localField: 'workoutlog_id',
                    foreignField: '_id',
                    as: 'log',
                  },
                },
                {
                  $project: { _id: 0, log: { $arrayElemAt: ['$log', 0] } },
                },
              ],
              as: 'pr',
            },
          },
          {
            $lookup: {
              from: 'logs',
              let: { group_workout_id: '$workout_id', group_workout_date: '$date' },
              pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$workout_id', '$$group_workout_id'] }, { $eq: ['$user_id', new ObjectId(user_id)] }, { $eq: ['$date', '$$group_workout_date'] }] } } }],
              as: 'log',
            },
          },
          {
            $project: { group: { $arrayElemAt: ['$group', 0] }, date: 1, workout: { $arrayElemAt: ['$workout', 0] }, pr: { $arrayElemAt: ['$pr', 0] }, log: { $arrayElemAt: ['$log', 0] } },
          },
        ])
        .toArray(function (error, response) {
          if (error) {
            res(400, { error });
          } else {
            res(200, response);
          }
        });
    }
  });
};

groupwod.post = (req, res) => {
  let { buffer, options } = req;

  let database = options.database;
  let groupwod;
  try {
    groupwod = JSON.parse(buffer);
  } catch (error) {
    res(400, { error: 'Error parsing groupwod data' });
    return;
  }
  if (groupwod) {
    let group_id = groupwod.group_id ? new ObjectId(groupwod.group_id) : null;
    let workout_id = groupwod.workout_id ? new ObjectId(groupwod.workout_id) : null;
    let date = groupwod.date ? new Date(groupwod.date) : null;
    let groupWodObj = { group_id, workout_id, date };
    if (group_id && workout_id && date) {
      database.collection('groupwod').replaceOne({ group_id, date }, groupWodObj, { upsert: true }, function (error, response) {
        if (error) {
          res(400, { error: 'Error occurred while saving group wod' });
          return;
        }
        res(200, response.ops[0]);
      });
    } else {
      res(400, { error: 'Missing group wod data. group wod must have a workout_id, group_id and date' });
    }
  }
};
module.exports = groupwod;
