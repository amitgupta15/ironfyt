(function () {
  'use strict';

  let groupTemplate = function (props) {
    let group = props && props.group ? props.group : {};
    let date = props && props.date ? new Date(props.date) : false;
    let workout = group && group.groupwod && group.groupwod.length ? group.groupwod[0].workout : false;
    let workoutlogs = group && group.logs ? group.logs : [];
    return `
    <div class="position-relative text-color-primary margin-bottom-5px text-align-center">
      <h3>${group.name}</h3>
    </div>
    <div class="selected-day-control-bar">
      <div><button class="day-control" id="prev-day-btn">&#9668;</button></div>
      <div>${date ? date.toDateString() : ''}</div>
      <div><button class="day-control" id="next-day-btn">&#9658;</button></div>
    </div>
    <div class="container">
      ${
        workout
          ? `<div class="rounded-border-primary">
              <div class="text-color-primary padding-bottom-10px bold-text">Workout of the Day</div>
              ${$ironfyt.displayWorkoutDetail(workout)}
            </div>`
          : ``
      }
      <div class="day-log-detail">
        ${workoutlogs.length === 0 ? 'No activity found' : ''}
        ${workoutlogs
          .map(function (log) {
            return `
            <div class="day-log-detail-container-calendar-view">
              <div>
                <div class="margin-bottom-5px text-color-secondary">${log.user.fname} ${log.user.lname} <span class="muted-text">(${log.user.username})</span> </div>
                ${log.workout ? `${$ironfyt.displayWorkoutDetail(log.workout, false)}` : ``}
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
    
    `;
  };
  let component = ($ironfyt.groupComponent = Component('[data-app=group]', {
    state: {
      user: {},
      error: '',
      group: {},
      date: '',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, groupTemplate);
    },
  }));

  ($ironfyt.groupPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user });
      let params = $hl.getParams();
      let date = params && params.date ? new Date(params.date) : new Date();
      let group_id = params && params.group_id ? params.group_id : false;
      let usergroups = user && user.groups ? user.groups : [];
      if (usergroups.indexOf(group_id) < 0) {
        component.setState({ error: 'You are not allowed to view this group page' });
      }
      if (group_id) {
        $ironfyt.getGroup({ _id: group_id, date }, function (error, response) {
          if (error) {
            component.setState({ error });
            return;
          }
          let group = response && response.length ? response[0] : {};
          component.setState({ group, date });
        });
      } else {
        component.setState({ error: 'No Group Selected' });
        return;
      }
    });
  })();
})();
