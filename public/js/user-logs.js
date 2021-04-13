(function () {
  'use strict';

  let userLogsTemplate = function (props) {
    let logs = props && props.logs ? props.logs : [];
    console.log(logs);
    return `User Logs`;
  };

  let component = ($ironfyt.userLogsComponent = Component('[data-app=user-logs]', {
    state: {
      logs: [],
      error: '',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, userLogsTemplate);
    },
  }));

  ($ironfyt.userLogsPage = function () {
    let params = $hl.getParams();
    let _id = params && params._id ? params._id : false;
    if (_id) {
      $ironfyt.fetchUserLogs(_id, function (error, logs) {
        if (!error) {
          console.log(logs);
        }
      });
    } else {
      component.setState({ error: `No User Id provided to fetch the logs` });
    }
  })();
})();
