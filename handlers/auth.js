'use strict';
/**
 * This module handles authentication related API calls
 */

const bcrypt = require('bcrypt');
const saltRounds = 13;
const auth = {};

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
      database.collection('users').findOne({ username: email }, function (error, user) {
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

module.exports = auth;
