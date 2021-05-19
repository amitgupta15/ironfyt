(function () {
  'use strict';
  $ironfyt.landingComponent = Component('[data-app=landing]', {
    state: {
      user: {},
    },
    template: function (props) {
      return `
      <p><a href="workoutlogs.html?user_id=${props.user._id}">Logs</a></p>
      <p><a href="workoutlog-form.html">New Log</a></p>
      <p><a href="workouts.html">Workouts</a></p>
      <p><a href="workout-form.html">New Workout</a></p>
      <p><a href="workoutlog-calendar.html">My Calendar</a></p>
      `;
    },
  });

  ($ironfyt.main = function () {
    let { token, user } = $ironfyt.getCredentials();
    if (token && user) {
      $ironfyt.landingComponent.setState({ user });
    } else {
      $ironfyt.navigateToUrl('login.html');
    }
  })();
})();
