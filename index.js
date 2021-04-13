'use strict';

const server = require('./vendor/mini-http-server');
const handlers = require('./handlers');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const port = process.env.PORT || 3000;

const mongodb = process.env.ENV === 'local' ? require('./vendor/local-db') : require('mongodb');
if (process.env.ENV === 'local') {
  //If running in dev environment, then provide the test data
  require('./local-db-collections');
}

let db;
console.log('Mongodb url:', process.env.MONGODB_URI);
mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, database) {
  console.log('trying to connect to the database');
  if (err) {
    console.log('Found error', err);
    process.exit(1);
  }
  db = database.db(process.env.DATABASE);
  // assign the db handle to handler
  handlers.db = db;
  console.log('Connected to Database: ' + process.env.DATABASE);
  // Dynamic paths
  const paths = {
    '/': handlers.default,
    '/api/workouts': handlers.workouts,
    '/api/logs': handlers.logs,
    '/api/users': handlers.users,
  };
  // Set the allowed dynamic paths
  server.setAllowedPaths(paths);
  server.setStaticPath(path.join(__dirname, '/public/'));
  server.init(port);
});
