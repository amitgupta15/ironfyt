(function () {
  'use strict';

  ($ironfyt.main = function () {
    let { token } = $ironfyt.getCredentials();
    if (!token) {
      $ironfyt.navigateToUrl('login.html');
    } else {
      $ironfyt.navigateToUrl('workoutlog.html');
    }
  })();
})();
