(function () {
  'use strict';

  $ironfyt.newWorkout = {
    name: null,
    type: null,
    timecap: null,
    rounds: null,
    reps: null,
    description: null,
    modality: [],
  };

  $ironfyt.newWorkoutFormTemplate = function (props) {
    let workout = props && props.workout ? props.workout : {};
    let timecap = workout.timecap ? workout.timecap : {};
    return `
    <input type="hidden" name="workout-id" id="workout-id" value="${workout._id ? workout._id : ''}">
    <div class="margin-top-20px">
      <label for="workout-name" class="form-label-classic">Workout Name</label>
      <input type="text" class="form-input-classic" name="workout-name" maxlength="30" id="workout-name" placeholder="Fran" value="${workout.name ? workout.name : ''}" required autofocus>
    </div>
    <div class="margin-top-5px">
      <label for="workout-type" class="form-label-classic">Type</label>
      <select class="form-input-classic" name="workout-type" id="workout-type">
        <option></option>
        <option ${workout.type && workout.type.toLowerCase() === 'for time' ? 'selected' : workout.type === null ? 'selected' : ''}>For Time</option>
        <option ${workout.type && workout.type.toLowerCase() === 'for load' ? 'selected' : ''}>For Load</option>
        <option ${workout.type && workout.type.toLowerCase() === 'amrap' ? 'selected' : ''}>AMRAP</option>
        <option ${workout.type && workout.type.toLowerCase() === 'for reps' ? 'selected' : ''}>For Reps</option>
        <option ${workout.type && workout.type.toLowerCase() === 'tabata' ? 'selected' : ''}>Tabata</option>
      </select>
    </div>
    <div class="flex">
      <div class="margin-top-5px flex-auto">
        <div class="form-label-classic">Time Cap</div>
        <div class="form-flex-group margin-top-5px">
          <div class="form-input-group show-time-separator-right-3px">
            <input type="number" class="form-input duration-input margin-right-10px" name="workout-time-cap-hours" id="workout-time-cap-hours" min="0" max="240" placeholder="H" value="${timecap.hours ? timecap.hours : ''}" />
            <label for="workout-time-cap-hours" class="form-label duration-label">H</label>
          </div>
          <div class="form-input-group show-time-separator-right-3px">
            <input type="number" class="form-input duration-input margin-right-10px" name="workout-time-cap-minutes" id="workout-time-cap-minutes" min="0" max="59" placeholder="M" value="${timecap.minutes ? timecap.minutes : ''}"  />
            <label for="workout-time-cap-minutes" class="form-label duration-label">M</label>
          </div>
          <div class="form-input-group">
            <input type="number" class="form-input duration-input margin-right-0" name="workout-time-cap-seconds" id="workout-time-cap-seconds" min="0" max="59" placeholder="S" value="${timecap.seconds ? timecap.seconds : ''}"  />
            <label for="workout-time-cap-seconds" class="form-label duration-label">S</label>
          </div>
        </div>
      </div>
      <div class="margin-top-5px margin-left-20px">
        <label for="workout-rounds" class="form-label-classic">Total Rounds</label>
        <input type="number" class="form-input-classic" name="workout-rounds" id="workout-rounds" placeholder="Rounds" value="${workout.rounds ? workout.rounds : ''}" >    
      </div>      
    </div>
    <div class="margin-top-5px">
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
    <div class="margin-top-5px">
      <label for="workout-description" class="form-label-classic">Description</label>
      <textarea class="form-input-classic" name="workout-description" id="workout-description" placeholder="Workout Description..." required>${workout.description ? workout.description : ''}</textarea>
      <div class="form-input-group flex-auto">
      </div> 
    </div>
    <div class="margin-top-5px">
      <label for="workout-scaling" class="form-label-classic">Scaling Options</label>
      <textarea class="form-input-classic" name="workout-scaling" id="workout-scaling" placeholder="Scaling Options">${workout.scalingdesc ? workout.scalingdesc : ''}</textarea>
    </div>
    <div class="submit-btn-bar margin-top-5px">
      <button type="button" id="workout-form-helper-save-new-workout-btn" class="submit-btn" ${workout.name && workout.description ? '' : 'disabled'}>Save Workout</button>
    </div>
    `;
  };

  let enableSaveWorkoutBtn = function (event) {
    let workoutName = document.getElementById('workout-name');
    let workoutDesc = document.getElementById('workout-description');
    let saveWorkoutBtn = document.getElementById('workout-form-helper-save-new-workout-btn');
    saveWorkoutBtn.disabled = workoutName.value !== '' && workoutDesc.value !== '' ? false : true;
  };

  /**
   * Call this method from the caller module
   * @param {Object} user
   * @param {Event} event
   * @param {function} callback - sends back the error, response
   */
  $ironfyt.validateAndSaveWorkout = function (user, event, callback) {
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
    let workoutScalingField = document.getElementById('workout-scaling');
    let workoutModality = document.getElementsByName('workout-modality');
    let workoutId = document.getElementById('workout-id');

    let workout = {};
    workout.name = workoutNameField.value ? $hl.sanitize(workoutNameField.value) : null;
    workout.description = workoutDescField.value ? $hl.sanitize(workoutDescField.value) : null;
    workout.type = workoutTypeField.value ? workoutTypeField.value : null;
    workout.timecap = {};
    workout.timecap.hours = workoutTimeCapHoursField.value !== '' ? parseInt(workoutTimeCapHoursField.value) : null;
    workout.timecap.minutes = workoutTimeCapMinutesField.value !== '' ? parseInt(workoutTimeCapMinutesField.value) : null;
    workout.timecap.seconds = workoutTimeCapSecondsField.value !== '' ? parseInt(workoutTimeCapSecondsField.value) : null;
    workout.rounds = workoutRoundsField.value !== '' ? parseInt(workoutRoundsField.value) : null;
    workout.scalingdesc = workoutScalingField.value !== '' ? $hl.sanitize(workoutScalingField.value) : null;
    workout.user_id = user._id;
    workout._id = workoutId.value !== '' ? workoutId.value : null;

    workout.modality = [];
    for (var i = 0; i < workoutModality.length; i++) {
      if (workoutModality[i].checked) workout.modality.push(workoutModality[i].value);
    }

    $ironfyt.parseWorkoutDescription(workout, function (error, response) {
      let { parsedMovements, workoutDesc, parsedLoadInfo } = response;
      workout.description = workoutDesc;
      callback(error, { workout, parsedMovements });
    });

    // $ironfyt.saveWorkout(workout, function (error, response) {
    //   callback(error, response);
    // });
  };

  let handleSaveWorkoutEvent = function (event) {
    //Implement this method in the caller module
    $ironfyt.handleSaveWorkoutEvent(event);
  };

  $hl.eventListener('input', 'workout-name', enableSaveWorkoutBtn);
  $hl.eventListener('input', 'workout-description', enableSaveWorkoutBtn);
  $hl.eventListener('click', 'workout-form-helper-save-new-workout-btn', handleSaveWorkoutEvent);
})();
