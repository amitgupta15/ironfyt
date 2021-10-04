(function () {
  'use strict';

  let displayGroupWod = function (dateString, groupwods) {
    let date = dateString ? new Date(dateString) : false;
    if (date) {
      let wods = groupwods.filter((groupwod) => {
        let wodDate = new Date(groupwod.date);
        return wodDate.getFullYear() === date.getFullYear() && wodDate.getMonth() === date.getMonth() && wodDate.getDate() === date.getDate();
      });
      if (wods.length) {
        return wods.map(
          (wod) => `<div class="rounded-corner-box">
              <div class="text-color-secondary margin-bottom-10px"><h3>WOD</h3></div>
              ${$ironfyt.displayWorkoutDetail(wod.workout)}
              <div class="margin-top-10px">
                <a href="workout-activity.html?workout_id=${wod._id}&ref=group.html" class="workout-history-link">Workout Log</a>
              </div>
            </div>`
        );
      }
    }
    return ``;
  };

  let currentDate;
  let displayDate = function (dateString, groupwods) {
    let date = dateString ? new Date(dateString) : false;
    if (date) {
      if (currentDate === undefined) {
        currentDate = date;
        return `
          <h3 class="bold-text text-align-center margin-top-20px margin-bottom-20px text-color-highlight">${currentDate.toDateString()}</h3>
          ${displayGroupWod(dateString, groupwods)}
          `;
      } else {
        let noDateChange = currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth() && currentDate.getDate() === date.getDate();
        if (noDateChange) {
          return ``;
        } else {
          currentDate = date;
          return `
            <h3 class="bold-text text-align-center margin-top-20px margin-bottom-20px text-color-highlight">${currentDate.toDateString()}</h3>
            ${displayGroupWod(dateString, groupwods)}
            `;
        }
      }
    }
    return ``;
  };

  let groupTemplate = function (props) {
    let group = props && props.group ? props.group : {};
    let showSpinner = props && props.showSpinner;
    // let workout = group && group.groupwod && group.groupwod.length ? group.groupwod[0].workout : false;
    let workoutlogs = group && group.logs ? group.logs : [];
    let user = props && props.user ? props.user : {};
    let groupwods = group && group.groupwod ? group.groupwod : [];
    return !showSpinner
      ? `
      <div class="position-relative text-color-primary margin-bottom-10px text-align-center">
        <h3 class="group-name">${group.name}</h3>
      </div>
      <div class="container">
        <div class="log-detail-section">
          ${workoutlogs.length === 0 ? 'No activity found' : ''}
          ${workoutlogs
            .map(function (log) {
              return `
              ${displayDate(log.date, groupwods)}
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
      `
      : $ironfyt.displaySpinner('Breathe in... breathe out...');
  };

  let component = ($ironfyt.groupComponent = Component('[data-app=group]', {
    state: {
      user: {},
      error: '',
      group: {},
      date: '',
      pageTitle: 'Group',
      showSpinner: false,
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, groupTemplate);
    },
  }));

  ($ironfyt.groupPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error, showSpinner: false });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user, showSpinner: true });
      let params = $hl.getParams();
      let group_id = params && params.group_id ? params.group_id : false;
      let usergroups = user && user.groups ? user.groups : [];
      if (usergroups.indexOf(group_id) < 0) {
        component.setState({ error: 'You are not allowed to view this group page', showSpinner: false });
        return;
      }
      $ironfyt.getGroup({ _id: group_id }, function (error, response) {
        if (error) {
          component.setState({ error, showSpinner: false });
          return;
        }
        let group = response && response.length ? response[0] : {};
        component.setState({ group, showSpinner: false });
      });
    });
  })();
})();
