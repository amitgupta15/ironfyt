(function () {
  'use strict';

  let component = ($ironfyt.userListComponent = Component('[data-app=user-list]', {
    state: {
      users: [],
      error: '',
    },
    template: function (props) {
      return `<h1>User List</h1>`;
    },
  }));

  (function userListPage() {
    $ironfyt.fetchUsers(function (error, users) {
      console.log(users);
    });
  })();
})();
