(function () {
  ('use strict');

  // Create a global variable and expose it the world.
  var $ironfyt = {};
  self.$ironfyt = $ironfyt;

  let fetch = $hl.fetch;
  let serverUrl = 'http://localhost:3000';

  $ironfyt.AUTH_TOKEN = 'ironfyt-auth-token';
  $ironfyt.AUTH_USER = 'ironfyt-auth-user';

  let validateReponse = function (error, callback) {
    if (error && error.code === 11) {
      $ironfyt.logout();
    } else {
      callback();
    }
  };

  let getAuthHeader = function () {
    let { token } = $ironfyt.getCredentials();
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  $ironfyt.getCredentials = function () {
    let token = localStorage.getItem($ironfyt.AUTH_TOKEN);
    let user = localStorage.getItem($ironfyt.AUTH_USER);
    user = user ? JSON.parse(user) : null;
    return { token, user };
  };

  $ironfyt.login = function (loginInfo, callback) {
    fetch.post(`${serverUrl}/login`, loginInfo, function (error, response) {
      callback(error, response);
    });
  };

  $ironfyt.logout = function () {
    localStorage.removeItem($ironfyt.AUTH_TOKEN);
    localStorage.removeItem($ironfyt.AUTH_USER);
    $ironfyt.navigateToUrl('/');
  };

  $ironfyt.getWorkoutLogs = function (params, callback) {
    let headers = getAuthHeader();
    let queryString = $hl.createQueryString(params);
    fetch.get(`/api/workoutlog?${queryString}`, { headers }, function (error, response) {
      validateReponse(error, function () {
        if (response.code === 0) {
          callback(false, response);
        } else {
          callback(response);
        }
      });
    });
  };
  /**
   * This methods builds the HTML for a page. It encapsulates the common page elements such as header, footer and takes a pageTemplate parameter that
   * holds the main content for the page
   *
   * @param {object} props - props to be passed to a template
   * @param {function} template - a template method that returns an html template
   */
  $ironfyt.pageTemplate = function (props, template) {
    props = props !== undefined ? props : {};
    if (props.error) {
      return errorTemplate(props.error);
    } else {
      return `
        ${topBarTemplate(props)}
        <div class="main">
        ${template(props)}
        </div>
        `;
    }
  };

  $ironfyt.navigateToUrl = function (page) {
    window.location.href = page;
  };

  //Topbar template
  let topBarTemplate = function (props) {
    let user = props && props.user ? props.user : {};
    return `<div>Logged in as: ${user.fname} ${user.lname}</div>`;
  };

  // Common error template which can be shared across components to render error messages
  let errorTemplate = function (error) {
    return `<p class="error-div">${error.message}</p>`;
  };
})();
