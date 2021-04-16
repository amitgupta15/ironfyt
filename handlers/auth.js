'use strict';
/**
 * This module handles authentication related API calls
 */

//library to hash password
const bcrypt = require('bcrypt');
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
          callback(400, `Error occurred while finding the user ${error}`);
        } else if (user) {
          bcrypt.compare(password, user.password, (error, same) => {
            if (error) {
              callback(400, `Error occurred while validating password ${error}`);
            } else if (same) {
              delete user.password; // Do not send back user password
              callback(201, { token: 'A fake token', user: user });
            } else {
              callback(401, 'User not authorized');
            }
          });
        } else {
          callback(400, 'User Not Found');
        }
      });
    } else {
      callback(400, 'Please provide the email address and password to authenticate');
    }
  } else {
    callback(405, 'Method not allowed');
  }
};

auth.register = (payload, callback) => {
  const { method, buffer, options } = payload;
  let user = {};
  if (method.toLowerCase() !== 'post') {
    callback(405, 'Method not allowed');
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
          callback(400, 'Error occurred while checking if user exists');
        } else if (u) {
          callback(400, 'User exists');
        } else {
          bcrypt.hash(user.password, saltRounds, function (error, hashedPassword) {
            if (!error) {
              user.password = hashedPassword;
              database.collection('users').insertOne(user, function () {
                callback(200, 'Registration Successful');
              });
            } else {
              callback(400, 'Error occurred while registering user');
            }
          });
        }
      });
    } else {
      callback(400, 'Please provide email and password for the user');
    }
  }
};
module.exports = auth;
