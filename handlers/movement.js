'use strict';

const ObjectId = require('mongodb').ObjectID;

const movement = {};
movement.get = (req, res) => {
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
  } else {
    query = { primary: true };
  }
  movementsCollection(req)
    .aggregate([
      {
        $match: query,
      },
    ])
    .sort({ movement: 1 })
    .toArray((error, movements) => {
      if (!error) {
        res(200, { movements, user });
      } else {
        res(400, { error: `Error occurred while retrieving movements` });
      }
    });
};

let movementsCollection = (req) => {
  let { options } = req;
  return options.database.collection('movements');
};
module.exports = movement;
