(function () {
  ('use strict');

  // Create a global variable and expose it the world.
  var $ironfyt = {};
  self.$ironfyt = $ironfyt;

  let fetch = $hl.fetch;
  let serverUrl = '';

  $ironfyt.AUTH_TOKEN = 'ironfyt-auth-token';
  $ironfyt.AUTH_USER = 'ironfyt-auth-user';

  $ironfyt.redirectToSecurePage = function () {
    if (!(window.location.hostname === 'localhost' || new RegExp(/(192|127)(.\d{1,3}){3}/gm).exec(window.location.hostname))) {
      if (window.location.protocol === 'http:') {
        window.location.href = window.location.href.replace('http:', 'https:');
      }
    }
  };

  $ironfyt.getCredentials = function () {
    let token = localStorage.getItem($ironfyt.AUTH_TOKEN);
    let user = localStorage.getItem($ironfyt.AUTH_USER);
    user = user ? JSON.parse(user) : null;
    return { token, user };
  };

  $ironfyt.authenticateUser = function (callback) {
    $ironfyt.redirectToSecurePage();
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
    getRequest('/api/workoutlog', params, callback);
  };

  $ironfyt.saveWorkoutLog = function (workoutlog, callback) {
    let headers = getAuthHeader();
    fetch.post(`/api/workoutlog`, { headers, data: workoutlog }, function (error, response) {
      validateReponse(error, response, callback);
    });
  };

  $ironfyt.deleteWorkoutLog = function (_id, callback) {
    let headers = getAuthHeader();
    fetch.delete(`/api/workoutlog?_id=${_id}`, { headers }, function (error, response) {
      validateReponse(error, response, callback);
    });
  };

  $ironfyt.getWorkouts = function (params, callback) {
    getRequest('/api/workout', params, callback);
  };

  $ironfyt.getUsers = function (params, callback) {
    getRequest('/api/user', params, callback);
  };

  $ironfyt.getMovements = function (params, callback) {
    getRequest('/api/movement', params, callback);
  };

  $ironfyt.getGroupWod = function (params, callback) {
    getRequest('/api/groupwod', params, callback);
  };

  $ironfyt.getPersonalRecord = function (params, callback) {
    getRequest('/api/pr', params, callback);
  };

  $ironfyt.getGroup = function (params, callback) {
    getRequest('/api/group', params, callback);
  };

  /**
   * Get a list of movement PR for the user. Params object contains the user_id {user_id:'123'}
   * This query is used in movementpr-list.js
   * @param {Object} params
   * @param {function} callback
   */
  $ironfyt.getMovementPr = function (params, callback) {
    getRequest('/api/movementpr', params, callback);
  };

  $ironfyt.saveWorkout = function (workout, callback) {
    let headers = getAuthHeader();
    fetch.post(`/api/workout`, { headers, data: workout }, function (error, response) {
      validateReponse(error, response, callback);
    });
  };

  $ironfyt.deleteWorkout = function (_id, callback) {
    let headers = getAuthHeader();
    fetch.delete(`/api/workout?_id=${_id}`, { headers }, function (error, response) {
      validateReponse(error, response, callback);
    });
  };

  $ironfyt.updatePersonalRecord = function (workoutlog, callback) {
    let headers = getAuthHeader();
    fetch.post(`/api/pr`, { headers, data: workoutlog }, function (error, response) {
      validateReponse(error, response, callback);
    });
  };

  $ironfyt.saveGroupWod = function (groupwod, callback) {
    let headers = getAuthHeader();
    fetch.post(`/api/groupwod`, { headers, data: groupwod }, function (error, response) {
      validateReponse(error, response, callback);
    });
  };

  $ironfyt.parseWorkoutDescription = function (workout, callback) {
    let headers = getAuthHeader();
    fetch.post(`/api/parseworkout`, { headers, data: workout }, function (error, response) {
      validateReponse(error, response, callback);
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
    let user = props && props.user ? props.user : {};
    let pagename = props && props.pagename ? props.pagename : '';
    if (props.error) {
      return errorTemplate(props.error);
    } else {
      return `
        ${topBarTemplate(props)}
        <div class="main">
        ${template(props)}
        </div>
        <!-- Following div is needed to cover the unsafe bottom area in the PWA view -->
        <div class="nav-bar-dummy"></div>
        <div class="nav-bar">
          <a class="nav-bar-item" href="/">
            <img src="images/${pagename === 'home' ? `home-icon-active.svg` : `home-icon.svg`}" />
            <div ${pagename === 'home' ? 'class="nav-bar-item-active"' : ''}>Home</div>
          </a>
          <a class="nav-bar-item" href="workoutlog-calendar.html">
            <img src="images/${pagename === 'logs' ? `calendar-icon-active.svg` : `calendar-icon.svg`}" />
            <div ${pagename === 'logs' ? 'class="nav-bar-item-active"' : ''}>Logs</div>
          </a>
          <div class="nav-bar-item">
            <img src="images/add_circle_24dp.svg" />
            <div>New</div>
          </div>
          <a class="nav-bar-item" href="workouts.html">
            <img src="images/${pagename === 'workouts' ? `workouts-icon-active.svg` : `workouts-icon.svg`}" />
            <div ${pagename === 'workouts' ? 'class="nav-bar-item-active"' : ''}>Workouts</div>
          </a>
          <div class="nav-bar-item profile-icon">${user.fname ? user.fname.substring(0, 1).toUpperCase() : ''}${user.lname ? user.lname.substring(0, 1).toUpperCase() : ''}</div>
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

  // Format time cap to accommodate legacy string based timecap
  $ironfyt.formatTimecap = function (timecap) {
    let timecapStr = '';
    if (typeof timecap === 'string') {
      timecapStr = timecap;
    } else if (typeof timecap === 'object' && timecap !== null) {
      if (!(timecap.hours === null && timecap.minutes === null && timecap.seconds === null)) {
        timecapStr += timecap.hours ? `${timecap.hours} hr ` : '';
        timecapStr += timecap.minutes ? `${timecap.minutes} mins ` : '';
        timecapStr += timecap.seconds ? `${timecap.seconds} secs` : '';
      }
    }
    return timecapStr;
  };
  // Format modality
  $ironfyt.formatModality = function (modality) {
    let modalities = {
      m: 'C',
      g: 'B',
      w: 'W',
    };
    return modalities[modality];
  };

  //'calories', 'miles', 'feet', 'meters', 'minutes'
  $ironfyt.units = ['lbs', 'kgs', 'pood'];

  // Workout Details Template
  $ironfyt.displayWorkoutDetail = function (workout, open = true, showBorder = false) {
    let timecap = $ironfyt.formatTimecap(workout.timecap);
    return `
    <details ${open ? `open` : ''}>
      <summary>${workout.name}</summary>
      <div class="workout-detail-view ${showBorder ? `day-has-log margin-top-5px` : ''}">
      ${workout.modality && workout.modality.length ? `<p><strong>Modality: </strong>${workout.modality.map((m) => `<span class="modality-${m}">${$ironfyt.formatModality(m)}</span>`).join(' ')}</p>` : ``}
      ${workout.type ? `<p><strong>Type: </strong> ${workout.type}</p>` : ''}
      ${timecap ? `<p><strong>Time Cap: </strong> ${timecap}</p>` : ''}
      ${workout.rounds ? `<p><strong>Rounds: </strong> ${workout.rounds}</p>` : ''}
      ${workout.reps ? `<p><strong>Reps: </strong> ${workout.reps}</p>` : ''}
      ${workout.description ? `<p>${$hl.replaceNewLineWithBR(workout.description)}</p>` : ''}
      ${workout.scalingdesc ? `<br/><details><summary><strong>Scaling Options</strong></summary><p>${$hl.replaceNewLineWithBR(workout.scalingdesc)}</p></details>` : ''}
      </div>
    </details>
    `;
  };

  // Re-usable log detail template
  $ironfyt.displayWorkoutLogDetail = function (log, cssClass = '', hideTitle = false) {
    return `
    <div class="${cssClass}">
    ${
      log.duration && (parseInt(log.duration.hours) > 0 || parseInt(log.duration.minutes) > 0 || parseInt(log.duration.seconds) > 0)
        ? `<p>${!hideTitle ? `<strong>Duration: </strong>` : ``}${log.duration.hours ? `${log.duration.hours} hr` : ''} ${log.duration.minutes ? `${log.duration.minutes} mins` : ''} ${log.duration.seconds ? `${log.duration.seconds} secs` : ''}</p>`
        : ''
    }
    ${
      log.roundinfo && log.roundinfo.length && (log.roundinfo[0].rounds || log.roundinfo[0].load)
        ? `<div class="flex">
            ${!hideTitle ? `<div><strong>Rounds/Load:&nbsp;</strong></div>` : ``}
            <div>${log.roundinfo.map((roundinfo) => `${roundinfo.rounds ? ` ${roundinfo.rounds}` : ''}${roundinfo.load ? (roundinfo.rounds ? ` X ${roundinfo.load} ${roundinfo.unit}` : `${roundinfo.load} ${roundinfo.unit}`) : ``}`).join('<br/>')}</div>
          </div>`
        : ''
    }
    ${log.rounds ? `<p>${!hideTitle ? `<strong>Rounds: </strong>` : ``}${log.rounds}</p>` : ''}
    ${
      log.totalreps
        ? `<div class="flex">
            ${!hideTitle ? `<div><strong>Total Reps: </strong></div>` : ``}
            <div>${log.totalreps}</div>
          </div>`
        : ``
    }
    ${
      log.movements && log.movements.length
        ? `<div>
            ${!hideTitle ? `<div><strong>Movements: </strong></div>` : ``}
            <div>
              ${log.movements
                .map((movement) => {
                  let repsArray = movement.reps && Array.isArray(movement.reps) ? movement.reps : [];
                  //Remove the legacy portion of the code to show movement once all the movement data is cleaned up
                  return `
                    <div>${movement && movement.movementObj ? movement.movementObj.movement : `${movement.movement}: ${movement.reps ? `${movement.reps}` : ''}${movement.load ? (movement.reps ? ` X ${movement.load}` : `${movement.load}`) : ``} ${movement.unit ? movement.unit : ``}`}</div>
                    <div class="margin-bottom-10px">
                    ${repsArray
                      .map((rep) => {
                        return `<div>${rep.reps} ${rep.load !== null ? ` X ${rep.load} ${rep.unit ? rep.unit : ''}` : ''}</div>`;
                      })
                      .join('')}
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>`
        : ''
    }
    ${
      log.notes
        ? `<div>
            ${!hideTitle ? `<div><strong>Notes: </strong></div>` : ``}
            <div>${$hl.replaceNewLineWithBR(log.notes)}</div>
          </div>`
        : ''
    }
    ${
      log.location
        ? `<div class="flex">
            ${!hideTitle ? `<div><strong>Location: </strong></div>` : ``}
            <div>${log.location}</div>
          </div>`
        : ''
    }</div>`;
  };

  //Topbar template
  let topBarTemplate = function (props) {
    let leftButtonTitle = props && props.leftButtonTitle ? props.leftButtonTitle : '';
    return `
    <div class="top-bar">
      <div class="top-bar-menu">
        ${leftButtonTitle.toLowerCase() === 'back' ? `<a href="javascript: history.go(-1)" class="topbar-back-btn">Back</a>` : ''}
      </div>
      <img src="images/logo/IronFytLogo.svg" class="top-bar-logo">
      <div></div>
    </div>`;
  };

  /**
   * Reusable search bar template
   * @param {*} inputId - id and name for the html input element
   * @param {*} placeholder - placeholder text for the input element and label
   * @returns html template to render a search bar
   */
  $ironfyt.searchBarTemplate = function (inputId, placeholder) {
    return `
    <div class="position-relative margin-top-20px margin-bottom-15px">
      <span class="search-input-icon"></span>
      <input type="text" class="form-input search-input" name="${inputId}" id="${inputId}" value="" placeholder="${placeholder}"/>
      <label for="${inputId}" class="form-label">${placeholder}</label>
    </div>`;
  };
  // Common error template which can be shared across components to render error messages
  let errorTemplate = function (error) {
    return `<p class="error-div">${error.message}</p>`;
  };

  /**
   * Displays the log item which includes, workout name, modality, log details
   * @param {Object} log
   * @param {Object} workout
   */
  $ironfyt.displayLogListItemTemplate = function (log, workout, ref, logCssClass = '', logHideTitle = false, showWorkoutDesc = true, showWorkoutBorder = false) {
    return `
    <div class="rounded-corner-box margin-bottom-10px workout-detail-container">
      <div class="item-btn-bar">
        <button class="item-edit-btn" id="edit-log-btn-${log._id}"></button>
        <button class="item-delete-btn" id="delete-log-btn-${log._id}"></button>
      </div>
      <div class="margin-bottom-5px text-color-secondary"><h3>Date: ${new Date(log.date).toLocaleDateString()}</h3></div>
      ${log.modality && log.modality.length ? `<p>${log.modality.map((m) => `<span class="modality-${m}">${$ironfyt.formatModality(m)}</span>`).join(' ')}</p>` : ''}
      ${
        workout.name !== '' && workout.name !== undefined
          ? `
            <div class="text-color-secondary "><h3>Workout</h3></div>
            ${$ironfyt.displayWorkoutDetail(workout, showWorkoutDesc, showWorkoutBorder)}
          `
          : ``
      }
      <div class="text-color-secondary margin-top-10px"><h3>Log</h3></div>
      <div>${$ironfyt.displayWorkoutLogDetail(log, logCssClass, logHideTitle)}</div>
      ${
        workout.name !== ''
          ? `<div class="margin-top-10px">
              <a href="workout-activity.html?workout_id=${workout._id}&ref=${ref}" class="workout-history-link">Workout Log</a>
            </div>`
          : ''
      }
    </div>`;
  };
  $ironfyt.displaySpinner = function (msg = 'A little patience goes a long way...') {
    return `<div class="container margin-top-20px text-align-center">
              <h3>${msg}</h3>
              <div class="spinner-container">
                <div class="spinner"></div>
              </div>
            </div>`;
  };

  let validateReponse = function (error, response, callback) {
    //Server will send back error code 1 if the token has expired
    if (error && error.code === 1) {
      $ironfyt.logout();
    } else if (error && error.code !== 1) {
      callback(error, response);
    } else {
      callback(false, response);
    }
  };

  let getRequest = function (path, params, callback) {
    let headers = getAuthHeader();
    let queryString = $hl.createQueryString(params);
    fetch.get(`${path}?${queryString}`, { headers }, function (error, response) {
      validateReponse(error, response, callback);
    });
  };

  let getAuthHeader = function () {
    let { token } = $ironfyt.getCredentials();
    return {
      Authorization: `Bearer ${token}`,
    };
  };
})();
