(function () {
  'use strict';

  let defaultPageTemplateLogList = function (props) {
    let workoutlogs = props && props.workoutlogs ? props.workoutlogs : [];
    let showSpinner = props && props.showSpinner;
    if (showSpinner) {
      return $ironfyt.displaySpinner('Keep moving...');
    }
    return `
    <div class="margin-bottom-5px text-color-secondary">${workoutlogs.length} Logs</div>
    ${workoutlogs
      .map((log) => {
        let workout = log && log.workout && log.workout.length > 0 ? log.workout[0] : {};
        return $ironfyt.displayLogListItemTemplate(log, workout, 'workoutlog-list.html', '', false, false, true);
      })
      .join(' ')}
    `;
  };

  let workoutLogListTemplate = function (props) {
    return `
    <div class="container">
      <div class="text-align-right"><a class="btn-primary icon-calendar" href="workoutlog-calendar.html">Calendar View</a></div>
      ${$ironfyt.searchBarTemplate('search-workout-logs-list-input', 'Search Logs...')}
      <div id="main-div-workout-list">
        ${defaultPageTemplateLogList(props)}      
      </div>
    </div>
    ${$ironfyt.deleteLogConfirmationModalTemplate()}
    `;
  };

  let component = ($ironfyt.workoutLogListComponent = Component('[data-app=workoutlog-list]', {
    state: {
      error: '',
      user: {},
      workoutlogs: [],
      pagename: 'logs',
      showSpinner: false,
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutLogListTemplate);
    },
  }));

  let handleSearchLogsEvent = function (event) {
    let inputField = event.target;
    let mainDiv = document.querySelector('#main-div-workout-list');
    let state = component.getState();
    let workoutlogs = state.workoutlogs ? state.workoutlogs : [];

    //Call the $ironfyt.searchWorkoutLogs() function from helpers/search-logs.js file
    $ironfyt.searchWorkoutLogs(mainDiv, workoutlogs, inputField, defaultPageTemplateLogList, state, 'workoutlog-list.html');
  };

  let showDeleteConfirmationDialog = function (_id) {
    component.setState({ deleteLogId: _id });
    $ironfyt.showDeleteConfirmationDialog();
  };
  let handleCancelDeleteLogEvent = function () {
    component.setState({ deleteLogId: null });
    $ironfyt.hideDeleteConfirmationDialog();
  };

  let handleConfirmDeleteLogEvent = function (event) {
    let state = component.getState();
    let _navigateToUrl = `workoutlog-list.html?ref=workoutlog-list.html`;
    if (state.deleteLogId) {
      $ironfyt.handleConfimDeleteLog(state.deleteLogId, _navigateToUrl, function (error) {
        if (error) component.setState({ error });
      });
    } else {
      component.setState({ error: { message: 'No log found to delete' } });
    }
  };
  $hl.eventListener('input', 'search-workout-logs-list-input', handleSearchLogsEvent);
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
      $ironfyt.navigateToUrl(`workoutlog-form.html?_id=${_id}&ref=workoutlog-list.html`);
    }

    // Handle delete button click
    let deleteBtnRegex = new RegExp(/^delete-log-btn-([a-zA-Z]|\d){24}/);
    if (deleteBtnRegex.test(targetId)) {
      let prefix = 'delete-log-btn-';
      let _id = event.target.id.substring(prefix.length, event.target.id.length);
      showDeleteConfirmationDialog(_id);
    }
  });

  ($ironfyt.workoutLogListPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user, showSpinner: true });
      $ironfyt.getWorkoutLogs({ user_id: user._id }, function (error, response) {
        if (error) {
          component.setState({ error, showSpinner: false });
          return;
        }
        let workoutlogs = response && response.workoutlogs ? response.workoutlogs : [];
        component.setState({ workoutlogs: workoutlogs, showSpinner: false });
      });
    });
  })();
})();
