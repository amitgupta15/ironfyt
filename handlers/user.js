'use strict';
/**
 * This module handles authentication related API calls
 */

//library to hash password
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Number of salt rounds to provide hashing
const saltRounds = 13;
const user = {};
/**
 * Authenticate a user and send back token with user info
 * @param {object} payload - payload object contains buffer with login info, database connection object, etc.
 * @param {*} callback - send back the status code and data callback(statusCode, data)
 */
user.login = (payload, callback) => {
  const { method, buffer, options } = payload;
  let loginData = {};
  if (method.toLowerCase() === 'get') {
    try {
      loginData = JSON.parse(buffer);
    } catch (e) {
      console.log('error parsing JSON data while authenticating the user: ' + e);
    }
    let database = options.database;
    let email = loginData && loginData.email ? loginData.email : false;
    let password = loginData && loginData.password ? loginData.password : false;
    if (email && password) {
      database.collection('users').findOne({ email: email }, function (error, user) {
        if (error) {
          callback(400, { code: 1, data: { error: `Error occurred while finding the user ${error}` } });
        } else if (user) {
          bcrypt.compare(password, user.password, (error, same) => {
            if (error) {
              callback(400, { code: 1, data: { error: `Error occurred while validating password ${error}` } });
            } else if (same) {
              delete user.password; // Do not send back user password
              let token = getToken(user);
              callback(201, { code: 0, data: { token } });
            } else {
              callback(401, { code: 1, data: { error: 'Wrong Username or Password' } });
            }
          });
        } else {
          callback(400, { code: 1, data: { error: 'Wrong Username or Password' } });
        }
      });
    } else {
      callback(400, { code: 1, data: { error: 'Please provide the email address and password to authenticate' } });
    }
  } else {
    callback(405, { code: 1, data: { error: 'Method not allowed' } });
  }
};

user.register = (payload, callback) => {
  const { method, buffer, options } = payload;
  let user = {};
  if (method.toLowerCase() !== 'post') {
    callback(405, { code: 1, data: { error: 'Method not allowed' } });
  } else {
    try {
      user = JSON.parse(buffer);
    } catch (e) {
      console.log('error parsing JSON data while authenticating the user: ' + e);
    }
    let database = options.database;
    user.email = user.email ? user.email : false;
    user.password = user.password ? user.password : false;
    if (user.email && user.password) {
      database.collection('users').findOne({ email: user.email }, function (error, u) {
        if (error) {
          callback(400, { code: 1, data: { error: 'Error occurred while checking if user exists' } });
        } else if (u) {
          callback(400, { code: 1, data: { error: 'User exists' } });
        } else {
          bcrypt.hash(user.password, saltRounds, function (error, hashedPassword) {
            if (!error) {
              user.password = hashedPassword;
              database.collection('users').insertOne(user, function () {
                callback(201, { code: 0, data: { message: 'Registration Successful' } });
              });
            } else {
              callback(400, { code: 1, data: { error: 'Error occurred while registering user' } });
            }
          });
        }
      });
    } else {
      callback(400, { code: 1, data: { error: 'Please provide email and password for the user' } });
    }
  }
};

let getToken = (user) => {
  let limit = 60 * 60 * 24 * 5; // expires after 5 days
  let expires = Math.floor(Date.now() / 1000) + limit;
  let obj = {
    user: user,
    exp: expires,
  };
  return jwt.sign(obj, process.env.JWT_KEY);
};

/** Temp methods - Remove once the authentication code is stable  */
user.token = (payload, callback) => {
  let user = {};
  try {
    user = JSON.parse(payload.buffer);
  } catch (error) {
    console.error(error);
  }
  let limit = 60 * 2;
  let expires = Math.floor(Date.now() / 1000) + limit;
  let obj = {
    email: user.email,
    exp: expires,
  };
  let token = jwt.sign(obj, process.env.JWT_KEY);
  callback(201, { data: token, email: user.email });
};

// Keep this method to test token
user.testtoken = (payload, callback) => {
  let header = payload.headers.authorization;
  let [type, token] = header.split(' ');
  if (type.toLowerCase() === 'bearer' && typeof token !== undefined) {
    try {
      let tokenPayload = jwt.verify(token, process.env.JWT_KEY);
      let current = Math.floor(Date.now() / 1000);
      let diff = current - tokenPayload.exp;
      callback(200, { code: 0, message: `You are good. ${diff} remaining`, tokenPayload: tokenPayload });
    } catch (err) {
      callback(401, { code: 123, message: 'Invalid or expired token' });
    }
  } else {
    callback(401, { code: 123, message: 'Invalid token' });
  }
};

user.get = (req, res) => {
  let { query, tokenpayload } = req;
  let user = tokenpayload && tokenpayload.user ? tokenpayload.user : {};
  let role = user && user.role ? user.role.toLowerCase() : 'notadmin';
  let _id = query && query._id ? query._id : false;
  if (role === 'admin' || _id === user._id) {
    if (_id) {
      if (_id.length === 24) {
        usersCollection(req).findOne({ _id: ObjectId(_id) }, (error, userDoc) => {
          if (!error) {
            res(200, { code: 0, data: { user: userDoc } });
          } else {
            res(400, { code: 1, data: { error: 'Error occurred while querying user' } });
          }
        });
      } else {
        res(400, { code: 1, data: { error: 'Invalid User Id' } });
      }
    } else if (role === 'admin') {
      usersCollection(req)
        .find({})
        .toArray((error, users) => {
          res(200, { code: 0, data: { users } });
        });
    } else {
      res(400, { code: 1, data: { error: 'Please provide a valid user id' } });
    }
  } else {
    res(401, { code: 1, data: { error: 'Not Authorized' } });
  }
};

user.put = (req, res) => {
  res(200, { code: 0, data: { message: 'successful user put request' } });
};

user.delete = (req, res) => {
  res(200, { code: 0, data: { message: 'successful user delete request' } });
};

let usersCollection = (req) => {
  let { options } = req;
  return options.database.collection('users');
};
module.exports = user;
