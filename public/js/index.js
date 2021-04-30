(function () {
  'use strict';
  $ironfyt.landingComponent = Component('[data-app=landing]', {
    state: {},
    template: function (props) {
      return `
      <p><a href="workoutlog.html">Logs</a></p>
      <p><a href="workoutlog-form.html">New Log</a></p>
      <p><a href="workoutlist.html">Workouts</a></p>
      <p><a href="workout-form.html">New Workout</a></p>
      `;
    },
  });

  ($ironfyt.main = function () {
    let { token, user } = $ironfyt.getCredentials();
    if (token && user) {
      $ironfyt.landingComponent.render();
    } else {
      $ironfyt.navigateToUrl('login.html');
    }
  })();
})();
