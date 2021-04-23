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
  let login = (app.login = function (loginInfo, callback) {
    callback();
  });
  // for (var key in app) {
  //   if (app.hasOwnProperty(key) && typeof app[key] === 'function') {
  //     app[key] = function (callback) {
  //       callback();
  //     };
  //   }
  // }

  let teardownComponents = function () {
    for (var key in app) {
      if (app.hasOwnProperty(key) && app[key] instanceof Component) {
        let component = app[key];
        for (var key in component.getState()) {
          component.setState({ [key]: '' });
        }
      }
      // if (app.hasOwnProperty(key) && typeof app[key] === 'function') {
      //   app[key] = function (callback) {
      //     callback();
      //   };
      // }
    }
  };

  global.$test = Uitest({
    tearDown: function () {
      $hl.getParams = getParams;

      teardownComponents();

      localStorage.setItem = localStroageSetItem;
      app.navigateToUrl = navigateToUrl;
      app.login = login;

      let selector = document.querySelector('#selector');
      selector.innerHTML = '';
    },
  });
})(window);
