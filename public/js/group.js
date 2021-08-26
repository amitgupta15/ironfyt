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
      <div><button class="day-control" id="group-prev-day-btn">&#9668;</button></div>
      <div>${date ? date.toDateString() : ''}</div>
      <div><button class="day-control" id="group-next-day-btn">&#9658;</button></div>
    </div>
    <div class="container">
      ${
        workout
          ? `<div class="rounded-corner-box">
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
                ${$ironfyt.displayWorkoutLogDetail(log)}
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

  let handleDayChangeEvent = function (event) {
    let state = component.getState();
    let date = new Date(state.date);
    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth();
    let currentDate = date.getDate();
    let group_id = state.group._id;
    if (event.target.id === 'group-prev-day-btn') {
      date = new Date(currentYear, currentMonth, currentDate - 1);
    } else if (event.target.id === 'group-next-day-btn') {
      date = new Date(currentYear, currentMonth, currentDate + 1);
    }
    getGroupActivity(group_id, date);
  };

  $hl.eventListener('click', 'group-prev-day-btn', handleDayChangeEvent);
  $hl.eventListener('click', 'group-next-day-btn', handleDayChangeEvent);

  let getGroupActivity = function (group_id, date) {
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
  };

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
      getGroupActivity(group_id, date);
    });
  })();
})();
