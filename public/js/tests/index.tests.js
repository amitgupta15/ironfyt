(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'index.js Tests');

  $test.it('should redirect to the login page if no token found or expired token', function () {
    $ironfyt.getCredentials = function () {
      return {};
    };
    let _page;
    $ironfyt.navigateToUrl = function (page) {
      _page = page;
    };

    $ironfyt.main();
    $test.assert(_page === 'login.html');
  });

  $test.it('should redirect to the workoutlog page if a valid token and user are found', function () {
    $ironfyt.getCredentials = function () {
      return { token: 'afaketoken', user: { _id: 1 } };
    };

    let _page;
    $ironfyt.navigateToUrl = function (page) {
      _page = page;
    };

    $ironfyt.main();
    $test.assert(_page === 'workoutlog.html');
  });

  console.groupEnd();
})();
