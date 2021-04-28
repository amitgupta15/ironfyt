(function () {
  'use strict';

  let workoutlogTemplate = function (props) {
    let logs = props && props.logs ? props.logs : [];
    return `
      <h1>Workout Logs (${logs.length})</h1>
      <pre>${JSON.stringify(logs, '2', '\t')}</pre>
    `;
  };

  let component = ($ironfyt.workoutlogComponent = Component('[data-app=workoutlog]', {
    state: {
      logs: [],
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogTemplate);
    },
  }));

  ($ironfyt.workoutlogPage = function () {
    let { user } = $ironfyt.getCredentials();
    user = user ? user : {};
    $ironfyt.getWorkoutLogs({ user_id: user._id }, function (error, response) {
      if (error) {
        component.setState({ error: { message: `Code: ${error.code}, Error: ${error.data.error}` } });
      } else {
        let logs = response && response.data && response.data.workoutlogs ? response.data.workoutlogs : [];
        component.setState({ logs, user });
      }
    });
  })();
})();
