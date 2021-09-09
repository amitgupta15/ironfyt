(function () {
  'use strict';

  let defaultPageTemplateLogList = function (props) {
    let workoutlogs = props && props.workoutlogs ? props.workoutlogs : [];
    return `
    <div class="margin-bottom-5px text-color-secondary">${workoutlogs.length} Logs</div>
    ${workoutlogs
      .map(
        (log) => `
      <div class="rounded-corner-box margin-bottom-5px">
        <div class="margin-bottom-5px text-color-secondary"><h3>Date: ${new Date(log.date).toLocaleDateString()}</h3></div>
        ${log.modality && log.modality.length ? `<p>${log.modality.map((m) => `<span class="modality-${m}">${$ironfyt.formatModality(m)}</span>`).join(' ')}</p>` : ''}
        ${
          log.workout_id
            ? `
              <div class="text-color-secondary "><h3>Workout</h3></div>
              ${$ironfyt.displayWorkoutDetail(log.workout[0], false, true)}
            `
            : ``
        }
        <div class="text-color-secondary margin-top-10px"><h3>Log</h3></div>
        <div>${$ironfyt.displayWorkoutLogDetail(log)}</div>
        ${
          log.workout_id
            ? `<div class="margin-top-10px">
                <a href="workout-activity.html?workout_id=${log.workout_id}&ref=workoutlog-list.html" class="workout-history-link">Workout Log</a>
              </div>`
            : ''
        }
      </div>`
      )
      .join(' ')}
    `;
  };
  let workoutLogListTemplate = function (props) {
    return `
    <div class="container">
      <div class="text-align-right"><a class="btn-primary icon-calendar" href="workoutlog-calendar.html">Calendar View</a></div>
      <!--${$ironfyt.searchBarTemplate('search-workout-logs-list-input', 'Search Logs...')}-->
      <div id="main-div-workout-list">
        ${defaultPageTemplateLogList(props)}      
      </div>
    </div>
    `;
  };

  let component = ($ironfyt.workoutLogListComponent = Component('[data-app=workoutlog-list]', {
    state: {
      error: '',
      user: {},
      workoutlogs: [],
      pageTitle: 'Logs',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutLogListTemplate);
    },
  }));

  ($ironfyt.workoutLogListPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user });
      $ironfyt.getWorkoutLogs({ user_id: user._id }, function (error, response) {
        if (error) {
          component.setState({ error });
          return;
        }
        let workoutlogs = response && response.workoutlogs ? response.workoutlogs : [];
        component.setState({ workoutlogs: workoutlogs });
      });
    });
  })();
})();
