(function () {
  'use strict';

  let workoutLogCalendarTemplate = function (props) {
    return `<h1>Calendar</h1>`;
  };

  let component = ($ironfyt.workoutLogCalendarComponent = Component('[data-app=workoutlog-calendar]', {
    state: {
      logs: [],
      error: '',
      user: {},
      year: null,
      month: null,
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutLogCalendarTemplate);
    },
  }));

  ($ironfyt.workoutLogCalendarPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        let params = $hl.getParams();
        let month = params && params.month ? parseInt(params.month) : new Date().getMonth();
        let year = params && params.year ? parseInt(params.year) : new Date().getFullYear();
        let startdate = `${$hl.formatDateForInputField(new Date(year, month))}T00:00:00.000Z`;
        let enddate = `${$hl.formatDateForInputField(new Date(year, month + 1, 0))}T23:59:59.000Z`;

        $ironfyt.getWorkoutLogs({ startdate, enddate }, function (error, response) {
          if (!error) {
            let logs = response && response.workoutlogs ? response.workoutlogs : [];
            console.log(logs);
            component.setState({ user, month, year, logs });
          } else {
            component.setState({ error });
          }
        });
      } else {
        component.setState({ error });
      }
    });
  })();
})();
