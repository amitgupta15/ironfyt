(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlogs.js Tests');

  let component = $ironfyt.workoutlogsComponent;
  let page = $ironfyt.workoutlogsPage;

  $test.it('should create a workoutlogs component successfully', function () {
    $test.assert(component.selector === '[data-app=workoutlogs-list]');
    $test.assert('user' in component.state);
    $test.assert('selectedUser' in component.state);
    $test.assert('workoutlogs' in component.state);
    $test.assert(Object.keys(component.state).length === 4);
  });

  $test.it('should redirect with user_id url params if not url params is provided and the logged in user is not an admin', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: `123456789012345678901234` } }); // Not an admin
    };
    let _url;
    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };
    page();
    $test.assert(_url === 'workoutlogs.html?user_id=123456789012345678901234');
  });

  $test.it('should fetch all workoutlogs if the user_id url param is not provided and the logged in user is an admin', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: `123456789012345678901234`, role: 'admin' } }); // admin
    };
    let _filter;
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      _filter = filter;
      callback(false, { workoutlogs: [{ _id: 1 }, { _id: 2 }] });
    };
    page();

    $test.assert(JSON.stringify(_filter) === '{}');
    let state = component.getState();
    $test.assert(state.user._id === `123456789012345678901234`);
    $test.assert(state.user.role === `admin`);
    $test.assert(state.workoutlogs.length === 2);
  });

  $test.it('should check for invalid user id - length must be 24', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: `123456789012345678901234` } });
    };
    $hl.getParams = function () {
      return { user_id: `123456789012345678901` }; // length less than 24
    };
    page();
    let state = component.getState();
    $test.assert(state.error.message === 'Invalid User ID');
  });

  $test.it("should NOT fetch logs if user_id does not match the logged in non-admin user's id", function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: `123456789012345678901234` } });
    };
    $hl.getParams = function () {
      return { user_id: `123456789012345678901233` }; // id different from logged in user's id
    };
    page();
    let state = component.getState();
    $test.assert(state.error.message === 'Invalid request. Not authorized.');
  });

  $test.it("should fetch logs if user_id matches the logged in non-admin user's id", function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: `123456789012345678901234` } });
    };
    let _filter, _userfilter;
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      _filter = filter;
      callback(false, { workoutlogs: [{}, {}] });
    };
    $ironfyt.getUsers = function (userfilter, callback) {
      _userfilter = userfilter;
      callback(false, { user: { _id: `123456789012345678901234` } });
    };
    $hl.getParams = function () {
      return { user_id: `123456789012345678901234` }; // id same as logged in user's id
    };
    page();
    let state = component.getState();
    $test.assert(_filter.user_id === '123456789012345678901234');
    $test.assert(state.workoutlogs.length === 2);
    $test.assert(_userfilter._id === '123456789012345678901234');
    $test.assert(state.selectedUser._id === '123456789012345678901234');
  });

  $test.it('should fetch logs for any given user_id if the logged in user is an admin', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: `123456789012345678901234`, role: 'admin' } }); //Admin user
    };
    let _filter, _userfilter;
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      _filter = filter;
      callback(false, { workoutlogs: [{}, {}] });
    };
    $ironfyt.getUsers = function (userfilter, callback) {
      _userfilter = userfilter;
      callback(false, { user: { _id: `123456789012345678901233` } });
    };
    $hl.getParams = function () {
      return { user_id: `123456789012345678901233` }; // different id from the logged in user (admin)
    };
    page();
    let state = component.getState();
    $test.assert(_filter.user_id === '123456789012345678901233');
    $test.assert(state.workoutlogs.length === 2);
    $test.assert(_userfilter._id === '123456789012345678901233');
    $test.assert(state.selectedUser._id === '123456789012345678901233');
    $test.assert(state.user._id === '123456789012345678901234');
  });

  $test.it('should delete a log', function () {
    let id, navigateToUrl;
    $ironfyt.deleteWorkoutLog = function (_id, callback) {
      id = _id;
      callback(false);
    };
    $ironfyt.navigateToUrl = function (url) {
      navigateToUrl = url;
    };

    let props = { user: { _id: `123456789012345678901233` }, selectedUser: { _id: `123456789012345678901233` }, workoutlogs: [{ _id: '111111111111111111111111' }, { _id: '222222222222222222222222' }] };
    component.setState(props);
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(props);

    $test.assert(selector.innerHTML.includes('<button id="delete-222222222222222222222222">Delete</button>'));

    let state = component.getState();
    $test.assert(state.workoutlogs.length === 2);

    $test.dispatchHTMLEvent('click', '#delete-222222222222222222222222');
    state = component.getState();

    $test.assert(id === '222222222222222222222222');
    $test.assert(navigateToUrl === 'workoutlogs.html');
  });
  console.groupEnd();
})();
