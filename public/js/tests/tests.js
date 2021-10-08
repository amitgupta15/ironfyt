/**
 * Main test file that should be included in the test-runner.html before any other test file.
 * This file contains all the test configurations required to conduct the unit tests
 */
(function (global) {
  'use strict';

  let getParams = $hl.getParams;

  let app = $ironfyt;

  /**
   * Create stubs for all the methods being used in the system. Whenever a new method is added to the $ironfyt object, it should be stubbed here.
   * Stubbing the method is necessary to avoid actual API call or call to the actual method that may navigate away from the page or login/logout a user, which may
   * have unwanted side effects
   */
  let localStroageSetItem = (localStorage.setItem = function () {});
  let navigateToUrl = (app.navigateToUrl = function () {});
  let logout = (app.logout = function () {});
  let login = (app.login = function (loginInfo, callback) {
    callback();
  });
  let getWorkoutLogs = (app.getWorkoutLogs = function (params, callback) {
    callback();
  });
  let getCredentials = (app.getCredentials = function () {
    return {};
  });
  let authenticateUser = (app.authenticateUser = function (callback) {
    callback();
  });
  let saveWorkoutLog = (app.saveWorkoutLog = function (obj, callback) {
    callback();
  });
  let deleteWorkoutLog = (app.deleteWorkoutLog = function (_id, callback) {
    callback();
  });
  let getWorkouts = (app.getWorkouts = function (params, callback) {
    callback();
  });

  let getUsers = (app.getUsers = function (params, callback) {
    callback();
  });
  let saveWorkout = (app.saveWorkout = function (obj, callback) {
    callback();
  });
  let deleteWorkout = (app.deleteWorkout = function (_id, callback) {
    callback();
  });
  let getMovements = (app.getMovements = function (params, callback) {
    callback();
  });
  let getGroupWod = (app.getGroupWod = function (params, callback) {
    callback();
  });
  let updatePersonalRecord = (app.updatePersonalRecord = function (params, callback) {
    callback();
  });
  let getPersonalRecord = (app.getPersonalRecord = function (params, callback) {
    callback();
  });
  let getGroup = (app.getGroup = function (params, callback) {
    callback();
  });

  let saveGroupWod = (app.saveGroupWod = function (params, callback) {
    callback();
  });

  let getMovementPr = (app.getMovementPr = function (params, callback) {
    callback();
  });

  let teardownComponents = function () {
    for (var key in app) {
      if (app.hasOwnProperty(key) && app[key] instanceof Component) {
        let component = app[key];
        for (var key in component.getState()) {
          component.setState({ [key]: '' });
        }
      }
    }
  };

  /**
   * Override the tearDown function in the $test object. Assign stubbed methods to the global $ironfyt object to avoid side effects.
   */
  global.$test = Uitest({
    tearDown: function () {
      $hl.getParams = getParams;

      teardownComponents();
      localStorage.setItem = localStroageSetItem;
      app.navigateToUrl = navigateToUrl;
      app.login = login;
      app.logout = logout;
      app.getWorkoutLogs = getWorkoutLogs;
      app.getCredentials = getCredentials;
      app.authenticateUser = authenticateUser;
      app.saveWorkoutLog = saveWorkoutLog;
      app.deleteWorkoutLog = deleteWorkoutLog;
      app.getWorkouts = getWorkouts;
      app.getUsers = getUsers;
      app.saveWorkout = saveWorkout;
      app.deleteWorkout = deleteWorkout;
      app.getMovements = getMovements;
      app.getGroupWod = getGroupWod;
      app.updatePersonalRecord = updatePersonalRecord;
      app.getPersonalRecord = getPersonalRecord;
      app.getGroup = getGroup;
      app.saveGroupWod = saveGroupWod;
      app.getMovementPr = getMovementPr;

      // Reset the selector on every $test call
      let selector = document.querySelector('#selector');
      selector.innerHTML = '';
    },
  });
})(window);
