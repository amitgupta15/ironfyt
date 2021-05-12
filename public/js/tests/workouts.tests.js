(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'workouts.js Tests');

  let component = $ironfyt.workoutsComponent;
  let page = $ironfyt.workoutsPage;

  $test.it('should create workouts component successfully', function () {
    $test.assert(component.selector === '[data-app=workouts]');
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('workouts' in component.state);
  });

  $test.it('should fetch all the workouts', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { _id: '111111111111111111111111' });
    };
    let _filter;
    $ironfyt.getWorkouts = function (filter, callback) {
      _filter = filter;
      callback(false, { workouts: [{}, {}] });
    };

    page();
    let state = component.getState();
    $test.assert(state.workouts.length === 2);
  });

  $test.it('should delete a workout', function () {
    let _filter, _url;
    $ironfyt.deleteWorkout = function (filter, callback) {
      _filter = filter;
      callback(false);
    };
    $ironfyt.navigateToUrl = function (url) {
      _url = url;
    };

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ workouts: [{ _id: '012345678901234567890123' }] });
    $test.dispatchHTMLEvent('click', '#delete-workout-012345678901234567890123');
    $test.assert(_filter === '012345678901234567890123');
    $test.assert(_url === 'workouts.html');
  });
  console.groupEnd();
})();
