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
    totalreps: null,
    roundinfo: [newRoundInfo],
    modality: [],
    location: null,
    notes: null,
    movements: [],
  };
  let units = ['lbs', 'kgs', 'pood', 'calories', 'miles', 'feet', 'meters', 'minutes'];

  let selectedWorkoutTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;

    return `
    <div class="flex block-with-border margin-bottom-5px">
      <div class="flex-align-self-center">
        <div class="block-with-border-label">Selected Workout</div>
        ${$ironfyt.displayWorkoutDetail(workout)}
      </div>
      <button type="button" id="unselect-workout" class="remove-btn margin-left-5px"></button> 
    </div>`;
  };

  let newWorkoutButton = function () {
    return `<button id="create-new-workout-btn">New Workout</button>`;
  };

  let workoutListModalTemplate = function (props) {
    return `
    <div class="modal-container" id="select-workout-modal">
      <div class="modal-dialog select-workout-modal">
        <button id="close-workout-list-modal-btn">X</button>
        <div class="form-input-group margin-top-20px margin-bottom-15px">
          <span id="search-workout-modal-icon"></span>
          <input type="text" class="form-input" name="search-workout" id="search-workout" value="" placeholder="Search Workout..."/>
          <label for="search-workout" class="form-label">Search Workout...</label>
        </div>
        <div id="autocomplete-workout-list" class="autocomplete-workout-list">${newWorkoutButton()}</div>
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
    <div class="form-flex-group block-with-border duration-block">
      <div class="block-with-border-label">Duration</div>
      <div class="block-with-border-switch">
        <label class="switch small form-group-label">
          <input type="checkbox" id="duration-switch"/>
          <span class="slider small round"></span>
        </label>
      </div>
      <div class="form-flex-group margin-top-10px">
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

  let movementsTemplate = function (workoutlog) {
    let movements = workoutlog && workoutlog.movements ? workoutlog.movements : [];
    return `
    <div class="form-flex-group margin-bottom-5px block-with-border">
      <div class="block-with-border-label">Movement x Reps x Load/Distance/...</div>
      <div class="block-with-border-switch">
        <label class="switch small form-group-label">
          <input type="checkbox" id="movement-switch"/>
          <span class="slider small round"></span>
        </label>
      </div>
      <div class="margin-top-5px">
        <div class="form-input-group margin-bottom-5px">
          <div class="add-movement-input-group">
            <input class="form-input" name="wolog-add-movement" id="wolog-add-movement" placeholder="Add a movement..." disabled />
            <label for="wolog-add-movement" class="form-label" id="wolog-add-movement-input-label">Add a movement...</label>
            <button type="button" id="wolog-movement-add-btn" class="wolog-movement-add-btn">Add</button>
          </div>
          <input type="hidden" id="selected-movement-index" value="">
          <div id="autocomplete-movement-list" class="autocomplete-movement-list"></div>
        </div>
        ${movements
          .map(function (item, index) {
            return `
            <div class="form-flex-group margin-bottom-5px">
              <div class="wolog-movement-name" id="wolog-movement-data-${index}" data-id=${item._id ? item._id : ''}>${item.movement}</div>
              <div class="form-input-group">
                <input type="number" class="form-input wolog-movement-attr" name="wolog-movement-reps-${index}" id="wolog-movement-reps-${index}" value="${item.reps ? item.reps : ''}" placeholder="Reps">    
                <label for="wolog-movement-reps-${index}" class="form-label rounds-label">Reps</label>
              </div>      
              <div class="form-input-group">  
                <input type="number" class="form-input wolog-movement-attr" name="wolog-movement-load-${index}" id="wolog-movement-load-${index}" value="${item.load ? item.load : ''}" placeholder="Load">
                <label for="wolog-movement-load-${index}" class="form-label rounds-label">Load</label>
              </div>
              <div class="form-input-group">
                <label for="wolog-movement-unit-${index}" class="form-label hide-view">Unit</label>
                <select class="form-input" name="wolog-movement-unit-${index}" id="wolog-movement-unit-${index}">
                  <option value=""></option>
                  ${units.map((unit) => `<option value="${unit}" ${item.unit && item.unit.toLowerCase() === unit.toLowerCase() ? 'selected' : ''}>${unit}</option>`)}
                </select>
              </div>
              <button type="button" class="copy-btn" id="copy-movement-${index}"></button>
              <button type="button" class="remove-btn" id="delete-movement-${index}"></button>
              <div>
              </div>
            </div>
            `;
          })
          .join('')}
      </div>      
    </div>
    `;
  };

  let notesTemplate = function (workoutlog) {
    return `
    <div class="form-flex-group margin-bottom-5px">
      <div class="form-input-group">
        <textarea class="form-input" name="wolog-notes" id="wolog-notes" placeholder="Notes" disabled>
          ${workoutlog.notes ? workoutlog.notes : ''}
        </textarea>
        <label for="wolog-notes" class="form-label">
          Notes
        </label>
      </div>
      <label class="switch small form-group-label margin-left-5px">
        <input type="checkbox" id="notes-switch" />
        <span class="slider small round"></span>
      </label>
    </div>`;
  };

  let locationTemplate = function (workoutlog) {
    return `
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
    `;
  };
  let totalRepsTemplate = function (workoutlog) {
    return `
    <div class="form-flex-group block-with-border total-reps-block">
      <div class="block-with-border-label">Total Reps</div>
      <div class="block-with-border-switch">
        <label class="switch small form-group-label">
          <input type="checkbox" id="total-reps-switch"/>
          <span class="slider small round"></span>
        </label>
      </div>
      <div class="form-flex-group margin-top-10px">
        <div class="form-input-group">
          <input type="number" class="form-input rounds-input" name="wolog-total-reps" id="wolog-total-reps" value="${workoutlog.totalreps ? workoutlog.totalreps : ''}" placeholder="Reps" disabled>    
          <label for="wolog-total-reps" class="form-label rounds-label">Reps</label>
        </div>      
      </div>
    </div>
    `;
  };
  let dateTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let wologdate = workoutlog && workoutlog.date ? $hl.formatDateForInputField(workoutlog.date) : '';
    let validationError = props.validationError ? props.validationError : {};
    return `
      <div class="form-flex-group margin-bottom-5px">
        <div class="form-input-group flex-width-100">
          <input type="date" name="wolog-date" id="wolog-date" value="${wologdate}" placeholder="Date" class="form-input"/>
          <label for="wolog-date" class="form-label date-label">Date</label>
        </div>
        ${validationError.date ? `<div id="error-wolog-date">${validationError.date}</div>` : ``}
      </div>
    `;
  };
  let workoutlogFormTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let validationError = props.validationError ? props.validationError : {};
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    return `
    <form id="workout-log-form" class="form-container" autocomplete="off">
      ${dateTemplate(props)}  
      ${workout ? selectedWorkoutTemplate(props) : `<div class="margin-bottom-5px"><button type="button" id="select-workout-btn-wolog">Select or Create a Workout</button></div>`}
      <input type="hidden" id="wolog-workout-id" value="${workout ? workout._id : ''}">
      <div class="form-flex-group margin-bottom-5px">
        ${durationTemplate(workoutlog)}
        ${totalRepsTemplate(workoutlog)}
      </div>
      ${roundsTemplate(workoutlog)}
      ${movementsTemplate(workoutlog)}
      ${notesTemplate(workoutlog)}
      ${modalityTemplate(workoutlog)}
      ${locationTemplate(workoutlog)}
      ${validationError.catchAll ? `<div id="error-catch-all" class="error">${validationError.catchAll}</div>` : ''}
      <div class="submit-btn-bar margin-top-5px">
        <button type="submit" id="submit-wolog" class="submit-btn">Save</button>
      </div>
    </form>
    ${workoutListModalTemplate(props)}
    ${newWorkoutFormModalTemplate(props)}
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
        setDurationSwitch(props);
        setRoundsSwitch(props);
        setLocationSwitch(props);
        setNotesSwitch(props);
        setMovementSwitch(props);
        setTotalRepsSwitch(props);
        autocomplete(document.getElementById('wolog-add-movement'), props.movements ? props.movements : []);
      }
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
   * After render, check if movements switch needs to be turned on.
   * movements switch also calls toggleMovementFields() to enable/disable the field
   * @param {*} props
   */
  let setMovementSwitch = function (props) {
    let movementSwitch = document.getElementById('movement-switch');
    let movements = props.workoutlog && props.workoutlog.movements ? props.workoutlog.movements : [];
    if (movements.length) {
      movementSwitch.checked = true;
    } else {
      movementSwitch.checked = false;
    }
    toggleMovementFields();
  };

  /**
   * After render, check if totalReps switch needs to be turned on.
   * totalReps switch also calls toggleTotalRepsField() to enable/disable the field
   * @param {*} props
   */
  let setTotalRepsSwitch = function (props) {
    let totalRepsSwitch = document.getElementById('total-reps-switch');
    let totalReps = props.workoutlog && props.workoutlog.totalreps ? props.workoutlog.totalreps : '';
    if (totalReps) {
      totalRepsSwitch.checked = true;
    } else {
      totalRepsSwitch.checked = false;
    }
    toggleTotalRepsField();
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
   * Enable/disable movement, reps, load, unit fields based on the state of movement switch.
   * Wipe out the values from the fields when the fields are disabled.
   * Re-populate the values on enable if the values are present in the state
   */
  let toggleMovementFields = function () {
    let movementSwitch = document.querySelector('#movement-switch');
    let movementAddButton = document.querySelector('#wolog-movement-add-btn');
    let addMovementTextField = document.getElementById('wolog-add-movement');
    if (movementSwitch.checked) {
      enableField(addMovementTextField);
      movementAddButton.style.display = 'block';
    } else {
      disableField(addMovementTextField);
      movementAddButton.style.display = 'none';
    }
  };

  /**
   * Enable/disable totalreps field based on the state of totalreps switch.
   * Wipe out the value from the field when the field is disabled.
   * Re-populate the value on enable if the value is present in the state
   */
  let toggleTotalRepsField = function () {
    let totalRepsSwitch = document.getElementById('total-reps-switch');
    let totalRepsFeild = document.getElementById('wolog-total-reps');
    let state = component.getState();
    let totalReps = state.workoutlog && state.workoutlog.totalreps ? state.workoutlog.totalreps : '';
    if (totalRepsSwitch.checked) {
      enableField(totalRepsFeild);
      totalRepsFeild.value = totalReps;
    } else {
      disableField(totalRepsFeild);
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

  /**
   * Adds a movement to the list of movements and shows the relevent fields to enter movement data
   * @param {*} event
   */
  let addMovement = function (event) {
    event.preventDefault();
    let addMovementField = document.getElementById('wolog-add-movement');
    let selectedMovementIndexField = document.getElementById('selected-movement-index');
    let state = component.getState();
    let movements = state.movements ? state.movements : [];
    if (addMovementField.value.trim()) {
      let index = selectedMovementIndexField.value ? parseInt(selectedMovementIndexField.value) : -1;
      let selectedMovement = movements[index] && movements[index].movement.trim().toLowerCase() === addMovementField.value.trim().toLowerCase() ? movements[index] : { movement: addMovementField.value.trim() };
      let workoutlog = createWorkoutLogObjFromFormElements();
      workoutlog.movements.push(selectedMovement);
      component.setState({ workoutlog });
      addMovementField.value = '';
    }
  };
  /**
   * takes two arguments, the input field and the list of items to be used for auto complete
   * Got the inspiration for the code from https://www.w3schools.com/howto/howto_js_autocomplete.asp
   * */

  let autocomplete = function (textField, list) {
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
          autocompleteList += `<div id="movement-list-item-${i}">${list[i].movement.replace(stringToHighlight, `<strong>${stringToHighlight}</strong>`)}</div>`;
          // }
        }
      }
      autocompleteDiv.innerHTML = autocompleteList;
    });
  };

  let autoCompleteWorkoutSearch = function () {
    let autocomleteDiv = document.getElementById('autocomplete-workout-list');
    let textField = document.getElementById('search-workout');
    let list = component.getState().workouts;
    textField.addEventListener('input', function (event) {
      let textFieldValue = this.value;
      if (!textFieldValue) {
        autocomleteDiv.innerHTML = newWorkoutButton();
        return false;
      }
      let autocompleteList = '';
      let count = 0;
      for (let i = 0; i < list.length; i++) {
        let subStringIndexName = list[i].name.toLowerCase().indexOf(textFieldValue.toLowerCase());
        let subStringIndexDescription = list[i].description.toLowerCase().indexOf(textFieldValue.toLowerCase());
        if (subStringIndexName > -1 || subStringIndexDescription > -1) {
          let stringNameToHighlight = subStringIndexName > -1 ? list[i].name.substr(subStringIndexName, textFieldValue.length) : '';
          let stringDescToHighlight = subStringIndexDescription > -1 ? list[i].description.substr(subStringIndexDescription, textFieldValue.length) : '';
          count++;
          let workout = list[i];
          let timecap = $ironfyt.formatTimecap(workout.timecap);
          autocompleteList += `
          <div id="workout-list-item-${i}" class="workout-search-result-item margin-bottom-5px">
            <button type="button" id="select-workout-from-search-result-btn-${i}" class="select-workout-from-search-result-btn"></button>
            <div>${workout.name.replace(stringNameToHighlight, `<strong>${stringNameToHighlight}</strong>`)}</div>
            <div>
            ${workout.modality && workout.modality.length ? `<p>Modality: ${workout.modality.map((m) => $ironfyt.formatModality(m)).join(', ')}</p>` : ``}
            ${workout.type ? `<p>Type: ${workout.type}</p>` : ''}
            ${timecap ? `<p>Time Cap: ${timecap}</p>` : ''}
            ${workout.rounds ? `<p>Rounds: ${workout.rounds}</p>` : ''}
            ${workout.reps ? `<p>Reps: ${workout.reps}</p>` : ''}
            ${workout.description ? `<p>${$hl.replaceNewLineWithBR(workout.description.replace(stringDescToHighlight, `<strong>${stringDescToHighlight}</strong>`))}</p>` : ''}
            </div>
          </div>`;
        }
      }
      let countString = `<div class="margin-bottom-5px small-text">Found ${count} Workouts</div>`;
      autocomleteDiv.innerHTML = `<div>${countString}${count === 0 ? newWorkoutButton() : ''}${autocompleteList}</div>`;
    });
  };
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

    let movements = [];
    let movementlength = workoutlog && workoutlog.movements ? workoutlog.movements.length : 0;
    for (var i = 0; i < movementlength; i++) {
      let movementDiv = document.querySelector(`#wolog-movement-data-${i}`);
      let movementObj = {};
      if (movementDiv && movementDiv.dataset.id) {
        movementObj._id = movementDiv.dataset.id;
      }
      movementObj.movement = movementDiv ? movementDiv.innerHTML.trim() : '';
      movementObj.reps = elements[`wolog-movement-reps-${i}`] && elements[`wolog-movement-reps-${i}`].value ? parseInt(elements[`wolog-movement-reps-${i}`].value) : null;
      movementObj.load = elements[`wolog-movement-load-${i}`] && elements[`wolog-movement-load-${i}`].value ? parseInt(elements[`wolog-movement-load-${i}`].value) : null;
      movementObj.unit = elements[`wolog-movement-unit-${i}`] && elements[`wolog-movement-unit-${i}`].value ? elements[`wolog-movement-unit-${i}`].value : null;
      movements.push(movementObj);
    }
    workoutlog.movements = movements;

    workoutlog.totalreps = elements[`wolog-total-reps`].value ? parseInt(elements[`wolog-total-reps`].value) : null;
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
      (elements['wolog-load-0'].value === '' || parseInt(elements['wolog-load-0'].value) === 0) &&
      (elements['wolog-rounds-0'].value === '' || parseInt(elements['wolog-rounds-0'].value) === 0) &&
      elements['wolog-notes'].value.trim() === '' &&
      empty_movement_load &&
      empty_movement_reps &&
      (elements['wolog-total-reps'].value === '' || parseInt(elements['wolog-total-reps'].value) === 0)
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
      let ref = params && params.ref ? params.ref : 'workoutlogs.html';
      let user_id = params && params.user_id ? `&user_id=${params.user_id}` : false;
      let date = ref === 'workoutlog-calendar.html' ? `&year=${new Date(workoutlog.date).getFullYear()}&month=${new Date(workoutlog.date).getMonth()}&date=${new Date(workoutlog.date).getDate()}` : false;
      let workoutIdRef = ref === 'workout-activity.html' ? `&workout_id=${workoutlog.workout_id}` : false;
      $ironfyt.saveWorkoutLog(workoutlog, function (error, response) {
        if (error) {
          console.error(error);
          component.setState({ error });
        } else {
          let workoutlog = response && response.workoutlog ? response.workoutlog : null;
          $ironfyt.updatePersonalRecord(workoutlog, function (error, response) {
            if (error) {
              component.setState({ error });
              return;
            } else {
              $ironfyt.navigateToUrl(`${ref}?ref=workoutlog-form.html${user_id ? user_id : ''}${date ? date : ''}${workoutIdRef ? workoutIdRef : ''}`);
            }
          });
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
        component.setState({ workoutlog, workouts });
        let dialog = document.getElementById('select-workout-modal');
        dialog.classList.add('show-view');
        autoCompleteWorkoutSearch();
      } else {
        component.setState({ error, workoutlog });
      }
    });
  };

  let handleCloseWorkoutListModalEvent = function (event) {
    let dialog = document.getElementById('select-workout-modal');
    dialog.classList.remove('show-view');

    let selectWorkoutBtn = document.getElementById('select-workout-btn-wolog');
    selectWorkoutBtn.disabled = false;
  };

  let selectWorkout = function (targetId) {
    let prefix = 'select-workout-from-search-result-btn-';
    let index = parseInt(targetId.substring(prefix.length, targetId.length));
    let workoutlog = createWorkoutLogObjFromFormElements();
    let state = component.getState();
    let workouts = state.workouts ? state.workouts : [];
    //Store selected workout in an array. This is to maintain consistency with the query result which brings back the selected workout as an array.
    //This is the side effect of MongoDB aggregate query
    workoutlog.workout = [workouts[index]];
    let autoCompleteWorkoutListDiv = document.getElementById('autocomplete-workout-list');
    autoCompleteWorkoutListDiv.innerHTML = '';
    let dialog = document.getElementById('select-workout-modal');
    dialog.classList.remove('show-view');
    component.setState({ workoutlog });
    enableFieldsForSelectedWorkout(workouts[index]);
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

  let deleteMovement = function (targetId) {
    let prefix = 'delete-movement-';
    let index = parseInt(targetId.substring(prefix.length, targetId.length));
    let workoutlog = createWorkoutLogObjFromFormElements();
    let movements = workoutlog.movements;
    movements.splice(index, 1);
    component.setState({ workoutlog });
  };

  let copyMovement = function (targetId) {
    let prefix = 'copy-movement-';
    let index = parseInt(targetId.substring(prefix.length, targetId.length));
    let movementDiv = document.getElementById(`wolog-movement-data-${index}`);
    let repsInputField = document.getElementById(`wolog-movement-reps-${index}`);
    let loadInputField = document.getElementById(`wolog-movement-load-${index}`);
    let unitSelect = document.getElementById(`wolog-movement-unit-${index}`);

    let movement = {};
    if (movementDiv.dataset.id) {
      movement._id = movementDiv.dataset.id;
    }
    movement.movement = movementDiv.innerHTML.trim();
    movement.reps = repsInputField.value ? parseInt(repsInputField.value) : null;
    movement.load = loadInputField.value ? parseInt(loadInputField.value) : null;
    movement.unit = unitSelect.value ? unitSelect.value : '';

    let workoutlog = createWorkoutLogObjFromFormElements();
    workoutlog.movements.push(movement);
    component.setState({ workoutlog });
  };

  let populateMovementTextField = function (matchedMovementId) {
    let prefix = 'movement-list-item-';
    let index = matchedMovementId.substr(prefix.length);
    let wologAddMovementField = document.getElementById('wolog-add-movement');
    let selectedMovementIndexField = document.getElementById('selected-movement-index');
    let state = component.getState();
    let movements = state.movements ? state.movements : [];
    wologAddMovementField.value = movements[parseInt(index)].movement;
    selectedMovementIndexField.value = index;
    let autocompleteDiv = document.getElementById('autocomplete-movement-list');
    autocompleteDiv.innerHTML = '';
  };

  let handleCreateNewWorkoutEvent = function (event) {
    let selectWorkoutModal = document.getElementById('select-workout-modal');
    let newWorkoutFormModal = document.getElementById('new-workout-form-modal');

    selectWorkoutModal.classList.remove('show-view');
    newWorkoutFormModal.classList.add('show-view');
  };

  let enableFieldsForSelectedWorkout = function (workout) {
    let type = workout.type ? workout.type.toLowerCase() : null;
    let totalRepsSwitch = document.getElementById('total-reps-switch');
    let durationSwitch = document.getElementById('duration-switch');
    let movementSwitch = document.getElementById('movement-switch');
    let roundsSwitch = document.getElementById('rounds-switch');
    switch (type) {
      case 'for time':
        durationSwitch.checked = true;
        toggleDurationFields();
        break;
      case 'for load':
        movementSwitch.checked = true;
        toggleMovementFields();
        break;
      case 'for reps':
        totalRepsSwitch.checked = true;
        toggleTotalRepsField();
        break;
      case 'amrap':
        roundsSwitch.checked = true;
        toggleRoundsFields();
        break;
      case 'tabata':
        totalRepsSwitch.checked = true;
        toggleTotalRepsField();
        break;
      default:
        break;
    }
    let modalities = workout.modality ? workout.modality : [];
    document.getElementById('modality-m').checked = modalities.indexOf('m') > -1;
    document.getElementById('modality-g').checked = modalities.indexOf('g') > -1;
    document.getElementById('modality-w').checked = modalities.indexOf('w') > -1;
  };

  $hl.eventListener('submit', 'workout-log-form', handleWorkoutLogFormSubmitEvent);
  $hl.eventListener('click', 'select-workout-btn-wolog', handleSelectWorkoutEvent);
  $hl.eventListener('click', 'close-workout-list-modal-btn', handleCloseWorkoutListModalEvent);
  $hl.eventListener('click', 'unselect-workout', handleUnselectWorkoutEvent);
  $hl.eventListener('click', 'duration-switch', toggleDurationFields);
  $hl.eventListener('click', 'rounds-switch', toggleRoundsFields);
  $hl.eventListener('click', 'location-switch', toggleLocationField);
  $hl.eventListener('click', 'notes-switch', toggleNotesTextarea);
  $hl.eventListener('click', 'movement-switch', toggleMovementFields);
  $hl.eventListener('click', 'wolog-movement-add-btn', addMovement);
  $hl.eventListener('click', 'total-reps-switch', toggleTotalRepsField);
  $hl.eventListener('click', 'create-new-workout-btn', handleCreateNewWorkoutEvent);

  document.addEventListener('click', function (event) {
    let deleteRoundInfoRegex = new RegExp(/^delete-round-info-\d+/gm);
    if (deleteRoundInfoRegex.test(event.target.id)) {
      deleteRoundInfo(event.target.id);
    }

    let copyRoundInfoRegex = new RegExp(/^copy-round-info-\d+/gm);
    if (copyRoundInfoRegex.test(event.target.id)) {
      copyRoundInfo(event.target.id);
    }

    let movementListRegex = new RegExp(/^movement-list-item-\d+/);
    matchedMovementId = $hl.matchClosestSelector(event.target, movementListRegex);
    if (matchedMovementId) {
      populateMovementTextField(matchedMovementId);
    }

    let copyMovementRegex = new RegExp(/^copy-movement-\d+/gm);
    if (copyMovementRegex.test(event.target.id)) {
      copyMovement(event.target.id);
    }

    let deleteMovementRegex = new RegExp(/^delete-movement-\d+/gm);
    if (deleteMovementRegex.test(event.target.id)) {
      deleteMovement(event.target.id);
    }

    let selectWorkoutItemRegex = new RegExp(/^select-workout-from-search-result-btn-\d+/gm);
    if (selectWorkoutItemRegex.test(event.target.id)) {
      selectWorkout(event.target.id);
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

            enableFieldsForSelectedWorkout(response.workouts[0]);
          });
        }
      });
    });
  })();

  /* New Workout Dialog */

  let newWorkoutFormModalTemplate = function (props) {
    return `
    <div class="modal-container" id="new-workout-form-modal">
      <div class="modal-dialog new-workout-form-modal">
        <button id="close-new-workout-form-modal-btn">X</button>
        <div class="form-input-group margin-top-20px">
          <input type="text" class="form-input" name="workout-name" id="workout-name" placeholder="Workout Name" required>
          <label for="workout-name" class="form-label">Workout Name</label>
        </div>
        <div class="form-flex-group margin-top-5px">
          <div class="form-flex-group block-with-border flex-auto">
            <div class="block-with-border-label">Type</div>
            <div class="form-input-group margin-top-10px">
              <select class="form-input" name="workout-type" id="workout-type">
                <option></option>
                <option selected>For Time</option>
                <option>For Load</option>
                <option>AMRAP</option>
                <option>For Reps</option>
                <option>Tabata</option>
              </select>
            </div>
          </div>
          <div class="form-flex-group block-with-border margin-left-5px flex-auto">
            <div class="block-with-border-label">Time Cap</div>
            <div class="block-with-border-switch">
              <label class="switch small form-group-label">
                <input type="checkbox" id="workout-time-cap-switch"/>
                <span class="slider small round"></span>
              </label>
            </div>
            <div class="form-flex-group margin-top-10px">
              <div class="form-input-group show-time-separator-right-3px">
                <input type="number" class="form-input duration-input margin-right-10px" name="workout-time-cap-hours" id="workout-time-cap-hours" min="0" max="240" placeholder="H" disabled />
                <label for="workout-time-cap-hours" class="form-label duration-label">H</label>
              </div>
              <div class="form-input-group show-time-separator-right-3px">
                <input type="number" class="form-input duration-input margin-right-10px" name="workout-time-cap-minutes" id="workout-time-cap-minutes" min="0" max="59" placeholder="M" disabled />
                <label for="workout-time-cap-minutes" class="form-label duration-label">M</label>
              </div>
              <div class="form-input-group">
                <input type="number" class="form-input duration-input margin-right-0" name="workout-time-cap-seconds" id="workout-time-cap-seconds" min="0" max="59" placeholder="S" disabled />
                <label for="workout-time-cap-seconds" class="form-label duration-label">S</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-flex-group margin-top-5px">
          <div class="form-flex-group block-with-border flex-auto">
            <div class="block-with-border-label">Total Rounds</div>
            <div class="block-with-border-switch">
              <label class="switch small form-group-label">
                <input type="checkbox" id="workout-rounds-switch"/>
                <span class="slider small round"></span>
              </label>
            </div>
            <div class="form-flex-group margin-top-10px">
              <div class="form-input-group">
                <input type="number" class="form-input" name="workout-rounds" id="workout-rounds" placeholder="Rounds" disabled>    
                <label for="workout-rounds" class="form-label rounds-label">Rounds</label>
              </div>      
            </div>
          </div>
          <div class="form-flex-group block-with-border margin-left-5px flex-auto">
            <div class="block-with-border-label">Total Reps</div>
            <div class="block-with-border-switch">
              <label class="switch small form-group-label">
                <input type="checkbox" id="workout-total-reps-switch"/>
                <span class="slider small round"></span>
              </label>
            </div>
            <div class="form-flex-group margin-top-10px">
              <div class="form-input-group">
                <input type="number" class="form-input" name="workout-total-reps" id="workout-total-reps" placeholder="Reps" disabled>    
                <label for="workout-total-reps" class="form-label rounds-label">Reps</label>
              </div>      
            </div>
          </div>
        </div>
        <div class="form-flex-group margin-top-5px">
          <div class="form-input-group flex-auto">
            <textarea class="form-input" name="workout-description" id="workout-description" placeholder="Description" required></textarea>
            <label for="workout-description" class="form-label">Description</label>
          </div> 
        </div>
        <div class="form-flex-group margin-bottom-5px">
          <div class="form-input-group">
            <textarea class="form-input" name="workout-scaling" id="workout-scaling" placeholder="Scaling Options" disabled></textarea>
            <label for="workout-scaling" class="form-label">Scaling Options</label>
          </div>
          <label class="switch small form-group-label margin-left-5px">
            <input type="checkbox" id="workout-scaling-switch" />
            <span class="slider small round"></span>
          </label>
        </div>
        <div class="form-flex-group margin-bottom-5px block-with-border">
          <div class="block-with-border-label">Modality</div>
          <div class="form-flex-group margin-top-5px">
            <label class="switch small">
              <input type="checkbox" id="workout-modality-m" name="workout-modality" value="m"/>
              <span class="slider small round"></span>
            </label>
            <div class="workout-modality-text">Cardio</div>
            <label class="switch small">
              <input type="checkbox" id="workout-modality-g" name="workout-modality" value="g" />
              <span class="slider small round"></span>
            </label>
            <div class="workout-modality-text">Body Weight</div>
            <label class="switch small">
              <input type="checkbox" id="workout-modality-w" name="workout-modality" value="w"/>
              <span class="slider small round"></span>
            </label>
            <div class="workout-modality-text">Weights</div>
          </div>
        </div>
        <div class="submit-btn-bar margin-top-5px">
          <button type="button" id="save-new-workout-btn" class="submit-btn" disabled>Save Workout</button>
        </div>
      </div>
    </div>
    `;
  };

  let handleCloseNewWorkoutFormModalEvent = function (event) {
    let newWorkoutFormModal = document.getElementById('new-workout-form-modal');
    newWorkoutFormModal.classList.remove('show-view');
  };

  let toggleWorkoutTimeCapFields = function () {
    let timecapSwitch = document.querySelector('#workout-time-cap-switch');
    let hourInput = document.querySelector('#workout-time-cap-hours');
    let minuteInput = document.querySelector('#workout-time-cap-minutes');
    let secondInput = document.querySelector('#workout-time-cap-seconds');
    if (timecapSwitch.checked) {
      enableField(hourInput);
      enableField(minuteInput);
      enableField(secondInput);
    } else {
      disableField(hourInput);
      disableField(minuteInput);
      disableField(secondInput);
    }
  };

  let toggleWorkoutRoundsFields = function () {
    let workoutRoundsSwitch = document.querySelector('#workout-rounds-switch');
    let workoutRoundsField = document.querySelector('#workout-rounds');

    workoutRoundsSwitch.checked ? enableField(workoutRoundsField) : disableField(workoutRoundsField);
  };

  let toggleWorkoutTotalRepsFields = function () {
    let workoutTotalRepsSwitch = document.querySelector('#workout-total-reps-switch');
    let workoutTotalRepsField = document.querySelector('#workout-total-reps');

    workoutTotalRepsSwitch.checked ? enableField(workoutTotalRepsField) : disableField(workoutTotalRepsField);
  };

  let toggleWorkoutScalingFields = function () {
    let workoutScalingSwitch = document.querySelector('#workout-scaling-switch');
    let workoutScalingField = document.querySelector('#workout-scaling');

    workoutScalingSwitch.checked ? enableField(workoutScalingField) : disableField(workoutScalingField);
  };

  let enableSaveWorkoutBtn = function (event) {
    let workoutName = document.getElementById('workout-name');
    let workoutDesc = document.getElementById('workout-description');
    let saveWorkoutBtn = document.getElementById('save-new-workout-btn');
    saveWorkoutBtn.disabled = workoutName.value !== '' && workoutDesc.value !== '' ? false : true;
  };

  let handleSaveNewWorkoutEvent = function (event) {
    let saveNewWorkoutBtn = document.getElementById(event.target.id);
    saveNewWorkoutBtn.innerHTML = 'Saving Workout...';
    saveNewWorkoutBtn.disabled = true;

    let workoutNameField = document.getElementById('workout-name');
    let workoutDescField = document.getElementById('workout-description');
    let workoutTypeField = document.getElementById('workout-type');
    let workoutTimeCapHoursField = document.getElementById('workout-time-cap-hours');
    let workoutTimeCapMinutesField = document.getElementById('workout-time-cap-minutes');
    let workoutTimeCapSecondsField = document.getElementById('workout-time-cap-seconds');
    let workoutRoundsField = document.getElementById('workout-rounds');
    let workoutTotalRepsField = document.getElementById('workout-total-reps');
    let workoutScalingField = document.getElementById('workout-scaling');
    let workoutModality = document.getElementsByName('workout-modality');

    let workout = {};
    workout.name = workoutNameField.value ? workoutNameField.value : null;
    workout.description = workoutDescField.value ? workoutDescField.value : null;
    workout.type = workoutTypeField.value ? workoutTypeField.value : null;
    workout.timecap = {};
    workout.timecap.hours = workoutTimeCapHoursField.value !== '' ? parseInt(workoutTimeCapHoursField.value) : null;
    workout.timecap.minutes = workoutTimeCapMinutesField.value !== '' ? parseInt(workoutTimeCapMinutesField.value) : null;
    workout.timecap.seconds = workoutTimeCapSecondsField.value !== '' ? parseInt(workoutTimeCapSecondsField.value) : null;
    workout.rounds = workoutRoundsField.value !== '' ? parseInt(workoutRoundsField.value) : null;
    workout.reps = workoutTotalRepsField.value !== '' ? parseInt(workoutTotalRepsField.value) : null;
    workout.scalingdesc = workoutScalingField.value !== '' ? workoutScalingField.value : null;
    let state = component.getState();
    workout.user_id = state.user._id;

    workout.modality = [];
    for (var i = 0; i < workoutModality.length; i++) {
      if (workoutModality[i].checked) workout.modality.push(workoutModality[i].value);
    }

    $ironfyt.saveWorkout(workout, function (error, response) {
      if (error) {
        component.setState({ error });
        return;
      }
      let workoutlog = state.workoutlog && typeof state.workoutlog === 'object' ? state.workoutlog : {};
      workoutlog.workout = [response.workout];
      component.setState({ workoutlog });

      enableFieldsForSelectedWorkout(response.workout);
    });
  };
  $hl.eventListener('click', 'close-new-workout-form-modal-btn', handleCloseNewWorkoutFormModalEvent);
  $hl.eventListener('click', 'workout-time-cap-switch', toggleWorkoutTimeCapFields);
  $hl.eventListener('click', 'workout-rounds-switch', toggleWorkoutRoundsFields);
  $hl.eventListener('click', 'workout-total-reps-switch', toggleWorkoutTotalRepsFields);
  $hl.eventListener('click', 'workout-scaling-switch', toggleWorkoutScalingFields);
  $hl.eventListener('input', 'workout-name', enableSaveWorkoutBtn);
  $hl.eventListener('input', 'workout-description', enableSaveWorkoutBtn);
  $hl.eventListener('click', 'save-new-workout-btn', handleSaveNewWorkoutEvent);
  /* End New Workout Dialog */
})();
