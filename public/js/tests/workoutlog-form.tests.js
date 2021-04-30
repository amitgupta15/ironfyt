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
  console.groupEnd();
})();
