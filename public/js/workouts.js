(function () {
  ('use strict');

  let workoutItemTemplate = function (workout) {
    return `
      <div class="rounded-border-primary margin-bottom-10px">
        ${
          isAdmin()
            ? `
          <div class="day-log-detail-container-calendar-view-btn-bar">
            <button class="day-log-detail-edit-btn" id="edit-workout-btn-${workout._id}"></button>
            <button class="day-log-detail-delete-btn" id="delete-workout-btn-${workout._id}"></button>
          </div>`
            : ``
        }
        
        ${$ironfyt.displayWorkoutDetail(workout)}
        <div class="margin-top-10px">
          <a href="workout-activity.html?workout_id=${workout._id}&ref=workouts.html" class="workout-history-link">Workout Log</a>
        </div>    
      </div>`;
  };
  let defaultPageTemplate = function (props) {
    let workouts = props && props.workouts ? props.workouts : [];
    return workouts.map((workout) => workoutItemTemplate(workout)).join('');
  };

  let workoutsTemplate = function (props) {
    return `
      <div class="container">
        ${$ironfyt.searchBarTemplate('search-workouts-input', 'Search Workouts...')}
        <div id="main-div-workouts">
          ${defaultPageTemplate(props)}
        </div>
      </div>`;
  };

  let component = ($ironfyt.workoutsComponent = Component('[data-app=workouts]', {
    state: {
      user: {},
      error: '',
      workouts: [],
      pageTitle: 'Workouts',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutsTemplate);
    },
  }));

  let isAdmin = function () {
    let state = component.getState();
    let user = state.user ? state.user : {};
    return user.role === 'admin';
  };
  let handleSearchWorkoutsEvent = function (event) {
    let inputField = event.target;
    let mainDiv = document.querySelector('#main-div-workouts');
    let state = component.getState();
    let workouts = state.workouts ? state.workouts : [];
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
    for (let i = 0; i < workouts.length; i++) {
      let workout = workouts[i];

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

      if (workoutNameIndex > -1 || workoutTypeIndex > -1 || workoutRepsIndex > -1 || workoutDescriptionIndex > -1 || workoutTimecapIndex > -1) {
        workout.name = getHighligtedAttribute(workoutNameIndex, workoutName);
        workout.type = getHighligtedAttribute(workoutTypeIndex, workoutType);
        workout.reps = getHighligtedAttribute(workoutRepsIndex, workoutReps);
        workout.description = getHighligtedAttribute(workoutDescriptionIndex, workoutDescription);
        workout.timecap = getHighligtedAttribute(workoutTimecapIndex, workoutTimecap);

        count++;
        autocompleteList += workoutItemTemplate(workout);
      }
    }
    let countString = `<div class="margin-bottom-5px muted-text">Found ${count} Workouts</div>`;
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
    let inputFieldValue = document.querySelector('#search-workouts-input').value.trim();
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
    let inputField = document.querySelector('#search-workouts-input');
    let inputFieldValue = inputField.value.trim();
    let stringToHighlight = matchIndex > -1 ? attribute.substr(matchIndex, inputFieldValue.length) : '';
    return attribute.replace(stringToHighlight, `<span class="text-color-secondary bold-text">${stringToHighlight}</span>`);
  };

  // let deleteWorkout = function (targetId) {
  //   let prefix = 'delete-workout-';
  //   let _id = targetId.substring(prefix.length, targetId.length);
  //   if (_id.length === 24) {
  //     $ironfyt.deleteWorkout(_id, function (error, response) {
  //       if (!error) {
  //         $ironfyt.navigateToUrl('workouts.html');
  //       }
  //     });
  //   } else {
  //     component.setState({ error: { message: 'Invalid ID' } });
  //   }
  // };

  $hl.eventListener('input', 'search-workouts-input', handleSearchWorkoutsEvent);

  // document.addEventListener('click', function (event) {
  //   let idregex = new RegExp(/^delete-workout-([a-zA-Z]|\d){24}/gm);
  //   if (idregex.test(event.target.id)) {
  //     deleteWorkout(event.target.id);
  //   }
  // });

  ($ironfyt.workoutsPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        //Sending group_wod = 1 will fetch all the workouts created by the user and group admins of the groups the user belongs to
        $ironfyt.getWorkouts({ group_wods: 1 }, function (error, response) {
          if (!error) {
            let workouts = response && response.workouts ? response.workouts : [];
            component.setState({ user, workouts });
          } else {
            component.setState({ error });
          }
        });
      } else {
        component.setState({ error });
      }
    });
  })();
})();
