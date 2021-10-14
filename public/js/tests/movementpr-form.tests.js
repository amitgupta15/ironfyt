(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'movementpr-form.js Tests');

  let component = $ironfyt.movementprFormComponent;
  let page = $ironfyt.movementprFormPage;

  $test.it('should create a movement pr form component', function () {
    $test.assert(Object.keys(component.state).length === 7);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('validationError' in component.state);
    $test.assert('movementpr' in component.state);
    $test.assert('showSpinner' in component.state);
    $test.assert('movements' in component.state);
    $test.assert('pageTitle' in component.state);
  });

  $test.it('should not allow unauthorized user to view this page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('You are not authorized to view this page');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'You are not authorized to view this page');
  });

  $test.it('should fetch movements to be shown in the form', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: '123' } });
    };
    $ironfyt.getMovements = function (params, callback) {
      callback(false, { movements: ['1', '2'] });
    };
    page();
    let state = component.getState();
    $test.assert(state.movements.length === 2);
    $test.assert(state.showSpinner === false);
  });
  console.groupEnd();
})();
