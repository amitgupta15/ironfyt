(function () {
  'use strict';
  $ironfyt.linksComponent = Component('[data-app=links]', {
    state: {
      user: {},
    },
    template: function (props) {
      return `
      <p><a href="workoutlogs.html?user_id=${props.user._id}">Logs</a></p>
      <p><a href="workouts.html">Workouts</a></p>
      <p><a href="workout-form.html">New Workout</a></p>
      <p><a href="workoutlog-calendar.html">My Calendar</a></p>
      <p><a href="/">Home</a></p>
      `;
    },
  });

  ($ironfyt.links = function () {
    let { token, user } = $ironfyt.getCredentials();
    if (token && user) {
      $ironfyt.linksComponent.setState({ user });
    } else {
      $ironfyt.navigateToUrl('login.html');
    }
  })();
})();
