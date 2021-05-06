(function () {
  'use strict';
  let workoutlogFormTemplate = function (props) {
    let workouts = props.workouts ? props.workouts : [];
    let workoutlog = props.workoutlog ? props.workoutlog : {};
    let wologdate = workoutlog && workoutlog.date ? $hl.formatDateForInputField(workoutlog.date) : '';
    let validationError = props.validationError ? props.validationError : {};
    return `
    <div class="container">
      <h1>Workout Log</h1>
      <form id="workout-log-form">
        <div>
          <label for="wolog-date">Date <span>*</span></label>
          <input type="date" name="wolog-date" id="wolog-date" value="${wologdate}" placeholder="Date">
          ${validationError.date ? `<div id="error-wolog-date">${validationError.date}</div>` : ``}
        </div>
        <div id="select-workout-btn-div">
          <button type="button" id="select-workout-btn">Select a Workout (If you want to attach an existing workout)</button>
        </div>
        <div id="selected-workout-div" style="display:none">
          <span id="unselect-workout">X</span>&nbsp;&nbsp;<span id="selected-workout-name-span"></span>
          <div id="selected-workout-detail-div" style="display:none"></div>
          <input type="hidden" id="wolog-workout-id" value="">
        </div>
        <div>
          <label for="wolog-duration">Duration</label>
          <input type="text" name="wolog-duration" id="wolog-duration" value="${workoutlog.duration ? workoutlog.duration : ''}" placeholder="30 min.">
        </div>
        <div>
          <label for="wolog-load">Load</label>
          <input type="text" name="wolog-load" id="wolog-load" value="${workoutlog.load ? workoutlog.load : ''}" placeholder="135 lbs.">
        </div>
        <div>
          <label for="wolog-rounds">Rounds</label>
          <input type="text" name="wolog-rounds" id="wolog-rounds" value="${workoutlog.rounds ? workoutlog.rounds : ''}" placeholder="5">
        </div>
        <div>
          <label for="wolog-modality">Modality</label><br/>
          <input type="checkbox" name="wolog-modality" value="m" ${workoutlog.modality && workoutlog.modality.indexOf('m') > -1 ? 'checked' : ''}> Metabolic Conditioning<br/>
          <input type="checkbox" name="wolog-modality" value="g" ${workoutlog.modality && workoutlog.modality.indexOf('g') > -1 ? 'checked' : ''}> Gymnastics<br/>
          <input type="checkbox" name="wolog-modality" value="w" ${workoutlog.modality && workoutlog.modality.indexOf('w') > -1 ? 'checked' : ''}> Weight Lifting
        </div>
        <div>
          <label for="wolog-location">Location</label>
          <input type="text" name="wolog-location" id="wolog-location" placeholder="Location" value="${workoutlog.location ? workoutlog.location : ''}">
        </div>
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
      workoutlog: {},
      user: {},
      workouts: [],
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogFormTemplate);
    },
    afterRender: function (props) {
      renderWorkoutInfo(props);
    },
  }));

  let renderWorkoutInfo = function (props) {
    let workouts = props && props.workouts ? props.workouts : [];
    let workoutlog = props && props.workoutlog ? props.workoutlog : {};
    let workout_id = workoutlog && workoutlog.workout_id ? workoutlog.workout_id : '';
    if (workout_id) {
      let workout = workouts.filter((workout) => workout._id === workout_id)[0];

      let selectWorkoutBtn = document.getElementById('select-workout-btn');
      selectWorkoutBtn.disabled = true;
      selectWorkoutBtn.style.display = 'none';

      let selectedWorkoutDiv = document.getElementById('selected-workout-div');
      selectedWorkoutDiv.style.display = 'block';
      let selectedWorkoutSpan = document.getElementById('selected-workout-name-span');
      selectedWorkoutSpan.innerHTML = workout.name;

      let wologWorkoutId = document.getElementById('wolog-workout-id');
      wologWorkoutId.value = workout._id;
    }
  };

  let handleWorkoutLogFormSubmitEvent = function (event) {
    event.preventDefault();
    let elements = document.querySelector('#workout-log-form').elements;
    let state = component.getState();

    // Create/update the workoutlog object
    let workoutlog = state.workoutlog ? state.workoutlog : {};
    let date = $hl.getDateObjFromHTMLDateInput(elements['wolog-date'].value);
    workoutlog.date = date instanceof Date && !isNaN(date) ? date : '';
    workoutlog.duration = elements['wolog-duration'].value.trim();
    workoutlog.load = elements['wolog-load'].value.trim();
    workoutlog.rounds = elements['wolog-rounds'].value.trim();
    workoutlog.notes = elements['wolog-notes'].value.trim();
    workoutlog.user_id = workoutlog.user_id ? workoutlog.user_id : state.user._id;
    workoutlog.modality = [];
    for (var i = 0; i < elements['wolog-modality'].length; i++) {
      if (elements['wolog-modality'][i].checked) workoutlog.modality.push(elements['wolog-modality'][i].value);
    }
    workoutlog.location = elements['wolog-location'].value.trim();
    workoutlog.workout_id = elements['wolog-workout-id'].value.trim();

    // Validate Form input
    let validationError = {};
    if (elements['wolog-date'].value === '') {
      validationError.date = 'Please enter a date for the log';
    }
    if (elements['wolog-duration'].value.trim() === '' && elements['wolog-load'].value.trim() === '' && elements['wolog-rounds'].value.trim() === '' && elements['wolog-notes'].value.trim() === '') {
      validationError.catchAll = 'Please enter a value in one of the fields or add notes.';
    }

    // Set the state
    component.setState({ workoutlog, validationError });

    // If there is no error then save the workout log
    if (JSON.stringify(validationError) === '{}') {
      $ironfyt.saveWorkoutLog(workoutlog, function (error, response) {
        $ironfyt.navigateToUrl('workoutlog.html');
      });
    }
  };

  let handleSelectWorkoutEvent = function (event) {
    let dialog = document.getElementById('select-workout-modal');
    dialog.style.display = 'block';

    let selectWorkoutBtn = document.getElementById('select-workout-btn');
    selectWorkoutBtn.disabled = true;
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

    let dialog = document.getElementById('select-workout-modal');
    dialog.style.display = 'none';

    let selectWorkoutBtn = document.getElementById('select-workout-btn');
    selectWorkoutBtn.disabled = true;
    selectWorkoutBtn.style.display = 'none';

    let selectedWorkoutDiv = document.getElementById('selected-workout-div');
    selectedWorkoutDiv.style.display = 'block';
    let selectedWorkoutSpan = document.getElementById('selected-workout-name-span');
    selectedWorkoutSpan.innerHTML = workout.name;

    let selectedWorkoutDetailDiv = document.getElementById('selected-workout-detail-div');
    selectedWorkoutDetailDiv.innerHTML = workout.description;

    let wologWorkoutId = document.getElementById('wolog-workout-id');
    wologWorkoutId.value = workout._id;
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
    let wologWorkoutId = document.getElementById('wolog-workout-id');
    wologWorkoutId.value = '';

    let selectedWorkoutDiv = document.getElementById('selected-workout-div');
    selectedWorkoutDiv.style.display = 'none';
    let selectedWorkoutSpan = document.getElementById('selected-workout-name-span');
    selectedWorkoutSpan.innerHTML = '';

    let selectWorkoutBtn = document.getElementById('select-workout-btn');
    selectWorkoutBtn.disabled = false;
    selectWorkoutBtn.style.display = 'block';
  };

  let toggleSelectedWorkoutDetailDisplay = function (event) {
    let div = document.getElementById('selected-workout-detail-div');

    div.style.display = div.style.display === 'none' ? 'block' : 'none';
  };

  $hl.eventListener('submit', 'workout-log-form', handleWorkoutLogFormSubmitEvent);
  $hl.eventListener('click', 'select-workout-btn', handleSelectWorkoutEvent);
  $hl.eventListener('click', 'close-workout-list-modal', handleCloseWorkoutListModalEvent);
  $hl.eventListener('click', 'unselect-workout', handleUnselectWorkoutEvent);
  $hl.eventListener('click', 'selected-workout-name-span', toggleSelectedWorkoutDetailDisplay);
  document.addEventListener('click', function (event) {
    let idregex = new RegExp(/^workout-([a-zA-Z]|\d){24}/gm);
    if (idregex.test(event.target.id)) {
      selectWorkout(event.target.id);
    }
  });

  document.addEventListener('click', function (event) {
    let idregex = new RegExp(/^show-detail-([a-zA-Z]|\d){24}/gm);
    if (idregex.test(event.target.id)) {
      showWorkoutDetail(event.target.id);
    }
  });

  ($ironfyt.workoutlogFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      let user = auth && auth.user ? auth.user : {};
      if (!error) {
        $ironfyt.getWorkouts({}, function (error, response) {
          if (!error) {
            let workouts = response && response.workouts ? response.workouts : [];
            let params = $hl.getParams();
            let _id = params && params._id ? params._id : false;
            if (_id) {
              $ironfyt.getWorkoutLogs({ _id }, function (error, response) {
                if (!error) {
                  let workoutlog = response.workoutlogs.length ? response.workoutlogs[0] : {};
                  component.setState({ workouts, workoutlog, user });
                } else {
                  component.setState({ error });
                }
              });
            } else {
              component.setState({ user, workouts });
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
