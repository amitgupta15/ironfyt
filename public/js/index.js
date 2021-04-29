(function () {
  'use strict';

  ($ironfyt.main = function () {
    let { token, user } = $ironfyt.getCredentials();
    if (token && user) {
      $ironfyt.navigateToUrl('workoutlog.html');
    } else {
      $ironfyt.navigateToUrl('login.html');
    }
  })();
})();
