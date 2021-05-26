(function () {
  'use strict';

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let veryShortDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  let workoutLogCalendarTemplate = function (props) {
    let displayUser = props && props.displayUser ? props.displayUser : {};
    let days = props && props.days ? props.days : [];
    let month = props && typeof props.month === 'number' ? props.month : '';
    let year = props && props.year ? props.year : '';
    let selectedDay = props && props.selectedDay ? props.selectedDay : {};
    return `
    <div class="calendar-month-control-bar">
      <div>${months[month]} ${year}</div>
      <div>${displayUser.fname}</div>
      <div>
        <button id="today-btn">Today</button>
        <button class="month-control" id="prev-month-btn"><</button>
        <button class="month-control" id="next-month-btn">></button>
      </div>
    </div>
    <div class="calendar-grid">
      ${veryShortDays.map((vShortDay) => `<div class="date-cell header">${vShortDay}</div>`).join('')}
      ${days.map((day, index) => `<div class="date-cell ${day.class} ${day.date - selectedDay.date === 0 ? `selected-date-cell` : ``} ${'log' in day ? `day-has-log` : ``}" id="date-cell-${index}">${day.date.getDate()}</div>`).join('')}
    </div>
    <div class="selected-day-control-bar">
      <div>${selectedDay.date ? `${longDays[selectedDay.date.getDay()]}, ${months[selectedDay.date.getMonth()]} ${selectedDay.date.getDate()}, ${selectedDay.date.getFullYear()}` : ''}</div>
    </div>
    <div class="day-detail-container">
      ${selectedDay.log ? JSON.stringify(selectedDay.log) : 'No Logs'}
    </div>
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
      pageTitle: 'Activity',
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
        logs.push(workoutLogs[j]);
        days[i] = { ...days[i], logs };
        // ++i;
        ++j;
      }
    }
    return days;
  };

  /**
   * If displaying calendar for the current month, then selected day on page load will be today.
   * If displaying calendar for any other month/year, then selected day on page load will be first day of the month (took inspiration from Google calendar)
   * @param {*} days
   * @param {*} month
   * @param {*} year
   * @returns
   */
  let selectDayOnPageLoad = function (days, month, year) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    if (month === today.getMonth() && year === today.getFullYear()) {
      return days.filter((day) => day.date - today === 0)[0];
    } else {
      return days.filter((day) => day.date.getMonth() === month && day.date.getFullYear() === year && day.date.getDate() === 1)[0];
    }
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
    $ironfyt.navigateToUrl(`workoutlog-calendar.html?year=${year}&month=${month}`);
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
          let days = getDaysForGrid(year, month);
          let startdate = days[0].date.toISOString();
          let enddate = days[41].date.toISOString();
          $ironfyt.getWorkoutLogs({ startdate, enddate, user_id }, function (error, response) {
            if (!error) {
              let logs = response && response.workoutlogs ? response.workoutlogs : [];
              days = addLogsToDays(logs, days);
              let selectedDay = selectDayOnPageLoad(days, month, year);

              if (user_id !== user._id) {
                $ironfyt.getUsers({ _id: user_id }, function (error, response) {
                  if (!error) {
                    component.setState({ user, days, month, year, displayUser: response.user, selectedDay });
                  } else {
                    component.setState({ error });
                  }
                });
              }
              component.setState({ user, days, month, year, displayUser: user, selectedDay });
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
})();
