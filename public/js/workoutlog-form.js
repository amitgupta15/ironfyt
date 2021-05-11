(function () {
  'use strict';

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
  let workoutlogFormTemplate = function (props) {
    let workouts = props.workouts ? props.workouts : [];
    let workoutlog = props.workoutlog ? props.workoutlog : newWorkoutLog;
    let wologdate = workoutlog && workoutlog.date ? $hl.formatDateForInputField(workoutlog.date) : '';
    let validationError = props.validationError ? props.validationError : {};
    let workout = workoutlog.workout && workoutlog.workout instanceof Array ? workoutlog.workout[0] : false;
    return `
    <div class="container">
      <h1>Workout Log</h1>
      <form id="workout-log-form">
        <div>
          <label for="wolog-date">Date <span>*</span></label>
          <input type="date" name="wolog-date" id="wolog-date" value="${wologdate}" placeholder="Date">
          ${validationError.date ? `<div id="error-wolog-date">${validationError.date}</div>` : ``}
        </div>
        ${
          workout
            ? `<div>
                <span id="unselect-workout">X</span>&nbsp;&nbsp;<span id="selected-workout-name-span">${workout.name}</span>
                <div id="selected-workout-detail-div" style="display:none">${workout.description}</div>
                </div>`
            : `<div>
            <button type="button" id="select-workout-btn">Select a Workout (If you want to attach an existing workout)</button>
            </div>`
        }
        <input type="hidden" id="wolog-workout-id" value="${workout ? workout._id : ''}">
        <br/>
        <div>
          <fieldset>
            <legend>Duration</legend>
            <label for="wolog-duration-hours">Hours</label>
            <input type="number" name="wolog-duration-hours" id="wolog-duration-hours" min="0" max="240" value="${workoutlog.duration && workoutlog.duration.hours ? workoutlog.duration.hours : ''}" placeholder="Hr">
            <label for="wolog-duration-minutes">Minutes</label>
            <input type="number" name="wolog-duration-minutes" id="wolog-duration-minutes" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.minutes ? workoutlog.duration.minutes : ''}" placeholder="Min.">
            <label for="wolog-duration-seconds">Seconds</label>
            <input type="number" name="wolog-duration-seconds" id="wolog-duration-seconds" min="0" max="59" value="${workoutlog.duration && workoutlog.duration.seconds ? workoutlog.duration.seconds : ''}" placeholder="Secs.">
          </fieldset>
        </div>
        <br/>
        <div>
          <div>
            <p>Rounds & Load</p>
            ${
              workoutlog.roundinfo
                ? workoutlog.roundinfo
                    .map(function (item, index) {
                      return `
              <fieldset>
                ${index > 0 ? `<button type="button" id="delete-round-info-${index}">Delete</button>` : `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`}
                <label for="wolog-rounds-${index}">Rounds</label>
                <input type="number" name="wolog-rounds-${index}" id="wolog-rounds-${index}" value="${item.rounds ? item.rounds : ''}" placeholder="Rounds">
                <label for="wolog-load-${index}">Load</label>
                <input type="number" name="wolog-load-${index}" id="wolog-load-${index}" value="${item.load ? item.load : ''}" placeholder="Load">
                <label for="wolog-reps-${index}">Reps</label>
                <input type="number" name="wolog-reps-${index}" id="wolog-reps-${index}" value="${item.reps ? item.reps : ''}" placeholder="Reps">
                <label for="wolog-unit-${index}">Unit</label>
                <select name="wolog-unit-${index}" id="wolog-unit-${index}">
                  <option value=""> </option>
                  <option value="lbs" ${item.unit === 'lbs' ? 'selected' : ''}>lbs</option>
                  <option value="kgs" ${item.unit === 'kgs' ? 'selected' : ''}>kgs</option>
                  <option value="pood" ${item.unit === 'pood' ? 'selected' : ''}>pood</option>
                </select>
              </fieldset>`;
                    })
                    .join('')
                : ''
            }
            
          </div>
          <button type="button" id="add-new-round-info">Add More Rounds</button>
        </div>
        <br/>
        <div>
        <fieldset>
          <legend>Modality</legend>
          <label for="wolog-modality-m">Metabolic Conditioning</label>
          <input type="checkbox" id="modality-m" name="wolog-modality" value="m" ${workoutlog.modality && workoutlog.modality.indexOf('m') > -1 ? 'checked' : ''}>
          <label for="wolog-modality-g">Gymnastics</label>
          <input type="checkbox" id="modality-g" name="wolog-modality" value="g" ${workoutlog.modality && workoutlog.modality.indexOf('g') > -1 ? 'checked' : ''}>
          <label for="wolog-modality-w">Weight Lifting</label>
          <input type="checkbox" id="modality-w" name="wolog-modality" value="w" ${workoutlog.modality && workoutlog.modality.indexOf('w') > -1 ? 'checked' : ''}>
        </fieldset>
        </div>
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
    </div>
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
      $ironfyt.saveWorkoutLog(workoutlog, function (error, response) {
        if (error) {
          console.error(error);
        } else {
          $ironfyt.navigateToUrl('workoutlogs.html');
        }
      });
    } else {
      component.setState({ workoutlog, validationError });
    }
  };

  let handleSelectWorkoutEvent = function (event) {
    let selectWorkoutBtn = document.getElementById('select-workout-btn');
    selectWorkoutBtn.disabled = true;
    // Get the current state of the form to save the intermediate state
    let workoutlog = createWorkoutLogObjFromFormElements();
    $ironfyt.getWorkouts({}, function (error, response) {
      if (!error) {
        let workouts = response && response.workouts ? response.workouts : [];
        component.setState({ workouts });

        let selectWorkoutBtn = document.getElementById('select-workout-btn');
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

    let selectWorkoutBtn = document.getElementById('select-workout-btn');
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

  let toggleSelectedWorkoutDetailDisplay = function (event) {
    let div = document.getElementById('selected-workout-detail-div');

    div.style.display = div.style.display === 'none' ? 'block' : 'none';
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
  $hl.eventListener('click', 'select-workout-btn', handleSelectWorkoutEvent);
  $hl.eventListener('click', 'close-workout-list-modal', handleCloseWorkoutListModalEvent);
  $hl.eventListener('click', 'unselect-workout', handleUnselectWorkoutEvent);
  $hl.eventListener('click', 'selected-workout-name-span', toggleSelectedWorkoutDetailDisplay);
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
        if (_id) {
          $ironfyt.getWorkoutLogs({ _id }, function (error, response) {
            if (!error) {
              let workoutlog = response.workoutlogs.length ? response.workoutlogs[0] : newWorkoutLog;
              component.setState({ workoutlog, user });
            } else {
              component.setState({ error });
            }
          });
        } else {
          component.setState({ user });
        }
      } else {
        component.setState({ error });
      }
    });
  })();
})();
