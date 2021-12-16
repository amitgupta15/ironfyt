(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'index.js Tests');

  let component = $ironfyt.landingPageComponent;
  let page = $ironfyt.landingPage;

  $test.it('should create the landing page component', function () {
    $test.assert(component.selector === '[data-app=landing]');
    $test.assert(Object.keys(component.state).length === 5);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('groupwods' in component.state);
    $test.assert('workoutlogs' in component.state);
    $test.assert('pageTitle' in component.state);
  });

  $test.it('should redirect to the login page if no token found or expired token', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('error');
    };
    let _page;
    $ironfyt.navigateToUrl = function (page) {
      _page = page;
    };

    page();
    $test.assert(_page === 'login.html');
  });

  $test.it('should navigate to workoutlog-form with appropriate parameters when log with wod button is clicked', function () {
    let _url;
    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };

    let groupwods = [{ _id: '123412341234123412341234', workout: { _id: 'workout1' }, date: '2020-08-12T08:00:00.000Z' }];
    component.setState({ groupwods });
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ groupwods });
    $test.dispatchHTMLEvent('click', '#log-this-wod-btn-123412341234123412341234');
    $test.assert(_url === 'workoutlog-form.html?workout_id=workout1&date=2020-08-12T08:00:00.000Z&ref=index.html');
  });

  $test.it('should fetch groupwods on initial load', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '1234' } });
    };

    $ironfyt.getGroupWod = function (params, callback) {
      callback(false, [
        { date: new Date(), _id: '1', group: { name: 'wod 1' } },
        { date: new Date(), _id: '2', group: { name: 'wod 2' } },
      ]);
    };
    page();
    let state = component.getState();
    $test.assert(state.groupwods.length === 2);
  });

  $test.it('should fetch user workout logs on initial load', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '1234' } });
    };
    $ironfyt.getWorkoutLogs = function (params, callback) {
      callback(false, { workoutlogs: [{ notes: 'log your workout' }, { notes: '' }] });
    };
    page();
    let state = component.getState();
    $test.assert(state.workoutlogs.length === 2);
  });

  console.groupEnd();
})();
