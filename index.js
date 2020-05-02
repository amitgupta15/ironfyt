'use strict';

const server = require('./mini-http-server');
const handlers = require('./handlers');

const paths = {
  '/': handlers.default,
  '/api/workouts': handlers.workouts,
  '/api/logs': handlers.logs,
  '/api/users': handlers.users,
};

server.setAllowedPaths(paths);
server.init(3000, '192.168.1.148');
