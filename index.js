'use strict';

const server = require('./mini-http-server');
const handlers = require('./handlers');
const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

let db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true }, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database.db('ironfyt');
  // assign the db handle to handler
  handlers.db = db;
  console.log('Database connection is ready');

  // Dynamic paths
  const paths = {
    '/': handlers.default,
    '/api/workouts': handlers.workouts,
    '/api/logs': handlers.logs,
    '/api/users': handlers.users,
  };

  // Set the allowed dynamic paths
  server.setAllowedPaths(paths);
  server.init(port);
});
