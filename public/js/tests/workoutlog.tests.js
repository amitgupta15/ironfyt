(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'workoutlog.js Tests');

  let component = $ironfyt.workoutlogComponent;
  let page = $ironfyt.workoutlogPage;

  $test.it('should create workoutlogComponent', function () {
    $test.assert(component.selector === '[data-app=workoutlog]');
    $test.assert('logs' in component.state);
  });

  $test.it('should retrieve workout logs', function () {
    $ironfyt.getWorkoutLogs = function (params, callback) {
      callback(false, { data: { workoutlogs: [{ _id: 1 }, { _id: 2 }] } });
    };
    page();
    let state = component.getState();
    $test.assert(state.logs.length === 2);
  });
  console.groupEnd();
})();
