(function () {
  'use strict';

  let component = $ironfyt.workoutFormComponentNew;
  $test.it('should create a new workout-form component', function () {
    $test.assert(component.selector === '[data-app=workout-form]');
    console.log(component);
  });
})();
