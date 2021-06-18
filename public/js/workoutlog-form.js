(function () {
  ('use strict');

  // Default roundinfo object
  let newRoundInfo = {
    rounds: null,
    load: null,
    unit: null,
    reps: null,
  };
  // Default workout log
  let newWorkoutLog = {
    date: new Date(),
    workout_id: null,
    user_id: null,
    duration: {
      hour: null,
      minutes: null,
      seconds: null,
    },
    roundinfo: [newRoundInfo],
    modality: [],
    location: null,
    notes: null,
  };
  let selectedWorkoutTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    return `
    <div class="flex block-with-border margin-bottom-15px">
      <button type="button" id="unselect-workout"></button>
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
    </div>`;
  };

  let workoutlogFormTemplate = function (props) {
    let workouts = props.workouts ? props.workouts : [];
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let wologdate = workoutlog && workoutlog.date ? $hl.formatDateForInputField(workoutlog.date) : '';
    let validationError = props.validationError ? props.validationError : {};
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    return `
    <form id="workout-log-form" class="form-container" autocomplete="off">
      <div class="form-flex-group margin-bottom-15px">
        <div class="form-input-group flex-width-100">
          <input type="date" name="wolog-date" id="wolog-date" value="${wologdate}" placeholder="Date" class="form-input"/>
          <label for="wolog-date" class="form-label date-label">Date</label>
        </div>
        ${validationError.date ? `<div id="error-wolog-date">${validationError.date}</div>` : ``}
      </div>
      ${workout ? selectedWorkoutTemplate(props) : `<div class="margin-bottom-15px"><button type="button" id="select-workout-btn-wolog">Select or Create a Workout</button></div>`}
      <input type="hidden" id="wolog-workout-id" value="${workout ? workout._id : ''}">
      <div class="form-flex-group margin-bottom-15px block-with-border">
        <div class="block-with-border-label">Modality</div>
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
      

      <div class="form-flex-group margin-bottom-15px">
        <div class="form-group-label">Time</div>
        <div class="form-flex-group">
          <div class="form-input-group show-time-separator">
            <input type="number" class="form-input duration-input" name="wolog-duration-hours" id="wolog-duration-hours" min="0" max="240" value="${workoutlog.duration && workoutlog.duration.hours ? workoutlog.duration.hours : ''}" placeholder="H">
            <label for="wolog-duration-hours" class="form-label duration-label">H</label>
          </div>
          <div class="form-input-group show-time-separator">
            <input type="number" class="form-input duration-input" name="wolog-duration-minutes" id="wolog-duration-minutes" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.minutes ? workoutlog.duration.minutes : ''}" placeholder="M">
            <label for="wolog-duration-minutes" class="form-label duration-label">M</label>
          </div>
          <div class="form-input-group">
            <input type="number" class="form-input duration-input" name="wolog-duration-seconds" id="wolog-duration-seconds" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.seconds ? workoutlog.duration.seconds : ''}" placeholder ="S">
            <label for="wolog-duration-seconds" class="form-label duration-label">S</label>
          </div>
        </div>
      </div>
      <div class="form-flex-group margin-bottom-15px">
        <!--div class="form-group-label">Rounds</div-->
        <div>
          <div>
         ${
           workoutlog.roundinfo
             ? workoutlog.roundinfo
                 .map(function (item, index) {
                   return `
          <div class="form-flex-group margin-bottom-15px">
            <div class="form-input-group">
              <input type="number" class="form-input rounds-input" name="wolog-rounds-${index}" id="wolog-rounds-${index}" value="${item.rounds ? item.rounds : ''}" placeholder="Rounds">    
              <label for="wolog-rounds-${index}" class="form-label rounds-label">Rounds</label>
            </div>      
            <div class="form-input-group">
              <input type="number" class="form-input rounds-input" name="wolog-reps-${index}" id="wolog-reps-${index}" value="${item.reps ? item.reps : ''}" placeholder="Reps">
              <label for="wolog-reps-${index}" class="form-label rounds-label">Reps</label>
            </div>
            <div class="form-input-group">  
              <input type="number" class="form-input rounds-input" name="wolog-load-${index}" id="wolog-load-${index}" value="${item.load ? item.load : ''}" placeholder="Load">
              <label for="wolog-load-${index}" class="form-label rounds-label">Load</label>
            </div>
            <div class="form-input-group">
              <label for="wolog-unit-${index}" class="form-label hide-view">Unit</label>
              <select class="form-input" name="wolog-unit-${index}" id="wolog-unit-${index}">
                <option value="lbs" ${item.unit === 'lbs' ? 'selected' : ''}>lbs</option>
                <option value="kgs" ${item.unit === 'kgs' ? 'selected' : ''}>kgs</option>
                <option value="pood" ${item.unit === 'pood' ? 'selected' : ''}>pood</option>
              </select>
            </div>
            <div>${index > 0 ? `<button type="button" class="wolog-form-delete-btn" id="delete-round-info-${index}">X</button>` : ``}</div>
          </div>
           `;
                 })
                 .join('')
             : ''
         }
        <button type="button" id="add-new-round-info">Add More Rounds</button>
      </div>
        </div>
      </div>
      
      <br/>
      <br/>
      <div>
        <label for="wolog-location">Location</label>
        <input type="text" name="wolog-location" id="wolog-location" placeholder="Location" value="${workoutlog.location ? workoutlog.location : ''}">
      </div>
      <br/>
      <div>
        <label for="wolog-notes">Notes</label>
        <textarea row=3 col=12 name="wolog-notes" id="wolog-notes" placeholder="Notes">${workoutlog.notes ? workoutlog.notes : ''}</textarea>
        ${validationError.catchAll ? `<div id="error-catch-all">${validationError.catchAll}` : ''}
      </div>
      <div>
        <button type="submit" id="submit-wolog">Save</button>
        <button type="button" id="cancel-submit-wolog" onclick="window.history.back()">Cancel</button>
      </div>
    </form>
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
    </div>
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
  }));

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
    for (var i = 0; i < workoutlog.roundinfo.length; i++) {
      let rounds = parseInt(elements[`wolog-rounds-${i}`].value);
      let load = parseInt(elements[`wolog-load-${i}`].value);
      let reps = parseInt(elements[`wolog-reps-${i}`].value);
      let unit = elements[`wolog-unit-${i}`].value;
      roundinfo.push({ rounds, load, reps, unit });
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

  let handleAddNewRoundInfoEvent = function (event) {
    let workoutlog = createWorkoutLogObjFromFormElements();
    workoutlog.roundinfo.push(newRoundInfo);
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

  $hl.eventListener('submit', 'workout-log-form', handleWorkoutLogFormSubmitEvent);
  $hl.eventListener('click', 'select-workout-btn-wolog', handleSelectWorkoutEvent);
  $hl.eventListener('click', 'close-workout-list-modal', handleCloseWorkoutListModalEvent);
  $hl.eventListener('click', 'unselect-workout', handleUnselectWorkoutEvent);
  $hl.eventListener('click', 'add-new-round-info', handleAddNewRoundInfoEvent);
  document.addEventListener('click', function (event) {
    let selectWorkoutRegex = new RegExp(/^workout-([a-zA-Z]|\d){24}/gm);
    if (selectWorkoutRegex.test(event.target.id)) {
      selectWorkout(event.target.id);
    }

    let showWorkoutDetailRegex = new RegExp(/^show-detail-([a-zA-Z]|\d){24}/gm);
    if (showWorkoutDetailRegex.test(event.target.id)) {
      showWorkoutDetail(event.target.id);
    }

    let deleteRoundInfoRegex = new RegExp(/^delete-round-info-\d+/gm);
    if (deleteRoundInfoRegex.test(event.target.id)) {
      deleteRoundInfo(event.target.id);
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
