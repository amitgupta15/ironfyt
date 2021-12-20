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
    $test.assert('pagename' in component.state);
    $test.assert(Object.keys(component.state).length === 5);
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

  $test.it('should enable save button when name and description are added to the workout', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    //Initially the save button is disabled
    $test.assert(selector.innerHTML.includes('<button type="button" id="new-workout-next-step-btn" class="submit-btn" disabled="">Next</button>'));

    // Do something
    document.querySelector('#workout-name-1').value = 'Workout1';
    document.querySelector('#workout-description-1').value = 'some description';
    //Dispatch input event from workout-name
    $test.dispatchHTMLEvent('input', '#workout-name-1');
    //Save button should now be enabled
    $test.assert(selector.innerHTML.includes('<button type="button" id="new-workout-next-step-btn" class="submit-btn">Next</button>'));

    document.querySelector('#workout-name-1').value = '';
    document.querySelector('#workout-description-1').value = '';
    $test.dispatchHTMLEvent('input', '#workout-description-1');
    $test.assert(selector.innerHTML.includes('<button type="button" id="new-workout-next-step-btn" class="submit-btn" disabled="">Next</button>'));

    document.querySelector('#workout-name-1').value = 'workout 2';
    document.querySelector('#workout-description-1').value = 'some desc';
    $test.dispatchHTMLEvent('input', '#workout-description-1');
    $test.assert(selector.innerHTML.includes('<button type="button" id="new-workout-next-step-btn" class="submit-btn">Next</button>'));
  });

  console.groupEnd();
})();
