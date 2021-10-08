(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'movementpr-list.js Tests');

  let component = $ironfyt.movementprListComponent;
  let page = $ironfyt.movementprListPage;

  $test.it('should create a movementpr-list component', function () {
    $test.assert(component.selector === '[data-app=movementpr-list]');
    $test.assert(Object.keys(component.state).length === 5);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('movementprList' in component.state);
    $test.assert('showSpinner' in component.state);
    $test.assert('pageTitle' in component.state);
  });

  $test.it('should not allow unauthorized users to view this page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('You are not authorized');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'You are not authorized');
  });

  $test.it('should fetch movement pr for authorized user', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '1234' } });
    };
    $ironfyt.getMovementPr = function (params, callback) {
      if (params.user_id === '1234') {
        callback(false, [
          { movement: 'm1', pr: [] },
          { movement: 'm2', pr: [] },
        ]);
      }
    };

    page();
    let state = component.getState();
    $test.assert(state.movementprList.length === 2);
  });
  console.groupEnd();
})();
