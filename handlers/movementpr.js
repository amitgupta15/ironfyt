'use strict';

const ObjectId = require('mongodb').ObjectID;
let movementpr = {};

movementpr.get = (req, res) => {
  let { options, query } = req;
  let user_id = query && query.user_id && query.user_id.length === 24 ? new ObjectId(query.user_id) : false;
  if (user_id) {
    options.database
      .collection('movementpr')
      .aggregate([{ $match: { user_id: user_id } }])
      .toArray((error, response) => {
        if (error) {
          res(400, 'Error while retrieving movement pr ' + error);
          return;
        }
        res(200, response);
      });
  } else {
    res(400, 'Please provide a valid user id');
  }
};

movementpr.post = (req, res) => {
  let { buffer, options } = req;
  let pr;
  try {
    pr = JSON.parse(buffer);
  } catch (error) {
    console.error(error);
    res(400, 'Invalid Movement PR Data');
  }
  pr.user_id = pr.user_id ? new ObjectId(pr.user_id) : null;
  pr._id = pr._id ? new ObjectId(pr._id) : null;
  pr.movement_id = pr.movement_id ? new ObjectId(pr.movement_id) : null;
  pr.movement = pr.movement ? pr.movement : null;
  pr.pr = pr.pr instanceof Array ? pr.pr : [];
  pr.pr = pr.pr.map((item) => {
    item.date = item.date ? new Date(item.date) : null;
    return item;
  });
  if (pr.user_id === null || pr.movement === null) {
    res(400, 'Missing required data. Please make sure to include user_id and movement name');
    return;
  }
  if (pr._id) {
    options.database.collection('movementpr').replaceOne({ _id: pr._id }, pr, function (error, result) {
      if (error) {
        res(400, { error: `Error updating workout` });
        return;
      }
      res(200, { movementpr: result.ops[0] });
    });
  } else {
    options.database.collection('movementpr').insertOne(pr, function (error, result) {
      if (error) {
        res(400, { error: `Error inserting new workout` });
        return;
      }
      res(200, { movementpr: result.ops[0] });
    });
  }
};

module.exports = movementpr;
