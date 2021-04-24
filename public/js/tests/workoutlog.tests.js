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
    page();
  });
  console.groupEnd();
})();
