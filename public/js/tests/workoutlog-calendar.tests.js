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
    $test.assert('year' in component.state);
    $test.assert('month' in component.state);
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
    let _filter;
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      _filter = filter;
      callback(false, { workoutlogs: [{}, {}] });
    };
    page();
    let startdate = new Date(_filter.startdate);
    let enddate = new Date(_filter.enddate);
    let today = new Date();
    let startMonth = new Date(today.getFullYear(), today.getMonth());
    let endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    $test.assert(startdate.getMonth() === startMonth.getMonth());
    $test.assert(startdate.getFullYear() === startMonth.getFullYear());
    $test.assert(enddate.getMonth() === endMonth.getMonth());
    $test.assert(enddate.getFullYear() === endMonth.getFullYear());
    let state = component.getState();
    $test.assert(state.logs.length === 2);
  });
  console.groupEnd();
})();
