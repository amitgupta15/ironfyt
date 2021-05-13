(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workout-detail.js Tests');

  let component = $ironfyt.workoutDetailComponent;
  let page = $ironfyt.workoutDetailPage;

  $test.it('should create a workoutDetail component successfully', function () {
    $test.assert(component.selector === '[data-app=workout-detail]');
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('workout' in component.state);
    $test.assert('logs' in component.state);
    $test.assert(Object.keys(component.state).length === 4);
  });

  $test.it('should not allow unauthorized user to view this page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('Unauthorized User');
    };

    page();
    let state = component.getState();
    $test.assert(state.error === 'Unauthorized User');
  });

  $test.it('should fetch the workout for the given _id', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123456789012345678901234' } });
    };
    $hl.getParams = function () {
      return { _id: '012345678901234567890123' };
    };
    let _filter;
    $ironfyt.getWorkouts = function (filter, callback) {
      _filter = filter;
      callback(false);
    };
    page();
    $test.assert(_filter._id === '012345678901234567890123');
  });
  console.groupEnd();
})();
