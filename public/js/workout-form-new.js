(function () {
  'use strict';

  let workoutFormTemplate = function (props) {
    return `Hello`;
  };

  let component = ($ironfyt.workoutFormComponentNew = Component('[data-app=workout-form]', {
    state: {},
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormTemplate);
    },
  }));
})();
