(function () {
  'use strict';

  // Create a global variable and expose it the world.
  var $ironfyt = {};
  self.$ironfyt = $ironfyt;

  let fetch = $hl.fetch;
  let serverUrl = '';

  $ironfyt.AUTH_TOKEN = 'ironfyt-auth-token';
  $ironfyt.AUTH_USER = 'ironfyt-auth-user';

  $ironfyt.getCredentials = function () {
    let token = localStorage.getItem($ironfyt.AUTH_TOKEN);
    let user = localStorage.getItem($ironfyt.AUTH_USER);
    user = user ? JSON.parse(user) : null;
    return { token, user };
  };

  $ironfyt.authenticateUser = function (callback) {
    let { token, user } = $ironfyt.getCredentials();
    if (token && user) {
      callback(false, { user });
    } else {
      callback({ message: `You are either not logged in or not authorized to view this page.` });
    }
  };

  $ironfyt.login = function (loginInfo, callback) {
    fetch.post(`${serverUrl}/login`, { data: loginInfo }, function (error, response) {
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
        callback(false, response);
      });
    });
  };

  $ironfyt.saveWorkoutLog = function (workoutlog, callback) {
    let headers = getAuthHeader();
    fetch.post(`/api/workoutlog`, { headers, data: workoutlog }, function (error, response) {
      validateReponse(error, function () {
        callback(false, response);
      });
    });
  };

  $ironfyt.deleteWorkoutLog = function (_id, callback) {
    let headers = getAuthHeader();
    fetch.delete(`/api/workoutlog?_id=${_id}`, { headers }, function (error, response) {
      validateReponse(error, function () {
        callback(false, response);
      });
    });
  };

  $ironfyt.getWorkouts = function (params, callback) {
    let headers = getAuthHeader();
    let queryString = $hl.createQueryString(params);
    fetch.get(`/api/workout?${queryString}`, { headers }, function (error, response) {
      validateReponse(error, function () {
        callback(false, response);
      });
    });
  };

  $ironfyt.getUsers = function (params, callback) {
    let headers = getAuthHeader();
    let queryString = $hl.createQueryString(params);
    fetch.get(`/api/user?${queryString}`, { headers }, function (error, response) {
      validateReponse(error, function () {
        callback(false, response);
      });
    });
  };

  $ironfyt.saveWorkout = function (workout, callback) {
    let headers = getAuthHeader();
    fetch.post(`/api/workout`, { headers, data: workout }, function (error, response) {
      validateReponse(error, function () {
        callback(false, response);
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

  // Check if the user is an admin
  $ironfyt.isAdmin = function (user) {
    return typeof user === 'object' && user.role && user.role === 'admin' ? true : false;
  };
  //Topbar template
  let topBarTemplate = function (props) {
    let user = props && props.user ? props.user : {};
    return `<div><a href="/">Home</a> Logged in as: ${user.fname} ${user.lname}</div>`;
  };

  // Common error template which can be shared across components to render error messages
  let errorTemplate = function (error) {
    return `<p class="error-div">${error.message}</p>`;
  };

  let validateReponse = function (error, callback) {
    //Server will send back error code 1 if the token has expired
    if (error && error.code === 1) {
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
})();
