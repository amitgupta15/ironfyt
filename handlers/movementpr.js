'use strict';

const ObjectId = require('mongodb').ObjectID;
let movementpr = {};

movementpr.get = (req, res) => {
  res(200, 'Get');
};

movementpr.post = (req, res) => {
  let { buffer } = req;
  let pr;
  try {
    pr = JSON.parse(buffer);
  } catch (error) {
    console.error(error);
    res(400, 'Invalid Movement PR Data');
  }
  pr.user_id = pr.user_id ? new ObjectId(pr.user_id) : null;
  pr._id = pr._id ? new ObjectId(pr._id) : null;
  pr.movement_id = pr.movement_id ? pr.movement_id : null;
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
    console.log('Replace');
  } else {
    console.log('New Record');
  }
  res(200, pr);
};

module.exports = movementpr;
