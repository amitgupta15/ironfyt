(function () {
  ('use strict');

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let veryShortDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  let monthControlBarTemplate = function (props) {
    let displayUser = props && props.displayUser ? props.displayUser : {};
    let month = props && typeof props.month === 'number' ? props.month : '';
    let year = props && props.year ? props.year : '';
    let user = props && props.user ? props.user : {};
    return `
    <div class="calendar-month-control-bar">
      <div>${months[month]} ${year}</div>
      <div id="display-name-calendar-view">${displayUser._id !== user._id ? displayUser.fname : ''}</div>
      <div>
        <button id="today-btn">Today</button>
        <button class="month-control" id="prev-month-btn">&#9668;</button>
        <button class="month-control" id="next-month-btn">&#9658;</button>
      </div>
    </div>
    `;
  };

  let calendarGridTemplate = function (props) {
    let days = props && props.days ? props.days : [];
    let selectedDay = props && props.selectedDay ? props.selectedDay : {};
    return `
    <div class="calendar-grid">
      ${veryShortDays.map((vShortDay) => `<div class="date-cell header">${vShortDay}</div>`).join('')}
      ${days
        .map(
          (day, index) =>
            `<div class="date-cell ${day.class} ${new Date(day.date) - new Date(selectedDay.date) === 0 ? `selected-date-cell` : ``} ${'logs' in day ? `day-has-log` : ``}" id="date-cell-${index}">${new Date(day.date).getDate()}${
              day.modalities && day.modalities.length ? day.modalities.map((m, i) => `<div class="modality-indicator-${i} modality-indicator-${m}">.</div>`).join('') : ''
            }</div>`
        )
        .join('')}
    </div>
    `;
  };

  let selectedDayControlBarTemplate = function (props) {
    let selectedDay = props && props.selectedDay ? props.selectedDay : {};
    return `
    <div class="selected-day-control-bar">
      <div>${selectedDay.date ? `${longDays[new Date(selectedDay.date).getDay()]}, ${months[new Date(selectedDay.date).getMonth()]} ${new Date(selectedDay.date).getDate()}, ${new Date(selectedDay.date).getFullYear()}` : ''}</div>
      <div>
        <button class="day-control" id="prev-day-btn">&#9668;</button>
        <button class="day-control" id="next-day-btn">&#9658;</button>
      </div>
    </div>
    `;
  };

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

  let displayLogOfTheDayTemplate = function (props) {
    let selectedDay = props && props.selectedDay ? props.selectedDay : {};
    return `
    <div class="day-detail-container">
      ${
        selectedDay.logs
          ? `
        <div class="day-log-detail">
          ${selectedDay.logs
            .map(
              (log) => `
              <div class="day-log-detail-container-calendar-view">
                <div class="day-log-detail-container-calendar-view-btn-bar">
                  <button class="day-item-edit-btn" id="edit-log-btn-${log._id}"></button>
                  <button class="day-item-delete-btn" id="delete-log-btn-${log._id}"></button>
                </div>
                <div>
                  ${log.modality && log.modality.length ? `<p><strong>Modality: </strong>${log.modality.map((m) => `<span class="modality-${m}">${$ironfyt.formatModality(m)}</span>`).join(' ')}</p>` : ''}
                  ${log.workout && log.workout.length ? `${$ironfyt.displayWorkoutDetail(log.workout[0], false)}` : ''}
                  ${$ironfyt.displayWorkoutLogDetail(log)}
                </div>
              </div>
              `
            )
            .join('')}
        </div>`
          : ``
      }
      <div class="add-log-btn-bar-calendar-view"><button id="add-log-btn-calendar-view">Add Log</button></div>
    </div>
    `;
  };
  let workoutLogCalendarTemplate = function (props) {
    return `
    ${monthControlBarTemplate(props)}
    ${calendarGridTemplate(props)}
    ${selectedDayControlBarTemplate(props)}
    ${displayLogOfTheDayTemplate(props)}
    ${confirmDeleteLogModalDialogTemplate()}
    `;
  };

  let component = ($ironfyt.workoutLogCalendarComponent = Component('[data-app=workoutlog-calendar]', {
    state: {
      error: '',
      user: {},
      month: null,
      year: null,
      displayUser: {},
      days: [],
      pageTitle: 'Logs',
      selectedDay: {},
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutLogCalendarTemplate);
    },
  }));

  let getDaysForGrid = function (year, month) {
    let days = []; //This array will have exactly 42 entries
    let daysInPrevMonth = new Date(year, month, 0).getDate();
    let firstDayInCalendarMonth = new Date(year, month).getDay();
    let daysInCalendarMonth = new Date(year, month + 1, 0).getDate();
    for (var i = 0; i < firstDayInCalendarMonth; i++) {
      days.push({ date: new Date(year, month - 1, daysInPrevMonth - firstDayInCalendarMonth + i + 1), class: 'prev-month' });
    }

    for (var i = 0; i < daysInCalendarMonth; i++) {
      days.push({ date: new Date(year, month, i + 1), class: 'curr-month' });
    }
    if (days.length < 42) {
      let count = 42 - days.length;
      for (var i = 1; i <= count; i++) {
        days.push({ date: new Date(year, month + 1, i), class: 'next-month' });
      }
    }

    // Add index information to each object in the days array. Used for setting prev and next selectedDay
    days = days.map((day, index) => {
      return { ...day, index };
    });
    return days;
  };

  let sortLogsByDateAsc = function (logs) {
    return logs.sort(function (a, b) {
      return new Date(a['date']) - new Date(b['date']);
    });
  };

  let addLogsToDays = function (workoutLogs, days) {
    if (workoutLogs.length) {
      workoutLogs = sortLogsByDateAsc(workoutLogs);
    }
    let i = 0,
      j = 0;
    while (i < days.length && j < workoutLogs.length) {
      let dayDate = new Date(days[i].date);
      let logDate = new Date(workoutLogs[j].date);
      if (dayDate < logDate) ++i;
      else if (dayDate > logDate) ++j;
      else {
        let logs = days[i].logs ? days[i].logs : [];
        let modalities = days[i].modalities ? days[i].modalities : [];
        let workoutModalities = workoutLogs[j].modality && workoutLogs[j].modality.length ? workoutLogs[j].modality : [];
        modalities.push.apply(modalities, workoutModalities);
        modalities = [...new Set(modalities)];
        logs.push(workoutLogs[j]);
        days[i] = { ...days[i], logs, modalities };
        ++j;
        // Not incrementing i here because logs may have more than one record for the date.
        // It is necessary to only increment j to catch all logs for a given day
      }
    }
    return days;
  };

  /**
   * @param {*} days
   * @param {*} month
   * @param {*} year
   * @returns
   */
  let selectDayOnPageLoad = function (days, date, month, year) {
    return days.filter((day) => day.date.getMonth() === month && day.date.getFullYear() === year && day.date.getDate() === (date ? date : 1))[0];
  };

  let handleChangeMonthEvent = function (event) {
    let state = component.getState();
    let month = state.month;
    let year = state.year;
    let date;
    if (event.target.id === 'today-btn') {
      date = new Date();
    }
    if (event.target.id === 'prev-month-btn') {
      date = new Date(year, month - 1);
    }
    if (event.target.id === 'next-month-btn') {
      date = new Date(year, month + 1);
    }
    month = date.getMonth();
    year = date.getFullYear();
    selectedDate = date.getDate();
    $ironfyt.navigateToUrl(`workoutlog-calendar.html?year=${year}&month=${month}&date=${selectedDate}`);
  };

  let handleChangeDayEvent = function (event) {
    let state = component.getState();
    let selectedDay = state.selectedDay;
    let days = state.days;
    if (event.target.id === 'prev-day-btn') {
      if (parseInt(selectedDay.index) > 0) {
        selectedDay = days[parseInt(selectedDay.index) - 1];
      }
    }
    if (event.target.id === 'next-day-btn') {
      if (parseInt(selectedDay.index) < 41) {
        selectedDay = days[parseInt(selectedDay.index) + 1];
      }
    }
    component.setState({ selectedDay });
  };

  let handleAddLogEvent = function (event) {
    let state = component.getState();
    let selectedDay = state.selectedDay;
    let date = new Date(selectedDay.date).toISOString();
    let user_id = state.displayUser._id;
    $ironfyt.navigateToUrl(`workoutlog-form.html?date=${date}&user_id=${user_id}&ref=workoutlog-calendar.html`);
  };

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
    let user_id = state.displayUser._id;
    let selectedDate = state.selectedDay.date;

    if (state.deleteLogId) {
      $ironfyt.deleteWorkoutLog(state.deleteLogId, function (error, result) {
        if (!error) {
          $ironfyt.navigateToUrl(`workoutlog-calendar.html?ref=workoutlog-calendar.html&user_id=${user_id}&month=${new Date(selectedDate).getMonth()}&year=${new Date(selectedDate).getFullYear()}&date=${new Date(selectedDate).getDate()}`);
        } else {
          component.setState({ error });
        }
      });
    } else {
      component.setState({ error: { message: 'No log found to delete' } });
    }
  };

  ($ironfyt.workoutLogCalendarPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        let params = $hl.getParams();

        let user_id = params && params.user_id && params.user_id.length === 24 ? params.user_id : user._id;
        if (user_id !== user._id && user.role !== 'admin') {
          component.setState({ error: { message: "You are not authorized to view this user's calendar" } });
        } else {
          let today = new Date();
          let month = params && params.month ? parseInt(params.month) : today.getMonth();
          let year = params && params.year ? parseInt(params.year) : today.getFullYear();
          let date = params && params.date ? parseInt(params.date) : month === today.getMonth() && year === today.getFullYear() ? today.getDate() : 1;
          let days = getDaysForGrid(year, month);
          let startdate = days[0].date.toISOString();
          let enddate = days[41].date.toISOString();
          $ironfyt.getWorkoutLogs({ startdate, enddate, user_id }, function (error, response) {
            if (!error) {
              let logs = response && response.workoutlogs ? response.workoutlogs : [];
              days = addLogsToDays(logs, days);
              let selectedDay = selectDayOnPageLoad(days, date, month, year);
              if (user_id !== user._id) {
                $ironfyt.getUsers({ _id: user_id }, function (error, response) {
                  if (!error) {
                    let displayUser = response && response.user ? response.user : {};
                    component.setState({ user, days, month, year, displayUser: displayUser, selectedDay });
                  } else {
                    component.setState({ error });
                  }
                });
              } else {
                component.setState({ user, days, month, year, displayUser: user, selectedDay });
              }
            } else {
              component.setState({ error });
            }
          });
        }
      } else {
        component.setState({ error });
      }
    });
  })();

  $hl.eventListener('click', 'prev-month-btn', handleChangeMonthEvent);
  $hl.eventListener('click', 'next-month-btn', handleChangeMonthEvent);
  $hl.eventListener('click', 'today-btn', handleChangeMonthEvent);
  $hl.eventListener('click', 'prev-day-btn', handleChangeDayEvent);
  $hl.eventListener('click', 'next-day-btn', handleChangeDayEvent);
  $hl.eventListener('click', 'add-log-btn-calendar-view', handleAddLogEvent);
  $hl.eventListener('click', 'cancel-delete-log-btn', handleCancelDeleteLogEvent);
  $hl.eventListener('click', 'confirm-delete-log-btn', handleConfirmDeleteLogEvent);

  document.addEventListener('click', function (event) {
    let targetId = event.target.id;
    let state = component.getState();

    // Handle date cell click
    let dateCellRegex = new RegExp(/^date-cell-\d+/);
    if (dateCellRegex.test(targetId)) {
      let prefix = 'date-cell-';
      let cellId = parseInt(event.target.id.substring(prefix.length, event.target.id.length));
      let days = state.days;
      component.setState({ selectedDay: days[cellId] });
    }

    // Handle edit button click
    let editBtnRegex = new RegExp(/^edit-log-btn-([a-zA-Z]|\d){24}/);
    if (editBtnRegex.test(targetId)) {
      let prefix = 'edit-log-btn-';
      let _id = event.target.id.substring(prefix.length, event.target.id.length);
      let user_id = state.displayUser._id;
      $ironfyt.navigateToUrl(`workoutlog-form.html?_id=${_id}&user_id=${user_id}&ref=workoutlog-calendar.html`);
    }

    // Handle delete button click
    let deleteBtnRegex = new RegExp(/^delete-log-btn-([a-zA-Z]|\d){24}/);
    if (deleteBtnRegex.test(targetId)) {
      let prefix = 'delete-log-btn-';
      let _id = event.target.id.substring(prefix.length, event.target.id.length);
      showDeleteConfirmationDialog(_id);
    }
  });
})();
