(function () {
  'use strict';
  let loginTemplate = function (props) {
    let token = props && props.token ? props.token : false;
    let user = props && props.user ? props.user : {};
    return token && JSON.stringify(user) !== '{}'
      ? `<h2>You are already logged in ${user.fname ? user.fname : ''} ${user.lname ? user.lname : ''}</h2>
      <button id="logout">Logout</button>
      `
      : `<div class="container login-container">
          <div class="login-logo">IronFyt</div>
          <form id="login-form">
            <div class="form-input-group margin-bottom-10px">
              <input type="text" class="form-input" name="email" id="email" placeholder="Email" />
              <label for="email" class="form-label">Email</label>
            </div>
            <div class="form-input-group margin-bottom-10px">
              <input type="password" class="form-input" name="password" id="password" placeholder="Password" />
              <label for="password" class="form-label">Password</label>
            </div>
            <div id="error-info"></div>
            <div class="submit-btn-bar">
              <button type="submit" id="submit" class="submit-btn">Login</button>
            </div>
          </form>
        </div>
      `;
  };

  $ironfyt.loginComponent = Component('[data-app=login]', {
    state: {},
    template: loginTemplate,
  });

  ($ironfyt.loginPage = function () {
    $ironfyt.redirectToSecurePage();
    let { token, user } = $ironfyt.getCredentials();
    $ironfyt.loginComponent.setState({ token, user });
  })();

  let handleLoginFormSubmitEvent = function (event) {
    event.preventDefault();
    let form = document.getElementById('login-form');
    let errorDiv = document.getElementById('error-info');

    let email = form.elements['email'].value.trim().toLowerCase();
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
          let token = response && response.token ? response.token : false;
          let user = response && response.user ? JSON.stringify(response.user) : '';

          if (token) {
            localStorage.setItem($ironfyt.AUTH_TOKEN, token);
            localStorage.setItem($ironfyt.AUTH_USER, user);
            $ironfyt.navigateToUrl(`/`);
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
