(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'workoutlog.js Tests');

  let component = $ironfyt.workoutlogComponent;
  let page = $ironfyt.workoutlogPage;

  $test.it('should create workoutlogComponent', function () {
    $test.assert(component.selector === '[data-app=workoutlog]');
    $test.assert('logs' in component.state);
  });

  $test.it('should show error if user is not present', function () {
    page();
    let state = component.getState();
    $test.assert(state.error.message === 'User not found, logout and log back in.');
  });

  $test.it('should retrieve workout logs for the logged in user', function () {
    $ironfyt.getWorkoutLogs = function (params, callback) {
      callback(false, { workoutlogs: [{ _id: 1 }, { _id: 2 }] });
    };
    $ironfyt.getCredentials = function () {
      return { user: { _id: 1 } };
    };
    page();
    let state = component.getState();
    $test.assert(state.logs.length === 2);
    $test.assert(state.user._id === 1);
  });

  $test.it('should show my logs and all logs', function () {
    $ironfyt.getWorkoutLogs = function (params, callback) {
      callback(false, { workoutlogs: [{ _id: 1 }, { _id: 2 }] });
    };
    $ironfyt.getCredentials = function () {
      return { user: { _id: 1 } };
    };
    page();
    let state = component.getState();
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);
    $test.assert(selector.innerHTML.includes('<button id="toggle-logs-btn">Show All Logs</button>'));

    selector.innerHTML = component.template({ filter: {} });
    $test.assert(selector.innerHTML.includes('<button id="toggle-logs-btn">Show My Logs</button>'));
  });
  console.groupEnd();
})();
