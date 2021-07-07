(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlog-form.js Tests');

  let component = $ironfyt.workoutlogFormComponent;
  let page = $ironfyt.workoutlogFormPage;

  $test.it('should create a workoutlogformComponent', function () {
    $test.assert(Object.keys(component.state).length === 7);
    $test.assert('error' in component.state);
    $test.assert('validationError' in component.state);
    $test.assert('user' in component.state);
    $test.assert('workoutlog' in component.state);
    $test.assert('workouts' in component.state);
    $test.assert('pageTitle' in component.state);
    $test.assert('movements' in component.state);
    $test.assert(component.selector === '[data-app=workoutlog-form]');
  });

  $test.it('should not allow unauthorized users to add a log', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('error occurred');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'error occurred');
  });

  $test.it('should only allow authorized users to add a log', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: 1 } });
    };
    page();
    let state = component.getState();
    $test.assert(state.error === '');
    $test.assert(state.user._id === 1);
    $test.assert(state.pageTitle === 'New Log');
  });

  $test.it('should handle invalid form data', function () {
    component.setState({ workoutlog: {} });
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ workoutlog: { movements: [{ _id: '1', movement: 'squat' }], roundinfo: [{ rounds: null, load: null, unit: null }] } });
    let form = document.querySelector('#workout-log-form');
    // Component sets the default date to today's date. Overwriting the default date here to generate an error
    form.elements['wolog-date'].value = '';
    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    let state = component.getState();
    $test.assert(state.validationError.date === 'Please enter a date for the log');
    $test.assert(state.validationError.catchAll === 'Please enter a value in one of the fields or add notes.');
  });

  $test.it('should handle valid form data', function () {
    component.setState({ workoutlog: {} });
    let _workoutlog, _url;
    $ironfyt.saveWorkoutLog = function (workoutlog, callback) {
      _workoutlog = workoutlog;
      callback();
    };

    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});
    let form = document.querySelector('#workout-log-form');

    form.elements['wolog-date'].value = '2020-01-01';
    form.elements['wolog-notes'].value = 'Some notes';

    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    let state = component.getState();
    $test.assert(state.validationError === '');
    $test.assert($hl.formatDateForInputField(_workoutlog.date) === '2020-01-01');
    $test.assert(_workoutlog.notes === 'Some notes');
    $test.assert(_url === 'workoutlogs.html?ref=workoutlog-form.html');

    $hl.getParams = function () {
      return { ref: 'workoutlog-calendar.html', user_id: '123456789012345678901234' };
    };
    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    $test.assert(_url === 'workoutlog-calendar.html?ref=workoutlog-form.html&user_id=123456789012345678901234&year=2020&month=0&date=1');
  });

  $test.it('should show search workout dialog when select-workout-btn-wolog is clicked', function () {
    component.setState({ workoutlog: {} });
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
    $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
    $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="select-workout-modal"'));
    $test.assert(selector.innerHTML.includes('<button type="button" id="select-workout-btn-wolog" disabled="">'));
    $test.assert(document.getElementById('wolog-workout-id').value === '');
  });

  $test.it('should close the search workout dialog when close button is clicked', function () {
    component.setState({ workoutlog: {} });
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});

    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
    $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
    $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="select-workout-modal">'));
    $test.dispatchHTMLEvent('click', '#close-workout-list-modal-btn');
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
  });

  $test.it('should show available workouts and let the user select a workout when searching for a workout - auto-complete', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '6070f1035b7f1e4066cb9450' } });
    };
    $ironfyt.getWorkouts = function (params, callback) {
      callback(false, {
        workouts: [
          { _id: 1, name: 'Chest & Back', description: 'Do 100 push-ups' },
          { _id: 2, name: 'DT', description: '155lb deadlift' },
          { _id: 3, name: 'Fran', description: '21-15-9 Pull-ups and Thrusters' },
        ],
      });
    };
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});

    //Dispatch the following event to trigger getWorkouts api call
    $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');

    let state = component.getState();
    $test.assert(state.workouts.length === 3);
    let searchWorkoutField = document.querySelector('#search-workout');
    searchWorkoutField.value = 'fr';
    $test.dispatchHTMLEvent('input', '#search-workout');
    $test.assert(selector.innerHTML.includes('<div><strong>Fr</strong>an</div>'));

    searchWorkoutField.value = 'dt';
    $test.dispatchHTMLEvent('input', '#search-workout');
    $test.assert(selector.innerHTML.includes('Found 1 Workouts'));
    $test.assert(selector.innerHTML.includes('<div><strong>DT</strong></div>'));

    $test.dispatchHTMLEvent('click', '#select-workout-from-search-result-btn-1');
    state = component.getState();
    $test.assert(state.workoutlog.workout[0]._id === 2);
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">')); //removed the 'show-view' class from the modal
  });

  $test.it('should copy round/load info block while preserving the form state', function () {
    component.setState({ workoutlog: { roundinfo: [{ rounds: null, load: null, unit: null }] } });

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    let form = document.querySelector('#workout-log-form');
    form.elements['wolog-date'].value = '2021-05-07';
    form.elements['wolog-rounds-0'].value = '5';
    form.elements['wolog-load-0'].value = '135';
    form.elements['wolog-unit-0'].value = 'lbs';

    $test.dispatchHTMLEvent('click', '#copy-round-info-0');
    let workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.roundinfo.length === 2);
    $test.assert(workoutlog.roundinfo[1].rounds === 5);
    $test.assert(workoutlog.roundinfo[1].load === 135);
    $test.assert(workoutlog.roundinfo[1].unit === 'lbs');
    $test.assert($hl.formatDateForInputField(workoutlog.date) === '2021-05-07');
  });

  $test.it('should remove round/load info block while preserving the form state', function () {
    component.setState({ workoutlog: { roundinfo: [{ rounds: null, load: null, unit: null }] } });
    let roundinfo = [
      { rounds: 0, reps: 0, load: 0, unit: null },
      { rounds: 0, reps: 0, load: 0, unit: null },
    ];
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ workoutlog: { roundinfo } });
    $test.dispatchHTMLEvent('click', '#delete-round-info-1');

    let workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.roundinfo.length === 1);
  });

  $test.it('should fetch workouts when "select workout" button is clicked', function () {
    component.setState({ workoutlog: { roundinfo: [{ rounds: null, load: null, unit: null }] } });
    $ironfyt.getWorkouts = function (filter, callback) {
      callback(false, {
        workouts: [
          { _id: 1, name: 'Workout 1' },
          { _id: 2, name: 'Workout 2' },
        ],
      });
    };
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});
    let state = component.getState();
    $test.assert(state.workouts.length === 0);
    $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
    state = component.getState();
    $test.assert(state.workouts.length === 2);
  });

  $test.it('should accept and validate date and user_id url param', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '6070f1035b7f1e4066cb9450' } });
    };
    let getWorkoutLogsCalled = false;
    $ironfyt.getWorkoutLogs = function (filter, callback) {
      getWorkoutLogsCalled = true;
    };
    $hl.getParams = function () {
      return { date: '2021-05-28T07:00:00.000', user_id: '6070f1035b7f1e4066cb9450' };
    };
    page();
    $test.assert(getWorkoutLogsCalled === false); // Because no _id provided in the url params, so no workoutlog is being fetched.
    let state = component.getState();
    $test.assert(state.workoutlog.date === '2021-05-28T07:00:00.000');
    $test.assert(state.workoutlog.user_id === '6070f1035b7f1e4066cb9450');
    $test.assert(state.pageTitle === 'New Log');
  });

  $test.it("should not let a non-admin user edit another user's workout log", function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '6070f1035b7f1e4066cb9450' } });
    };
    // log is for a different user from the one logged in.
    $ironfyt.getWorkoutLogs = function (params, callback) {
      if (params._id === '60a42872175ed060322c0183') {
        callback(false, { workoutlogs: [{ _id: '60a42872175ed060322c0183', user: { _id: '123456789012345678901234' } }] });
      }
    };

    $hl.getParams = function () {
      return { date: '2021-05-28T07:00:00.000', user_id: '123456789012345678901234' };
    };
    page();
    let state = component.getState();
    $test.assert(state.error.message === 'You cannot edit a workout log for another user!');
    component.setState({ error: '' });
    $hl.getParams = function () {
      return { _id: '60a42872175ed060322c0183' };
    };
    page();
    state = component.getState();
    $test.assert(state.error.message === 'Sorry, either no log found or you are not authorized to edit the log');
  });

  $test.it("should let an admin edit another user's workout log", function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '6070f1035b7f1e4066cb9450', role: 'admin' } });
    };

    $hl.getParams = function () {
      return { date: '2021-05-28T07:00:00.000', user_id: '123456789012345678901234' };
    };
    page();
    let state = component.getState();
    $test.assert(state.workoutlog.date === '2021-05-28T07:00:00.000');
    $test.assert(state.workoutlog.user_id === '123456789012345678901234');
    $test.assert(state.pageTitle === 'New Log');
  });

  $test.it('should set the status of duration switch and enable/disable duration fields based on duration data', function () {
    let selector = document.querySelector('#selector');
    let state = { error: '' };
    component.setState(state);
    selector.innerHTML = component.template(state);
    component.afterRender(state);
    let durationSwitch = document.getElementById('duration-switch');
    let hourInput = document.querySelector('#wolog-duration-hours');
    let minuteInput = document.querySelector('#wolog-duration-minutes');
    let secondInput = document.querySelector('#wolog-duration-seconds');
    $test.assert(durationSwitch.checked === false);
    $test.assert(hourInput.disabled === true);
    $test.assert(minuteInput.disabled === true);
    $test.assert(secondInput.disabled === true);

    state = { error: '', workoutlog: { duration: { hours: null, minutes: 30, seconds: null } } };
    component.afterRender(state);
    $test.assert(durationSwitch.checked === true);
    $test.assert(hourInput.disabled === false);
    $test.assert(minuteInput.disabled === false);
    $test.assert(secondInput.disabled === false);

    durationSwitch.checked = false;
    $test.dispatchHTMLEvent('click', '#duration-switch');
    $test.assert(hourInput.disabled === true);
    $test.assert(hourInput.value === '');
    $test.assert(minuteInput.disabled === true);
    $test.assert(minuteInput.value === '');
    $test.assert(secondInput.disabled === true);
    $test.assert(secondInput.value === '');

    component.setState({ error: '', workoutlog: { duration: { hours: 10, minutes: 20, seconds: 30 } } });
    durationSwitch.checked = true;
    $test.dispatchHTMLEvent('click', '#duration-switch');
    $test.assert(hourInput.disabled === false);
    $test.assert(hourInput.value === '10');
    $test.assert(minuteInput.disabled === false);
    $test.assert(minuteInput.value === '20');
    $test.assert(secondInput.disabled === false);
    $test.assert(secondInput.value === '30');
  });

  $test.it('should set the status of rounds switch and enable/disable rounds fields based on rounds data', function () {
    let selector = document.querySelector('#selector');
    let state = { error: '' };
    component.setState(state);
    selector.innerHTML = component.template(state);
    component.afterRender(state);
    let roundsSwitch = document.getElementById('rounds-switch');
    let roundsInputField = document.querySelector('#wolog-rounds-0');
    let loadInputField = document.querySelector('#wolog-load-0');
    let unitSelect = document.querySelector('#wolog-unit-0');
    $test.assert(roundsSwitch.checked === false);
    $test.assert(unitSelect.disabled === true);
    $test.assert(roundsInputField.disabled === true);
    $test.assert(loadInputField.disabled === true);

    state = { error: '', workoutlog: { roundinfo: [{ rounds: 1, load: 30, unit: 'lbs' }] } };
    component.setState(state);
    component.afterRender(state);
    $test.assert(roundsSwitch.checked === true);
    $test.assert(unitSelect.disabled === false);
    $test.assert(roundsInputField.disabled === false);
    $test.assert(loadInputField.disabled === false);

    roundsSwitch.checked = false;
    $test.dispatchHTMLEvent('click', '#rounds-switch');
    $test.assert(unitSelect.disabled === true);
    $test.assert(unitSelect.value === '');
    $test.assert(roundsInputField.disabled === true);
    $test.assert(roundsInputField.value === '');
    $test.assert(loadInputField.disabled === true);
    $test.assert(loadInputField.value === '');

    component.setState({ error: '', workoutlog: { roundinfo: [{ rounds: 1, load: 30, unit: 'lbs' }] } });
    roundsSwitch.checked = true;
    $test.dispatchHTMLEvent('click', '#rounds-switch');
    $test.assert(unitSelect.disabled === false);
    $test.assert(unitSelect.value === 'lbs');
    $test.assert(roundsInputField.disabled === false);
    $test.assert(roundsInputField.value === '1');
    $test.assert(loadInputField.disabled === false);
    $test.assert(loadInputField.value === '30');
  });

  $test.it('should set the status of location switch and enable/disable location field based on location data', function () {
    let selector = document.querySelector('#selector');
    let state = { error: '' };
    component.setState(state);
    selector.innerHTML = component.template(state);
    component.afterRender(state);
    let locationSwitch = document.getElementById('location-switch');
    let locationInputField = document.querySelector('#wolog-location');
    $test.assert(locationSwitch.checked === false);
    $test.assert(locationInputField.disabled === true);

    state = { error: '', workoutlog: { location: 'Home Gym' } };
    component.setState(state);
    component.afterRender(state);
    $test.assert(locationSwitch.checked === true);
    $test.assert(locationInputField.disabled === false);

    locationSwitch.checked = false;
    $test.dispatchHTMLEvent('click', '#location-switch');
    $test.assert(locationInputField.disabled === true);
    $test.assert(locationInputField.value === '');

    locationSwitch.checked = true;
    $test.dispatchHTMLEvent('click', '#location-switch');
    $test.assert(locationInputField.disabled === false);
    $test.assert(locationInputField.value === 'Home Gym');
  });

  $test.it('should set the status of notes switch and enable/disable notes field based on notes data', function () {
    let selector = document.querySelector('#selector');
    let state = { error: '' };
    component.setState(state);
    selector.innerHTML = component.template(state);
    component.afterRender(state);
    let notesSwitch = document.getElementById('notes-switch');
    let notesInputField = document.querySelector('#wolog-notes');
    $test.assert(notesSwitch.checked === false);
    $test.assert(notesInputField.disabled === true);

    state = { error: '', workoutlog: { notes: 'Do better next time' } };
    component.setState(state);
    component.afterRender(state);
    $test.assert(notesSwitch.checked === true);
    $test.assert(notesInputField.disabled === false);

    notesSwitch.checked = false;
    $test.dispatchHTMLEvent('click', '#notes-switch');
    $test.assert(notesInputField.disabled === true);
    $test.assert(notesInputField.value === '');

    notesSwitch.checked = true;
    $test.dispatchHTMLEvent('click', '#notes-switch');
    $test.assert(notesInputField.disabled === false);
    $test.assert(notesInputField.value === 'Do better next time');
  });

  $test.it('should set the status of movements switch and enable/disable movement fields based on movements data', function () {
    let selector = document.querySelector('#selector');
    let state = { error: '' };
    selector.innerHTML = component.template(state);
    let movementSwitch = document.getElementById('movement-switch');
    let addMovementTextField = document.querySelector('#wolog-add-movement');
    let movementAddButton = document.querySelector('#wolog-movement-add-btn');

    $test.assert(addMovementTextField.disabled === true);
    $test.assert(addMovementTextField.disabled === true);
    $test.assert(movementAddButton.style.display === '');

    // Simulate checking the movement checkbox
    movementSwitch.checked = true;
    $test.dispatchHTMLEvent('click', '#movement-switch');
    $test.assert(movementSwitch.checked === true);
    $test.assert(addMovementTextField.disabled === false);
    $test.assert(movementAddButton.style.display === 'block');

    // Simulate unchecking the movement checkbox
    movementSwitch.checked = false;
    $test.dispatchHTMLEvent('click', '#movement-switch');
    $test.assert(movementSwitch.checked === false);
    $test.assert(addMovementTextField.disabled === true);
    $test.assert(movementAddButton.style.display === 'none');

    component.setState({ workoutlog: { movements: [{ _id: 1, movement: 'Bench Press' }] } });
    state = component.getState();
    component.afterRender(state);
    $test.assert(movementSwitch.checked);
    $test.assert(addMovementTextField.disabled === false);
    $test.assert(movementAddButton.style.display === 'block');
  });

  $test.it('should show available movements when adding a movement - auto-complete', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '6070f1035b7f1e4066cb9450' } });
    };
    $ironfyt.getMovements = function (params, callback) {
      callback(false, {
        movements: [
          { _id: 1, movement: 'Back Squat' },
          { _id: 2, movement: 'Bench Press' },
          { _id: 3, movement: 'Squat' },
        ],
      });
    };
    page();
    let state = component.getState();
    $test.assert(state.movements.length === 3);

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);
    component.afterRender(state);
    let addMovementField = document.querySelector('#wolog-add-movement');
    addMovementField.value = 'b';
    $test.dispatchHTMLEvent('input', '#wolog-add-movement');
    $test.assert(selector.innerHTML.includes('<div id="movement-list-item-0"><strong>B</strong>ack Squat</div><div id="movement-list-item-1"><strong>B</strong>ench Press</div>'));
    addMovementField.value = 'sq';
    $test.dispatchHTMLEvent('input', '#wolog-add-movement');
    $test.assert(selector.innerHTML.includes('<div id="movement-list-item-0">Back <strong>Sq</strong>uat</div><div id="movement-list-item-2"><strong>Sq</strong>uat</div>'));

    $test.dispatchHTMLEvent('click', '#movement-list-item-0');
    $test.assert(addMovementField.value === 'Back Squat');
    $test.assert(document.getElementById('selected-movement-index').value === '0');
  });

  $test.it('should add movement to the log when the add button is clicked', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '6070f1035b7f1e4066cb9450' } });
    };
    $ironfyt.getMovements = function (params, callback) {
      callback(false, {
        movements: [
          { _id: 1, movement: 'Back Squat' },
          { _id: 2, movement: 'Bench Press' },
          { _id: 3, movement: 'Squat' },
        ],
      });
    };
    page();
    let state = component.getState();
    $test.assert(state.movements.length === 3);

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);
    component.afterRender(state);
    let addMovementField = document.querySelector('#wolog-add-movement');
    addMovementField.value = 'sq';
    $test.dispatchHTMLEvent('input', '#wolog-add-movement');
    $test.dispatchHTMLEvent('click', '#movement-list-item-0');
    $test.assert(addMovementField.value === 'Back Squat');
    $test.assert(document.getElementById('selected-movement-index').value === '0');
    $test.dispatchHTMLEvent('click', '#wolog-movement-add-btn');
    state = component.getState();
    $test.assert(state.workoutlog.movements[0]._id === 1);
    $test.assert(state.workoutlog.movements[0].movement === 'Back Squat');
    $test.assert(addMovementField.value === '');

    addMovementField.value = 'Deadlift'; //this is not in the list
    $test.dispatchHTMLEvent('click', '#wolog-movement-add-btn');
    state = component.getState();
    $test.assert(state.workoutlog.movements[1].hasOwnProperty('_id') === false);
    $test.assert(state.workoutlog.movements[1].movement === 'Deadlift');
    $test.assert(addMovementField.value === '');
  });

  $test.it('should copy movement block while preserving the form state', function () {
    let state = { workoutlog: { movements: [{ movement: 'Clean', reps: 10, load: 135, unit: 'lbs' }] } };
    component.setState(state);

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);

    $test.dispatchHTMLEvent('click', '#copy-movement-0');
    let workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements.length === 2);
    $test.assert(workoutlog.movements[1].movement === 'Clean');
    $test.assert(workoutlog.movements[1].reps === 10);
    $test.assert(workoutlog.movements[1].load === 135);
    $test.assert(workoutlog.movements[1].unit === 'lbs');
  });

  $test.it('should remove movement block while preserving the form state', function () {
    let state = {
      workoutlog: {
        movements: [
          { movement: 'Clean', reps: null, load: null, unit: null },
          { movement: 'Clean', reps: null, load: null, unit: null },
        ],
      },
    };
    component.setState(state);

    let workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements.length === 2);

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);
    $test.dispatchHTMLEvent('click', '#delete-movement-0');

    workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements.length === 1);

    $test.dispatchHTMLEvent('click', '#delete-movement-0');
    workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements.length === 0);
  });

  $test.it('should set the status of total reps switch and enable/disable wolog-total-reps field based on totalreps data', function () {
    let selector = document.querySelector('#selector');
    let state = { error: '' };
    component.setState(state);
    selector.innerHTML = component.template(state);
    component.afterRender(state);
    let totalRepsSwitch = document.getElementById('total-reps-switch');
    let totalRepsInputField = document.querySelector('#wolog-total-reps');
    $test.assert(totalRepsSwitch.checked === false);
    $test.assert(totalRepsInputField.disabled === true);

    state = { error: '', workoutlog: { totalreps: 150 } };
    component.setState(state);
    component.afterRender(state);
    $test.assert(totalRepsSwitch.checked === true);
    $test.assert(totalRepsInputField.disabled === false);

    totalRepsSwitch.checked = false;
    $test.dispatchHTMLEvent('click', '#total-reps-switch');
    $test.assert(totalRepsInputField.disabled === true);
    $test.assert(totalRepsInputField.value === '');

    totalRepsSwitch.checked = true;
    $test.dispatchHTMLEvent('click', '#total-reps-switch');
    $test.assert(totalRepsInputField.disabled === false);
    $test.assert(totalRepsInputField.value === '150');
  });

  $test.it('should show create new workout dialog when new workout button is clicked', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    //Open the select workout dialog
    $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
    $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="select-workout-modal">'));
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="new-workout-form-modal">'));

    //Click on create new workout button
    $test.dispatchHTMLEvent('click', '#create-new-workout-btn');
    //show-view class is removed from select-workout-modal dialog
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
    //show-view class is added to new-workout-form-modal dialog
    $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="new-workout-form-modal">'));
  });

  $test.it('should close the new workout form when close button is clicked', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();

    $test.dispatchHTMLEvent('click', '#create-new-workout-btn');
    //show-view class is added to new-workout-form-modal dialog
    $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="new-workout-form-modal">'));

    $test.dispatchHTMLEvent('click', '#close-new-workout-form-modal-btn');
    $test.assert(selector.innerHTML.includes('<div class="modal-container" id="new-workout-form-modal">'));
  });
  console.groupEnd();
})();
