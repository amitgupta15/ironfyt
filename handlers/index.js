/**
 * This is the handler module. It intercepts the route request and calls the appropriate route. It checks if authorization is required and calls the authorization method
 * if the route is a secure route.
 */
'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_key = process.env.JWT_KEY;

const workout = require('./workout');
const workoutlog = require('./workoutlog');
const user = require('./user');
const movement = require('./movement');
const groupwod = require('./groupwod');
const personalrecord = require('./personalrecord');
const group = require('./group');

const handler = {};

handler.healthcheck = (req, res) => {
  res(302, { pathname: req.pathname, query: req.query });
};

handler.workout = (req, res) => {
  handleRoute(req, res, workout, true);
};

handler.workoutlog = (req, res) => {
  handleRoute(req, res, workoutlog, true, ['get', 'post', 'delete']);
};

handler.user = (req, res) => {
  handleRoute(req, res, user, true, ['get', 'put', 'delete']);
};

handler.movement = (req, res) => {
  handleRoute(req, res, movement, true, ['get']);
};

handler.groupwod = (req, res) => {
  handleRoute(req, res, groupwod, true, ['get']);
};

handler.personalrecord = (req, res) => {
  handleRoute(req, res, personalrecord, true, ['post', 'get']);
};

handler.group = (req, res) => {
  handleRoute(req, res, group, true, ['get']);
};

/**
 *
 * @param {*} req - request object
 * @param {*} res - response callback
 * @param {*} route - route module
 * @param {*} secure - flag to indicate if it is a secure route. By default, it is assumed that the route is a secure route
 */
let handleRoute = (req, res, route, secure = true, allowedMethods = ['get', 'post', 'put', 'delete']) => {
  let { method, headers } = req;
  method = method.toLowerCase();
  if (allowedMethods.indexOf(method) < 0) {
    res(405, { error: 'Method not allowed' });
  } else {
    if (secure) {
      //check for valid token
      verifyToken(headers, res, (tokenpayload) => {
        req.tokenpayload = tokenpayload;
        route[method](req, res);
      });
    } else {
      req.tokenpayload = {};
      route[method](req, res);
    }
  }
};

let verifyToken = (headers, res, next) => {
  if (headers.authorization) {
    let [type, token] = headers.authorization.split(' ');
    if (type === 'Bearer') {
      try {
        let tokenpayload = jwt.verify(token, jwt_key);
        next(tokenpayload);
      } catch (error) {
        res(401, { code: 1, error: 'Invalid or expired token' });
      }
    } else {
      res(401, { error: 'Unauthorized request' });
    }
  } else {
    res(401, { error: 'Unauthorized request' });
  }
};
module.exports = handler;
