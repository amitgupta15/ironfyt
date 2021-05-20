(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlog-calendar.js Tests');

  let component = $ironfyt.workoutLogCalendarComponent;
  let page = $ironfyt.workoutLogCalendarPage;

  $test.it('should create a workoutLogCalendar component successfully', function () {
    $test.assert(component.selector === '[data-app=workoutlog-calendar]');
    $test.assert(Object.keys(component.state).length === 6);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('displayUser' in component.state);
    $test.assert('month' in component.state);
    $test.assert('year' in component.state);
    $test.assert('days' in component.state);
  });

  $test.it('should not allow unauthorized user to view the calendar page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('Unauthorized User');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'Unauthorized User');
  });

  $test.it('should take month and year url parameters and create a days array of size 42', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false);
    };

    $hl.getParams = function () {
      return { month: '0', year: '2021' }; // January 2021
    };

    let _filter;
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      _filter = filter;
      callback(false, {
        workoutlogs: [
          { _id: 1, date: '2021-01-03T08:00:00.000Z', notes: 'log for January 3rd 2021' },
          { _id: 2, date: '2020-12-30T08:00:00.000Z', notes: 'log for 30th' },
        ],
      });
    };

    page();
    let state = component.getState();
    $test.assert(state.month === 0);
    $test.assert(state.year === 2021);
    $test.assert(new Date(state.days[0].date).getDate() === 27);
    $test.assert(state.days[0].class === 'prev-month');
    $test.assert(new Date(state.days[5].date).getDate() === 1);
    $test.assert(state.days[5].class === 'curr-month');
    $test.assert(new Date(state.days[36].date).getDate() === 1);
    $test.assert(new Date(state.days[36].date).getMonth() === 1);
    $test.assert(state.days[36].class === 'next-month');
    $test.assert(new Date(state.days[41].date).getDate() === 6);
    $test.assert(state.days.length === 42);
    $test.assert(state.days[3].log._id === 2);
    $test.assert(state.days[7].log._id === 1);
  });

  $test.it("should only let admin to view another user's calendar", function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123456789012345678901234' } });
    };
    $hl.getParams = function () {
      return {
        user_id: '012345678901234567891111',
      };
    };
    page();
    let state = component.getState();
    $test.assert(state.error.message === "You are not authorized to view this user's calendar");

    component.setState({ error: '' });
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123456789012345678901234', role: 'admin' } });
    };
    state = component.getState();
    $test.assert(state.error === '');
  });

  console.groupEnd();
})();
