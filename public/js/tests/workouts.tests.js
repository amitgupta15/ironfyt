(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'workouts.js Tests');

  let component = $ironfyt.workoutsComponent;
  let page = $ironfyt.workoutsPage;

  $test.it('should create workouts component successfully', function () {
    $test.assert(component.selector === '[data-app=workouts]');
    $test.assert(Object.keys(component.state).length === 4);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('workouts' in component.state);
    $test.assert('pageTitle' in component.state);
  });

  $test.it('should fetch all the workouts created by the user and the groups the user belongs to', function () {
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
    $test.assert(_filter.group_wods === 1);
    $test.assert(state.workouts.length === 2);
  });

  $test.it('should show edit and delete buttons if the user is an admin', function () {
    component.setState({ user: { _id: '1234', role: 'admin' } });
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ user: { _id: '123', role: 'admin' }, workouts: [{ _id: '1234' }] });
    $test.assert(selector.innerHTML.includes('<button class="day-log-detail-edit-btn" id="edit-workout-btn-1234"></button>'));
    $test.assert(selector.innerHTML.includes('<button class="day-log-detail-delete-btn" id="delete-workout-btn-1234"></button>'));

    component.setState({ user: { _id: '1234' } });
    selector.innerHTML = component.template({ user: { _id: '123' }, workouts: [{ _id: '1234' }] });
    $test.assert(!selector.innerHTML.includes('<button class="day-log-detail-edit-btn"'));
    $test.assert(!selector.innerHTML.includes('<button class="day-log-detail-delete-btn"'));
  });

  // $test.it('should delete a workout', function () {
  //   let _filter, _url;
  //   $ironfyt.deleteWorkout = function (filter, callback) {
  //     _filter = filter;
  //     callback(false);
  //   };
  //   $ironfyt.navigateToUrl = function (url) {
  //     _url = url;
  //   };

  //   let selector = document.querySelector('#selector');
  //   selector.innerHTML = component.template({ workouts: [{ _id: '012345678901234567890123' }] });
  //   $test.dispatchHTMLEvent('click', '#delete-workout-012345678901234567890123');
  //   $test.assert(_filter === '012345678901234567890123');
  //   $test.assert(_url === 'workouts.html');
  // });

  console.groupEnd();
})();
