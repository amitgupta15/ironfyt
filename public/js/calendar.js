(function () {
  'use strict';

  // Create a global variable and expose it the world.
  let ironfytCal = {};
  self.ironfytCal = ironfytCal;

  let ironfytCalState = {
    modalId: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    logs: [
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
        notes: '3 rounds + 6 Bench press Finished 4 rounds after the clock. All strict pull-ups ',
        workout: {
          _id: 110,
          user_id: 1,
          name: 'Sunday 200809',
          type: 'For Time',
          timecap: '20 minutes ',
          rounds: null,
          reps: null,
          description: '12 bench presses\n12 strict pull-ups\n\n♀ 95 lb. ♂ 135 lb.\n\nPost rounds',
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
          type: 'For Time',
          timecap: null,
          rounds: 5,
          reps: null,
          description: '5 rounds, each for time of:\nRun 400 meters\n15 clean & jerks\nRest 3 minutes between rounds.\n\n♀ 65 lb. ♂ 95 lb.\n\nPost times',
        },
      },
    ],
  };

  ironfytCal.setState = function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        ironfytCalState[key] = obj[key];
      }
    }
  };

  ironfytCal.getData = function () {
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
   */
  ironfytCal.createDaysArray = function (year, month) {
    let daysOfCalendarMonth = [];
    let firstDayOfCalendarMonth = new Date(year, month).getDay();
    let totalDaysInCalendarMonth = new Date(year, month + 1, 0).getDate();
    let totalDaysInPrevCalendarMonth = new Date(year, month, 0).getDate();

    for (var i = 1; i <= firstDayOfCalendarMonth; i++) {
      daysOfCalendarMonth.push({ date: totalDaysInPrevCalendarMonth - firstDayOfCalendarMonth + i, month: 'prev' });
    }
    for (var i = 1; i <= totalDaysInCalendarMonth; i++) {
      daysOfCalendarMonth.push({ date: i, month: 'current' });
    }
    if (daysOfCalendarMonth.length < 42) {
      let count = 42 - daysOfCalendarMonth.length;
      for (var i = 1; i <= count; i++) {
        daysOfCalendarMonth.push({ date: i, month: 'next' });
      }
    }
    return daysOfCalendarMonth;
  };

  ironfytCal.calendarDateGridTemplate = function ({ year, month }) {
    let daysOfCalendarMonth = ironfytCal.createDaysArray(year, month);
    return daysOfCalendarMonth
      .map((day) => {
        if (day.month === 'prev') return `<div id="dt-${year}-${month}-${day.date}" class="calendar-item date-last-month">${day.date}</div>`;
        if (day.month === 'current') {
          return `<div id="dt-${year}-${month + 1}-${day.date}" class="calendar-item date  for-time-border">${day.date}
                  <div class="modality-indicator-container">
                    <div class="modality-indicator m"></div>
                    <div class="modality-indicator w"></div>
                    <div class="modality-indicator g"></div>
                  </div>
                  </div>`;
        }
        if (day.month === 'next') return `<div id="dt-${year}-${month + 2}-${day.date}" class="calendar-item date-next-month">${day.date}</div>`;
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
            <h2 class="activity-date">Fri, July 3, 2020</h2>
            <h3>Log</h3>
            <div class="log-detail">
              <p><strong>Duration: </strong>42:09 minutes</p>
              <p>
                <strong>Notes:</strong><br />
                Squats - 185 lbs
              </p>
            </div>
            <h3>Workout</h3>
            <div>
              <div class="workout-top-band">
                <ul class="modality">
                  <li class="modality-m">M</li>
                  <li class="modality-w">W</li>
                  <li class="modality-g">G</li>
                </ul>
              </div>
              <div class="log-detail">
                <h2>Loredo</h2>
                <p><strong>Type: </strong>For Time</p>
                <p><strong>Rounds: </strong>6</p>
                <p>
                  24 squats<br />
                  24 push-ups<br />
                  24 walking lunge steps<br />
                  Run 400 meters<br /><br />Post Time
                </p>
              </div>
            </div>
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
    let { month, year } = ironfytCal.getData();
    let date = new Date(year, month + indicator);
    ironfytCal.setState({ month: date.getMonth(), year: date.getFullYear() });
    ironfytCal.calendarComponent.setData(ironfytCal.getData());
  }

  let calendarPage = () => showCalendar(0);
  let showPrevMonth = () => showCalendar(-1);
  let showNextMonth = () => showCalendar(1);

  /**
   * Handle the display for Log Activity Modal
   */
  function showModal(id) {
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.add('show-slide-up-3_4-modal');
  }

  function hideModal() {
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.remove('show-slide-up-3_4-modal');
  }

  // Handling the click event for a Regex to match the closest selector for dates grid.
  // Did not enhance the hl.eventListener method to handle this situation yet. Waiting to see if the requirement evolves. Don't want to refactor prematurely.
  document.addEventListener('click', function (ev) {
    let matchedId = false;
    let calendarItemIdRegEx = new RegExp(/dt-(\d{4}|\d{2})-\d{1,2}-\d{1,2}/);
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
