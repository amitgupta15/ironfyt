/**
 * Main test file that should be included in the test-runner.html before any other test file.
 * This file contains all the test configurations required to conduct the unit tests
 */
(function (global) {
  'use strict';

  let getParams = $hl.getParams;

  let app = $ironfyt;

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
      let selector = document.querySelector('#selector');
      selector.innerHTML = '';
    },
  });
})(window);
