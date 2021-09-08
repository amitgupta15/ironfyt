(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlog-list.js Tests');

  let component = $ironfyt.workoutLogListComponent;
  let page = $ironfyt.workoutLogListPage;

  $test.it('should create a workoutlog list component successfully', function () {
    $test.assert(component.selector === '[data-app=workoutlog-list]');
    $test.assert(Object.keys(component.state).length === 4);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('workoutlogs' in component.state);
    $test.assert('pageTitle' in component.state);
  });

  $test.it('should not allow unauthorized users to view this page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('Unauthorized User');
    };

    page();
    let state = component.getState();
    $test.assert(state.error === 'Unauthorized User');
  });

  $test.it('should fetch all the workout logs for the logged in user', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123456789123456789123456' } });
    };
    let _params;
    $ironfyt.getWorkoutLogs = function (params, callback) {
      _params = params;
      callback(false, { workoutlogs: [{ _id: 1 }, { _id: 2 }] });
    };
    page();
    $test.assert(_params.user_id === '123456789123456789123456');
    let state = component.getState();
    $test.assert(state.workoutlogs.length === 2);
  });
  console.groupEnd();
})();
