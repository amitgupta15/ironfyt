(function () {
  ('use strict');

  let repsRowTemplate = (attr, movementIndex, repsIndex) => {
    let { reps, movementObj } = attr;
    let units = movementObj && movementObj.units ? movementObj.units : [];
    let repsNum = reps && reps.reps ? reps.reps : '';
    let repsLoad = reps && reps.load ? reps.load : '';
    let repsUnit = reps && reps.unit ? reps.unit : '';
    return `
    <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
      <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
        ${repsIndex === 0 ? `<label for="workout-movement-reps-${movementIndex}-${repsIndex}" class="form-label-classic">Reps</label>` : ``}
        <input type="number" class="form-input-classic" name="workout-movement-reps-${movementIndex}-${repsIndex}" id="workout-movement-reps-${movementIndex}-${repsIndex}" value="${repsNum}" placeholder="">    
      </div>
      ${
        units.length
          ? `
          <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
            ${repsIndex === 0 ? `<label for="workout-movement-load-${movementIndex}-${repsIndex}" class="form-label-classic">Load</label>` : ``}  
            <input type="number" class="form-input-classic" name="workout-movement-load-${movementIndex}-${repsIndex}" id="workout-movement-load-${movementIndex}-${repsIndex}" value="${repsLoad}" placeholder="">
          </div>
          <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
            ${repsIndex === 0 ? `<label for="workout-movement-unit-${movementIndex}-${repsIndex}" class="form-label-classic">Unit</label>` : ``}  
            <select class="form-input-classic" name="workout-movement-unit-${movementIndex}-${repsIndex}" data-movement-index="${movementIndex}" id="workout-movement-unit-${movementIndex}-${repsIndex}">
              <option value=""></option>
              ${units.map((unit) => `<option value="${unit}" ${unit === repsUnit ? 'selected' : ''}>${unit}</option>`)}
            </select>
          </div>
      `
          : ``
      }  
      <div class="${repsIndex === 0 ? 'margin-top-30px' : ''}">
        <button type="button" class="copy-btn" data-movement-index="${movementIndex}" data-reps-index="${repsIndex}" id="copy-movement-reps-${movementIndex}-${repsIndex}"></button>
        <button type="button" class="remove-btn" data-movement-index="${movementIndex}" data-reps-index="${repsIndex}" id="delete-movement-reps-${movementIndex}-${repsIndex}"></button>
      </div>
    </div>`;
  };

  let workoutFormReviewTemplate = function (props) {
    let workout = props && props.workout ? props.workout : {};
    let timecap = workout.timecap ? workout.timecap : {};
    let movements = workout.movements ? workout.movements : [];
    return `
    <div class="container">
      <div class="text-align-center bold-text">Review & Add Details</div>
      <div class="text-align-center text-color-secondary">Step 2 of 2</div>
      <div class="text-color-highlight margin-top-20px">Name</div>
      <div>${workout.name ? workout.name : ''}</div>
      <div class="text-color-highlight margin-top-10px">Description</div>
      <div>
      ${workout.description ? $hl.replaceNewLineWithBR(workout.description) : ''}
      </div>
      <form id="workout-form-review">
        <div class="margin-top-10px">
          <label for="workout-type" class="form-label-classic">Type</label>
          <select class="form-input-classic" name="workout-type" id="workout-type">
            <option></option>
            <option ${workout.type && workout.type.toLowerCase() === 'for time' ? 'selected' : workout.type === null || workout.type === undefined ? 'selected' : ''}>For Time</option>
            <option ${workout.type && workout.type.toLowerCase() === 'for load' ? 'selected' : ''}>For Load</option>
            <option ${workout.type && workout.type.toLowerCase() === 'amrap' ? 'selected' : ''}>AMRAP</option>
            <option ${workout.type && workout.type.toLowerCase() === 'for reps' ? 'selected' : ''}>For Reps</option>
            <option ${workout.type && workout.type.toLowerCase() === 'tabata' ? 'selected' : ''}>Tabata</option>
          </select>
        </div>
        <div class="flex margin-top-10px">
          <div class="flex-auto">
            <div class="form-label-classic">Time Cap</div>
            <div class="form-flex-group margin-top-5px">
              <div class="position-relative show-time-separator-right-3px">
                <input type="number" class="form-input-classic duration-input margin-right-10px" name="workout-time-cap-hours" id="workout-time-cap-hours" min="0" max="240" placeholder="H" value="${timecap.hours ? timecap.hours : ''}" />
              </div>
              <div class="position-relative show-time-separator-right-3px">
                <input type="number" class="form-input-classic duration-input margin-right-10px" name="workout-time-cap-minutes" id="workout-time-cap-minutes" min="0" max="59" placeholder="M" value="${timecap.minutes ? timecap.minutes : ''}"  />
              </div>
              <div class="position-relative">
                <input type="number" class="form-input-classic duration-input margin-right-0" name="workout-time-cap-seconds" id="workout-time-cap-seconds" min="0" max="59" placeholder="S" value="${timecap.seconds ? timecap.seconds : ''}"  />
              </div>
            </div>
          </div>
          <div class="margin-left-20px">
            <label for="workout-rounds" class="form-label-classic">Total Rounds</label>
            <input type="number" class="form-input-classic" name="workout-rounds" id="workout-rounds" placeholder="" value="${workout.rounds ? workout.rounds : ''}" >    
          </div>      
        </div>
        <div class="margin-top-10px">
          <div class="form-label-classic">Modality</div>
          <div class="form-flex-group margin-top-5px">
            <label class="switch small">
              <input type="checkbox" id="workout-modality-m" name="workout-modality" value="m" ${workout.modality && workout.modality.indexOf('m') > -1 ? 'checked' : ''}/>
              <span class="slider small round"></span>
            </label>
            <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-cardio"><span class="modality-m"></span>Cardio</div>
            <label class="switch small">
              <input type="checkbox" id="workout-modality-g" name="workout-modality" value="g" ${workout.modality && workout.modality.indexOf('g') > -1 ? 'checked' : ''}/>
              <span class="slider small round"></span>
            </label>
            <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-body-weight"><span class="modality-g"></span>Body Weight</div>
            <label class="switch small">
              <input type="checkbox" id="workout-modality-w" name="workout-modality" value="w" ${workout.modality && workout.modality.indexOf('w') > -1 ? 'checked' : ''}/>
              <span class="slider small round"></span>
            </label>
            <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-weights"><span class="modality-w flex-align-self-center"></span>Weights</div>
          </div>
        </div>
        <div class="margin-top-10px position-relative">
          <label for="workout-add-movement" class="form-label-classic">Movements</label>
          <input class="form-input-classic" name="workout-add-movement" id="workout-add-movement" placeholder="Find movement to add..."/>
          <input type="hidden" id="selected-movement-index" value="">
          <div id="autocomplete-new-workout-movement-list" class="autocomplete-movement-list"></div>
        </div>
        ${movements
          .map((movement, movementIndex) => {
            let reps = movement.reps ? movement.reps : [];
            return `
            <div class="rounded-corner-box margin-top-5px">
              <div class="form-flex-group">
                <div id="workout-movement-data-${movementIndex}">${movement && movement.movementObj ? movement.movementObj.movement : ''}</div>
                <button type="button" class="remove-btn margin-left-5px"  data-workout-movement-index="${movementIndex}" id="delete-workout-movement-${movementIndex}"></button>
              </div>
              ${reps.map((reps, repsIndex) => repsRowTemplate({ reps, movementObj: movement.movementObj }, movementIndex, repsIndex)).join('')}
            </div>
            `;
          })
          .join('')}
        <div class="submit-btn-bar margin-top-5px">
          <button type="button" id="new-workout-save-btn" class="submit-btn">${workout._id ? 'Update Workout' : 'Create Workout'}</button>
        </div>
      </form>
    </div>
    `;
  };

  let component = ($ironfyt.workoutFormReviewComponent = Component('[data-app=workout-form-review]', {
    state: {
      user: {},
      error: '',
      workout: $ironfyt.newWorkout,
      leftButtonTitle: 'Back',
      movements: [],
      primaryMovements: [], //Primary movements are used for autocomplete list.
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormReviewTemplate);
    },
    afterRender: function (props) {
      setDefaultModality(props);
      autocompleteMovement(document.getElementById('workout-add-movement'), props.primaryMovements ? props.primaryMovements : []);
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
    let autocompleteDiv = document.getElementById('autocomplete-new-workout-movement-list');
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
          autocompleteList += `<div id="new-workout-movement-auto-list-item-${i}" data-new-workout-movement-auto-list-index="${i}">${list[i].movement.replace(stringToHighlight, `<span class="text-color-highlight">${stringToHighlight}</span>`)}</div>`;
          // }
        }
      }
      autocompleteDiv.innerHTML = autocompleteList;
    });
  };

  /**
   * Creates a workout obj from form fields
   *
   */
  let createWorkoutObjFromFields = function () {
    let typeInputField = document.getElementById('workout-type');
    let hourInputField = document.getElementById('workout-time-cap-hours');
    let minuteInputField = document.getElementById('workout-time-cap-minutes');
    let secondInputField = document.getElementById('workout-time-cap-seconds');
    let modalityRadios = document.getElementsByName('workout-modality');
    let roundsInputField = document.getElementById('workout-rounds');

    let state = component.getState();
    let user = state && state.user ? state.user : {};
    let workout = state && state.workout ? state.workout : {};
    workout.type = typeInputField && typeInputField.value !== '' ? typeInputField.value : null;
    workout.rounds = roundsInputField && roundsInputField.value !== '' ? roundsInputField.value : null;
    workout.timecap = {
      hours: hourInputField && hourInputField.value !== '' ? parseInt(hourInputField.value) : null,
      minutes: minuteInputField && minuteInputField.value !== '' ? parseInt(minuteInputField.value) : null,
      seconds: secondInputField && secondInputField.value !== '' ? parseInt(secondInputField.value) : null,
    };

    workout.modality = [];
    if (modalityRadios) {
      for (var i = 0; i < modalityRadios.length; i++) {
        if (modalityRadios[i].checked) workout.modality.push(modalityRadios[i].value);
      }
    }

    let movements = workout.movements ? workout.movements : [];
    movements.forEach((movement, movementIndex) => {
      movement.reps.forEach((rep, repsIndex) => {
        let repsField = document.getElementById(`workout-movement-reps-${movementIndex}-${repsIndex}`);
        let loadField = document.getElementById(`workout-movement-load-${movementIndex}-${repsIndex}`);
        let unitField = document.getElementById(`workout-movement-unit-${movementIndex}-${repsIndex}`);
        rep.reps = repsField && repsField.value !== '' ? parseInt(repsField.value) : null;
        rep.load = loadField && loadField.value !== '' ? parseInt(loadField.value) : null;
        rep.unit = unitField && unitField.value !== '' ? unitField.value : null;
      });
    });
    workout.movements = movements;
    workout.user_id = user._id;
    return workout;
  };
  /**
   * Creates a new row of movement reps
   * @param {Event} event
   */
  let copyMovementReps = function (event) {
    let workout = createWorkoutObjFromFields();
    let movementIndex = parseInt(event.target.dataset.movementIndex);
    let repsIndex = parseInt(event.target.dataset.repsIndex);
    let movement = workout.movements ? workout.movements[movementIndex] : {};
    let rep = movement.reps[repsIndex];
    //createWorkoutObjFromFields() method will already update the movement.reps array with the latest values from the fields.
    //Get the rep object for the specified index and copy it to the index right after the current rep object
    movement.reps.splice(repsIndex + 1, 0, rep);
    component.setState({ workout });
  };

  /**
   * Deletes the specified reps row from the movement.
   * @param {Event} event
   */
  let deleteMovementReps = function (event) {
    let workout = createWorkoutObjFromFields();
    let movementIndex = parseInt(event.target.dataset.movementIndex);
    let repsIndex = parseInt(event.target.dataset.repsIndex);
    let movement = workout.movements ? workout.movements[movementIndex] : {};
    movement.reps.splice(repsIndex, 1);
    component.setState({ workout });
  };

  /**
   * Deletes the specified movement from the workout form
   * @param {Event} event
   */
  let deleteMovement = function (event) {
    let workout = createWorkoutObjFromFields();
    let movementIndex = parseInt(event.target.dataset.workoutMovementIndex);
    let movements = workout.movements ? workout.movements : [];
    movements.splice(movementIndex, 1);
    component.setState({ workout });
  };

  /**
   * Adds the selected movement to the list of movements and hides the auto complete list
   * @param {Event} event
   */
  let addMovementFromAutoList = function (event) {
    let workout = createWorkoutObjFromFields();
    let movementIndex = parseInt(event.target.dataset.newWorkoutMovementAutoListIndex);
    let state = component.getState();
    let movements = state.movements ? state.movements : [];
    let movementObj = movements[movementIndex];
    let reps = [{ reps: null, load: null, unit: null }];
    let newMovement = { movementObj, reps };
    // workout.movements.splice(0, 0, newMovement);
    workout.movements.push(newMovement);

    component.setState({ workout });
  };
  /**
   * Check the modality of the parsed movements and set the default modality of the workout
   * @param {Object} props
   */
  let setDefaultModality = function (props) {
    let workout = props && props.workout ? props.workout : {};
    let movements = workout.movements ? workout.movements : [];
    let modalities = new Set();
    movements.forEach((movement) => {
      if (movement.movementObj.modality) {
        modalities.add(movement.movementObj.modality);
      }
    });
    if (modalities.size) {
      modalities.forEach((modality) => {
        document.getElementById(`workout-modality-${modality}`).checked = true;
      });
    }
  };
  let handleSaveNewWorkoutEvent = function () {
    let workout = createWorkoutObjFromFields();
    $ironfyt.saveWorkout(workout, function (error) {
      if (error) {
        component.setState({ error });
      } else {
        localStorage.removeItem('newworkout');
        $ironfyt.navigateToUrl('workouts.html');
      }
    });
  };

  ($ironfyt.workoutFormReviewPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        let workout = localStorage.getItem('newworkout');
        if (workout === null) {
          //If no workout is found in the localstorage, then send the user back to the workout form page
          $ironfyt.navigateToUrl(`workout-form.html`);
          return;
        } else {
          workout = workout ? JSON.parse(workout) : {};
        }
        component.setState({ user });
        $ironfyt.getMovements({}, function (error, response) {
          if (error) {
            component.setState({ error });
          } else {
            let movements = response && response.movements ? response.movements : [];
            let primaryMovements = movements.filter((movement) => movement.primary === true);
            let parsedWorkout = $ironfyt.parseWorkout(workout.description, movements);
            let parsedMovements = parsedWorkout && parsedWorkout.parsedMovements ? parsedWorkout.parsedMovements : [];
            //Sanitize the reps information before adding it to the workout. Movement and reps info should be in the format
            // {movementObj: {}, reps:[{reps:1,load:1,unit:lb}]}
            parsedMovements = parsedMovements.map((movement) => {
              let reps = [];
              if (Array.isArray(movement.reps)) {
                movement.reps.forEach((rep) => reps.push({ reps: rep, load: null, unit: null }));
              } else {
                reps = [{ reps: movement.reps, load: null, unit: null }];
              }
              return { movementObj: movement.movementObj, reps };
            });
            workout.origdescription = workout.description;
            workout.description = parsedWorkout && parsedWorkout.workoutDesc ? parsedWorkout.workoutDesc : '';
            workout.movements = workout.movements ? workout.movements : [];
            workout.movements = parsedMovements;
            component.setState({ movements, primaryMovements, workout });
          }
        });
      } else {
        component.setState({ error });
      }
    });
  })();

  $hl.eventListener('click', 'new-workout-save-btn', handleSaveNewWorkoutEvent);

  document.addEventListener('change', function (event) {
    //Check if the unit of the first rep for a given movement is changed. If it is changed, then change the rest of the units for the movement to the
    //same unit
    let wologMovementUnitRegex = new RegExp(/^workout-movement-unit-\d+-0/g);
    if (wologMovementUnitRegex.test(event.target.id)) {
      let unit = event.target.value;
      let movementIndex = event.target.dataset.movementIndex;
      let unitSelectors = document.querySelectorAll(`[id^="workout-movement-unit-${movementIndex}"]`);
      unitSelectors.forEach((selector) => (selector.value = unit));
    }
  });

  document.addEventListener('click', function (event) {
    //Copy reps row of a movement
    let copyMovementRepsRegex = new RegExp(/^copy-movement-reps-\d+-\d+/g);
    if (copyMovementRepsRegex.test(event.target.id)) {
      copyMovementReps(event);
    }

    //Delete reps row of a movement
    let deleteMovementRepsRegex = new RegExp(/^delete-movement-reps-\d+-\d+/g);
    if (deleteMovementRepsRegex.test(event.target.id)) {
      deleteMovementReps(event);
    }

    //Delete a movement
    let deleteMovementRegex = new RegExp(/^delete-workout-movement-\d+/g);
    if (deleteMovementRegex.test(event.target.id)) {
      deleteMovement(event);
    }

    //Select a movement from the auto complete movement list
    let movementAutoListItemRegex = new RegExp(/^new-workout-movement-auto-list-item-\d+/g);
    if (movementAutoListItemRegex.test(event.target.id)) {
      addMovementFromAutoList(event);
    }
  });
})();
