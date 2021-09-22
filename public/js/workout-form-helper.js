(function () {
  ('use strict');

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
    let enableTimecap = timecap.hour > 0 || timecap.minutes > 0 || timecap.seconds > 0;
    return `
    <input type="hidden" name="workout-id" id="workout-id" value="${workout._id ? workout._id : ''}">
    <div class="form-input-group margin-top-20px">
      <input type="text" class="form-input" name="workout-name" maxlength="30" id="workout-name" placeholder="Workout Name" value="${workout.name ? workout.name : ''}" required autofocus>
      <label for="workout-name" class="form-label">Workout Name</label>
    </div>
    <div class="form-flex-group margin-top-5px">
      <div class="form-flex-group block-with-border flex-auto">
        <div class="block-with-border-label">Type</div>
        <div class="form-input-group margin-top-10px">
          <select class="form-input" name="workout-type" id="workout-type">
            <option></option>
            <option ${workout.type && workout.type.toLowerCase() === 'for time' ? 'selected' : workout.type === null ? 'selected' : ''}>For Time</option>
            <option ${workout.type && workout.type.toLowerCase() === 'for load' ? 'selected' : ''}>For Load</option>
            <option ${workout.type && workout.type.toLowerCase() === 'amrap' ? 'selected' : ''}>AMRAP</option>
            <option ${workout.type && workout.type.toLowerCase() === 'for reps' ? 'selected' : ''}>For Reps</option>
            <option ${workout.type && workout.type.toLowerCase() === 'tabata' ? 'selected' : ''}>Tabata</option>
          </select>
        </div>
      </div>
      <div class="form-flex-group block-with-border margin-left-5px flex-auto">
        <div class="block-with-border-label">Time Cap</div>
        <div class="block-with-border-switch">
          <label class="switch small form-group-label">
            <input type="checkbox" id="workout-time-cap-switch" ${enableTimecap ? 'checked' : ''}/>
            <span class="slider small round"></span>
          </label>
        </div>
        <div class="form-flex-group margin-top-10px">
          <div class="form-input-group show-time-separator-right-3px">
            <input type="number" class="form-input duration-input margin-right-10px" name="workout-time-cap-hours" id="workout-time-cap-hours" min="0" max="240" placeholder="H" value="${timecap.hours ? timecap.hours : ''}" ${enableTimecap ? '' : 'disabled'} />
            <label for="workout-time-cap-hours" class="form-label duration-label">H</label>
          </div>
          <div class="form-input-group show-time-separator-right-3px">
            <input type="number" class="form-input duration-input margin-right-10px" name="workout-time-cap-minutes" id="workout-time-cap-minutes" min="0" max="59" placeholder="M" value="${timecap.minutes ? timecap.minutes : ''}" ${enableTimecap ? '' : 'disabled'}  />
            <label for="workout-time-cap-minutes" class="form-label duration-label">M</label>
          </div>
          <div class="form-input-group">
            <input type="number" class="form-input duration-input margin-right-0" name="workout-time-cap-seconds" id="workout-time-cap-seconds" min="0" max="59" placeholder="S" value="${timecap.seconds ? timecap.seconds : ''}" ${enableTimecap ? '' : 'disabled'}  />
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
            <input type="checkbox" id="workout-rounds-switch" ${workout.rounds ? 'checked' : ''}/>
            <span class="slider small round"></span>
          </label>
        </div>
        <div class="form-flex-group margin-top-10px">
          <div class="form-input-group">
            <input type="number" class="form-input" name="workout-rounds" id="workout-rounds" placeholder="Rounds" value="${workout.rounds ? workout.rounds : ''}" ${workout.rounds ? '' : 'disabled'}>    
            <label for="workout-rounds" class="form-label rounds-label">Rounds</label>
          </div>      
        </div>
      </div>
      <div class="form-flex-group block-with-border margin-left-5px flex-auto">
        <div class="block-with-border-label">Total Reps</div>
        <div class="block-with-border-switch">
          <label class="switch small form-group-label">
            <input type="checkbox" id="workout-total-reps-switch" ${workout.reps ? 'checked' : ''}/>
            <span class="slider small round"></span>
          </label>
        </div>
        <div class="form-flex-group margin-top-10px">
          <div class="form-input-group">
            <input type="number" class="form-input" name="workout-total-reps" id="workout-total-reps" placeholder="Reps" value="${workout.reps ? workout.reps : ''}" ${workout.reps ? '' : 'disabled'}>    
            <label for="workout-total-reps" class="form-label rounds-label">Reps</label>
          </div>      
        </div>
      </div>
    </div>
    <div class="form-flex-group margin-top-5px">
      <div class="form-input-group flex-auto">
        <textarea class="form-input" name="workout-description" id="workout-description" placeholder="Description" required>${workout.description ? workout.description : ''}</textarea>
        <label for="workout-description" class="form-label">Description</label>
      </div> 
    </div>
    <div class="form-flex-group margin-bottom-5px">
      <div class="form-input-group">
        <textarea class="form-input" name="workout-scaling" id="workout-scaling" placeholder="Scaling Options" ${workout.scalingdesc ? '' : 'disabled'}>${workout.scalingdesc ? workout.scalingdesc : ''}</textarea>
        <label for="workout-scaling" class="form-label">Scaling Options</label>
      </div>
      <label class="switch small form-group-label margin-left-5px">
        <input type="checkbox" id="workout-scaling-switch" ${workout.scalingdesc ? 'checked' : ''}/>
        <span class="slider small round"></span>
      </label>
    </div>
    <div class="form-flex-group margin-bottom-5px block-with-border">
      <div class="block-with-border-label">Modality</div>
      <div class="form-flex-group margin-top-5px">
        <label class="switch small">
          <input type="checkbox" id="workout-modality-m" name="workout-modality" value="m" ${workout.modality && workout.modality.indexOf('m') > -1 ? 'checked' : ''}/>
          <span class="slider small round"></span>
        </label>
        <div class="workout-modality-text">Cardio</div>
        <label class="switch small">
          <input type="checkbox" id="workout-modality-g" name="workout-modality" value="g" ${workout.modality && workout.modality.indexOf('g') > -1 ? 'checked' : ''}/>
          <span class="slider small round"></span>
        </label>
        <div class="workout-modality-text">Body Weight</div>
        <label class="switch small">
          <input type="checkbox" id="workout-modality-w" name="workout-modality" value="w" ${workout.modality && workout.modality.indexOf('w') > -1 ? 'checked' : ''}/>
          <span class="slider small round"></span>
        </label>
        <div class="workout-modality-text">Weights</div>
      </div>
    </div>
    <div class="submit-btn-bar margin-top-5px">
      <button type="button" id="workout-form-helper-save-new-workout-btn" class="submit-btn" ${workout.name && workout.description ? '' : 'disabled'}>Save Workout</button>
    </div>
    `;
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
    let workoutTotalRepsField = document.getElementById('workout-total-reps');
    let workoutScalingField = document.getElementById('workout-scaling');
    let workoutModality = document.getElementsByName('workout-modality');
    let workoutId = document.getElementById('workout-id');

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
    workout.user_id = user._id;
    workout._id = workoutId.value !== '' ? workoutId.value : null;

    workout.modality = [];
    for (var i = 0; i < workoutModality.length; i++) {
      if (workoutModality[i].checked) workout.modality.push(workoutModality[i].value);
    }

    $ironfyt.saveWorkout(workout, function (error, response) {
      callback(error, response);
    });
  };

  let handleSaveWorkoutEvent = function (event) {
    //Implement this method in the caller module
    $ironfyt.handleSaveWorkoutEvent(event);
  };

  $hl.eventListener('input', 'workout-name', enableSaveWorkoutBtn);
  $hl.eventListener('input', 'workout-description', enableSaveWorkoutBtn);
  $hl.eventListener('click', 'workout-time-cap-switch', toggleWorkoutTimeCapFields);
  $hl.eventListener('click', 'workout-rounds-switch', toggleWorkoutRoundsFields);
  $hl.eventListener('click', 'workout-total-reps-switch', toggleWorkoutTotalRepsFields);
  $hl.eventListener('click', 'workout-scaling-switch', toggleWorkoutScalingFields);
  $hl.eventListener('click', 'workout-form-helper-save-new-workout-btn', handleSaveWorkoutEvent);
})();
