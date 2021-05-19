(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlog-calendar.js Tests');

  let component = $ironfyt.workoutLogCalendarComponent;
  let page = $ironfyt.workoutLogCalendarPage;

  $test.it('should create a workoutLogCalendar component successfully', function () {
    $test.assert(component.selector === '[data-app=workoutlog-calendar]');
    $test.assert(Object.keys(component.state).length === 5);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('logs' in component.state);
    $test.assert('startdate' in component.state);
    $test.assert('enddate' in component.state);
  });

  $test.it('should not allow unauthorized user to view the calendar page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('Unauthorized User');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'Unauthorized User');
  });

  $test.it("should fetch the user's workout logs for the given month", function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { _id: 1 });
    };
    $hl.getParams = function () {
      return {
        startdate: '2021-01-15T00:00:00',
      };
    };
    let _filter;
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      _filter = filter;
      callback(false, { workoutlogs: [{}, {}] });
    };
    page();
    let state = component.getState();
    $test.assert(state.logs.length === 2);
    $test.assert(state.startdate === '2021-01-01T00:00:00.000Z');
    $test.assert(state.enddate === '2021-01-31T23:59:59.000Z');
  });
  console.groupEnd();
})();
