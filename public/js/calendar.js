(function () {
  'use strict';

  // Create a global variable and expose it the world.
  let ironfytCal = {};
  self.ironfytCal = ironfytCal;

  let ironfytCalState = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  let logs = [
    {
      _id: 469,
      user_id: '1',
      workout_id: null,
      date: '2020-08-10T07:00:00.000Z',
      duration: '1 hour',
      load: null,
      rounds: null,
      notes: 'Run 5 miles',
      modality: ['m'],
    },
    {
      _id: 468,
      user_id: '1',
      workout_id: 110,
      date: '2020-08-09T07:00:00.000Z',
      duration: null,
      load: null,
      rounds: null,
      notes: '3 rounds + 6 Bench press Finished 4 rounds after the clock. \nAll strict pull-ups ',
      workout: {
        _id: 110,
        user_id: 1,
        name: 'Sunday 200809',
        type: 'For Load',
        timecap: '20 minutes ',
        rounds: null,
        reps: null,
        description: '12 bench presses\n12 strict pull-ups\n\n♀ 95 lb. ♂ 135 lb.\n\nPost rounds',
        modality: ['w', 'g'],
      },
    },
    {
      _id: 464,
      user_id: '1',
      workout_id: 109,
      date: '2020-08-07T07:00:00.000Z',
      duration: '31:23 minutes',
      load: null,
      rounds: null,
      notes: null,
      workout: {
        _id: 109,
        user_id: 1,
        name: 'Friday 200807',
        type: 'AMRAP',
        timecap: null,
        rounds: 5,
        reps: null,
        description: '5 rounds, each for time of:\nRun 400 meters\n15 clean & jerks\nRest 3 minutes between rounds.\n\n♀ 65 lb. ♂ 95 lb.\n\nPost times',
        modality: ['m', 'w'],
      },
    },
  ];

  ironfytCal.setState = function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        ironfytCalState[key] = obj[key];
      }
    }
  };

  ironfytCal.getState = function () {
    // Return a copy of data object
    return JSON.parse(JSON.stringify(ironfytCalState));
  };

  ironfytCal.headerTemplate = function (props) {
    return `
        <header>
          <div class="top-bar">
            <a href="" class="icon-profile">AG</a>
            <h1 class="title-activity">ACTIVITY</h1>
            <button id="new-task-btn" class="btn-new"></button>
          </div>
        </header>
    `;
  };

  ironfytCal.footerTemplate = function (props) {
    return `
      <footer>
        <a href="#friends">Friends</a>
        <a href="#pr">PR</a>
        <a href="#workouts" class="active">Workouts</a>
        <a href="#activity">Activity</a>
        <a href="#more">More</a>
      </footer>
    `;
  };

  ironfytCal.calendarMonthBarTemplate = function (props) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (props.month < 0 || props.month > 11) return `Invalid Month`;
    return `
        <div class="calendar-month-bar">
          <button id="prev-month-btn">Previous</button>
          <h2>${months[props.month]} ${props.year}</h2>
          <button id="next-month-btn">Next</button>
        </div>
    `;
  };

  ironfytCal.calendarDayOfWeekTemplate = function () {
    let dayOfWeekAbbr = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    return dayOfWeekAbbr.map((day) => `<div class="calendar-item day">${day}</div>`).join('');
  };

  /**
   *
   * @param {number} year
   * @param {number} month 0-indexed
   * @param {Array} logs
   */
  ironfytCal.createDaysArray = function (year, month, logs) {
    let daysOfCalendarMonth = [];
    let firstDayOfCalendarMonth = new Date(year, month).getDay();
    let totalDaysInCalendarMonth = new Date(year, month + 1, 0).getDate();
    let totalDaysInPrevCalendarMonth = new Date(year, month, 0).getDate();

    for (var i = 1; i <= firstDayOfCalendarMonth; i++) {
      daysOfCalendarMonth.push({ date: totalDaysInPrevCalendarMonth - firstDayOfCalendarMonth + i, month: 'prev' });
    }
    for (var i = 1; i <= totalDaysInCalendarMonth; i++) {
      let logForDate = {};
      logs.forEach((log) => {
        let logDate = new Date(log.date);
        if (logDate.getFullYear() === year && logDate.getMonth() === month && logDate.getDate() === i) {
          logForDate = log;
        }
      });
      daysOfCalendarMonth.push({ date: i, month: 'current', log: logForDate });
    }
    if (daysOfCalendarMonth.length < 42) {
      let count = 42 - daysOfCalendarMonth.length;
      for (var i = 1; i <= count; i++) {
        daysOfCalendarMonth.push({ date: i, month: 'next' });
      }
    }
    return daysOfCalendarMonth;
  };

  ironfytCal.calendarDateGridTemplate = function ({ daysOfCalendarMonth }) {
    return daysOfCalendarMonth
      .map((day) => {
        let border = '';
        let modality = '';
        let divId = '';
        if (day.log && Object.keys(day.log).length > 0) {
          let log = day.log;
          divId = log._id;
          if (log.workout) {
            let workout = log.workout;
            if (workout.type.toLowerCase() === 'For Time'.toLowerCase()) border = 'for-time-border';
            if (workout.type.toLowerCase() === 'For Load'.toLowerCase()) border = 'for-load-border';
            if (workout.type.toLowerCase() === 'AMRAP'.toLowerCase()) border = 'amrap-border';
            if (workout.type.toLowerCase() === 'For Reps'.toLowerCase()) border = 'amrap-border';
            if (workout.modality) {
              modality += '<div class="modality-indicator-container">';
              modality += workout.modality.map((logModality) => `<div class="modality-indicator ${logModality}"></div>`).join(' ');
              modality += '</div>';
            }
          }
          if (log.modality) {
            modality += '<div class="modality-indicator-container">';
            modality += log.modality.map((logModality) => `<div class="modality-indicator ${logModality}"></div>`).join(' ');
            modality += '</div>';
          }
          if (border === '') border = 'for-time-border';
        }
        if (day.month === 'prev') return `<div ${divId ? `id="${divId}"` : ''} class="calendar-item date-last-month">${day.date}</div>`;
        if (day.month === 'current') {
          return `<div ${divId ? `id="${divId}"` : ''} class="calendar-item date${border ? ` ${border}` : ''}">${day.date}
                  ${modality}
                  </div>`;
        }
        if (day.month === 'next') return `<div ${divId ? `id="${divId}"` : ''} class="calendar-item date-next-month">${day.date}</div>`;
      })
      .join('');
  };

  ironfytCal.slideUpModalTempate = function (props) {
    return `
    <div class="slide-up-modal-3_4-container" id="activity-detail-modal">
      <div class="modal-content-3_4">
        <button class="cancel-slide-up-3_4-modal-btn" id="close-activity-detail-modal">
          X
        </button>
        <div>
          <div class="activity-detail">
            <h2 class="activity-date"></h2>
            <h3>Log</h3>
            <div class="log-detail"></div>
            <div id="activity-workout"></div>
          </div>
        </div>
      </div>
    </div>
    `;
  };
  ironfytCal.calendarComponent = new Component('[data-app=calendar]', {
    data: {
      month: '',
      year: '',
      daysOfCalendarMonth: [],
      selectedLogId: '',
    },
    template: function (props) {
      return `
      <div class="container">
        ${ironfytCal.headerTemplate(props)}
        <div class="calendar-container">
          ${ironfytCal.calendarMonthBarTemplate(props)}
          <div class="calendar">
            ${ironfytCal.calendarDayOfWeekTemplate()}
            ${ironfytCal.calendarDateGridTemplate(props)}
          </div>
        </div>
        ${ironfytCal.footerTemplate(props)}
      </div>
      ${ironfytCal.slideUpModalTempate(props)}
      `;
    },
  });

  /**
   *
   * @param {*} indicator 0 = current, 1 = next, -1 = previous
   */
  function showCalendar(indicator) {
    let { month, year } = ironfytCal.getState();
    let date = new Date(year, month + indicator);

    ironfytCal.setState({ month: date.getMonth(), year: date.getFullYear() });

    let daysOfCalendarMonth = ironfytCal.createDaysArray(date.getFullYear(), date.getMonth(), logs);
    ironfytCal.calendarComponent.setData({ year: date.getFullYear(), month: date.getMonth(), daysOfCalendarMonth: daysOfCalendarMonth });
  }

  let calendarPage = () => showCalendar(0);
  let showPrevMonth = () => showCalendar(-1);
  let showNextMonth = () => showCalendar(1);

  /**
   * Handle the display for Log Activity Modal
   */
  function showModal(id) {
    ironfytCal.calendarComponent.setData({ selectedLogId: id }, false);
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.add('show-slide-up-3_4-modal');
    var log = logs.filter(function (log) {
      return parseInt(log._id) === parseInt(id);
    })[0];
    let logDate = new Date(log.date).toDateString().split(' ');
    document.querySelector('.activity-date').innerHTML = `${logDate[0]}, ${logDate[1]} ${logDate[2]}, ${logDate[3]}`;
    document.querySelector('.log-detail').innerHTML = `
              ${
                log.modality && log.modality.length > 0
                  ? `
                    <ul class="modality">
                      ${log.modality
                        .map(function (modality) {
                          return `<li class="modality-${modality}">${modality}</li>`;
                        })
                        .join(' ')}
                    </ul><br/>`
                  : ``
              }
              ${log.duration ? `<p><strong>Duration: </strong>${log.duration}</p>` : ``}
              ${log.load ? `<p><strong>Load: </strong>${log.load}</p>` : ``}
              ${log.rounds ? `<p><strong>Rounds: </strong>${log.rounds}</p>` : ``}
              ${log.notes ? `<p><strong>Notes: </strong><br/>${hl.replaceNewLineWithBR(log.notes)}</p>` : ``}
              `;
    if (log.workout) {
      let workout = log.workout;
      document.querySelector('#activity-workout').innerHTML = `
        <h3>Workout</h3>
        <div>
          <div class="workout-top-band">
          ${
            workout.modality && workout.modality.length > 0
              ? `<ul class="modality">
                  ${workout.modality
                    .map(function (modality) {
                      return `<li class="modality-${modality}">${modality}</li>`;
                    })
                    .join(' ')}
                </ul><br/>`
              : ``
          }
          </div>
          <div class="log-detail">
            <h2>${workout.name}</h2>
            <p><strong>Type: </strong>${workout.type}</p>
            ${workout.timecap ? `<p><strong>Time Cap: </strong>${workout.timecap}</p>` : ``}
            ${workout.rounds ? `<p><strong>Rounds: </strong>${workout.rounds}</p>` : ``}
            ${workout.reps ? `<p><strong>Reps: </strong>${workout.reps}</p>` : ``}
            ${workout.description ? `<p>${hl.replaceNewLineWithBR(workout.description)}</p>` : ``}
          </div>
        </div>
      `;
    }
  }

  function hideModal() {
    ironfytCal.calendarComponent.setData({ selectedLogId: '' }, false);
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.remove('show-slide-up-3_4-modal');

    document.querySelector('.activity-date').innerHTML = ``;
    document.querySelector('.log-detail').innerHTML = ``;
    document.querySelector('#activity-workout').innerHTML = ``;
  }

  // Handling the click event for a Regex to match the closest selector for dates grid.
  // Did not enhance the hl.eventListener method to handle this situation yet. Waiting to see if the requirement evolves. Don't want to refactor prematurely.
  document.addEventListener('click', function (ev) {
    let matchedId = false;
    let calendarItemIdRegEx = new RegExp(/\d+/);
    matchedId = hl.matchClosestSelector(ev.target, calendarItemIdRegEx);
    if (matchedId) {
      showModal(matchedId);
    }
  });
  hl.eventListener('click', 'prev-month-btn', showPrevMonth);
  hl.eventListener('click', 'next-month-btn', showNextMonth);
  hl.eventListener('click', 'close-activity-detail-modal', hideModal);

  // Register Routes
  ironfytCal.routes = {
    calendar: calendarPage,
  };
  // Calling client side router to laod the calendar page for 'calendar' data-app attribute
  hl.router(ironfytCal.routes);
})();
