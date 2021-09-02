(function () {
  ('use strict');

  let setWodModalTemplate = function (props) {
    let groups = props && props.groups && props.groups.length ? props.groups : [];
    let selectedWorkoutForWod = props && props.selectedWorkoutForWod ? props.selectedWorkoutForWod : {};
    let today = $hl.formatDateForInputField(new Date());
    return `
    <div class="modal-container" id="set-wod-modal">
      <div class="modal-dialog select-workout-modal">
        <button class="close-modal-dialog" id="close-set-wod-modal-btn">X</button>
        <div class="margin-top-10px">
          <h4 class="text-align-center margin-bottom-10px">Set Workout Of The Day</h4>
          <div class="text-color-secondary bold-text">Workout</div>
          <div class="margin-bottom-10px">${$ironfyt.displayWorkoutDetail(selectedWorkoutForWod, false)}</div>
          <div class="form-flex-group margin-bottom-5px">
            <div class="form-input-group flex-width-100">
              <input type="date" name="wod-date" id="wod-date" placeholder="Date" value="${today}" class="form-input"/>
              <label for="wod-date" class="form-label date-label">Date</label>
            </div>
          </div>
          <div class="form-input-group margin-top-10px">
            <div class="text-color-highlight">Group</div>
            <select class="form-input" name="group" id="wod-group">
              <option></option>
              ${groups.map((group) => `<option value="${group._id}">${group.name}</option>`)}
            </select>
          </div>
          <input type="hidden" id="wod-workout-id" name="wod-workout-id" value="${selectedWorkoutForWod._id}">
          <div class="submit-btn-bar margin-top-5px">
            <button type="button" id="save-group-wod-btn" class="submit-btn" disabled>Save</button>
          </div>
        </div>
      </div>
    </div>`;
  };

  let workoutItemTemplate = function (workout) {
    return `
      <div class="rounded-corner-box margin-bottom-10px workout-detail-container">
        ${
          isAdmin()
            ? `
          <div class="item-btn-bar">
            <button class="item-set-wod-btn" id="set-as-wod-btn-${workout._id}"></button>
            <button class="item-edit-btn" id="edit-workout-btn-${workout._id}"></button>
            <button class="item-delete-btn" id="delete-workout-btn-${workout._id}"></button>
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
        ${
          isAdmin()
            ? `<div class="flex margin-bottom-10px">
                <button class="btn-primary icon-add" id="new-wod-btn">New WOD</button>    
              </div>`
            : ``
        }
        <div id="main-div-workouts">
          ${defaultPageTemplate(props)}
        </div>
      </div>
      ${setWodModalTemplate(props)}
      `;
  };

  let component = ($ironfyt.workoutsComponent = Component('[data-app=workouts]', {
    state: {
      user: {},
      error: '',
      workouts: [],
      pageTitle: 'Workouts',
      selectedWorkoutForWod: {},
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

      let workoutReps = workout.reps ? (typeof workout.reps === 'number' ? workout.reps.toString() : workout.reps) : '';
      let workoutRepsIndex = getSearchStringMatchIndex(workoutReps);

      let workoutDescription = workout.description ? workout.description : '';
      let workoutDescriptionIndex = getSearchStringMatchIndex(workoutDescription);

      let workoutTimecap = workout.timecap ? $ironfyt.formatTimecap(workout.timecap) : '';
      let workoutTimecapIndex = getSearchStringMatchIndex(workoutTimecap);

      if (workoutNameIndex > -1 || workoutTypeIndex > -1 || workoutRepsIndex > -1 || workoutDescriptionIndex > -1 || workoutTimecapIndex > -1) {
        workout.name = workoutName.trim() ? getHighligtedAttribute(workoutNameIndex, workoutName) : '';
        workout.type = workoutType.trim() ? getHighligtedAttribute(workoutTypeIndex, workoutType) : '';
        workout.reps = workoutReps.trim() ? getHighligtedAttribute(workoutRepsIndex, workoutReps) : '';
        workout.description = workoutDescription.trim() ? getHighligtedAttribute(workoutDescriptionIndex, workoutDescription) : '';
        workout.timecap = workoutTimecap.trim() ? getHighligtedAttribute(workoutTimecapIndex, workoutTimecap) : '';

        count++;
        autocompleteList += workoutItemTemplate(workout);
      }
    }
    let countString = `<div class="margin-bottom-5px text-color-secondary">Found ${count} Workouts</div>`;
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
    return attribute.replace(stringToHighlight, `<span class="text-color-highlight bold-text">${stringToHighlight}</span>`);
  };

  /**
   * Sets the state with the workout to be used for group wod and opens the dialog box to set the wod
   * @param {String} workoutId
   */
  let setWod = function (workoutId) {
    let state = component.getState();
    let workouts = state.workouts && state.workouts.length ? state.workouts : [];
    let selectedWorkoutForWod = workouts.filter((workout) => workout._id === workoutId)[0];
    component.setState({ selectedWorkoutForWod });
    let dialog = document.getElementById('set-wod-modal');
    dialog.classList.add('show-view');
  };

  let handleCloseSetWodModalEvent = function (event) {
    let dialog = document.getElementById('set-wod-modal');
    dialog.classList.remove('show-view');
  };

  let handleNewWodEvent = function (event) {
    $ironfyt.navigateToUrl('workout-form.html');
  };

  /**
   * Handle the Set Workout Of The Day save event. Calls the api to update/insert new WOD for the given group and date
   * @param {Event} event
   */
  let handleSaveGroupWodEvent = function (event) {
    let wodWorkoutId = document.querySelector('#wod-workout-id').value;
    let wodDate = $hl.getDateObjFromHTMLDateInput(document.querySelector('#wod-date').value);
    let wodGroupId = document.querySelector('#wod-group').value;
    let groupwod = { date: wodDate, workout_id: wodWorkoutId, group_id: wodGroupId };

    $ironfyt.saveGroupWod(groupwod, function (error, response) {
      if (error) {
        console.log(error);
        return;
      }
      handleCloseSetWodModalEvent();
      $ironfyt.navigateToUrl(`group.html?group_id=${wodGroupId}&date=${wodDate.toISOString()}`);
    });
  };

  let enableSaveGroupWodBtn = function (event) {
    let saveGroupWodButton = document.querySelector('#save-group-wod-btn');
    let wodDate = document.querySelector('#wod-date').value;
    let wodGroup = document.querySelector('#wod-group').value;
    saveGroupWodButton.disabled = wodDate !== '' && wodGroup !== '' ? false : true;
  };

  $hl.eventListener('input', 'wod-date', enableSaveGroupWodBtn);
  $hl.eventListener('input', 'wod-group', enableSaveGroupWodBtn);
  $hl.eventListener('input', 'search-workouts-input', handleSearchWorkoutsEvent);
  $hl.eventListener('click', 'new-wod-btn', handleNewWodEvent);
  $hl.eventListener('click', 'close-set-wod-modal-btn', handleCloseSetWodModalEvent);
  $hl.eventListener('click', 'save-group-wod-btn', handleSaveGroupWodEvent);

  document.addEventListener('click', function (event) {
    let idregex = new RegExp(/^edit-workout-btn-([a-zA-Z]|\d){24}/gm);
    if (idregex.test(event.target.id)) {
      let targetId = event.target.id;
      let prefix = 'edit-workout-btn-';
      let _id = targetId.substring(prefix.length, targetId.length);
      $ironfyt.navigateToUrl(`workout-form.html?_id=${_id}`);
    }

    let deleteregex = new RegExp(/^delete-workout-btn-([a-zA-Z]|\d){24}/gm);
    if (deleteregex.test(event.target.id)) {
      let targetId = event.target.id;
      let prefix = 'delete-workout-btn-';
      let _id = targetId.substring(prefix.length, targetId.length);
      $ironfyt.deleteWorkout(_id, function (error, response) {
        if (!error) {
          $ironfyt.navigateToUrl('workouts.html');
        } else {
          component.setState({ error });
        }
      });
    }

    let setwodregex = new RegExp(/^set-as-wod-btn-([a-zA-Z]|\d){24}/gm);
    if (setwodregex.test(event.target.id)) {
      let targetId = event.target.id;
      let prefix = 'set-as-wod-btn-';
      let _id = targetId.substring(prefix.length, targetId.length);
      setWod(_id);
    }
  });

  ($ironfyt.workoutsPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        component.setState({ user });
        //Sending group_wod = 1 will fetch all the workouts created by the user and group admins of the groups the user belongs to
        $ironfyt.getWorkouts({ group_wods: 1 }, function (error, response) {
          if (!error) {
            let workouts = response && response.workouts ? response.workouts : [];
            component.setState({ workouts });
            if (user.role === 'admin') {
              $ironfyt.getGroup({ admin_id: user._id }, function (error, groups) {
                if (!error) {
                  component.setState({ groups });
                } else {
                  component.setState({ error });
                }
              });
            }
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
