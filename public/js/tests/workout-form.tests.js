(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workout-form.js Tests');

  let component = $ironfyt.workoutFormComponent;
  let page = $ironfyt.workoutFormPage;

  $test.it('should create a workoutForm component', function () {
    $test.assert(component.selector === '[data-app=workout-form]');
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('workout' in component.state);
    $test.assert('validationError' in component.state);
    $test.assert(Object.keys(component.state).length === 4);
  });

  $test.it('should not allow unauthorized user to create a new workout', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback({ message: 'You are not authorized to create a new workout' });
    };

    page();
    let state = component.getState();
    $test.assert(state.error.message === 'You are not authorized to create a new workout');
  });

  $test.it('should allow authorized user', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '012345678901234567890123' } });
    };

    page();
    let state = component.getState();
    $test.assert(state.user._id === '012345678901234567890123');
  });

  $test.it('should fetch a workout to edit if params are provided', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '012345678901234567890123' } });
    };
    let _filter;
    $ironfyt.getWorkouts = function (filter, callback) {
      _filter = filter;
      callback(false, { workouts: [{ _id: '112345678901234567890123' }] });
    };
    $hl.getParams = function () {
      return { _id: '112345678901234567890123' };
    };

    page();
    $test.assert(_filter._id === '112345678901234567890123');
  });

  $test.it('should validate form input', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();

    //Try to submit the form without entering any values
    $test.dispatchHTMLEvent('submit', '#workout-form');
    let state = component.getState();
    $test.assert(state.validationError.name === 'Please enter a workout name');
    $test.assert(state.validationError.description === 'Please enter a workout description');

    selector.innerHTML = component.template(state);
    $test.assert(selector.innerHTML.includes('<div id="error-workout-name">Please enter a workout name</div>'));
    $test.assert(selector.innerHTML.includes('<div id="error-workout-description">Please enter a workout description</div>'));
  });

  $test.it('should create a workout object from form elements for valid input', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();

    let form = document.querySelector('#workout-form');
    form.elements['workout-name'].value = 'Fran';
    form.elements['workout-type'].value = 'For Time';
    form.elements['workout-timecap'].value = '10 minutes';
    form.elements['workout-rounds'].value = '3';
    form.elements['workout-reps'].value = '21-15-9';
    form.elements['workout-description'].value = 'Thrusters and Pull-ups';
    form.elements['workout-modality'][0].checked = true;
    form.elements['workout-modality'][1].checked = true;

    $test.dispatchHTMLEvent('submit', '#workout-form');
    let state = component.getState();
    $test.assert(state.workout.name === 'Fran');
    $test.assert(state.workout.type === 'For Time');
    $test.assert(state.workout.timecap === '10 minutes');
    $test.assert(state.workout.rounds === 3);
    $test.assert(state.workout.reps === '21-15-9');
    $test.assert(state.workout.description === 'Thrusters and Pull-ups');
    $test.assert(state.workout.modality[0] === 'm');
    $test.assert(state.workout.modality[1] === 'g');
  });

  $test.it('should successfully submit a workout request', function () {
    let _workout, _url;
    $ironfyt.saveWorkout = function (workout, callback) {
      _workout = workout;
      callback(false, { workout: { _id: '1234' } });
    };
    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();

    let form = document.querySelector('#workout-form');
    form.elements['workout-name'].value = 'Fran';
    form.elements['workout-type'].value = 'For Time';
    form.elements['workout-timecap'].value = '10 minutes';
    form.elements['workout-rounds'].value = '3';
    form.elements['workout-reps'].value = '21-15-9';
    form.elements['workout-description'].value = 'Thrusters and Pull-ups';

    $test.dispatchHTMLEvent('submit', '#workout-form');
    let state = component.getState();
    $test.assert(state.workout.name === 'Fran');
    $test.assert(state.workout.type === 'For Time');
    $test.assert(state.workout.timecap === '10 minutes');
    $test.assert(state.workout.rounds === 3);
    $test.assert(state.workout.reps === '21-15-9');
    $test.assert(state.workout.description === 'Thrusters and Pull-ups');

    $test.assert(_workout.name === 'Fran');
    $test.assert(_workout.type === 'For Time');
    $test.assert(_workout.timecap === '10 minutes');
    $test.assert(_workout.rounds === 3);
    $test.assert(_workout.reps === '21-15-9');
    $test.assert(_workout.description === 'Thrusters and Pull-ups');

    // $test.assert(_url === 'workout-detail.html?_id=1234');
    $test.assert(_url === 'workouts.html');
  });
  console.groupEnd();
})();
