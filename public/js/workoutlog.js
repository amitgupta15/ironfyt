(function () {
  'use strict';

  let workoutlogTemplate = function (props) {
    let logs = props && props.logs ? props.logs : [];
    let user = props && props.user ? props.user : {};
    let showingResultsFor = logs && logs.user ? (logs[0].user[0] ? `${logs[0].user[0].fname} ${logs[0].user[0].lname}` : '') : '';
    let filter = props && props.filter ? props.filter : {};
    let name = function (log) {
      let nameString = log.user[0] ? `${log.user[0].fname} ${log.user[0].lname}` : ``;
      let urlString = nameString ? `<a href="workoutlog.html?user_id=${log.user[0]._id}">${nameString}</a>` : ``;
      return nameString ? `<br/><br/><strong>User: </strong> ${user.role === 'admin' ? urlString : nameSring}<br/>` : ``;
    };
    return `
      <div class="container">
        <button id="toggle-logs-btn">${filter.user_id ? `Show All Logs` : `Show My Logs`}</button>
        <h1>${filter.user_id ? `${showingResultsFor}` : `Logs`} (${logs.length})</h1><br/>
        ${logs
          .map((log) => {
            let workout = log.workout && log.workout.length ? log.workout[0] : {};
            return `
          <div><br/>
            <strong>Date: </strong>${new Date(log.date).toLocaleDateString()} <a href="workoutlog-form.html?_id=${log._id}">Edit</a> <button id="delete-${log._id}">Delete</button><br/>
            ${log.rounds ? `<strong>Rounds: </strong>${log.rounds}<br/>` : ''}
            ${log.duration ? `<strong>Duration: </strong>${log.duration.hours ? log.duration.hours : '00'}:${log.duration.minutes ? log.duration.minutes : '00'}:${log.duration.seconds ? log.duration.seconds : '00'}<br/>` : ''}
            ${log.load ? `<strong>Load: </strong>${log.load}<br/>` : ''}
            ${log.notes ? `<strong>Notes: </strong>${$hl.replaceNewLineWithBR(log.notes)}<br/>` : ''}
            ${log.modality ? `<strong>Modality: </strong>${log.modality.map((mod) => mod)}<br/>` : ''}
            ${
              workout.name
                ? `<strong>Workout: </strong><br/>
                  ${workout.name ? `<a href="workout.html?user_id=${user._id}&workout_id=${workout._id}">${workout.name}</a><br/>` : ''}
                  ${workout.type ? `${workout.type}<br/>` : ''}
                  ${workout.timecap ? `${workout.timecap}<br/>` : ''}
                  ${workout.reps ? `${workout.reps}<br/>` : ''}
                  ${workout.rounds ? `${workout.rounds}<br/>` : ''}
                  ${workout.description ? `${$hl.replaceNewLineWithBR(workout.description)}` : ''}`
                : ''
            }
            ${filter.user_id ? `` : name(log)}
            <br/><br/><hr/>
          </div>
        `;
          })
          .join(' ')}
      </div>
    `;
  };

  let component = ($ironfyt.workoutlogComponent = Component('[data-app=workoutlog]', {
    state: {
      logs: [],
      user: {},
      filter: {},
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogTemplate);
    },
  }));

  let handleToggleLogsEvent = function (event) {
    let state = component.getState();
    let { filter, user } = state;
    filter = JSON.stringify(filter) === '{}' ? { user_id: user._id } : {};
    getLogs(filter, user);
  };

  // By default, only get the logs for the logged in user
  let getLogs = function (filter = {}, user) {
    $ironfyt.getWorkoutLogs(filter, function (error, response) {
      if (error) {
        console.log(error);
        component.setState({ error });
      } else {
        let logs = response && response.workoutlogs ? response.workoutlogs : [];
        logs = logs.sort(function (a, b) {
          return new Date(b['date']) - new Date(a['date']);
        });
        component.setState({ logs, user, filter });
      }
    });
  };

  let deleteWorkoutLog = function (targetId) {
    let _id = targetId.substring(7, targetId.length);
    if (_id.length === 24) {
      $ironfyt.deleteWorkoutLog(_id, function (error, response) {
        if (!error) {
          $ironfyt.navigateToUrl('workoutlog.html');
        }
      });
    } else {
      console.error('Invalid ID');
    }
  };

  ($ironfyt.workoutlogPage = function () {
    let { user } = $ironfyt.getCredentials();
    user = user ? user : {};
    if (JSON.stringify(user) === '{}') {
      component.setState({ error: { message: 'User not found, logout and log back in.' } });
    } else {
      let params = $hl.getParams();
      let filter = JSON.stringify(params) !== '{}' ? params : { user_id: user._id };
      getLogs(filter, user);
    }
  })();

  $hl.eventListener('click', 'toggle-logs-btn', handleToggleLogsEvent);
  document.addEventListener('click', function (event) {
    let idregex = new RegExp(/^delete-([a-zA-Z]|\d){24}/gm);
    if (idregex.test(event.target.id)) {
      deleteWorkoutLog(event.target.id);
    }
  });
})();
