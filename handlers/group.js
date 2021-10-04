'use strict';

const ObjectId = require('mongodb').ObjectID;
let group = {};

group.get = (req, res) => {
  let { options, query } = req;

  let database = options.database;
  let _id = query && query._id && query._id.length === 24 ? new ObjectId(query._id) : false;
  let date = query && query.date ? new Date(query.date) : false;
  let admin_id = query && query.admin_id ? new ObjectId(query.admin_id) : false;
  if (_id) {
    if (date) {
      database
        .collection('groups')
        .aggregate([
          { $match: { _id } },
          {
            $lookup: {
              from: 'logs',
              let: { group_users: '$users' },
              pipeline: [
                { $match: { $expr: { $and: [{ $in: ['$user_id', '$$group_users'] }, { $eq: ['$date', date] }] } } },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
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
                  $addFields: { user: { $arrayElemAt: ['$user', 0] }, workout: { $arrayElemAt: ['$workout', 0] } },
                },
              ],
              as: 'logs',
            },
          },
          {
            $lookup: {
              from: 'groupwod',
              let: { group_id: '$_id' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$group_id', '$$group_id'] }, { $eq: ['$date', date] }] } } },
                {
                  $lookup: {
                    from: 'workouts',
                    localField: 'workout_id',
                    foreignField: '_id',
                    as: 'workout',
                  },
                },
                {
                  $addFields: { workout: { $arrayElemAt: ['$workout', 0] } },
                },
              ],
              as: 'groupwod',
            },
          },
        ])
        .toArray(function (error, result) {
          if (error) {
            console.error(error);
            res(400, error);
          } else {
            res(200, result);
          }
        });
    } else {
      database
        .collection('groups')
        .aggregate([
          { $match: { _id } },
          {
            $lookup: {
              from: 'logs',
              let: { group_users: '$users' },
              pipeline: [
                { $match: { $expr: { $in: ['$user_id', '$$group_users'] } } },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
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
                  $addFields: { user: { $arrayElemAt: ['$user', 0] }, workout: { $arrayElemAt: ['$workout', 0] } },
                },
                {
                  $sort: { date: -1 },
                },
              ],
              as: 'logs',
            },
          },
          {
            $lookup: {
              from: 'groupwod',
              let: { group_id: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$group_id', '$$group_id'] } } },
                {
                  $lookup: {
                    from: 'workouts',
                    localField: 'workout_id',
                    foreignField: '_id',
                    as: 'workout',
                  },
                },
                {
                  $addFields: { workout: { $arrayElemAt: ['$workout', 0] } },
                },
              ],
              as: 'groupwod',
            },
          },
        ])
        .toArray(function (error, result) {
          if (error) {
            console.error(error);
            res(400, error);
          } else {
            res(200, result);
          }
        });
    }
  } else if (admin_id) {
    database
      .collection('groups')
      .find({ admins: admin_id })
      .toArray(function (error, result) {
        if (error) {
          console.error(error);
          res(400, error);
        } else {
          res(200, result);
        }
      });
  } else {
    res(400, { error: 'Invalid group query' });
  }
};

module.exports = group;
