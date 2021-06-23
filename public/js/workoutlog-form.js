(function () {
  ('use strict');

  // Default roundinfo object
  let newRoundInfo = {
    rounds: null,
    load: null,
    unit: null,
  };
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
    roundinfo: [newRoundInfo],
    modality: [],
    location: null,
    notes: null,
  };
  let units = ['lbs', 'kgs', 'pood', 'calories', 'miles', 'feet', 'meters', 'minutes'];

  let selectedWorkoutTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    return `
    <div class="flex block-with-border margin-bottom-5px">
      <div class="flex-align-self-center">
        <div class="block-with-border-label">Selected Workout</div>
        <details>
          <summary>${workout.name}</summary>
          <div class="workout-detail-view">
          ${workout.modality && workout.modality.length ? `<p><strong>Modality: </strong>${workout.modality.map((m) => m.toUpperCase()).join(' ')}</p>` : ``}
          ${workout.type ? `<p><strong>Type:</strong> ${workout.type}</p>` : ''}
          ${workout.timecap ? `<p><strong>Time Cap:</strong> ${workout.timecap}</p>` : ''}
          ${workout.rounds ? `<p><strong>Rounds:</strong> ${workout.rounds}</p>` : ''}
          ${workout.reps ? `<p><strong>Reps:</strong> ${workout.reps}</p>` : ''}
          ${workout.description ? `<p>${$hl.replaceNewLineWithBR(workout.description)}</p>` : ''}
          </div>
        </details>
      </div>
      <button type="button" id="unselect-workout" class="remove-btn margin-left-5px"></button> 
    </div>`;
  };

  let workoutListModalTemplate = function (props) {
    let workouts = props.workouts ? props.workouts : [];
    return `
    <div id="select-workout-modal" style="display:none;">
      <div class="container">
        <br/><br/>
        <h3>Select a workout&nbsp;&nbsp;&nbsp;&nbsp;<span id="close-workout-list-modal">X</span></h3>
        <br/>
        ${workouts
          .map(
            (workout) => `
            <div>
              <div id="workout-${workout._id}"><span id="show-detail-${workout._id}"> &gt; </span>${workout.name}</div>
              <div id="workout-detail-${workout._id}" style="display:none">${workout.description}</div>
              <br/>
            </div>`
          )
          .join('')}
      </div>
    </div>`;
  };

  let modalityTemplate = function (workoutlog) {
    return `
      <div class="form-flex-group margin-bottom-5px block-with-border">
        <div class="block-with-border-label">Modality</div>
        <div class="form-flex-group margin-top-5px">
          <label class="switch small">
            <input type="checkbox" id="modality-m" name="wolog-modality" value="m" ${workoutlog.modality && workoutlog.modality.indexOf('m') > -1 ? 'checked' : ''}/>
            <span class="slider small round"></span>
          </label>
          <div>Cardio</div>
          <label class="switch small">
            <input type="checkbox" id="modality-g" name="wolog-modality" value="g" ${workoutlog.modality && workoutlog.modality.indexOf('g') > -1 ? 'checked' : ''} />
            <span class="slider small round"></span>
          </label>
          <div>Body Weight</div>
          <label class="switch small">
            <input type="checkbox" id="modality-w" name="wolog-modality" value="w" ${workoutlog.modality && workoutlog.modality.indexOf('w') > -1 ? 'checked' : ''} />
            <span class="slider small round"></span>
          </label>
          <div>Weights</div>
        </div>
      </div>`;
  };

  let durationTemplate = function (workoutlog) {
    return `
    <div class="form-flex-group margin-bottom-5px block-with-border">
      <div class="block-with-border-label">Duration</div>
      <div class="block-with-border-switch">
        <label class="switch small form-group-label">
          <input type="checkbox" id="duration-switch"/>
          <span class="slider small round"></span>
        </label>
      </div>
      <div class="form-flex-group margin-top-5px">
        <div class="form-input-group show-time-separator">
          <input type="number" class="form-input duration-input" name="wolog-duration-hours" id="wolog-duration-hours" min="0" max="240" value="${workoutlog.duration && workoutlog.duration.hours ? workoutlog.duration.hours : ''}" placeholder="H" disabled />
          <label for="wolog-duration-hours" class="form-label duration-label">H</label>
        </div>
        <div class="form-input-group show-time-separator">
          <input type="number" class="form-input duration-input" name="wolog-duration-minutes" id="wolog-duration-minutes" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.minutes ? workoutlog.duration.minutes : ''}" placeholder="M" disabled />
          <label for="wolog-duration-minutes" class="form-label duration-label">M</label>
        </div>
        <div class="form-input-group">
          <input type="number" class="form-input duration-input" name="wolog-duration-seconds" id="wolog-duration-seconds" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.seconds ? workoutlog.duration.seconds : ''}" placeholder="S" disabled />
          <label for="wolog-duration-seconds" class="form-label duration-label">S</label>
        </div>
      </div>
    </div>
    `;
  };

  let roundsTemplate = function (workoutlog) {
    return `
    <div class="form-flex-group margin-bottom-5px block-with-border">
        <div class="block-with-border-label">Rounds & Load/Distance/Cal</div>
        <div class="block-with-border-switch">
          <label class="switch small form-group-label">
            <input type="checkbox" id="rounds-switch"/>
            <span class="slider small round"></span>
          </label>
        </div>
        <div class="margin-top-10px">
         ${
           workoutlog.roundinfo
             ? workoutlog.roundinfo
                 .map(function (item, index) {
                   return `
                  <div class="form-flex-group margin-bottom-5px">
                    <div class="form-input-group">
                      <input type="number" class="form-input rounds-input" name="wolog-rounds-${index}" id="wolog-rounds-${index}" value="${item.rounds ? item.rounds : ''}" placeholder="Rounds" disabled>    
                      <label for="wolog-rounds-${index}" class="form-label rounds-label">Rounds</label>
                    </div>      
                    <div class="form-input-group">  
                      <input type="number" class="form-input rounds-input" name="wolog-load-${index}" id="wolog-load-${index}" value="${item.load ? item.load : ''}" placeholder="Load" disabled>
                      <label for="wolog-load-${index}" class="form-label rounds-label">Load</label>
                    </div>
                    <div class="form-input-group">
                      <label for="wolog-unit-${index}" class="form-label hide-view">Unit</label>
                      <select class="form-input" name="wolog-unit-${index}" id="wolog-unit-${index}" disabled>
                        <option value=""></option>
                        ${units.map((unit) => `<option value="${unit}" ${item.unit && item.unit.toLowerCase() === unit.toLowerCase() ? 'selected' : ''}>${unit}</option>`)}
                      </select>
                    </div>
                    <button type="button" class="copy-btn" id="copy-round-info-${index}"></button>
                    ${index > 0 ? `<button type="button" class="remove-btn" id="delete-round-info-${index}"></button>` : ``}
                    <div>
                    </div>
                  </div>
                  `;
                 })
                 .join('')
             : ''
         }
        </div>
      </div>
    `;
  };
  let workoutlogFormTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let wologdate = workoutlog && workoutlog.date ? $hl.formatDateForInputField(workoutlog.date) : '';
    let validationError = props.validationError ? props.validationError : {};
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    return `
    <form id="workout-log-form" class="form-container" autocomplete="off">
      <div class="form-flex-group margin-bottom-5px">
        <div class="form-input-group flex-width-100">
          <input type="date" name="wolog-date" id="wolog-date" value="${wologdate}" placeholder="Date" class="form-input"/>
          <label for="wolog-date" class="form-label date-label">Date</label>
        </div>
        ${validationError.date ? `<div id="error-wolog-date">${validationError.date}</div>` : ``}
      </div>
      ${workout ? selectedWorkoutTemplate(props) : `<div class="margin-bottom-5px"><button type="button" id="select-workout-btn-wolog">Select or Create a Workout</button></div>`}
      <input type="hidden" id="wolog-workout-id" value="${workout ? workout._id : ''}">
      ${modalityTemplate(workoutlog)}
      ${durationTemplate(workoutlog)}
      ${roundsTemplate(workoutlog)}
      <div class="form-flex-group margin-bottom-5px">
        <div class="form-input-group">
          <input type="text" class="form-input" name="wolog-location" id="wolog-location" value="${workoutlog.location ? workoutlog.location : ''}" placeholder="Location" disabled />
          <label for="wolog-location" class="form-label">Location</label>
        </div>
        <label class="switch small form-group-label margin-left-5px">
          <input type="checkbox" id="location-switch"/>
          <span class="slider small round"></span>
        </label>
      </div>
      <div class="form-flex-group margin-bottom-5px">
        <div class="form-input-group">
          <textarea class="form-input" name="wolog-notes" id="wolog-notes" placeholder="Notes" disabled>${workoutlog.notes ? workoutlog.notes : ''}</textarea>
          <label for="wolog-notes" class="form-label">Notes</label>
        </div>
        <label class="switch small form-group-label margin-left-5px">
          <input type="checkbox" id="notes-switch"/>
          <span class="slider small round"></span>
        </label>
      </div>
      <div>
        ${validationError.catchAll ? `<div id="error-catch-all">${validationError.catchAll}` : ''}
      </div>
      <div>
        <button type="submit" id="submit-wolog">Save</button>
        <button type="button" id="cancel-submit-wolog" onclick="window.history.back()">Cancel</button>
      </div>
    </form>
    ${workoutListModalTemplate(props)}
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
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogFormTemplate);
    },
    afterRender: function (props) {
      setDurationSwitch(props);
      setRoundsSwitch(props);
      setLocationSwitch(props);
      setNotesSwitch(props)
    },
  }));

  /**
   * After render, check if duration switch needs to be turned on.
   * I decided against directly storing the duration switch state because it is a derived state. I did not want to have to render the whole form and save the partial state
   * every time a user turns on or off the duration switch.
   * In the curren approach I check if duration information is present in the state and accordingly I set the duration switch on or off.
   * Duration switch also calls toggleDurationFields() to enable/disable the fields.
   * @param {*} props
   */
  let setDurationSwitch = function (props) {
    let durationSwitch = document.getElementById('duration-switch');
    let duration = props.workoutlog && props.workoutlog.duration ? props.workoutlog.duration : {};
    if (JSON.stringify(duration) !== '{}') {
      let hours = duration.hours !== null && parseInt(duration.hours) !== 0;
      let minutes = duration.minutes !== null && parseInt(duration.minutes) !== 0;
      let seconds = duration.seconds !== null && parseInt(duration.seconds) !== 0;
      if (hours || minutes || seconds) {
        durationSwitch.checked = true;
      }
    } else {
      durationSwitch.checked = false;
    }
    toggleDurationFields();
  };

  /**
   * After render, check if rounds switch needs to be turned on.
   * Rounds switch also calls toggleRoundsFields() to enable/disable the fields.
   * @param {*} props
   */
  let setRoundsSwitch = function (props) {
    let roundsSwitch = document.getElementById('rounds-switch');
    let roundinfo = props.workoutlog && props.workoutlog.roundinfo ? props.workoutlog.roundinfo : [];
    let switchOnCount = 0;
    if (roundinfo.length > 0) {
      for (let i = 0; i < roundinfo.length; i++) {
        let rounds = roundinfo[i].rounds !== null && parseInt(roundinfo[i].rounds) !== 0 && !isNaN(roundinfo[i].rounds);
        let load = roundinfo[i].load !== null && parseInt(roundinfo[i].load) !== 0 && !isNaN(roundinfo[i].load);
        if (rounds || load) {
          switchOnCount++;
        }
      }
      roundsSwitch.checked = switchOnCount > 0;
    } else {
      roundsSwitch.checked = false;
    }
    toggleRoundsFields();
  };
  /**
   * After render, check if location switch needs to be turned on.
   * Location switch also calls toggleLocationField() to enable/disable the field
   * @param {*} props
   */
  let setLocationSwitch = function (props) {
    let locationSwitch = document.getElementById('location-switch');
    let location = props.workoutlog && props.workoutlog.location ? props.workoutlog.location : '';
    if (location) {
      locationSwitch.checked = true;
    } else {
      locationSwitch.checked = false;
    }
    toggleLocationField();
  };

  /**
   * After render, check if notes switch needs to be turned on.
   * notes switch also calls toggleNotesTextarea() to enable/disable the field
   * @param {*} props
   */
  let setNotesSwitch = function (props) {
    let notesSwitch = document.getElementById('notes-switch');
    let notes = props.workoutlog && props.workoutlog.notes ? props.workoutlog.notes : '';
    if (notes) {
      notesSwitch.checked = true;
    } else {
      notesSwitch.checked = false;
    }
    toggleNotesTextarea();
  };
  

  /**
   * Enables/disabled the hours, minutes, seconds fields based on the state of duration switch.
   * Wipes out the values from the fields when the fields are disabled.
   * Re-populates the duration values if present in the state
   */
  let toggleDurationFields = function () {
    let durationSwitch = document.querySelector('#duration-switch');
    let hourInput = document.querySelector('#wolog-duration-hours');
    let minuteInput = document.querySelector('#wolog-duration-minutes');
    let secondInput = document.querySelector('#wolog-duration-seconds');
    if (durationSwitch.checked) {
      enableField(hourInput);
      enableField(minuteInput);
      enableField(secondInput);
      let state = component.getState();
      let duration = state.workoutlog && state.workoutlog.duration ? state.workoutlog.duration : {};
      hourInput.value = parseInt(duration.hours) !== 0 ? duration.hours : '';
      minuteInput.value = parseInt(duration.minutes) !== 0 ? duration.minutes : '';
      secondInput.value = parseInt(duration.seconds) !== 0 ? duration.seconds : '';
    } else {
      disableField(hourInput);
      disableField(minuteInput);
      disableField(secondInput);
    }
  };

  /**
   * Enable/disable rounds, load, unit fields based on the state of rounds switch.
   * Wipe out the values from the fields when the fields are disabled.
   * Re-populate the values on enable if the values are present in the state
   */
  let toggleRoundsFields = function () {
    let roundsSwitch = document.querySelector('#rounds-switch');
    let state = component.getState();
    let roundinfo = state.workoutlog && state.workoutlog.roundinfo ? state.workoutlog.roundinfo : [];
    for (let i = 0; i < roundinfo.length; i++) {
      let roundsInputField = document.querySelector(`#wolog-rounds-${i}`);
      let loadInputField = document.querySelector(`#wolog-load-${i}`);
      let unitSelect = document.querySelector(`#wolog-unit-${i}`);
      if (roundsSwitch.checked) {
        enableField(roundsInputField);
        enableField(loadInputField);
        enableField(unitSelect);
        roundsInputField.value = roundinfo[i].rounds !== null ? roundinfo[i].rounds : '';
        loadInputField.value = roundinfo[i].load !== null ? roundinfo[i].load : '';
        unitSelect.value = roundinfo[i].unit !== null ? roundinfo[i].unit : '';
      } else {
        disableField(roundsInputField);
        disableField(loadInputField);
        disableField(unitSelect);
      }
    }
  };

  /**
   * Enable/disable location field based on the state of location switch.
   * Wipe out the value from the field when the field is disabled.
   * Re-populate the value on enable if the value is present in the state
   */
  let toggleLocationField = function () {
    let locationSwitch = document.getElementById('location-switch');
    let locationField = document.getElementById('wolog-location');
    let state = component.getState();
    let location = state.workoutlog && state.workoutlog.location ? state.workoutlog.location : '';
    if (locationSwitch.checked) {
      enableField(locationField);
      locationField.value = location;
    } else {
      disableField(locationField);
    }
  };

  /**
   * Enable/disable location field based on the state of location switch.
   * Wipe out the value from the field when the field is disabled.
   * Re-populate the value on enable if the value is present in the state
   */
  let toggleNotesTextarea = function () {
    let notesSwitch = document.getElementById('notes-switch');
    let notesField = document.getElementById('wolog-notes');
    let state = component.getState();
    let notes = state.workoutlog && state.workoutlog.notes ? state.workoutlog.notes : '';
    if (notesSwitch.checked) {
      enableField(notesField);
      notesField.value = notes;
    } else {
      disableField(notesField);
    }
  };

  /**
   * Helper function to disable a field and set the value to empty string
   * @param {*} name - field name
   */
  function disableField(name) {
    name['disabled'] = true;
    name['value'] = '';
  }

  /**
   * Helper function to enable a field
   * @param {*} name - field name
   */
  function enableField(name) {
    name['disabled'] = false;
  }

  let createWorkoutLogObjFromFormElements = function () {
    let elements = document.querySelector('#workout-log-form').elements;
    let state = component.getState();
    let workoutlog = state.workoutlog ? state.workoutlog : newWorkoutLog;

    let date = $hl.getDateObjFromHTMLDateInput(elements['wolog-date'].value);
    workoutlog.date = date instanceof Date && !isNaN(date) ? date : '';
    workoutlog.notes = elements['wolog-notes'].value.trim();
    workoutlog.user_id = workoutlog.user_id ? workoutlog.user_id : state.user._id;

    workoutlog.modality = [];
    for (var i = 0; i < elements['wolog-modality'].length; i++) {
      if (elements['wolog-modality'][i].checked) workoutlog.modality.push(elements['wolog-modality'][i].value);
    }

    workoutlog.location = elements['wolog-location'].value.trim();
    workoutlog.workout_id = elements['wolog-workout-id'].value.trim();

    workoutlog.duration = {
      hours: elements['wolog-duration-hours'].value ? parseInt(elements['wolog-duration-hours'].value) : 0,
      minutes: elements['wolog-duration-minutes'].value ? parseInt(elements['wolog-duration-minutes'].value) : 0,
      seconds: elements['wolog-duration-seconds'].value ? parseInt(elements['wolog-duration-seconds'].value) : 0,
    };

    let roundinfo = [];
    let workoutLogRoundInfoLength = workoutlog && workoutlog.roundinfo ? workoutlog.roundinfo.length : 0;
    for (var i = 0; i < workoutLogRoundInfoLength; i++) {
      let rounds = parseInt(elements[`wolog-rounds-${i}`].value);
      let load = parseInt(elements[`wolog-load-${i}`].value);
      let unit = elements[`wolog-unit-${i}`].value;
      roundinfo.push({ rounds, load, unit });
    }
    workoutlog.roundinfo = roundinfo;

    return workoutlog;
  };

  let validateFormInput = function () {
    let elements = document.querySelector('#workout-log-form').elements;
    let validationError = {};
    if (elements['wolog-date'].value === '') {
      validationError.date = 'Please enter a date for the log';
    }
    if (
      (elements['wolog-duration-hours'].value === '' || parseInt(elements['wolog-duration-hours'].value) === 0) &&
      (elements['wolog-duration-minutes'].value === '' || parseInt(elements['wolog-duration-minutes'].value) === 0) &&
      (elements['wolog-duration-seconds'].value === '' || parseInt(elements['wolog-duration-seconds'].value) === 0) &&
      (elements['wolog-load-0'].value === '' || parseInt(elements['wolog-load-0'].value) === 0) &&
      (elements['wolog-rounds-0'].value === '' || parseInt(elements['wolog-rounds-0'].value) === 0) &&
      elements['wolog-notes'].value.trim() === ''
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
      let params = $hl.getParams();
      let ref = params && params.ref ? params.ref : 'workoutlogs.html';
      let user_id = params && params.user_id ? `&user_id=${params.user_id}` : false;
      let date = ref === 'workoutlog-calendar.html' ? `&year=${new Date(workoutlog.date).getFullYear()}&month=${new Date(workoutlog.date).getMonth()}&date=${new Date(workoutlog.date).getDate()}` : false;
      $ironfyt.saveWorkoutLog(workoutlog, function (error, response) {
        if (error) {
          console.error(error);
        } else {
          $ironfyt.navigateToUrl(`${ref}?ref=workoutlog-form.html${user_id ? user_id : ''}${date ? date : ''}`);
        }
      });
    } else {
      component.setState({ workoutlog, validationError });
    }
  };

  let handleSelectWorkoutEvent = function (event) {
    let selectWorkoutBtn = document.getElementById('select-workout-btn-wolog');
    selectWorkoutBtn.disabled = true;
    // Get the current state of the form to save the intermediate state
    let workoutlog = createWorkoutLogObjFromFormElements();
    $ironfyt.getWorkouts({}, function (error, response) {
      if (!error) {
        let workouts = response && response.workouts ? response.workouts : [];
        component.setState({ workouts });

        let selectWorkoutBtn = document.getElementById('select-workout-btn-wolog');
        selectWorkoutBtn.disabled = true;

        let dialog = document.getElementById('select-workout-modal');
        dialog.style.display = 'block';
      } else {
        component.setState({ error, workoutlog });
      }
    });
  };

  let handleCloseWorkoutListModalEvent = function (event) {
    let dialog = document.getElementById('select-workout-modal');
    dialog.style.display = 'none';

    let selectWorkoutBtn = document.getElementById('select-workout-btn-wolog');
    selectWorkoutBtn.disabled = false;
  };

  let selectWorkout = function (targetId) {
    let _id = targetId.substring(8, targetId.length);
    let state = component.getState();
    let workouts = state.workouts ? state.workouts : [];
    let workout = workouts.filter((workout) => workout._id === _id)[0];

    let workoutlog = createWorkoutLogObjFromFormElements();
    workoutlog.workout = [workout];
    component.setState({ workoutlog });

    let dialog = document.getElementById('select-workout-modal');
    dialog.style.display = 'none';
  };

  let showWorkoutDetail = function (targetId) {
    let _id = targetId.substring(12, targetId.length);
    let workoutShowDetailSpan = document.getElementById(`show-detail-${_id}`);
    let workoutDetailDiv = document.getElementById(`workout-detail-${_id}`);
    if (workoutDetailDiv.style.display === 'none') {
      workoutDetailDiv.style.display = 'block';
      workoutShowDetailSpan.innerHTML = '^ ';
    } else {
      workoutDetailDiv.style.display = 'none';
      workoutShowDetailSpan.innerHTML = '> ';
    }
  };

  let handleUnselectWorkoutEvent = function (event) {
    let workoutlog = createWorkoutLogObjFromFormElements();
    workoutlog.workout = [];
    component.setState({ workoutlog });
  };

  let deleteRoundInfo = function (targetId) {
    let prefix = 'delete-round-info-';
    let index = parseInt(targetId.substring(prefix.length, targetId.length));
    let workoutlog = createWorkoutLogObjFromFormElements();
    let roundinfo = workoutlog.roundinfo;
    roundinfo.splice(index, 1);
    component.setState({ workoutlog });
  };

  let copyRoundInfo = function (targetId) {
    let prefix = 'copy-round-info-';
    let index = parseInt(targetId.substring(prefix.length, targetId.length));
    let roundsInputField = document.getElementById(`wolog-rounds-${index}`);
    let loadInputField = document.getElementById(`wolog-load-${index}`);
    let unitSelect = document.getElementById(`wolog-unit-${index}`);
    let newRound = newRoundInfo;
    newRound.rounds = roundsInputField.value ? parseInt(roundsInputField.value) : null;
    newRound.load = loadInputField.value ? parseInt(loadInputField.value) : null;
    newRound.unit = unitSelect.value ? unitSelect.value : '';

    let workoutlog = createWorkoutLogObjFromFormElements();
    workoutlog.roundinfo.push(newRound);
    component.setState({ workoutlog });
  };

  $hl.eventListener('submit', 'workout-log-form', handleWorkoutLogFormSubmitEvent);
  $hl.eventListener('click', 'select-workout-btn-wolog', handleSelectWorkoutEvent);
  $hl.eventListener('click', 'close-workout-list-modal', handleCloseWorkoutListModalEvent);
  $hl.eventListener('click', 'unselect-workout', handleUnselectWorkoutEvent);
  $hl.eventListener('click', 'duration-switch', toggleDurationFields);
  $hl.eventListener('click', 'rounds-switch', toggleRoundsFields);
  $hl.eventListener('click', 'location-switch', toggleLocationField);
  $hl.eventListener('click', 'notes-switch', toggleNotesTextarea);
  document.addEventListener('click', function (event) {
    //Select a workout from the list
    let selectWorkoutRegex = new RegExp(/^workout-([a-zA-Z]|\d){24}/gm);
    if (selectWorkoutRegex.test(event.target.id)) {
      selectWorkout(event.target.id);
    }
    // Show workout detail for each workout in the list - can be achieve with detail/summary - refactor
    let showWorkoutDetailRegex = new RegExp(/^show-detail-([a-zA-Z]|\d){24}/gm);
    if (showWorkoutDetailRegex.test(event.target.id)) {
      showWorkoutDetail(event.target.id);
    }

    let deleteRoundInfoRegex = new RegExp(/^delete-round-info-\d+/gm);
    if (deleteRoundInfoRegex.test(event.target.id)) {
      deleteRoundInfo(event.target.id);
    }

    let copyRoundInfoRegex = new RegExp(/^copy-round-info-\d+/gm);
    if (copyRoundInfoRegex.test(event.target.id)) {
      copyRoundInfo(event.target.id);
    }
  });

  ($ironfyt.workoutlogFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      let user = auth && auth.user ? auth.user : {};
      if (!error) {
        let params = $hl.getParams();
        let _id = params && params._id ? params._id : false;
        let date = params && params.date ? params.date : false;
        let user_id = params && params.user_id ? params.user_id : false;

        if (_id && _id.length !== 24) {
          component.setState({ error: { message: 'Invalid ID' } });
        } else if (_id && _id.length === 24) {
          $ironfyt.getWorkoutLogs({ _id }, function (error, response) {
            if (!error) {
              let workoutlog = response.workoutlogs.length ? response.workoutlogs[0] : newWorkoutLog;
              component.setState({ workoutlog, user, pageTitle: 'Edit Log' });
            } else {
              component.setState({ error });
            }
          });
        } else if (date) {
          let workoutlog = newWorkoutLog;
          workoutlog.date = date;
          if (user_id && user.role === 'admin' && user_id !== user._id) {
            workoutlog.user_id = user_id;
          } else if (user_id && user.role !== 'admin' && user_id !== user._id) {
            component.setState({ error: { message: 'You cannot edit a workout log for another user!' } });
            return;
          } else {
            workoutlog.user_id = user._id;
          }
          component.setState({ workoutlog, user, pageTitle: 'New Log' });
        } else {
          component.setState({ user, pageTitle: 'New Log' });
        }
      } else {
        component.setState({ error });
      }
    });
  })();
})();
