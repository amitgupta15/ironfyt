(function () {
  ('use strict');

  /**
   * This is the default page template for the landing page. This template is replaced with search result template when a user
   * starts searching for logs.
   * This page template is restored once user is done searching for logs.
   * @param {Object} props
   * @returns default page template
   */
  let defaultPageTemplate = function (props) {
    let groupwods = props && props.groupwods ? props.groupwods : [];
    return `
    <div id="default-page-template-dashboard">
      <div>
        <button class="log-this-workout-btn" id="new-log-btn">New Log</button>
        <button class="activity-btn" id="activity-btn">Logs</button>        
      </div>
      ${groupwods
        .map((groupwod) => {
          let workout = groupwod && groupwod.workout !== undefined ? groupwod.workout : {};
          let groupName = groupwod && groupwod.group && groupwod.group.name ? groupwod.group.name : '';
          let groupid = groupwod && groupwod.group && groupwod.group._id ? groupwod.group._id : '';
          let pr = groupwod && groupwod.pr && groupwod.pr.log ? groupwod.pr.log : {};
          let prDate = pr && pr.date ? pr.date : null;
          let log = groupwod && groupwod.log ? groupwod.log : false;
          return `
            <div class="rounded-border-primary margin-top-10px">
              <div class="flex margin-bottom-5px">
                <div class="text-color-primary flex-align-self-center flex-auto"><h3>${groupName}</h3></div>
                <div class="flex-auto text-align-right">
                  <button class="group-home-btn" id="group-home-btn-${groupid}" data-new-messages="5"></button>
                </div>
              </div>
              <p class="margin-bottom-5px">
                <span class="text-color-secondary">${new Date(groupwod.date).toLocaleDateString()}</span>
              </p>
              ${$ironfyt.displayWorkoutDetail(workout)}
              <div class="margin-top-10px">
                ${
                  log
                    ? `<div class="groupwod-log-text small-text">
                        <span class="workout-done"></span>${new Date(log.date).toLocaleDateString()}
                        ${$ironfyt.displayWorkoutLogDetail(log, 'groupwod-log-text', true)}
                      </div>`
                    : `<button class="log-this-workout-btn" id="log-this-wod-btn-${groupwod._id}">Log This WOD</button>`
                }   
              </div>
              <div class="margin-top-10px small-text">
                ${JSON.stringify(pr) === '{}' ? '' : `<div class="muted-text">Your PR is ${$ironfyt.displayWorkoutLogDetail(pr, 'text-color-secondary', true)} on <span class="text-color-secondary">${prDate ? new Date(prDate).toLocaleDateString() : ''}</span></div>`}
                <div class="margin-top-10px"><a href="workout-activity.html?workout_id=${groupwod.workout._id}&ref=index.html" class="workout-history-link">Workout Log</a></div>
              </div>
            </div>`;
        })
        .join('')}
    </div>`;
  };

  /**
   * This is the main template for the page. By default, the landing page shows, a search bar and the default page view. When a user initiates
   * workout log search, the default page view gets swaped out by search result page view.
   *
   * @param {Object} props
   * @returns page view
   */
  let landingPageTemplate = function (props) {
    return `
    <div class="container">
      ${$ironfyt.searchBarTemplate('search-workout-logs-dashboard-input', 'Search Logs...')}
      <div id="main-div-dashboard">
        ${defaultPageTemplate(props)}      
      </div>
    </div>`;
  };

  /** Sample code shows the video links next to the movements */
  /*
  Description:<br/>
  100 Battle Rope Slams <a href=""><img class="movie-icon" src="images/smart_display_black_24dp.svg"></a><br/>
  100 Battle Rope Side-to-Side <a href=""><img class="movie-icon" src="images/smart_display_black_24dp.svg"></a>
  */

  let component = ($ironfyt.landingPageComponent = Component('[data-app=landing]', {
    state: {
      user: {},
      error: '',
      groupwods: [],
      workoutlogs: [],
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, landingPageTemplate);
    },
  }));

  let navToURL = {
    'new-log-btn': 'workoutlog-form.html',
    'activity-btn': 'workoutlog-calendar.html',
  };

  let navigateEvent = function (event) {
    let targetId = event.target.id;
    $ironfyt.navigateToUrl(navToURL[targetId]);
  };

  /**
   * Event handler gets called on 'input' event in search-workout-logs-dashboard-input element.
   * Handler performs the search on workoutlog list and shows the results
   * @param {Event} event
   */
  let handleSearchLogsEvent = function (event) {
    let inputField = event.target;
    let mainDiv = document.querySelector('#main-div-dashboard');
    let state = component.getState();
    let workoutlogs = state.workoutlogs ? state.workoutlogs : [];
    let inputFieldValue = inputField.value;
    //If the search input field is empty then show the default view
    if (!inputFieldValue) {
      mainDiv.innerHTML = defaultPageTemplate(state);
      return;
    }
    mainDiv.innerHTML = `<div id="autocomplete-search-result"></div>`;
    let autocomleteDiv = document.querySelector('#autocomplete-search-result');
    let autocompleteList = '';
    let count = 0;
    for (let i = 0; i < workoutlogs.length; i++) {
      let log = workoutlogs[i];
      let workout = log && log.workout && log.workout.length ? log.workout[0] : {};
      let notes = log.notes ? log.notes : '';
      let notesMatchIndex = getSearchStringMatchIndex(notes);

      let workoutName = workout.name ? workout.name : '';
      let workoutNameIndex = getSearchStringMatchIndex(workoutName);

      let workoutType = workout.type ? workout.type : '';
      let workoutTypeIndex = getSearchStringMatchIndex(workoutType);

      let workoutReps = workout.reps ? workout.reps : '';
      let workoutRepsIndex = getSearchStringMatchIndex(workoutReps);

      let workoutDescription = workout.description ? workout.description : '';
      let workoutDescriptionIndex = getSearchStringMatchIndex(workoutDescription);

      let workoutTimecap = workout.timecap ? $ironfyt.formatTimecap(workout.timecap) : '';
      let workoutTimecapIndex = getSearchStringMatchIndex(workoutTimecap);

      if (notesMatchIndex > -1 || workoutNameIndex > -1 || workoutTypeIndex > -1 || workoutRepsIndex > -1 || workoutDescriptionIndex > -1 || workoutTimecapIndex > -1) {
        log.notes = getHighligtedAttribute(notesMatchIndex, notes);
        workout.name = getHighligtedAttribute(workoutNameIndex, workoutName);
        workout.type = getHighligtedAttribute(workoutTypeIndex, workoutType);
        workout.reps = getHighligtedAttribute(workoutRepsIndex, workoutReps);
        workout.description = getHighligtedAttribute(workoutDescriptionIndex, workoutDescription);
        workout.timecap = getHighligtedAttribute(workoutTimecapIndex, workoutTimecap);

        count++;
        autocompleteList += `
        <div class="workout-search-result-item margin-bottom-5px">
          <div class="margin-bottom-5px bold-text text-color-primary">Date: ${new Date(log.date).toLocaleDateString()}</div>
          <div class="text-color-primary bold-text">Workout</div>
          ${$ironfyt.displayWorkoutDetail(workout)}
          <div class="text-color-primary bold-text">Log</div>
          ${$ironfyt.displayWorkoutLogDetail(log)}
        </div>
        `;
      }
    }
    let countString = `<div class="margin-bottom-5px muted-text">Found ${count} Logs</div>`;
    autocomleteDiv.innerHTML = `<div>${countString}${autocompleteList}</div>`;
  };

  /**
   * Utility function normalizes the incoming string attribute and input field value, and compares to find the index of matching text. Returns the index.
   * This function is used by handleSearchLogsEvent()
   * @param {String} attribute
   * @param {String} inputFieldValue
   * @returns index of the matching text
   */
  let getSearchStringMatchIndex = function (attribute) {
    //Get the search input field value
    let inputFieldValue = document.querySelector('#search-workout-logs-dashboard-input').value.trim();
    //return the index of the search string in attribute parameter passed to the function
    return attribute.toLowerCase().indexOf(inputFieldValue.toLowerCase());
  };

  /**
   * Utility function finds the substring to be highlighted and returns the highlighted substring
   * This function is used by handleSearchLogsEvent()
   * @param {int} matchIndex
   * @param {String} attribute
   * @returns
   */
  let getHighligtedAttribute = function (matchIndex, attribute) {
    let inputField = document.querySelector('#search-workout-logs-dashboard-input');
    let inputFieldValue = inputField.value.trim();
    let stringToHighlight = matchIndex > -1 ? attribute.substr(matchIndex, inputFieldValue.length) : '';
    return attribute.replace(stringToHighlight, `<span class="text-color-secondary bold-text">${stringToHighlight}</span>`);
  };

  $hl.eventListener('click', 'new-log-btn', navigateEvent);
  $hl.eventListener('click', 'activity-btn', navigateEvent);
  $hl.eventListener('input', 'search-workout-logs-dashboard-input', handleSearchLogsEvent);

  document.addEventListener('click', function (event) {
    let groupIdRegex = new RegExp(/^group-home-btn-([a-zA-Z]|\d){24}/gm);
    if (groupIdRegex.test(event.target.id)) {
      let prefix = 'group-home-btn-';
      let groupId = event.target.id.substr(prefix.length);
      $ironfyt.navigateToUrl(`group.html?group_id=${groupId}`);
    }

    let logthiswodbtnRegex = new RegExp(/^log-this-wod-btn-([a-zA-Z]|\d){24}/gm);
    if (logthiswodbtnRegex.test(event.target.id)) {
      let prefix = 'log-this-wod-btn-';
      let groupwodId = event.target.id.substr(prefix.length);
      let groupwods = component.getState().groupwods;
      let groupwod = groupwods.filter(function (groupwod) {
        return groupwod._id === groupwodId;
      })[0];
      $ironfyt.navigateToUrl(`workoutlog-form.html?workout_id=${groupwod.workout._id}&date=${groupwod.date}&ref=index.html`);
    }
  });

  let sortByDateDesc = function (arr) {
    return arr.sort(function (a, b) {
      return new Date(b['date']) - new Date(a['date']);
    });
  };

  ($ironfyt.landingPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        $ironfyt.navigateToUrl('login.html');
      } else {
        let user = auth && auth.user ? auth.user : {};
        component.setState({ user });
        $ironfyt.getGroupWod({}, function (error, response) {
          if (error) {
            component.setState({ error });
            return;
          }
          let groupwods = response ? sortByDateDesc(response) : [];
          component.setState({ groupwods });
        });
        $ironfyt.getWorkoutLogs({ user_id: user._id }, function (error, response) {
          if (error) {
            component.setState({ error });
            return;
          }
          let workoutlogs = response && response.workoutlogs ? response.workoutlogs : [];
          workoutlogs = sortByDateDesc(workoutlogs);
          component.setState({ workoutlogs });
        });
      }
    });
  })();
})();
