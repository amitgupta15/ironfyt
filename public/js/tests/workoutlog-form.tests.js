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
    $test.assert(_url === 'workoutlog-calendar.html?ref=workoutlog-form.html&year=2020&month=0&date=1');

    $hl.getParams = function () {
      return { ref: 'workoutlog-calendar.html', user_id: '123456789012345678901234' };
    };
    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    $test.assert(_url === 'workoutlog-calendar.html?ref=workoutlog-form.html&user_id=123456789012345678901234&year=2020&month=0&date=1');
  });

  /*****
   * Review these tests. Are we keeping this feature in the log form?
   * ****/

  // $test.it('should show search workout dialog when select-workout-btn-wolog is clicked', function () {
  //   component.setState({ workoutlog: {} });
  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template({});
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
  //   $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="select-workout-modal"'));
  //   $test.assert(selector.innerHTML.includes('<button type="button" id="select-workout-btn-wolog" disabled="">'));
  //   $test.assert(document.getElementById('wolog-workout-id').value === '');
  // });

  // $test.it('should close the search workout dialog when close button is clicked', function () {
  //   component.setState({ workoutlog: {} });
  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template({});

  //   $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
  //   $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="select-workout-modal">'));
  //   $test.dispatchHTMLEvent('click', '#close-workout-list-modal-btn');
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
  // });

  // $test.it('should show available workouts and let the user select a workout when searching for a workout - auto-complete', function () {
  //   $ironfyt.authenticateUser = function (callback) {
  //     callback(false, { user: { _id: '6070f1035b7f1e4066cb9450' } });
  //   };
  //   $ironfyt.getWorkouts = function (params, callback) {
  //     callback(false, {
  //       workouts: [
  //         { _id: 1, name: 'Chest & Back', description: 'Do 100 push-ups' },
  //         { _id: 2, name: 'DT', description: '155lb deadlift' },
  //         { _id: 3, name: 'Fran', description: '21-15-9 Pull-ups and Thrusters' },
  //       ],
  //     });
  //   };
  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template({});

  //   //Dispatch the following event to trigger getWorkouts api call
  //   $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');

  //   let state = component.getState();
  //   $test.assert(state.workouts.length === 3);
  //   let searchWorkoutField = document.querySelector('#search-workout');
  //   searchWorkoutField.value = 'fr';
  //   $test.dispatchHTMLEvent('input', '#search-workout');
  //   $test.assert(selector.innerHTML.includes('<summary><span class="text-color-highlight bold-text">Fr</span>an</summary>'));

  //   searchWorkoutField.value = 'dt';
  //   $test.dispatchHTMLEvent('input', '#search-workout');
  //   $test.assert(selector.innerHTML.includes('Found 1 Workouts'));
  //   $test.assert(selector.innerHTML.includes('<summary><span class="text-color-highlight bold-text">DT</span></summary>'));

  //   $test.dispatchHTMLEvent('click', '#select-workout-from-search-result-btn-1');
  //   state = component.getState();
  //   $test.assert(state.workoutlog.workout[0]._id === 2);
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">')); //removed the 'show-view' class from the modal
  // });

  // $test.it('should fetch workouts when "select workout" button is clicked', function () {
  //   component.setState({ workoutlog: { roundinfo: [{ rounds: null, load: null, unit: null }] } });
  //   $ironfyt.getWorkouts = function (filter, callback) {
  //     callback(false, {
  //       workouts: [
  //         { _id: 1, name: 'Workout 1' },
  //         { _id: 2, name: 'Workout 2' },
  //       ],
  //     });
  //   };
  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template({});
  //   let state = component.getState();
  //   $test.assert(state.workouts.length === 0);
  //   $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
  //   state = component.getState();
  //   $test.assert(state.workouts.length === 2);
  // });

  // $test.it('should show create new workout dialog when new workout button is clicked', function () {
  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template();
  //   //Open the select workout dialog
  //   $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="select-workout-modal">'));
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container" id="new-workout-form-modal">'));

  //   //Click on create new workout button
  //   $test.dispatchHTMLEvent('click', '#create-new-workout-btn');
  //   //show-view class is removed from select-workout-modal dialog
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container" id="select-workout-modal">'));
  //   //show-view class is added to new-workout-form-modal dialog
  //   $test.assert(selector.innerHTML.includes('<div class="modal-container show-view" id="new-workout-form-modal">'));
  // });

  // $test.it('should enable appropriate fields based on the type of workout selected', function () {
  //   $ironfyt.getWorkouts = function (params, callback) {
  //     callback(false, {
  //       workouts: [
  //         { _id: 1, type: 'For Time', name: 'Chest & Back', description: 'Do 100 push-ups', modality: ['g'] },
  //         { _id: 2, type: 'For Reps', name: 'DT', description: '155lb deadlift', modality: ['g', 'm'] },
  //         { _id: 3, type: 'AMRAP', name: 'Fran', description: '21-15-9 Pull-ups and Thrusters' },
  //         { _id: 4, type: 'For Load', name: 'for load workout', description: '5-5-3-1 Deadlift' },
  //         { _id: 5, type: 'Tabata', name: 'tabata workout', description: 'tabata something else' },
  //       ],
  //     });
  //   };

  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template();
  //   $test.dispatchHTMLEvent('click', '#select-workout-btn-wolog');
  //   let searchWorkoutField = document.getElementById('search-workout');

  //   // Search and select "For Time" type workout
  //   searchWorkoutField.value = 'ch';
  //   $test.dispatchHTMLEvent('input', '#search-workout');
  //   $test.dispatchHTMLEvent('click', '#select-workout-from-search-result-btn-0');
  //   $test.assert(document.getElementById('duration-switch').checked === true);
  //   $test.assert(document.getElementById('wolog-duration-hours').disabled === false);
  //   $test.assert(document.getElementById('wolog-duration-minutes').disabled === false);
  //   $test.assert(document.getElementById('wolog-duration-seconds').disabled === false);

  //   // Search and select "For Reps" type workout
  //   searchWorkoutField.value = 'dt';
  //   $test.dispatchHTMLEvent('input', '#search-workout');
  //   $test.dispatchHTMLEvent('click', '#select-workout-from-search-result-btn-1');
  //   $test.assert(document.getElementById('total-reps-switch').checked === true);
  //   $test.assert(document.getElementById('wolog-total-reps').disabled === false);
  //   $test.assert(document.getElementById('modality-g').checked === true);
  //   //reset the fields
  //   document.getElementById('total-reps-switch').checked = false;
  //   document.getElementById('wolog-total-reps').disabled = true;

  //   // Search and select "AMRAP" type workout
  //   searchWorkoutField.value = '21-15';
  //   $test.dispatchHTMLEvent('input', '#search-workout');
  //   $test.dispatchHTMLEvent('click', '#select-workout-from-search-result-btn-2');
  //   $test.assert(document.getElementById('rounds-switch').checked === true);
  //   $test.assert(document.getElementById('wolog-rounds-0').disabled === false);
  //   $test.assert(document.querySelector(`#wolog-load-0`).disabled === false);
  //   $test.assert(document.querySelector(`#wolog-unit-0`).disabled === false);

  //   // Search and select "For Load" type workout
  //   searchWorkoutField.value = 'for load';
  //   $test.dispatchHTMLEvent('input', '#search-workout');
  //   $test.dispatchHTMLEvent('click', '#select-workout-from-search-result-btn-3');
  //   $test.assert(document.getElementById('movement-switch').checked === true);

  //   // Search and select "Tabata" type workout
  //   searchWorkoutField.value = 'tabata';
  //   $test.dispatchHTMLEvent('input', '#search-workout');
  //   $test.dispatchHTMLEvent('click', '#select-workout-from-search-result-btn-4');
  //   $test.assert(document.getElementById('total-reps-switch').checked === true);
  //   $test.assert(document.getElementById('wolog-total-reps').disabled === false);
  // });

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
    $test.assert(selector.innerHTML.includes('<div id="movement-list-item-0" data-movement-list-item-index="0"><span class="text-color-highlight">B</span>ack Squat</div><div id="movement-list-item-1" data-movement-list-item-index="1"><span class="text-color-highlight">B</span>ench Press</div>'));
    addMovementField.value = 'sq';
    $test.dispatchHTMLEvent('input', '#wolog-add-movement');
    $test.assert(selector.innerHTML.includes('<div id="movement-list-item-0" data-movement-list-item-index="0">Back <span class="text-color-highlight">Sq</span>uat</div><div id="movement-list-item-2" data-movement-list-item-index="2"><span class="text-color-highlight">Sq</span>uat</div>'));
  });

  $test.it('should add movement to the log when the a movement is selected from the auto list', function () {
    let movements = [
      { _id: 1, movement: 'Back Squat' },
      { _id: 2, movement: 'Bench Press' },
      { _id: 3, movement: 'Squat' },
    ];
    component.setState({ movements });
    let state = component.getState();

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);

    component.afterRender(state);
    let addMovementField = document.querySelector('#wolog-add-movement');
    addMovementField.value = 'sq';
    $test.dispatchHTMLEvent('input', '#wolog-add-movement');
    $test.dispatchHTMLEvent('click', '#movement-list-item-0');
    state = component.getState();
    $test.assert(state.workoutlog.movements[0].movementObj._id === 1);
    $test.assert(state.workoutlog.movements[0].movementObj.movement === 'Back Squat');
  });

  $test.it('should copy movement block while preserving the form state', function () {
    let state = {
      workoutlog: {
        movements: [
          {
            movementObj: { movement: 'Thruster', units: ['lb', 'kg'] },
            reps: [
              { reps: 45, load: null, unit: null },
              { reps: 50, load: null, unit: null },
            ],
          },
        ],
      },
    };
    component.setState(state);

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);

    $test.dispatchHTMLEvent('click', '#copy-wolog-movement-reps-0-0');
    let workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements[0].reps.length === 3);
    $test.assert(workoutlog.movements[0].movementObj.movement === 'Thruster');
    $test.assert(workoutlog.movements[0].reps[1].reps === 45);
    $test.assert(workoutlog.movements[0].reps[1].load === null);
    $test.assert(workoutlog.movements[0].reps[1].unit === null);
  });

  $test.it('should successfully delete a rep when the delete button is clicked', function () {
    let state = {
      workoutlog: {
        movements: [
          {
            movementObj: { movement: 'Clean' },
            reps: [
              { reps: null, load: null, unit: null },
              { reps: null, load: null, unit: null },
            ],
          },
        ],
      },
    };
    component.setState(state);

    let workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements[0].reps.length === 2);

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);
    $test.dispatchHTMLEvent('click', '#delete-wolog-movement-reps-0-0');

    workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements[0].reps.length === 1);

    $test.dispatchHTMLEvent('click', '#delete-wolog-movement-reps-0-0');
    workoutlog = component.getState().workoutlog;
    $test.assert(workoutlog.movements[0].reps.length === 0);
  });

  $test.it('should successfully delete a movement', function () {
    let workoutlog = {
      movements: [
        { movementObj: { movement: 'Thruster' }, reps: [] },
        { movementObj: { movement: 'Pull-ups' }, reps: [] },
      ],
    };
    component.setState({ workoutlog });
    let selector = document.getElementById('selector');
    selector.innerHTML = component.template({ workoutlog });
    $test.dispatchHTMLEvent('click', '#delete-wolog-movement-0');
    let state = component.getState();
    $test.assert(state.workoutlog.movements.length === 1);
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

  $test.it('should enable/disable save new workout button based on values of workout name and desc fields', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    let workoutNameField = document.querySelector('#workout-name');
    let workoutDescField = document.querySelector('#workout-description');
    let workoutSaveBtn = document.querySelector('#workout-form-helper-save-new-workout-btn');

    $test.assert(workoutSaveBtn.disabled === true);

    workoutNameField.value = 'workout 1';
    workoutDescField.value = '';
    $test.dispatchHTMLEvent('input', '#workout-name');

    $test.assert(workoutSaveBtn.disabled === true);

    workoutNameField.value = '';
    workoutDescField.value = 'Some description';
    $test.dispatchHTMLEvent('input', '#workout-description');

    $test.assert(workoutSaveBtn.disabled === true);

    workoutNameField.value = 'workout 1';
    workoutDescField.value = 'Some Description';
    $test.dispatchHTMLEvent('input', '#workout-name');

    $test.assert(workoutSaveBtn.disabled === false);
    workoutSaveBtn.disabled = true;
    $test.dispatchHTMLEvent('input', '#workout-description');
    $test.assert(workoutSaveBtn.disabled === false);
  });

  $test.it('should validate and save new workout', function () {
    $ironfyt.saveWorkout = function (workout, callback) {
      callback(false, { workout: { name: 'new workout' } });
    };

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();

    let workoutSaveBtn = document.querySelector('#workout-form-helper-save-new-workout-btn');
    workoutSaveBtn.disabled = false;
    $test.dispatchHTMLEvent('click', '#workout-form-helper-save-new-workout-btn');
    $test.assert(workoutSaveBtn.disabled === true);
    $test.assert(workoutSaveBtn.innerHTML === 'Saving Workout...');

    let state = component.getState();
    $test.assert(state.workoutlog.workout[0].name === 'new workout');
  });

  $test.it('should check and process new personal record once the log is created', function () {
    $ironfyt.saveWorkoutLog = function (workoutlog, callback) {
      callback(false, { workoutlog: { _id: '123412341234123412341234', workout_id: '123412341234123412341235', user_id: '555555555555555555555555' } });
    };
    let _updatePersonalRecordCalled = false;
    $ironfyt.updatePersonalRecord = function (workoutlog) {
      _updatePersonalRecordCalled = true;
    };
    component.setState({ user: { _id: '555555555555555555555555' } });
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    let form = document.querySelector('#workout-log-form');
    // Need to have some value to pass validation
    form.elements['wolog-duration-minutes'].value = 30;
    // Submit the form to trigger PR check
    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    $test.assert(_updatePersonalRecordCalled === true);
  });

  $test.it('should set the date and workout if the form is loaded from the "Log this WOD" button from the home page', function () {
    component.setState({ workoutlog: {} });
    $hl.getParams = function () {
      return {
        workout_id: '123412341234123412341234',
        date: '2021-01-01T08:00:00.000Z',
      };
    };
    $ironfyt.getWorkouts = function (params, callback) {
      callback(false, { workouts: [{ _id: '123412341234123412341234' }] });
    };
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    page();
    let state = component.getState();
    $test.assert(state.workoutlog.date === '2021-01-01T08:00:00.000Z');
    $test.assert(state.workoutlog.workout[0]._id === '123412341234123412341234');
  });
  console.groupEnd();
})();
