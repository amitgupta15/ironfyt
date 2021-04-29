(function () {
  'use strict';
  let loginTemplate = function (props) {
    let token = props && props.token ? props.token : false;
    let user = props && props.user ? props.user : {};
    return token && JSON.stringify(user) !== '{}'
      ? `<h2>You are already logged in ${user.fname ? user.fname : ''} ${user.lname ? user.lname : ''}</h2>
      <button id="logout">Logout</button>
      `
      : `<div class="login-container">
        <h2>Login</h2>
        <form id="login-form">
          <div>
            <label for="email">Email</label>
            <input type="text" id="email" name="email" placeholder="Email">
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password">
          </div>
          <div>
            <button id="submit">Login</button>
          </div>
          <div id="error-info"></div>
        </form>
      </div>
      `;
  };

  $ironfyt.loginComponent = Component('[data-app=login]', {
    state: {},
    template: loginTemplate,
  });

  ($ironfyt.loginPage = function () {
    let { token, user } = $ironfyt.getCredentials();
    $ironfyt.loginComponent.setState({ token, user });
  })();

  let handleLoginFormSubmitEvent = function (event) {
    event.preventDefault();
    let form = document.getElementById('login-form');
    let errorDiv = document.getElementById('error-info');

    let email = form.elements['email'].value.trim();
    let password = form.elements['password'].value.trim();
    if (email === '' || password === '') {
      errorDiv.innerHTML = `Please enter a valid email address and password`;
    } else {
      errorDiv.innerHTML = '';
      let loginInfo = { email, password };
      $ironfyt.login(loginInfo, function (error, response) {
        if (error) {
          let errorMessage = error.error ? error.error : 'Unknown error occurred';
          errorDiv.innerHTML = errorMessage;
        } else {
          let token = response.token ? response.token : false;
          let user = response.user ? JSON.stringify(response.user) : '';

          if (token) {
            localStorage.setItem($ironfyt.AUTH_TOKEN, token);
            localStorage.setItem($ironfyt.AUTH_USER, user);
            $ironfyt.navigateToUrl(`workoutlog.html`);
          } else {
            errorDiv.innerHTML = 'Problem retrieving authorization token. Contact Administrator';
          }
        }
      });
    }
  };
  let handleLogoutEvent = function (event) {
    event.preventDefault();
    $ironfyt.logout();
  };
  $hl.eventListener('submit', 'login-form', handleLoginFormSubmitEvent);
  $hl.eventListener('click', 'logout', handleLogoutEvent);
})();
