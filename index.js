'use strict';

const server = require('./vendor/mini-http-server');
const handlers = require('./handlers');
const auth = require('./handlers/auth');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const port = process.env.PORT || 3000;

const mongodb = require('mongodb');

console.log('Mongodb url:', process.env.MONGODB_URI);
mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, database) {
  console.log('trying to connect to the database');
  if (err) {
    console.log('Found error', err);
    process.exit(1);
  }
  // Making database connection available across different routes
  server.setOptions({ database: database.db(process.env.DATABASE) });
  // assign the db handle to handler
  // handlers.db = db;
  console.log('Connected to Database: ' + process.env.DATABASE);
  // Dynamic paths
  const paths = {
    '/': handlers.default,
    '/api/workouts': handlers.workouts,
    '/api/logs': handlers.logs,
    '/api/users': handlers.users,
    '/api/login': auth.login,
    '/api/register': auth.register,
    '/api/token': auth.token,
    '/api/testtoken': auth.testtoken,
  };
  // Set the allowed dynamic paths
  server.setAllowedPaths(paths);
  server.setStaticPath(path.join(__dirname, '/public/'));
  server.init(port);
});
