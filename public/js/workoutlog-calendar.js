(function () {
  'use strict';

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let workoutLogCalendarTemplate = function (props) {
    let displayUser = props && props.displayUser ? props.displayUser : {};
    let user = props && props.user ? props.user : {};
    let days = props && props.days ? props.days : [];
    let month = props && typeof props.month === 'number' ? props.month : '';
    let year = props && props.year ? props.year : '';
    let today = new Date();
    today.setHours(0, 0, 0, 0);
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
      <div class="date-cell header">S</div>
      <div class="date-cell header">M</div>
      <div class="date-cell header">T</div>
      <div class="date-cell header">W</div>
      <div class="date-cell header">T</div>
      <div class="date-cell header">F</div>
      <div class="date-cell header">S</div>
      ${days.map((day, index) => `<div class="date-cell ${day.class} ${day.date - today === 0 ? `today-date-cell` : ``}" id="date-cell-${index}">${day.date.getDate()}</div>`).join('')}
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

  let addLogsToDays = function (logs, days) {
    if (logs.length) {
      logs = sortLogsByDateAsc(logs);
    }
    let i = 0,
      j = 0;
    while (i < days.length && j < logs.length) {
      let dayDate = new Date(days[i].date);
      let logDate = new Date(logs[j].date);
      if (dayDate < logDate) ++i;
      else if (dayDate > logDate) ++j;
      else {
        days[i] = { ...days[i], log: logs[j] };
        ++i;
        ++j;
      }
    }
    return days;
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
              if (user_id !== user._id) {
                $ironfyt.getUsers({ _id: user_id }, function (error, response) {
                  if (!error) {
                    component.setState({ user, days, month, year, displayUser: response.user });
                  } else {
                    component.setState({ error });
                  }
                });
              }
              component.setState({ user, days, month, year, displayUser: user });
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
