(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlog-form.js Tests');

  let component = $ironfyt.workoutlogFormComponent;
  let page = $ironfyt.workoutlogFormPage;

  $test.it('should create a workoutlogformComponent', function () {
    $test.assert('error' in component.state);
    $test.assert('validationError' in component.state);
    $test.assert('user' in component.state);
    $test.assert('workoutlog' in component.state);
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
  });

  $test.it('should handle invalid form data', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});
    let form = document.querySelector('#workout-log-form');
    // Component sets the default date to today's date. Overwriting the default date here to generate an error
    form.elements['wolog-date'].value = '';
    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    let state = component.getState();
    $test.assert(state.validationError.date === 'Please enter a date for the log');
    $test.assert(state.validationError.catchAll === 'Please enter a value in one of the fields or add notes.');
  });

  $test.it('should handle valid form data', function () {
    let _workoutlog;
    $ironfyt.saveWorkoutLog = function (workoutlog, callback) {
      _workoutlog = workoutlog;
      callback();
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
  });

  $test.it('should show workout list dialog when select-workout-btn is clicked', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});

    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display:none;">'));
    $test.dispatchHTMLEvent('click', '#select-workout-btn');
    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: block;">'));
    $test.assert(selector.innerHTML.includes('<button type="button" id="select-workout-btn" disabled="">'));
    $test.assert(document.getElementById('wolog-workout-id').value === '');
  });

  $test.it('should close the workout list dialog when close button is clicked', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});

    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display:none;">'));
    $test.dispatchHTMLEvent('click', '#select-workout-btn');
    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: block;">'));
    $test.dispatchHTMLEvent('click', '#close-workout-list-modal');
    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: none;">'));
  });

  // $test.it('should populate the workout and close the workout list modal when a workout is selected', function () {
  //   component.setState({ workouts: [{ _id: '6070eec7f20f85401bca47a1', name: 'Linda' }] });
  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template({ workouts: [{ _id: '6070eec7f20f85401bca47a1' }] });
  //   $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display:none;">'));
  //   $test.dispatchHTMLEvent('click', '#select-workout-btn');
  //   // $test.dispatchHTMLEvent('click', '#workout-6070eec7f20f85401bca47a1');
  //   $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: none;">'));
  //   $test.assert(selector.innerHTML.includes('<button type="button" id="select-workout-btn" disabled="">'));
  //   let state = component.getState();
  //   $test.assert(state.workoutlog.workout[0]._id === '6070eec7f20f85401bca47a1');
  //   $test.assert(state.workoutlog.workout[0].name === 'Linda');
  //   console.log(selector.innerHTML);
  // });

  $test.it('should show/hide workout details in the workout list', function () {
    let state = { workouts: [{ _id: '6070eec7f20f85401bca47a1', name: 'Linda', description: 'Do 15 reps of each set' }] };
    component.setState(state);
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);
    $test.assert(selector.innerHTML.includes('<span id="show-detail-6070eec7f20f85401bca47a1"> &gt; </span>Linda'));
    $test.assert(selector.innerHTML.includes('<div id="workout-detail-6070eec7f20f85401bca47a1" style="display:none">Do 15 reps of each set</div>'));

    $test.dispatchHTMLEvent('click', '#show-detail-6070eec7f20f85401bca47a1');
    // Show details
    $test.assert(selector.innerHTML.includes('<span id="show-detail-6070eec7f20f85401bca47a1">^ </span>Linda'));
    $test.assert(selector.innerHTML.includes('<div id="workout-detail-6070eec7f20f85401bca47a1" style="display: block;">Do 15 reps of each set</div>'));

    $test.dispatchHTMLEvent('click', '#show-detail-6070eec7f20f85401bca47a1');
    // Hide Details
    $test.assert(selector.innerHTML.includes('<span id="show-detail-6070eec7f20f85401bca47a1">&gt; </span>Linda'));
    $test.assert(selector.innerHTML.includes('<div id="workout-detail-6070eec7f20f85401bca47a1" style="display: none;">Do 15 reps of each set</div>'));
  });

  $test.it('should show/hide workout details for the selected workout', function () {
    let state = { workoutlog: { workout: [{ _id: '6070eec7f20f85401bca47a1', name: 'Linda', description: 'Do 15 reps of each set' }] } };
    component.setState(state);
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template(state);

    $test.assert(selector.innerHTML.includes('<span id="unselect-workout">X</span>&nbsp;&nbsp;<span id="selected-workout-name-span">Linda</span>'));

    // Show workout detail
    $test.dispatchHTMLEvent('click', '#selected-workout-name-span');
    $test.assert(selector.innerHTML.includes('<div id="selected-workout-detail-div" style="display: block;">Do 15 reps of each set</div>'));

    // Hide workout detail
    $test.dispatchHTMLEvent('click', '#selected-workout-name-span');
    $test.assert(selector.innerHTML.includes('<div id="selected-workout-detail-div" style="display: none;">Do 15 reps of each set</div>'));
  });

  $test.it('should add/remove round/load info block while preserving the form state', function () {
    $test.assert(component.getState().workoutlog === '');

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    let form = document.querySelector('#workout-log-form');
    form.elements['wolog-date'].value = '2021-05-07';

    $test.dispatchHTMLEvent('click', '#add-new-round-info');
    let workoutlog = component.getState().workoutlog;

    $test.assert(workoutlog.roundinfo.length === 2);
    $test.assert($hl.formatDateForInputField(workoutlog.date) === '2021-05-07');
  });

  $test.it('should remove round/load info block while preserving the form state', function () {
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
    $test.dispatchHTMLEvent('click', '#select-workout-btn');
    state = component.getState();
    $test.assert(state.workouts.length === 2);
  });
  console.groupEnd();
})();
