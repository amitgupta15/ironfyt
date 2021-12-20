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
    $test.assert('pagename' in component.state);
    $test.assert('movements' in component.state);
    $test.assert('primaryMovements' in component.state);
    $test.assert(Object.keys(component.state).length === 7);
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
    let primaryMovements = [
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
    component.setState({ workout, primaryMovements });
    let selector = document.getElementById('selector');
    selector.innerHTML = component.template({ workout, primaryMovements });
    component.afterRender({ workout, primaryMovements });
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

  let movements = [
    { _id: '1', movement: 'Thruster', regexTerms: ['(thruster)(s*)'], demolink: 'https://youtube.com/1', modality: 'w', units: ['lb', 'kg'] },
    { _id: '2', movement: 'Dumbbell Thruster', regexTerms: ['(db|dumbbell|dumbell|dumbel)(s*)', '(thruster)(s*)'], demolink: 'https://youtube.com/2', modality: 'w', units: ['lb', 'kg'] },
    { _id: '3', movement: 'Toes-to-bar', regexTerms: ['(toe)(s*)', '(to)(s*)', '(bar)(s*)'], demolink: 'https://youtube.com/3', modality: 'g', units: [] },
    { _id: '4', movement: 'Double-Unders', regexTerms: ['(double)(s*)', '(under)(s*)'], demolink: 'https://youtube.com/4', modality: 'g', units: [] },
    { _id: '5', movement: 'Pull-Up', regexTerms: ['(pull)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/5', modality: 'g', units: [] },
    { _id: '6', movement: 'Push-Up', regexTerms: ['(push)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/7', modality: 'g', units: [] },
    { _id: '7', movement: 'Jumping Jacks', regexTerms: ['(jumping|jump|jumped|juming)(s*)', '(jack|jac|jak)(s*)'], demolink: 'https://youtube.com/8', modality: 'g', units: [] },
    { _id: '8', movement: 'Sit-up', regexTerms: ['(sit|sat)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/9', modality: 'g', units: [] },
    { _id: '9', movement: 'Squat', regexTerms: ['(squat)(s*)'], demolink: 'https://youtube.com/10', modality: 'g', units: [] },
    { _id: '10', movement: 'Air Squat', regexTerms: ['(air)(s*)', '(squat)(s*)'], demolink: 'https://youtube.com/11', modality: 'g', units: [] },
    { _id: '11', movement: 'Back Squat', regexTerms: ['(back)(s*)', '(squat)(s*)'], demolink: 'https://youtube.com/12', modality: 'w', units: ['lb', 'kg'] },
  ];

  $test.it('should not add the same movement twice while editing', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false);
    };
    localStorage.getItem = function () {
      return JSON.stringify({ name: 'some name', description: '20 thrusters', movements: [{ reps: [{ reps: 10, load: 135, unit: 'lb' }], movementObj: { _id: '1', movement: 'Thruster', regexTerms: ['(thruster)(s*)'], demolink: 'https://youtube.com/1', modality: 'w', units: ['lb', 'kg'] } }] });
    };
    $ironfyt.getMovements = function (params, callback) {
      callback(false, { movements: [] });
    };
    $ironfyt.parseWorkout = function (workoutDescription, movements) {
      return {
        parsedMovements: [
          { reps: [{ reps: 30, load: 135, unit: 'lb' }], movementObj: { _id: '1', movement: 'Thruster', regexTerms: ['(thruster)(s*)'], demolink: 'https://youtube.com/1', modality: 'w', units: ['lb', 'kg'] } },
          { reps: [{ reps: 40, load: null, unit: null }], movementObj: { _id: '3', movement: 'Toes-to-bar', regexTerms: ['(toe)(s*)', '(to)(s*)', '(bar)(s*)'], demolink: 'https://youtube.com/3', modality: 'g', units: [] } },
        ],
      };
    };
    page();
    let state = component.getState();
    let workout = state.workout;
    $test.assert(workout.movements.length === 2);
    let thrusterMovement = workout.movements.filter((movement) => movement.movementObj._id === '1')[0];
    $test.assert(thrusterMovement.reps[0].reps.reps === 30);
  });
  console.groupEnd();
})();
