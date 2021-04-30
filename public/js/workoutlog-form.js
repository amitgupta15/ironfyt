(function () {
  'use strict';

  let workoutlogFormTemplate = function (props) {
    return `Workout log form template`;
  };

  let component = ($ironfyt.workoutlogFormComponent = Component('[data-app=workoutlog-form]', {
    state: {
      error: '',
      validationError: '',
      workoutlog: {},
      user: {},
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogFormTemplate);
    },
  }));

  ($ironfyt.workoutlogFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      let user = auth && auth.user ? auth.user : {};
      if (!error) {
        component.setState({ user });
      } else {
        component.setState({ error: error });
      }
    });
  })();
})();
