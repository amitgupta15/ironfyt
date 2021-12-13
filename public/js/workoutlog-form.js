(function () {
  ('use strict');

  // Default workout log
  let newWorkoutLog = {
    date: new Date(),
    workout_id: null,
    user_id: null,
    duration: {
      hours: null,
      minutes: null,
      seconds: null,
    },
    rounds: null,
    modality: [],
    notes: null,
    movements: [],
  };

  let repsRowTemplate = (attr, movementIndex, repsIndex) => {
    let { reps, movementObj } = attr;
    let units = movementObj && movementObj.units ? movementObj.units : [];
    let repsNum = reps && reps.reps ? reps.reps : '';
    let repsLoad = reps && reps.load ? reps.load : '';
    let repsUnit = reps && reps.unit ? reps.unit : '';
    return `
    <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
      <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
        ${repsIndex === 0 ? `<label for="wolog-movement-reps-${movementIndex}-${repsIndex}" class="form-label-classic">Reps</label>` : ``}
        <input type="number" class="form-input-classic" name="wolog-movement-reps-${movementIndex}-${repsIndex}" id="wolog-movement-reps-${movementIndex}-${repsIndex}" value="${repsNum}" placeholder="">    
      </div>
      ${
        units.length
          ? `
          <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
            ${repsIndex === 0 ? `<label for="wolog-movement-load-${movementIndex}-${repsIndex}" class="form-label-classic">Load</label>` : ``}  
            <input type="number" class="form-input-classic" name="wolog-movement-load-${movementIndex}-${repsIndex}" id="wolog-movement-load-${movementIndex}-${repsIndex}" value="${repsLoad}" placeholder="">
          </div>
          <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
            ${repsIndex === 0 ? `<label for="wolog-movement-unit-${movementIndex}-${repsIndex}" class="form-label-classic">Unit</label>` : ``}  
            <select class="form-input-classic" name="wolog-movement-unit-${movementIndex}-${repsIndex}" data-movement-index="${movementIndex}" id="wolog-movement-unit-${movementIndex}-${repsIndex}">
              <option value=""></option>
              ${units.map((unit) => `<option value="${unit}" ${unit === repsUnit ? 'selected' : ''}>${unit}</option>`)}
            </select>
          </div>
      `
          : ``
      }  
      <div class="${repsIndex === 0 ? 'margin-top-30px' : ''}">
        <button type="button" class="copy-btn" data-movement-index="${movementIndex}" data-reps-index="${repsIndex}" id="copy-wolog-movement-reps-${movementIndex}-${repsIndex}"></button>
        <button type="button" class="remove-btn" data-movement-index="${movementIndex}" data-reps-index="${repsIndex}" id="delete-wolog-movement-reps-${movementIndex}-${repsIndex}"></button>
      </div>
    </div>`;
  };

  let selectedWorkoutTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    return `
    <div class="margin-bottom-5px">
      <div class="text-color-highlight margin-bottom-5px">Selected Workout</div>
      <div class="flex rounded-corner-box">
        <div class="flex-align-self-center margin-top-5px">
          ${$ironfyt.displayWorkoutDetail(workout)}
        </div>
        <button type="button" id="unselect-workout" class="remove-btn margin-left-5px"></button> 
      </div>
    </div>`;
  };

  /**
   * Parent template for workout log form
   * @param {Object} props
   * @returns HTML template to be rendered
   */
  let workoutlogFormTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let wologdate = workoutlog && workoutlog.date ? $hl.formatDateForInputField(workoutlog.date) : '';
    let validationError = props.validationError ? props.validationError : {};
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    let users = props.users ? props.users : [];
    let loggedInUser = props.user ? props.user : {};
    let movements = workoutlog && workoutlog.movements ? workoutlog.movements : [];
    console.log(workoutlog.notes);
    return `
    <form id="workout-log-form" class="form-container" autocomplete="off">
      <div class="margin-bottom-5px">
        <label for="wolog-date" class="form-label-classic">Date</label>
        <input type="date" name="wolog-date" id="wolog-date" value="${wologdate}" placeholder="" class="form-input-classic"/>
        ${validationError.date ? `<div id="error-wolog-date" class="error">${validationError.date}</div>` : ``}
      </div>
      ${
        isAdmin() && users
          ? `
        <div class="margin-bottom-5px">
          <label for="wolog-user" class="form-label-classic">User</label>
          <select class="form-input-classic" name="wolog-user" id="wolog-user">
            <option value=""></option>
            ${users.map((user) => `<option value="${user._id}" ${user._id === workoutlog.user_id ? 'selected' : user._id === loggedInUser._id ? 'selected' : ''}>${user.fname} ${user.lname}</option>`)}
          </select>  
        </div>
      `
          : ``
      }
      ${workout ? selectedWorkoutTemplate(props) : ``}
      <input type="hidden" id="wolog-workout-id" value="${workout ? workout._id : ''}">
      <div class="margin-bottom-5px">
        <div class="form-label-classic">Modality</div>
        <div class="form-flex-group margin-top-5px">
          <label class="switch small">
            <input type="checkbox" id="modality-m" name="wolog-modality" value="m" ${workoutlog.modality && workoutlog.modality.indexOf('m') > -1 ? 'checked' : ''}/>
            <span class="slider small round"></span>
          </label>
          <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-cardio"><span class="modality-m"></span>Cardio</div>
          <label class="switch small">
            <input type="checkbox" id="modality-g" name="wolog-modality" value="g" ${workoutlog.modality && workoutlog.modality.indexOf('g') > -1 ? 'checked' : ''} />
            <span class="slider small round"></span>
          </label>
          <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-body-weight"><span class="modality-g"></span>Body Weight</div>
          <label class="switch small">
            <input type="checkbox" id="modality-w" name="wolog-modality" value="w" ${workoutlog.modality && workoutlog.modality.indexOf('w') > -1 ? 'checked' : ''} />
            <span class="slider small round"></span>
          </label>
          <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-weights"><span class="modality-w flex-align-self-center"></span>Weights</div>
        </div>
      </div>
      <div class="flex margin-bottom-5px">
        <div class="flex-auto">
          <div class="form-label-classic">Duration</div>
          <div class="form-flex-group margin-top-5px">
            <div class="form-input-group show-time-separator">
              <input type="number" class="form-input-classic duration-input" name="wolog-duration-hours" id="wolog-duration-hours" min="0" max="240" value="${workoutlog.duration && workoutlog.duration.hours ? workoutlog.duration.hours : ''}" placeholder="H" />
            </div>
            <div class="form-input-group show-time-separator">
              <input type="number" class="form-input-classic duration-input" name="wolog-duration-minutes" id="wolog-duration-minutes" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.minutes ? workoutlog.duration.minutes : ''}" placeholder="M" />
            </div>
            <div class="form-input-group">
              <input type="number" class="form-input-classic duration-input" name="wolog-duration-seconds" id="wolog-duration-seconds" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.seconds ? workoutlog.duration.seconds : ''}" placeholder="S" />
            </div>
          </div>
        </div>
        <div class="margin-left-20px">
          <label for="wolog-rounds" class="form-label-classic">Rounds</label>
          <input type="number" class="form-input-classic" name="wolog-rounds" id="wolog-rounds" value="${workoutlog.rounds ? workoutlog.rounds : ''}" placeholder="">    
        </div>
      </div>
      <div class="margin-bottom-5px position-relative">
        <label for="wolog-add-movement" class="form-label-classic" id="wolog-add-movement-input-label">Movements</label>
        <input class="form-input-classic" name="wolog-add-movement" id="wolog-add-movement" placeholder="Add a movement..." />
        <div id="autocomplete-movement-list" class="autocomplete-movement-list"></div>
      </div>
      ${movements
        .map((movement, movementIndex) => {
          let reps = movement.reps ? movement.reps : [];
          return `
              <div class="rounded-corner-box margin-top-5px">
                <div class="form-flex-group">
                  <div id="wolog-movement-data-${movementIndex}">${movement && movement.movementObj ? movement.movementObj.movement : ''}</div>
                  <button type="button" class="remove-btn margin-left-5px"  data-wolog-movement-index="${movementIndex}" id="delete-wolog-movement-${movementIndex}"></button>
                </div>
                ${reps.map((reps, repsIndex) => repsRowTemplate({ reps, movementObj: movement.movementObj }, movementIndex, repsIndex)).join('')}
              </div>
              `;
        })
        .join('')}
      <div class="margin-bottom-5px">
        <label for="wolog-notes" class="form-label-classic">Notes</label>
        <textarea class="form-input-classic wolog-notes" name="wolog-notes" id="wolog-notes" placeholder="">${workoutlog.notes ? workoutlog.notes : ''}</textarea>      
      </div>
      ${validationError.catchAll ? `<div id="error-catch-all" class="error">${validationError.catchAll}</div>` : ''}
      <div class="submit-btn-bar margin-top-5px">
        <button type="submit" id="submit-wolog" class="submit-btn">Save</button>
      </div>
    </form>
    `;
  };

  let component = ($ironfyt.workoutlogFormComponent = Component('[data-app=workoutlog-form]', {
    state: {
      error: '',
      validationError: {},
      workoutlog: newWorkoutLog,
      user: {},
      workouts: [],
      pageTitle: 'Log',
      movements: [],
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogFormTemplate);
    },
    afterRender: function (props) {
      if (props.error === '') {
        autocompleteMovement(document.getElementById('wolog-add-movement'), props.movements ? props.movements : []);
      }
    },
  }));

  /**
   * This method is used to autocomplete the "movements" input field on the logs form.
   * The method is called at the time of component creation in afterRender to make it ready for use
   *
   * Credit: Got the inspiration for the code from https://www.w3schools.com/howto/howto_js_autocomplete.asp
   *
   * @param {*} textField - Input field on which the autocomplete will attach itself to
   * @param {*} list - List of data to use for autocomplete
   */
  let autocompleteMovement = function (textField, list) {
    let autocompleteDiv = document.getElementById('autocomplete-movement-list');
    // Execute the function when someone writes something in the input field
    textField.addEventListener('input', function (event) {
      //Capture the input value
      let textFieldValue = this.value;
      //Close any open lists of autocompleted values
      if (!textFieldValue) {
        //If no textfield value then clean the list
        autocompleteDiv.innerHTML = '';
        return false;
      }
      let autocompleteList = '';
      for (let i = 0; i < list.length; i++) {
        if (list[i].movement.toLowerCase().includes(textFieldValue.toLowerCase())) {
          let subStringIndex = list[i].movement.toLowerCase().indexOf(textFieldValue.toLowerCase());
          // Check if the first letter of the list items matches the input value or if 2 or more letters match anywhere in the list item
          // if ((textFieldValue.length < 2 && subStringIndex === 0) || textFieldValue.length >= 2) { //Suspending this check for now. In some cases, this check can be misleading
          let stringToHighlight = list[i].movement.substr(subStringIndex, textFieldValue.length);
          autocompleteList += `<div id="movement-list-item-${i}" data-movement-list-item-index="${i}">${list[i].movement.replace(stringToHighlight, `<span class="text-color-highlight">${stringToHighlight}</span>`)}</div>`;
          // }
        }
      }
      autocompleteDiv.innerHTML = autocompleteList;
    });
  };

  let createWorkoutLogObjFromFormElements = function () {
    let elements = document.querySelector('#workout-log-form').elements;
    let state = component.getState();
    let workoutlog = state.workoutlog ? state.workoutlog : newWorkoutLog;

    let date = $hl.getDateObjFromHTMLDateInput(elements['wolog-date'].value);
    workoutlog.date = date instanceof Date && !isNaN(date) ? date : '';
    workoutlog.notes = $hl.sanitize(elements['wolog-notes'].value.trim());
    workoutlog.user_id = workoutlog.user_id ? workoutlog.user_id : state.user._id;

    //Admin can override the user id
    if (isAdmin()) {
      let user_id = elements['wolog-user'].value;
      workoutlog.user_id = user_id;
    }

    //If admin is creating a copy then remove the _id
    let params = $hl.getParams();
    let admincopy = params && params.admincopy === '1';
    if (isAdmin() && admincopy) {
      workoutlog._id = null;
    }

    workoutlog.modality = [];
    for (var i = 0; i < elements['wolog-modality'].length; i++) {
      if (elements['wolog-modality'][i].checked) workoutlog.modality.push(elements['wolog-modality'][i].value);
    }

    workoutlog.workout_id = elements['wolog-workout-id'].value.trim();

    workoutlog.duration = {
      hours: elements['wolog-duration-hours'].value ? parseInt(elements['wolog-duration-hours'].value) : 0,
      minutes: elements['wolog-duration-minutes'].value ? parseInt(elements['wolog-duration-minutes'].value) : 0,
      seconds: elements['wolog-duration-seconds'].value ? parseInt(elements['wolog-duration-seconds'].value) : 0,
    };

    workoutlog.rounds = elements[`wolog-rounds`].value ? parseInt(elements[`wolog-rounds`].value) : null;

    let movements = workoutlog.movements ? workoutlog.movements : [];
    movements.forEach((movement, movementIndex) => {
      movement.reps.forEach((rep, repsIndex) => {
        let repsField = document.getElementById(`wolog-movement-reps-${movementIndex}-${repsIndex}`);
        let loadField = document.getElementById(`wolog-movement-load-${movementIndex}-${repsIndex}`);
        let unitField = document.getElementById(`wolog-movement-unit-${movementIndex}-${repsIndex}`);
        rep.reps = repsField && repsField.value !== '' ? parseInt(repsField.value) : null;
        rep.load = loadField && loadField.value !== '' ? parseInt(loadField.value) : null;
        rep.unit = unitField && unitField.value !== '' ? parseInt(unitField.value) : null;
      });
    });
    workoutlog.movements = movements;
    return workoutlog;
  };

  let validateFormInput = function () {
    let elements = document.querySelector('#workout-log-form').elements;
    let validationError = {};

    let empty_movement_reps = true;
    let empty_movement_load = true;
    if (elements['wolog-movement-reps-0']) {
      empty_movement_reps = elements['wolog-movement-reps-0'].value === '' || elements['wolog-movement-reps-0'].value === 0;
    }
    if (elements['wolog-movement-load-0']) {
      empty_movement_load = elements['wolog-movement-load-0'].value === '' || elements['wolog-movement-load-0'].value === 0;
    }
    if (elements['wolog-date'].value === '') {
      validationError.date = 'Please enter a date for the log';
    }
    if (
      (elements['wolog-duration-hours'].value === '' || parseInt(elements['wolog-duration-hours'].value) === 0) &&
      (elements['wolog-duration-minutes'].value === '' || parseInt(elements['wolog-duration-minutes'].value) === 0) &&
      (elements['wolog-duration-seconds'].value === '' || parseInt(elements['wolog-duration-seconds'].value) === 0) &&
      (elements['wolog-rounds'].value === '' || parseInt(elements['wolog-rounds'].value) === 0) &&
      elements['wolog-notes'].value.trim() === '' &&
      empty_movement_load &&
      empty_movement_reps
    ) {
      validationError.catchAll = 'Please enter a value in one of the fields or add notes.';
    }
    return validationError;
  };

  let handleWorkoutLogFormSubmitEvent = function (event) {
    event.preventDefault();
    let workoutlog = createWorkoutLogObjFromFormElements();
    let validationError = validateFormInput();

    if (JSON.stringify(validationError) === '{}') {
      //Disable submit button to avoid multiple submissions
      let submitButton = document.getElementById('submit-wolog');
      submitButton.disabled = true;
      submitButton.innerHTML = 'Saving...';

      let params = $hl.getParams();
      let ref = params && params.ref ? params.ref : 'workoutlog-calendar.html';
      let user_id = params && params.user_id ? `&user_id=${params.user_id}` : false;
      let date = ref === 'workoutlog-calendar.html' ? `&year=${new Date(workoutlog.date).getFullYear()}&month=${new Date(workoutlog.date).getMonth()}&date=${new Date(workoutlog.date).getDate()}` : false;
      let workoutIdRef = ref === 'workout-activity.html' ? `&workout_id=${workoutlog.workout_id}` : false;
      let url = `${ref}?ref=workoutlog-form.html${user_id ? user_id : ''}${date ? date : ''}${workoutIdRef ? workoutIdRef : ''}`; // default url
      if (ref === 'group.html') {
        let group_id = params && params.group_id ? params.group_id : '';
        url = `${ref}?group_id=${group_id}`; // form the url for group page
      }
      $ironfyt.saveWorkoutLog(workoutlog, function (error, response) {
        if (error) {
          console.error(error);
          component.setState({ error });
        } else {
          let workoutlog = response && response.workoutlog ? response.workoutlog : null;
          let state = component.getState();
          if (workoutlog && workoutlog.workout_id && workoutlog.user_id === state.user._id) {
            $ironfyt.updatePersonalRecord(workoutlog, function (error, response) {
              if (error) {
                component.setState({ error });
                return;
              }
            });
          }
          $ironfyt.navigateToUrl(url);
        }
      });
    } else {
      component.setState({ workoutlog, validationError });
    }
  };

  let handleUnselectWorkoutEvent = function (event) {
    let workoutlog = createWorkoutLogObjFromFormElements();
    workoutlog.workout = [];
    component.setState({ workoutlog });
  };

  /**
   * Deletes the specified reps row from the movement.
   * @param {Event} event
   */
  let deleteMovementReps = function (event) {
    let workoutlog = createWorkoutLogObjFromFormElements();
    let movementIndex = parseInt(event.target.dataset.movementIndex);
    let repsIndex = parseInt(event.target.dataset.repsIndex);
    let movement = workoutlog.movements ? workoutlog.movements[movementIndex] : {};
    movement.reps.splice(repsIndex, 1);
    component.setState({ workoutlog });
  };

  /**
   * Creates a new row of movement reps
   * @param {Event} event
   */
  let copyMovementReps = function (event) {
    let workoutlog = createWorkoutLogObjFromFormElements();
    let movementIndex = parseInt(event.target.dataset.movementIndex);
    let repsIndex = parseInt(event.target.dataset.repsIndex);
    let movement = workoutlog.movements ? workoutlog.movements[movementIndex] : {};
    let rep = movement.reps[repsIndex];
    //createWorkoutObjFromFields() method will already update the movement.reps array with the latest values from the fields.
    //Get the rep object for the specified index and copy it to the index right after the current rep object
    movement.reps.splice(repsIndex + 1, 0, rep);
    component.setState({ workoutlog });
  };

  /**
   * Deletes the specified movement from the workout form
   * @param {Event} event
   */
  let deleteMovement = function (event) {
    let workoutlog = createWorkoutLogObjFromFormElements();
    let movementIndex = parseInt(event.target.dataset.wologMovementIndex);
    let movements = workoutlog.movements ? workoutlog.movements : [];
    movements.splice(movementIndex, 1);
    component.setState({ workoutlog });
  };

  /**
   * Adds the selected movement to the list of movements and hides the auto complete list
   * @param {Event} event
   */
  let addMovementFromAutoList = function (event) {
    let workoutlog = createWorkoutLogObjFromFormElements();
    let movementIndex = parseInt(event.target.dataset.movementListItemIndex);
    let state = component.getState();
    let movements = state.movements ? state.movements : [];
    let movementObj = movements[movementIndex];
    let reps = [{ reps: null, load: null, unit: null }];
    let newMovement = { movementObj, reps };
    // workoutlog.movements.splice(0, 0, newMovement);
    workoutlog.movements.push(newMovement);

    component.setState({ workoutlog });
  };

  let isAdmin = function () {
    let state = component.getState();
    return state.user.role === 'admin';
  };

  $hl.eventListener('submit', 'workout-log-form', handleWorkoutLogFormSubmitEvent);
  $hl.eventListener('click', 'unselect-workout', handleUnselectWorkoutEvent);

  document.addEventListener('click', function (event) {
    //Copy reps row of a movement
    let copyMovementRepsRegex = new RegExp(/^copy-wolog-movement-reps-\d+-\d+/g);
    if (copyMovementRepsRegex.test(event.target.id)) {
      copyMovementReps(event);
    }

    //Delete reps row of a movement
    let deleteMovementRepsRegex = new RegExp(/^delete-wolog-movement-reps-\d+-\d+/g);
    if (deleteMovementRepsRegex.test(event.target.id)) {
      deleteMovementReps(event);
    }
    //Delete a movement
    let deleteMovementRegex = new RegExp(/^delete-wolog-movement-\d+/g);
    if (deleteMovementRegex.test(event.target.id)) {
      deleteMovement(event);
    }

    //Select a movement from the auto complete movement list
    let movementAutoListItemRegex = new RegExp(/^movement-list-item-\d+/g);
    if (movementAutoListItemRegex.test(event.target.id)) {
      addMovementFromAutoList(event);
    }
  });

  ($ironfyt.workoutlogFormPage = function () {
    let state = { pageTitle: 'New Log' };
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      state.user = user;
      $ironfyt.getMovements({}, function (error, response) {
        if (error) {
          component.setState({ error });
          return;
        }
        state.movements = response && response.movements ? response.movements : [];

        let params = $hl.getParams();
        let _id = params && params._id ? params._id : false;
        let date = params && params.date ? params.date : false;
        let user_id = params && params.user_id ? params.user_id : false;
        let isAdmin = user.role === 'admin';
        let workout_id = params && params.workout_id ? params.workout_id : false;
        if (isAdmin) {
          $ironfyt.getUsers({}, function (error, response) {
            if (error) {
              component.setState({ error });
              return;
            }
            let users = response && response.users ? response.users : [];
            component.setState({ users });
          });
        }
        if (user_id && user_id !== user._id && !isAdmin) {
          component.setState({ error: { message: 'You cannot edit a workout log for another user!' } });
          return;
        }
        if (_id && _id.length !== 24) {
          component.setState({ error: { message: 'Invalid ID' } });
          return;
        }
        if (_id) {
          $ironfyt.getWorkoutLogs({ _id }, function (error, response) {
            if (error) {
              component.setState({ error });
              return;
            }
            let workoutlog = response.workoutlogs.length && (response.workoutlogs[0].user_id === user._id || user.role === 'admin') ? response.workoutlogs[0] : false;
            if (workoutlog) {
              state.pageTitle = 'Edit Log';
              state.workoutlog = workoutlog;
              component.setState(state);
            } else {
              component.setState({ error: { message: 'Sorry, either no log found or you are not authorized to edit the log' } });
            }
          });
        } else if (date) {
          let workoutlog = newWorkoutLog;
          workoutlog.date = date;
          workoutlog.user_id = user_id && user.role === 'admin' && user_id !== user._id ? user_id : user._id;
          state.workoutlog = workoutlog;
          component.setState(state);
        } else {
          component.setState(state);
        }
        if (workout_id) {
          $ironfyt.getWorkouts({ _id: workout_id }, function (error, response) {
            if (error) {
              component.setState({ error });
              return;
            }
            let workoutlog = component.getState().workoutlog;
            workoutlog.workout = response.workouts;
            component.setState({ workoutlog });
          });
        }
      });
    });
  })();
})();
