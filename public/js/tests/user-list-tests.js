(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'user-list.js Tests');

  $test.it('should create userListComponent', function () {
    $test.assert($ironfyt.userListComponent.selector === '[data-app=user-list]');
    $test.assert(Object.keys($ironfyt.userListComponent.state).length === 2);
    $test.assert('users' in $ironfyt.userListComponent.state);
    $test.assert('error' in $ironfyt.userListComponent.state);
    console.log($ironfyt.fetchUsers);
  });
  console.groupEnd();
})();
