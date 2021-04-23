(function () {
  'use strict';

  let token = localStorage.getItem($ironfyt.AUTH_TOKEN);

  if (!token) {
    $ironfyt.navigateToUrl('login.html');
  } else {
    $ironfyt.navigateToUrl('workoutlog.html');
  }
})();
