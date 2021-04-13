(function () {
  'use strict';

  let userListTemplate = function (props) {
    let users = props && props.users ? props.users : [];
    return `<ul>
    ${users
      .map(function (user) {
        return `<li><a href="user-logs.html?_id=${user.user._id}">${user.user.fname}</a> (${user.userLogs.length})</li>`;
      })
      .join('')}
      </ul>`;
  };
  let component = ($ironfyt.userListComponent = Component('[data-app=user-list]', {
    state: {
      users: [],
      error: '',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, userListTemplate);
    },
  }));

  ($ironfyt.userListPage = function () {
    $ironfyt.fetchUsers(function (error, users) {
      if (!error) {
        $ironfyt.fetchLogs(function (error, logs) {
          if (!error) {
            users = users
              ? users.map(function (user) {
                  let userLogs = logs.filter(function (log) {
                    return log.user_id === user._id;
                  });
                  return { user: user, userLogs: userLogs };
                })
              : [];
            component.setState({ users });
          } else {
            component.setState({ error: `There was an error while fetching logs: ${error.message}` });
          }
        });
      } else {
        component.setState({ error: 'There was an error while fetching users ' + error.message });
      }
    });
  })();
})();
