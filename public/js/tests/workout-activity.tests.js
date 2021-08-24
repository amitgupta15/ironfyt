(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workout-activity.js Tests');

  let component = $ironfyt.workoutActivityComponent;
  let page = $ironfyt.workoutActivityPage;

  $test.it('should create workout activitiy component', function () {
    $test.assert(component.selector === '[data-app=workout-activity]');
    $test.assert(Object.keys(component.state).length === 6);
    $test.assert('user' in component.state);
    $test.assert('workoutlogs' in component.state);
    $test.assert('error' in component.state);
    $test.assert('pr' in component.state);
    $test.assert('workout' in component.state);
    $test.assert('pageTitle' in component.state);
  });

  $test.it('should not allow unauthorized user to view the calendar page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('Unauthorized User');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'Unauthorized User');
  });

  $test.it('should fetch logs for the given workout', function () {
    $hl.getParams = function () {
      return { workout_id: '123412341234123412341234' };
    };
    $ironfyt.getWorkoutLogs = function (params, callback) {
      callback(false, { workoutlogs: [{ _id: 1 }, { _id: 2 }] });
    };
    $ironfyt.getPersonalRecord = function (params, callback) {
      callback(false, { log: { _id: 1 } });
    };
    page();
    let state = component.getState();
    $test.assert(state.workoutlogs.length === 2);
    $test.assert(state.pr._id === 1);
  });
  console.groupEnd();
})();
