(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'index.js Tests');

  $test.it('should successfully check for a token in localstorage', function () {
    localStorage.getItem = function (key) {
      if (key === $ironfyt.AUTH_TOKEN) {
        return 'afaketoken';
      } else {
        return null;
      }
    };
    $ironfyt.navigateToUrl = function (url) {
      console.log(url);
    };
  });

  console.groupEnd();
})();
