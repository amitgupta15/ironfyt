(function () {
  'use strict';

  let workoutlogTemplate = function (props) {
    let logs = props && props.logs ? props.logs : [];
    return `
      <h1>Workout Logs</h1>
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
    $ironfyt.getWorkoutLogs(function (error, response) {
      if (error) {
        component.setState({ error: { message: `Code: ${error.code}, Error: ${error.data.error}` } });
      } else if (response && response.code !== 0) {
        let err = response.data && response.data.error ? response.data.error : 'Some error occurred';
        component.setState({ error: { message: err } });
      } else {
        let logs = response && response.data && response.data.workoutlogs ? response.data.workoutlogs : [];
        component.setState({ logs });
      }
    });
  })();
})();
