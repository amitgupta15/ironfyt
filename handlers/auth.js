'use strict';
/**
 * This module handles authentication related API calls
 */

const saltRounds = 13;
const auth = {};

auth.login = (payload, callback) => {
  const { method, buffer } = payload;
  if (method.toLowerCase() === 'get') {
    try {
      let loginData = JSON.parse(buffer);
      //retrieve the user from the database
      //check the password
      //callback success or error based on password/email match
    } catch (e) {
      console.log('error parsing JSON data while authenticating the user: ' + e);
    }
    callback(201, payload);
  } else {
    callback(405, 'Method not allowed');
  }
};

module.exports = auth;
