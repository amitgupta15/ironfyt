(function () {
  'use strict';

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
              <div class="form-input-group show-time-separator-right-3px">
                <input type="number" class="form-input-classic duration-input margin-right-10px" name="workout-time-cap-hours" id="workout-time-cap-hours" min="0" max="240" placeholder="H" value="${timecap.hours ? timecap.hours : ''}" />
              </div>
              <div class="form-input-group show-time-separator-right-3px">
                <input type="number" class="form-input-classic duration-input margin-right-10px" name="workout-time-cap-minutes" id="workout-time-cap-minutes" min="0" max="59" placeholder="M" value="${timecap.minutes ? timecap.minutes : ''}"  />
              </div>
              <div class="form-input-group">
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
        <div class="margin-top-10px">
          <label for="workout-add-movement" class="form-label-classic">Movements</label>
          <input class="form-input-classic" name="workout-add-movement" id="workout-add-movement" placeholder="Find movement to add..."/>
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
          <button type="button" id="new-workout-next-step-btn" class="submit-btn">Create Workout</button>
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
      pageTitle: 'New Workout',
      leftButtonTitle: 'Back',
      movements: [],
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormReviewTemplate);
    },
    afterRender: function (props) {
      setDefaultModality(props);
    },
  }));

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

    let state = component.getState();
    let workout = state && state.workout ? state.workout : {};
    workout.type = typeInputField ? typeInputField.value : '';
    workout.duration = {
      hours: hourInputField ? parseInt(hourInputField.value) : 0,
      minutes: minuteInputField ? parseInt(minuteInputField.value) : 0,
      seconds: secondInputField ? parseInt(secondInputField.value) : 0,
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
        rep.reps = document.getElementById(`workout-movement-reps-${movementIndex}-${repsIndex}`).value;
        rep.load = document.getElementById(`workout-movement-load-${movementIndex}-${repsIndex}`).value;
        rep.unit = document.getElementById(`workout-movement-unit-${movementIndex}-${repsIndex}`).value;
      });
    });
    workout.movements = movements;
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
   * Check the modality of the parsed movements and set the default modality of the workout
   * @param {Object} props
   */
  let setDefaultModality = function (props) {
    let workout = props && props.workout ? props.workout : {};
    let movements = workout.movements ? workout.movements : [];
    let modalities = new Set();
    movements.forEach((movement) => {
      modalities.add(movement.movementObj.modality);
    });
    if (modalities.size) {
      modalities.forEach((modality) => {
        document.getElementById(`workout-modality-${modality}`).checked = true;
      });
    }
  };

  ($ironfyt.workoutFormReviewPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        let workout = localStorage.getItem('newworkout');
        if (workout === null) {
          //If no workout is found in the localstorage, then send the user back to the workout form page
          $ironfyt.navigateToUrl(`workout-form.html`);
        } else {
          workout = workout ? JSON.parse(workout) : {};
        }
        component.setState({ user });
        $ironfyt.getMovements({}, function (error, response) {
          if (error) {
            component.setState({ error });
          } else {
            let movements = response && response.movements ? response.movements : [];
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
            workout.description = parsedWorkout && parsedWorkout.workoutDesc ? parsedWorkout.workoutDesc : '';
            workout.movements = parsedMovements;
            component.setState({ movements, workout });
          }
        });
      } else {
        component.setState({ error });
      }
    });
  })();

  document.addEventListener('change', function (event) {
    //Check if the unit of the first rep for a given movement is changed. If it is changed, then change the rest of the units for the movement to the
    //same unit
    let wologMovementUnitRegex = new RegExp(/^wolog-movement-unit-\d+-0/g);
    if (wologMovementUnitRegex.test(event.target.id)) {
      let unit = event.target.value;
      let movementIndex = event.target.dataset.movementIndex;
      let unitSelectors = document.querySelectorAll(`[id^="wolog-movement-unit-${movementIndex}"]`);
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
  });
})();
