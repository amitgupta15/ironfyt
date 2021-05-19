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
      startdate: null,
      enddate: null,
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
        let startdate = params && params.startdate ? params.startdate : false;
        let enddate; // Ignore any end date provided in the url parameters. Only use start date to determine the end date of the month
        let today = new Date();
        if (!startdate) {
          // For calendar start date is always the beginning of the month
          startdate = `${$hl.formatDateForInputField(new Date(today.getFullYear(), today.getMonth()))}T00:00:00.000Z`;
          // For calendar end date is always the end of the month
          enddate = `${$hl.formatDateForInputField(new Date(today.getFullYear(), today.getMonth() + 1, 0))}T23:59:59.000Z`;
        } else {
          let tempStartDate = new Date(startdate);
          startdate = `${$hl.formatDateForInputField(new Date(tempStartDate.getFullYear(), tempStartDate.getMonth()))}T00:00:00.000Z`;
          enddate = `${$hl.formatDateForInputField(new Date(tempStartDate.getFullYear(), tempStartDate.getMonth() + 1, 0))}T23:59:59.000Z`;
        }

        $ironfyt.getWorkoutLogs({ startdate, enddate }, function (error, response) {
          if (!error) {
            let logs = response && response.workoutlogs ? response.workoutlogs : [];
            component.setState({ user, logs, startdate, enddate });
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
