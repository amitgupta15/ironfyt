(function () {
  'use strict';

  let workoutlogsTemplate = function (props) {
    let user = props && props.user ? props.user : {};
    let workoutlogs = props && props.workoutlogs ? props.workoutlogs : [];
    let selectedUser = props && props.selectedUser ? props.selectedUser : {};
    let title = `${$ironfyt.isAdmin(user) && JSON.stringify(selectedUser) === '{}' && workoutlogs.length ? 'All Logs' : `${selectedUser.fname}'s Logs`} (${workoutlogs.length})`;
    let loglink = $ironfyt.isAdmin(user) ? (JSON.stringify(selectedUser) !== '{}' ? `<div><a href="workoutlogs.html">All Logs</a></div>` : `<div><a href="workoutlogs.html?user_id=${user._id}">My Logs</a></div>`) : ``;

    return `
    <div class="container">
      ${loglink}
      <h2>${title}</h2>
      <hr/><br/>
      ${workoutlogs
        .map((log) => {
          let workout = log.workout && log.workout.length ? log.workout[0] : {};
          let name = function (log) {
            let nameString = log.user[0] ? `${log.user[0].fname} ${log.user[0].lname}` : ``;
            let urlString = nameString ? `<a href="workoutlogs.html?user_id=${log.user[0]._id}">${nameString}</a>` : ``;
            return nameString ? `<br/><br/><strong>User: </strong> ${urlString}<br/>` : ``;
          };
          return `
            <p><strong>${new Date(log.date).toLocaleDateString()}</strong> <a href="workoutlog-form.html?_id=${log._id}">Edit</a> <button id="delete-${log._id}">Delete</button></p>
            ${log.duration ? `<p><strong>Duration: </strong>${log.duration.hours ? log.duration.hours : '00'}:${log.duration.minutes ? log.duration.minutes : '00'}:${log.duration.seconds ? log.duration.seconds : '00'}</p>` : ''}
            ${
              log.roundinfo
                ? log.roundinfo
                    .map(function (item) {
                      return ` ${item.rounds ? `<p><strong>Rounds: </strong> ${item.rounds}&nbsp;&nbsp;&nbsp;` : ''} 
                      ${item.load ? `<strong>Load: </strong> ${item.load} ${item.unit ? item.unit : ''}&nbsp;&nbsp;&nbsp;` : ''}
                      ${item.reps ? `<strong>Reps: </strong> ${item.reps}` : ''}</p>`;
                    })
                    .join('')
                : ''
            }
            ${log.notes ? `<strong>Notes: </strong>${$hl.replaceNewLineWithBR(log.notes)}<br/>` : ''}
            ${log.modality && log.modality.length ? `<strong>Modality: </strong>${log.modality.map((mod) => mod)}<br/>` : ''}
            ${
              workout.name
                ? `<strong>Workout: </strong><br/>
                  ${workout.name ? `<a href="workout.html?user_id=${user._id}&workout_id=${workout._id}">${workout.name}</a><br/>` : ''}
                  ${workout.type ? `${workout.type}<br/>` : ''}
                  ${workout.timecap ? `${workout.timecap}<br/>` : ''}
                  ${workout.reps ? `${workout.reps}<br/>` : ''}
                  ${workout.rounds ? `${workout.rounds}<br/>` : ''}
                  ${workout.description ? `${$hl.replaceNewLineWithBR(workout.description)}` : ''}<br/>`
                : ''
            }
            ${JSON.stringify(selectedUser) === '{}' ? name(log) : ``}
            <br/>
            <hr/>
            `;
        })
        .join('')}
    </div>
    `;
  };

  let component = ($ironfyt.workoutlogsComponent = Component('[data-app=workoutlogs-list]', {
    state: {
      selectedUser: {}, //User for whom logs are being displayed
      user: {}, // Logged in user
      workoutlogs: [],
      error: '',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogsTemplate);
    },
  }));

  let sortLogsByDateDesc = function (logs) {
    return logs.sort(function (a, b) {
      return new Date(b['date']) - new Date(a['date']);
    });
  };

  let deleteWorkoutLog = function (targetId) {
    let prefix = 'delete-';
    let _id = targetId.substring(prefix.length, targetId.length);
    if (_id.length === 24) {
      $ironfyt.deleteWorkoutLog(_id, function (error, response) {
        if (!error) {
          $ironfyt.navigateToUrl('workoutlogs.html');
        }
      });
    } else {
      console.error('Invalid ID');
    }
  };

  ($ironfyt.workoutlogsPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      let user = auth && auth.user ? auth.user : {};
      if (!error) {
        let params = $hl.getParams();
        let user_id = params && params.user_id ? params.user_id : false;
        if (user_id) {
          if (user_id.length === 24) {
            if ($ironfyt.isAdmin(user) || user_id === user._id) {
              $ironfyt.getWorkoutLogs({ user_id }, function (error, response) {
                if (!error) {
                  let workoutlogs = response && response.workoutlogs ? response.workoutlogs : [];
                  workoutlogs = sortLogsByDateDesc(workoutlogs);
                  $ironfyt.getUsers({ _id: user_id }, function (error, response) {
                    if (!error) {
                      let selectedUser = response.user;
                      component.setState({ user, workoutlogs, selectedUser });
                    } else {
                      component.setState({ error });
                    }
                  });
                } else {
                  component.setState({ error });
                }
              });
            } else {
              component.setState({ error: { message: 'Invalid request. Not authorized.' } });
            }
          } else {
            component.setState({ error: { message: 'Invalid User ID' } });
          }
        } else if ($ironfyt.isAdmin(user)) {
          $ironfyt.getWorkoutLogs({}, function (error, response) {
            if (!error) {
              let workoutlogs = response && response.workoutlogs ? response.workoutlogs : [];
              workoutlogs = sortLogsByDateDesc(workoutlogs);
              component.setState({ user, workoutlogs });
            } else {
              component.setState({ error });
            }
          });
        } else {
          $ironfyt.navigateToUrl(`workoutlogs.html?user_id=${user._id}`);
        }
      } else {
        component.setState({ error });
      }
    });
  })();

  document.addEventListener('click', function (event) {
    let idregex = new RegExp(/^delete-([a-zA-Z]|\d){24}/gm);
    if (idregex.test(event.target.id)) {
      deleteWorkoutLog(event.target.id);
    }
  });
})();
