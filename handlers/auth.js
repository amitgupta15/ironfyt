'use strict';
/**
 * This module handles authentication related API calls
 */

//library to hash password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Number of salt rounds to provide hashing
const saltRounds = 13;
const auth = {};
/**
 * Authenticate a user and send back token with user info
 * @param {object} payload - payload object contains buffer with login info, database connection object, etc.
 * @param {*} callback - send back the status code and data callback(statusCode, data)
 */
auth.login = (payload, callback) => {
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

auth.register = (payload, callback) => {
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
  let limit = 60 * 2;
  let expires = Math.floor(Date.now() / 1000) + limit;
  let obj = {
    user: user,
    exp: expires,
  };
  return jwt.sign(obj, process.env.JWT_KEY);
};

auth.token = (payload, callback) => {
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

auth.testtoken = (payload, callback) => {
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
module.exports = auth;
