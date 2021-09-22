(function () {
  'use strict';

  let groupTemplate = function (props) {
    let group = props && props.group ? props.group : {};
    let date = props && props.date ? new Date(props.date) : false;
    let workout = group && group.groupwod && group.groupwod.length ? group.groupwod[0].workout : false;
    let workoutlogs = group && group.logs ? group.logs : [];
    let user = props && props.user ? props.user : {};
    return `
    <div class="position-relative text-color-primary margin-bottom-10px text-align-center">
      <h3 class="group-name">${group.name}</h3>
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
              <div class="text-color-secondary margin-bottom-10px"><h3>WOD</h3></div>
              ${$ironfyt.displayWorkoutDetail(workout)}
              <div class="margin-top-10px">
                <a href="workout-activity.html?workout_id=${workout._id}&ref=group.html" class="workout-history-link">Workout Log</a>
              </div>
            </div>`
          : ``
      }
      <div class="log-detail-section">
        ${workoutlogs.length === 0 ? 'No activity found' : ''}
        ${workoutlogs
          .map(function (log) {
            return `
            <div class="log-detail-container">
              <div class="item-btn-bar">
                ${$ironfyt.isAdmin(user) ? `<button class="item-copy-btn" id="copy-log-btn-${log._id}"></button>` : ``}
              </div>
              <div class="margin-bottom-5px bold-text">${log.user.fname} ${log.user.lname} <div class="text-color-secondary">${log.user.username}</div> </div>
              ${log.workout ? `${$ironfyt.displayWorkoutDetail(log.workout, false)}` : ``}
              ${$ironfyt.displayWorkoutLogDetail(log)}
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
      pageTitle: 'Group',
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
  document.addEventListener('click', function (event) {
    let targetId = event.target.id;
    let state = component.getState();

    let copyBtnRegex = new RegExp(/^copy-log-btn-([a-zA-Z]|\d){24}/);
    if (copyBtnRegex.test(targetId)) {
      let prefix = 'copy-log-btn-';
      let _id = targetId.substring(prefix.length, targetId.length);
      let user_id = state.user._id;
      $ironfyt.navigateToUrl(`workoutlog-form.html?_id=${_id}&user_id=${user_id}&ref=group.html&group_id=${state.group._id}&admincopy=1`);
    }
  });
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
      date.setHours(0, 0, 0, 0);
      let group_id = params && params.group_id ? params.group_id : false;
      let usergroups = user && user.groups ? user.groups : [];
      if (usergroups.indexOf(group_id) < 0) {
        component.setState({ error: 'You are not allowed to view this group page' });
      }
      getGroupActivity(group_id, date);
    });
  })();
})();
