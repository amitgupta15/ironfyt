'use strict';

const ObjectId = require('mongodb').ObjectID;

const movement = {};
movement.get = (req, res) => {
  let { query, tokenpayload } = req;
  let user = tokenpayload.user;
  if (Object.keys(query).length) {
    for (let key in query) {
      //It is assumed that if the parameter length is 24 then it is an Object ID, in which case create an objectid
      if (query[key].length === 24) {
        query[key] = ObjectId(query[key]);
      }
      //Convert primary to a boolean value
      if (key === 'primary') {
        query.primary = query.primary === 'true';
      }
    }
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
