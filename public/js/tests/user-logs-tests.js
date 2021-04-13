(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'user-logs.js Tests');

  let component = $ironfyt.userLogsComponent;
  let page = $ironfyt.userLogsPage;

  $test.it('should create userLogsComponent', function () {
    $test.assert(component.selector === '[data-app=user-logs]');
    $test.assert(Object.keys(component.state).length === 2);
    $test.assert('logs' in component.state);
    $test.assert('error' in component.state);
  });

  $test.it("should fetch user's logs", function () {
    $hl.getParams = function () {
      return { _id: 1 };
    };
    $ironfyt.fetchUserLogs = function (userId, callback) {
      callback(false, []);
    };
    page();
    //   $ironfyt.fetchUsers = function (callback) {
    //     callback(false, [
    //       { _id: 1, user: 'user 1' },
    //       { _id: 2, user: 'user 2' },
    //       { _id: 3, user: 'user 3' },
    //     ]);
    //   };
    //   $ironfyt.fetchLogs = function (callback) {
    //     callback(false, []);
    //   };
    //   page();
    //   let state = component.getState();
    //   $test.assert(state.users.length === 3);
  });
  console.groupEnd();
})();
