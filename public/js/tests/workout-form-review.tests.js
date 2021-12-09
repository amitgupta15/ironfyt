(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'workout-form-review.js Tests');

  let component = $ironfyt.workoutFormReviewComponent;
  let page = $ironfyt.workoutFormReviewPage;

  $test.it('should create a workoutFormReview component', function () {
    $test.assert(component.selector === '[data-app=workout-form-review]');
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('workout' in component.state);
    $test.assert('leftButtonTitle' in component.state);
    $test.assert('pageTitle' in component.state);
    $test.assert(Object.keys(component.state).length === 6);
  });

  $test.it('should successfully create a new rep when copy button is clicked and insert the rep right under the clicked rep', function () {
    let workout = {
      name: 'Fran',
      description: '21 15 9\nThrusters\nPull-ups',
      movements: [
        {
          movementObj: { movement: 'Thruster', units: ['lb', 'kg'] },
          reps: [
            { reps: 45, load: null, unit: null },
            { reps: 50, load: null, unit: null },
          ],
        },
      ],
    };
    component.setState({ workout });
    let selector = document.getElementById('selector');
    selector.innerHTML = component.template({ workout });
    document.getElementById('workout-movement-reps-0-0').value = '5';
    document.getElementById('workout-movement-load-0-0').value = '95';
    document.getElementById('workout-movement-unit-0-0').value = 'lb';
    $test.dispatchHTMLEvent('click', '#copy-movement-reps-0-0');
    let state = component.getState();
    $test.assert(state.workout.movements[0].reps.length === 3);
  });

  $test.it('should successfully delete a rep when the delete button is clicked', function () {
    let workout = {
      name: 'Fran',
      description: '21 15 9\nThrusters\nPull-ups',
      movements: [
        {
          movementObj: { movement: 'Thruster' },
          reps: [
            { reps: 45, load: null, unit: null },
            { reps: 50, load: null, unit: null },
          ],
        },
      ],
    };
    component.setState({ workout });
    let selector = document.getElementById('selector');
    selector.innerHTML = component.template({ workout });
    $test.dispatchHTMLEvent('click', '#delete-movement-reps-0-0');
    let state = component.getState();
    $test.assert(state.workout.movements[0].reps.length === 1);
  });

  $test.it('should successfully delete a movement', function () {
    let workout = {
      name: 'Fran',
      description: '21 15 9\nThrusters\nPull-ups',
      movements: [
        { movementObj: { movement: 'Thruster' }, reps: [] },
        { movementObj: { movement: 'Pull-ups' }, reps: [] },
      ],
    };
    component.setState({ workout });
    let selector = document.getElementById('selector');
    selector.innerHTML = component.template({ workout });
    $test.dispatchHTMLEvent('click', '#delete-workout-movement-0');
    let state = component.getState();
    $test.assert(state.workout.movements.length === 1);
  });

  $test.it('should select a movement from the autocomplete list and add it to the list of movements', function () {
    let movements = [
      { _id: '1234', movement: 'Air Squat' },
      { _id: '1234', movement: 'Squat' },
      { _id: '1234', movement: 'Back Squat' },
    ];
    let workout = {
      name: 'Fran',
      description: '21 15 9\nThrusters\nPull-ups',
      movements: [
        { movementObj: { movement: 'Thruster' }, reps: [] },
        { movementObj: { movement: 'Pull-ups' }, reps: [] },
      ],
    };
    component.setState({ workout, movements });
    let selector = document.getElementById('selector');
    selector.innerHTML = component.template({ workout, movements });
    component.afterRender({ workout, movements });
    document.getElementById('workout-add-movement').value = 'sq';
    $test.dispatchHTMLEvent('input', '#workout-add-movement');
    $test.dispatchHTMLEvent('click', '#new-workout-movement-auto-list-item-2');
  });

  $test.it('should populate all the units dropdowns for a movement to the same value as the first dropdown', function () {
    let workout = {
      name: 'Fran',
      description: '21 15 9\nThrusters\nPull-ups',
      movements: [
        {
          movementObj: { movement: 'Thruster', units: ['lb', 'kg'] },
          reps: [
            { reps: 1, load: 95, unit: null },
            { reps: 1, load: 95, unit: null },
            { reps: 1, load: 95, unit: null },
          ],
        },
        { movementObj: { movement: 'Pull-ups' }, reps: [] },
      ],
    };
    component.setState({ workout });
    let selector = document.getElementById('selector');
    selector.innerHTML = component.template({ workout });

    $test.assert(document.getElementById('workout-movement-unit-0-1').value === '');
    $test.assert(document.getElementById('workout-movement-unit-0-2').value === '');

    document.getElementById('workout-movement-unit-0-0').value = 'lb';
    $test.dispatchHTMLEvent('change', '#workout-movement-unit-0-0');

    $test.assert(document.getElementById('workout-movement-unit-0-1').value === 'lb');
    $test.assert(document.getElementById('workout-movement-unit-0-2').value === 'lb');
  });
  console.groupEnd();
})();
