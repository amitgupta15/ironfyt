(function () {
  ('use strict');

  let confirmDeleteLogModalDialogTemplate = function () {
    return `
    <div class="modal-container" id="delete-log-confirmation-dialog">
      <div class="modal-dialog">
        <p>Are you sure, you want to delete the log?</p>
        <div class="modal-dialog-btn-bar">
          <button class="delete" id="confirm-delete-log-btn">Delete</button>
          <button class="cancel" id="cancel-delete-log-btn">Cancel</button>
        </div>
      </div>
    </div>
    `;
  };

  let workoutActivityTemplate = function (props) {
    let workoutlogs = props && props.workoutlogs ? props.workoutlogs : [];
    let workout = props && props.workout ? props.workout : {};
    let pr = props && props.pr ? props.pr : {};
    return `
    <div class="container">
      <div class="position-relative text-color-primary margin-bottom-5px text-align-center">
        <h4>Workout Activity</h4>
      </div>
      <div class="rounded-border-primary margin-top-10px">
        ${$ironfyt.displayWorkoutDetail(workout)}
        <a href="workoutlog-form.html?workout_id=${workout._id}&ref=workout-activity.html" class="log-this-workout-btn">Log This WOD</a>
      </div>
      <div class="day-log-detail">
        ${workoutlogs.length === 0 ? 'No activity found' : ''}
        ${workoutlogs
          .map(function (log) {
            let isPr = log._id === pr._id;
            return `
          <div class="day-log-detail-container-calendar-view">
            <div class="day-log-detail-container-calendar-view-btn-bar">
              <button class="day-log-detail-edit-btn" id="edit-log-btn-${log._id}"></button>
              <button class="day-log-detail-delete-btn" id="delete-log-btn-${log._id}"></button>
            </div>
            <div>
              <div class="margin-bottom-5px text-color-secondary">${new Date(log.date).toLocaleDateString()} ${isPr ? `<span class="text-color-tertiary bold-text">PR</span>` : ''}</div>
              ${
                log.duration && (parseInt(log.duration.hours) > 0 || parseInt(log.duration.minutes) > 0 || parseInt(log.duration.seconds) > 0)
                  ? `<p><strong>Duration: </strong>${log.duration.hours ? `${log.duration.hours} hr` : ''} ${log.duration.minutes ? `${log.duration.minutes} mins` : ''} ${log.duration.seconds ? `${log.duration.seconds} secs` : ''}</p>`
                  : ''
              }
              ${
                log.roundinfo && log.roundinfo.length && log.roundinfo[0].rounds
                  ? `<div class="flex">
                      <div><strong>Rounds: </strong></div>
                      <div class="margin-left-5px">${log.roundinfo.map((roundinfo) => `${roundinfo.rounds ? ` ${roundinfo.rounds}` : ''}${roundinfo.load ? ` X ${roundinfo.load} ${roundinfo.unit}` : ``}`).join('<br/>')}</div>
                    </div>`
                  : ''
              }
              ${
                log.totalreps
                  ? `<div class="flex">
                      <div><strong>Total Reps:</strong></div>
                      <div class="margin-left-5px">${log.totalreps}</div>
                    </div>`
                  : ``
              }
              ${
                log.movements && log.movements.length
                  ? `<div>
                      <div><strong>Movements: </strong></div>
                      <div class="margin-left-5px">${log.movements.map((movement) => `${movement.movement}: ${movement.reps ? ` ${movement.reps}` : ''}${movement.load ? ` X ${movement.load}` : ``}${movement.unit ? ` ${movement.unit}` : ``}`).join('<br/>')}</div>
                    </div>`
                  : ''
              }
              ${
                log.notes
                  ? `<div>
                      <div><strong>Notes: </strong></div>
                      <div class="margin-left-5px">${$hl.replaceNewLineWithBR(log.notes)}</div>
                    </div>`
                  : ''
              }
              ${
                log.location
                  ? `<div class="flex">
                      <div><strong>Location: </strong></div>
                      <div class="margin-left-5px">${log.location}</div>
                    </div>`
                  : ''
              }
            </div>
          </div>`;
          })
          .join(' ')}
      </div>
    </div>
    ${confirmDeleteLogModalDialogTemplate()}
    `;
  };

  let component = ($ironfyt.workoutActivityComponent = Component('[data-app=workout-activity]', {
    state: {
      user: '',
      error: '',
      workoutlogs: [],
      pr: {},
      workout: {},
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutActivityTemplate);
    },
  }));

  let showDeleteConfirmationDialog = function (_id) {
    component.setState({ deleteLogId: _id });
    let deleteConfirmationDialog = document.querySelector('#delete-log-confirmation-dialog');
    deleteConfirmationDialog.style.display = 'flex';
  };
  let handleCancelDeleteLogEvent = function () {
    component.setState({ deleteLogId: null });
    let deleteConfirmationDialog = document.querySelector('#delete-log-confirmation-dialog');
    deleteConfirmationDialog.style.display = 'none';
  };

  let handleConfirmDeleteLogEvent = function () {
    let state = component.getState();

    if (state.deleteLogId) {
      $ironfyt.deleteWorkoutLog(state.deleteLogId, function (error, result) {
        if (!error) {
          $ironfyt.navigateToUrl(`workout-activity.html?ref=workout-activity.html&workout_id=${state.workoutlogs[0].workout[0]._id}`);
        } else {
          component.setState({ error });
        }
      });
    } else {
      component.setState({ error: { message: 'No log found to delete' } });
    }
  };

  $hl.eventListener('click', 'cancel-delete-log-btn', handleCancelDeleteLogEvent);
  $hl.eventListener('click', 'confirm-delete-log-btn', handleConfirmDeleteLogEvent);

  document.addEventListener('click', function (event) {
    let targetId = event.target.id;
    let state = component.getState();
    // Handle edit button click
    let editBtnRegex = new RegExp(/^edit-log-btn-([a-zA-Z]|\d){24}/);
    if (editBtnRegex.test(targetId)) {
      let prefix = 'edit-log-btn-';
      let _id = event.target.id.substring(prefix.length, event.target.id.length);
      let user_id = state.user._id;
      $ironfyt.navigateToUrl(`workoutlog-form.html?_id=${_id}&user_id=${user_id}&ref=workout-activity.html`);
    }

    // Handle delete button click
    let deleteBtnRegex = new RegExp(/^delete-log-btn-([a-zA-Z]|\d){24}/);
    if (deleteBtnRegex.test(targetId)) {
      let prefix = 'delete-log-btn-';
      let _id = event.target.id.substring(prefix.length, event.target.id.length);
      showDeleteConfirmationDialog(_id);
    }
  });

  ($ironfyt.workoutActivityPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error });
        return;
      } else {
        let user = auth && auth.user ? auth.user : {};
        component.setState({ user });
        let params = $hl.getParams();
        let workout_id = params && params.workout_id ? params.workout_id : false;
        if (workout_id && workout_id.length === 24) {
          $ironfyt.getWorkouts({ _id: workout_id }, function (error, response) {
            if (error) {
              component.setState({ error });
              return;
            }
            let workout = response && response.workouts ? response.workouts[0] : {};
            component.setState({ workout });
          });
          $ironfyt.getWorkoutLogs({ workout_id, user_id: user._id }, function (error, response) {
            if (error) {
              component.setState({ error });
              return;
            } else {
              let workoutlogs = response && response.workoutlogs ? sortByDateDesc(response.workoutlogs) : [];
              $ironfyt.getPersonalRecord({ workout_id, user_id: user._id }, function (error, response) {
                if (error) {
                  component.setState({ error });
                  return;
                } else {
                  let pr = response && response.log ? response.log : {};
                  component.setState({ workoutlogs: workoutlogs, pr: pr });
                }
              });
            }
          });
        } else {
          component.setState({ error: 'Please provide a valid workout_id in the URL params to retrieve the activity log' });
        }
      }
    });
  })();

  let sortByDateDesc = function (arr) {
    return arr.sort(function (a, b) {
      return new Date(b['date']) - new Date(a['date']);
    });
  };
})();
