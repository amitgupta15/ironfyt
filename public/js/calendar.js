(function () {
  'use strict';

  // Create a global variable and expose it the world.
  let ironfytCal = {};
  self.ironfytCal = ironfytCal;

  function showModal(id) {
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.add('show-slide-up-3_4-modal');
  }

  function hideModal() {
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.remove('show-slide-up-3_4-modal');
  }

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let daysofWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentDay = today.getDate();
  let currentYear = today.getFullYear();

  let month = currentMonth;
  let year = currentYear;

  let firstDayOfCalendarMonth = new Date(year, month).getDay();
  let totalDaysInCalendarMonth = new Date(year, month + 1, 0).getDate();
  let totalDaysInPrevCalendarMonth = new Date(year, month, 0).getDate();
  let daysOfCalendarMonth = [];

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

  ironfytCal.dateGridTemplate = function (props) {
    return props.daysOfCalendarMonth
      .map((day) => {
        if (day.month === 'prev') return `<div id="dt${props.year}${props.monthDigit}${day.date}" class="calendar-item date-last-month">${day.date}</div>`;
        if (day.month === 'current') {
          return `<div id="dt${props.year}${props.monthDigit + 1}${day.date}" class="calendar-item date  for-time-border">${day.date}
                  <div class="modality-indicator-container">
                    <div class="modality-indicator m"></div>
                    <div class="modality-indicator w"></div>
                    <div class="modality-indicator g"></div>
                  </div>
                  </div>`;
        }
        if (day.month === 'next') return `<div id="dt${props.year}${props.monthDigit + 2}${day.date}" class="calendar-item date-next-month">${day.date}</div>`;
      })
      .join('');
  };
  ironfytCal.calendarComponent = new Component('[data-app=calendar]', {
    data: {
      monthDigit: '',
      month: '',
      year: '',
      daysOfCalendarMonth: [],
    },
    template: function (props) {
      return `
      <div class="calendar-container">
        <div class="calendar-month-bar">
          <button id="prev-month-btn">Previous</button>
          <h2>${props.month} ${props.year}</h2>
          <button id="next-month-btn">Next</button>
        </div>
        <div class="calendar">
          <div class="calendar-item day">S</div>
          <div class="calendar-item day">M</div>
          <div class="calendar-item day">T</div>
          <div class="calendar-item day">W</div>
          <div class="calendar-item day">TH</div>
          <div class="calendar-item day">F</div>
          <div class="calendar-item day">SA</div>
          ${ironfytCal.dateGridTemplate(props)}
        </div>
      </div>
      `;
    },
  });

  ironfytCal.calendarComponent.setData({ monthDigit: month, month: months[month], year: year, daysOfCalendarMonth });

  function showPrevMonth() {
    console.log('show prev month');
  }

  function showNextMonth() {
    console.log('show next month');
  }

  document.addEventListener('click', function (ev) {
    let matchedId = false;
    let calendarItemIdRegEx = new RegExp(/dt\d{6}/);
    matchedId = hl.matchClosestSelector(ev.target, calendarItemIdRegEx);
    if (matchedId) {
      showModal(matchedId);
    } else if (ev.target.className !== undefined && ev.target.className === 'cancel-slide-up-3_4-modal-btn') {
      hideModal();
    } else if (ev.target.id === 'prev-month-btn') {
      showPrevMonth();
    } else if (ev.target.id === 'next-month-btn') {
      showNextMonth();
    }
  });
})();
