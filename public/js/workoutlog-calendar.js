(function () {
  'use strict';

  let workoutLogCalendarTemplate = function (props) {
    let displayUser = props && props.displayUser ? props.displayUser : {};
    let days = props && props.days ? props.days : [];
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    return `<div class="container">
              <h2>Activity Calendar - ${displayUser.fname}</h2><br/>
              <div class="calendar-grid">
                <div class="date-cell">S</div>
                <div class="date-cell">M</div>
                <div class="date-cell">T</div>
                <div class="date-cell">W</div>
                <div class="date-cell">T</div>
                <div class="date-cell">F</div>
                <div class="date-cell">S</div>
                ${days.map((day, index) => `<div class="date-cell ${day.class} ${day.date - today === 0 ? `today-date-cell` : ``}" id="date-cell-${index}">${day.date.getDate()}</div>`).join('')}
              </div>
            </div>`;
  };

  let component = ($ironfyt.workoutLogCalendarComponent = Component('[data-app=workoutlog-calendar]', {
    state: {
      error: '',
      user: {},
      month: null,
      year: null,
      displayUser: {},
      days: [],
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
  ($ironfyt.workoutLogCalendarPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        let today = new Date();
        let params = $hl.getParams();
        let month = params && params.month ? parseInt(params.month) : today.getMonth();
        let year = params && params.year ? parseInt(params.year) : today.getFullYear();
        let days = getDaysForGrid(year, month);
        let startdate = days[0].date.toISOString();
        let enddate = days[41].date.toISOString();

        let user_id = params && params.user_id && params.user_id.length === 24 ? params.user_id : user._id;
        if (user_id !== user._id && user.role !== 'admin') {
          component.setState({ error: { message: "You are not authorized to view this user's calendar" } });
        } else {
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
})();
