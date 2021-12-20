(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlog-calendar.js Tests');

  let component = $ironfyt.workoutLogCalendarComponent;
  let page = $ironfyt.workoutLogCalendarPage;

  $test.it('should create a workoutLogCalendar component successfully', function () {
    $test.assert(component.selector === '[data-app=workoutlog-calendar]');
    $test.assert(Object.keys(component.state).length === 8);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('displayUser' in component.state);
    $test.assert('month' in component.state);
    $test.assert('year' in component.state);
    $test.assert('days' in component.state);
    $test.assert('pagename' in component.state);
    $test.assert('selectedDay' in component.state);
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
          { _id: 2, date: '2020-12-30T08:00:00.000Z', notes: 'log for 30th', modality: ['m', 'g'] },
          { _id: 3, date: '2020-12-30T08:00:00.000Z', notes: 'another log for 30th', modality: ['g', 'w'] },
          { _id: 4, date: '2021-01-06T05:00:00.000Z', notes: 'some log' },
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
    $test.assert(state.days[3].logs.length === 2);
    $test.assert(state.days[3].modalities.length === 3);
    $test.assert(state.days[3].logs[0]._id === 2);
    $test.assert(state.days[7].logs[0]._id === 1);

    //Since the date gets normalized to local timezone in the database, a date set in chicago will be show up a day earlier in los angeles
    $test.assert(state.days[9].logs.length === 1);
    $test.assert(state.days[9].logs[0]._id === 4);
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

  $test.it("should only show a user's name on the calendar if a user is not the one logged in", function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123456789012345678901234', role: 'admin', fname: 'Admin' } });
    };
    $ironfyt.getUsers = function (filter, callback) {
      callback(false, { user: { _id: '012345678901234567891111', fname: 'Amit' } });
    };
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      callback(false, {
        workoutlogs: [
          { _id: 1, date: '2021-01-03T08:00:00.000Z', notes: 'log for January 3rd 2021' },
          { _id: 2, date: '2020-12-30T08:00:00.000Z', notes: 'log for 30th' },
        ],
      });
    };
    $hl.getParams = function () {
      return {
        user_id: '012345678901234567891111',
      };
    };
    page();
    let state = component.getState();
    $test.assert(state.displayUser.fname === 'Amit');
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);
    $test.assert(selector.innerHTML.includes('<div id="display-name-calendar-view">Amit</div>'));

    $hl.getParams = function () {
      return {
        user_id: '123456789012345678901234',
      };
    };
    page();
    state = component.getState();
    selector.innerHTML = component.template(state);
    $test.assert(selector.innerHTML.includes('<div id="display-name-calendar-view"></div>'));
  });

  $test.it('should change month when prev, next or today button is clicked', function () {
    let _url;
    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    component.setState({ month: 0, year: 2021 });
    $test.dispatchHTMLEvent('click', '#prev-month-btn');
    $test.assert(_url === 'workoutlog-calendar.html?year=2020&month=11&date=1');

    $test.dispatchHTMLEvent('click', '#next-month-btn');
    $test.assert(_url === 'workoutlog-calendar.html?year=2021&month=1&date=1');

    $test.dispatchHTMLEvent('click', '#today-btn');
    let date = new Date();
    $test.assert(_url === `workoutlog-calendar.html?year=${date.getFullYear()}&month=${date.getMonth()}&date=${date.getDate()}`);
  });

  $test.it('should set selectedDay to an appropriate item from days array upon initial page load', function () {
    let date = new Date();
    date.setHours(0, 0, 0, 0);

    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123456789012345678901234', role: 'admin' } });
    };

    $ironfyt.getWorkoutLogs = function (filter, callback) {
      callback(false, {
        workoutlogs: [
          { _id: 1, date: date, notes: 'log for January 3rd 2021' },
          { _id: 2, date: date, notes: 'log for 30th' },
        ],
      });
    };
    page();
    let state = component.getState();
    $test.assert(new Date(state.selectedDay.date) - date === 0);
    $test.assert(state.selectedDay.logs.length === 2);
    $test.assert(state.selectedDay.logs[0].notes === 'log for January 3rd 2021');
    $test.assert(state.selectedDay.logs[1].notes === 'log for 30th');

    $hl.getParams = function () {
      return { month: '0', year: '2021' }; // January 2021
    };
    page();
    state = component.getState();
    let selectedDate = new Date(state.selectedDay.date);
    $test.assert(selectedDate.getMonth() === 0);
    $test.assert(selectedDate.getFullYear() === 2021);
    $test.assert(selectedDate.getDate() === 1);
  });

  $test.it('should set the selectedDay to an appropriate item from days array upon clicking prev and next day button', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123456789012345678901234', role: 'admin' } });
    };

    $ironfyt.getWorkoutLogs = function (filter, callback) {
      callback(false, {
        workoutlogs: [
          { _id: 1, date: '2021-01-03T08:00:00.000Z', notes: 'log for January 3rd 2021' },
          { _id: 2, date: '2020-12-30T08:00:00.000Z', notes: 'log for 30th' },
        ],
      });
    };
    $hl.getParams = function () {
      return { month: '0', year: '2021' }; // January 2021
    };
    page();

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    let state = component.getState();
    component.setState({ selectedDay: state.days[1] });
    state = component.getState();
    $test.assert(state.selectedDay.index === 1);

    $test.dispatchHTMLEvent('click', '#prev-day-btn');
    state = component.getState();
    $test.assert(state.selectedDay.index === 0);

    $test.dispatchHTMLEvent('click', '#prev-day-btn');
    state = component.getState();
    $test.assert(state.selectedDay.index === 0); //Clicking prev button won't have any effect if the index was already 0

    component.setState({ selectedDay: state.days[40] });
    state = component.getState();
    $test.assert(state.selectedDay.index === 40);

    $test.dispatchHTMLEvent('click', '#next-day-btn');
    state = component.getState();
    $test.assert(state.selectedDay.index === 41);

    $test.dispatchHTMLEvent('click', '#next-day-btn');
    state = component.getState();
    $test.assert(state.selectedDay.index === 41); // Clicking next button won't have any effect if the index is already 41
  });

  $test.it('should handle edit log event', function () {
    let _url;
    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ selectedDay: { logs: [{ _id: '123456789012345678909999' }] } });
    component.setState({ displayUser: { _id: '012345678901234567892222' } });
    $test.dispatchHTMLEvent('click', '#edit-log-btn-123456789012345678909999');
    $test.assert(_url === 'workoutlog-form.html?_id=123456789012345678909999&user_id=012345678901234567892222&ref=workoutlog-calendar.html');
  });

  $test.it('should handle delete log event', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ selectedDay: { logs: [{ _id: '123456789012345678909999' }] } });

    $test.dispatchHTMLEvent('click', '#delete-log-btn-123456789012345678909999');
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="delete-log-confirmation-dialog" style="display: flex;">'));
    let state = component.getState();
    $test.assert(state.deleteLogId === '123456789012345678909999');

    $test.dispatchHTMLEvent('click', '#cancel-delete-log-btn');
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="delete-log-confirmation-dialog" style="display: none;">'));
    state = component.getState();
    $test.assert(state.deleteLogId === null);

    //Finally delete the log
    $ironfyt.deleteWorkoutLog = function (_id, callback) {
      callback(false);
    };
    let _url;
    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };
    component.setState({ selectedDay: { date: '2021-01-01T08:00:00.000Z' }, displayUser: { _id: '012345678901234567892222' } });
    $test.dispatchHTMLEvent('click', '#delete-log-btn-123456789012345678909999');
    $test.dispatchHTMLEvent('click', '#confirm-delete-log-btn');
    $test.assert(_url === 'workoutlog-calendar.html?ref=workoutlog-calendar.html&user_id=012345678901234567892222&month=0&year=2021&date=1');
  });
  console.groupEnd();
})();
