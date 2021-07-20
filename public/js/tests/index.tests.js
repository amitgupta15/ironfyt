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

    $ironfyt.landingPage();
    $test.assert(_page === 'login.html');
  });

  console.groupEnd();
})();
