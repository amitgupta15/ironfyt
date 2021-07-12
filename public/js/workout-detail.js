(function () {
  'use strict';

  let workoutDetailTemplate = function (props) {
    let workout = props && props.workout ? props.workout : {};
    let workoutlogs = props && props.workoutlogs && props.workoutlogs.length ? props.workoutlogs : [];
    let timecap = $ironfyt.formatTimecap(workout.timecap);
    return `
    <div class="container">
      <h1>${workout.name}</h1>
      <p>
      ${workout.type ? `<strong>Type:</strong> ${workout.type}<br/>` : ''}
        ${timecap ? `<strong>Timecap:</strong> ${timecap}<br/>` : ''}
        ${workout.reps ? `<strong>Reps:</strong> ${workout.reps}<br/>` : ''}
        ${workout.rounds ? `<strong>Rounds:</strong> ${workout.rounds}<br/>` : ''}
        ${workout.modality && workout.modality.length ? `<strong>Modality:</strong> ${workout.modality.map((modality) => $ironfyt.formatModality[modality]).join(', ')}<br/>` : ''}
        ${workout.description ? `${$hl.replaceNewLineWithBR(workout.description)}` : ''}
      </p><hr/><br/>
      <h3>Logs</h3>
      ${workoutlogs
        .map(
          (log) => `<br/><strong>${new Date(log.date).toLocaleDateString()}</strong> <a href="workoutlog-form.html?_id=${log._id}">Edit</a> <button id="delete-${log._id}">Delete</button></p>
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
            ${log.modality && log.modality.length ? `<strong>Modality: </strong>${log.modality.map((mod) => mod)}<br/>` : ''}<br/><hr/>`
        )
        .join('')}
    </div>`;
  };

  let component = ($ironfyt.workoutDetailComponent = Component('[data-app=workout-detail]', {
    state: {
      user: {},
      workout: {},
      logs: [],
      error: '',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutDetailTemplate);
    },
  }));

  ($ironfyt.workoutDetailPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        if (JSON.stringify(user) === '{}') {
          component.setState({ error: { message: 'Some error occurred while authenticating the user' } });
        } else {
          let params = $hl.getParams();
          let _id = params && params._id ? params._id : false;
          if (_id && _id.length === 24) {
            $ironfyt.getWorkouts({ _id }, function (error, response) {
              if (!error) {
                let workout = response && response.workouts && response.workouts.length ? response.workouts[0] : {};
                $ironfyt.getWorkoutLogs({ workout_id: _id, user_id: user._id }, function (error, response) {
                  if (!error) {
                    let workoutlogs = response && response.workoutlogs && response.workoutlogs.length ? response.workoutlogs : [];
                    component.setState({ user, workout, workoutlogs });
                  } else {
                    component.setState({ error, user });
                  }
                });
              }
            });
          } else {
            component.setState({ error: { message: 'Invalid ID' }, user });
          }
        }
      } else {
        component.setState({ error });
      }
    });
  })();
})();
