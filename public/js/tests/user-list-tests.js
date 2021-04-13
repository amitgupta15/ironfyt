(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'user-list.js Tests');

  let component = $ironfyt.userListComponent;
  let page = $ironfyt.userListPage;

  $test.it('should create userListComponent', function () {
    $test.assert(component.selector === '[data-app=user-list]');
    $test.assert(Object.keys(component.state).length === 2);
    $test.assert('users' in component.state);
    $test.assert('error' in component.state);
  });

  $test.it('should fetch users', function () {
    $ironfyt.fetchUsers = function (callback) {
      callback(false, [
        { _id: 1, user: 'user 1' },
        { _id: 2, user: 'user 2' },
        { _id: 3, user: 'user 3' },
      ]);
    };
    $ironfyt.fetchLogs = function (callback) {
      callback(false, []);
    };

    page();
    let state = component.getState();
    $test.assert(state.users.length === 3);
  });
  console.groupEnd();
})();
