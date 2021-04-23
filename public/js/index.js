(function () {
  'use strict';

  let token = localStorage.getItem($ironfyt.AUTH_TOKEN);

  if (!token) {
    $ironfyt.navigateToUrl('login.html');
  } else {
    console.log(token);
  }

  // try to get the token from local storage
  // if token is present then get the logs and the user info and show the logs page
  // if token is not present then show the login page
  // On successful login, show the logs
})();
