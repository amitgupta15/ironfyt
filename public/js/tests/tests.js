/**
 * Main test file that should be included in the test-runner.html before any other test file.
 * This file contains all the test configurations required to conduct the unit tests
 */
(function (global) {
  'use strict';

  // Use HelperLib instance from ceapp so that the state can be viewed, especially for hl.getParams() method
  // global.$hl = ceapp.hl;

  // let getParams = $hl.getParams;
  // let get = $hl.fetch.get;
  // let post = $hl.fetch.post;

  let app = $ironfyt;
  for (var key in app) {
    if (app.hasOwnProperty(key) && typeof app[key] === 'function') {
      app[key] = function (callback) {
        callback();
      };
    }
  }

  let teardownComponents = function () {
    for (var key in app) {
      if (app.hasOwnProperty(key) && app[key] instanceof Component) {
        let component = app[key];
        for (var key in component.getState()) {
          component.setState({ [key]: '' });
        }
      }
      if (app.hasOwnProperty(key) && typeof app[key] === 'function') {
        app[key] = function (callback) {
          callback();
        };
      }
    }
  };

  global.$test = Uitest({
    tearDown: function () {
      // $hl.getParams = getParams;
      // $hl.fetch.get = get;
      // $hl.fetch.post = post;

      // $ironfyt.fetchUsers = fetchUsers;
      teardownComponents();
      let selector = document.querySelector('#selector');
      selector.innerHTML = '';
    },
  });
})(window);
