(function () {
  'use strict';

  let workoutlogsTemplate = function (props) {
    let user = props && props.user ? props.user : {};
    let workoutlogs = props && props.workoutlogs ? props.workoutlogs : [];
    let selectedUser = props && props.selectedUser ? props.selectedUser : {};
    let title = `${$ironfyt.isAdmin(user) && JSON.stringify(selectedUser) === '{}' && workoutlogs.length ? 'All Logs' : `${selectedUser.fname}'s Logs`} (${workoutlogs.length})`;
    let loglink = $ironfyt.isAdmin(user) ? (JSON.stringify(selectedUser) !== '{}' ? `<div><a href="workoutlogs.html">All Logs</a></div>` : `<div><a href="workoutlogs.html?user_id=${user._id}">My Logs</a></div>`) : ``;
    return `${loglink}
    <h2>${title}</h2>`;
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
})();
