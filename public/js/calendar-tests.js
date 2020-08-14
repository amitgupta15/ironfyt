(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');

  uitest.it('should show a slide up modal dialog', function () {
    const div = `
      <div id="dt200629" class="calendar-item date-last-month for-time-border">
        29
        <div class="modality-indicator-container">
          <div class="modality-indicator m"></div>
        </div>
      </div>
      <div class="slide-up-modal-3_4-container" id="activity-detail-modal">
        <div class="modal-content-3_4">
          <button class="cancel-slide-up-3_4-modal-btn">
            X
          </button>
          <div>
            <div class="activity-detail">
            </div>
          </div>
      </div>
    </div>
    `;
    const selector = document.querySelector('#selector');
    selector.innerHTML = div;
    uitest.dispatchHTMLEvent('click', '.modality-indicator');
    const modal = document.querySelector('#activity-detail-modal');
    //If click is captured successfully, modal window is showed.
    uitest.assert(modal.classList.contains('show-slide-up-3_4-modal'));

    selector.innerHTML = '';
  });

  uitest.it('should render month bar template', function () {
    uitest.assert(ironfytCal.calendarMonthBarTemplate({ month: 'August', year: 2020 }).includes('<h2>August 2020</h2>'));
  });

  uitest.it('should render days of the week titles template', function () {
    uitest.assert(ironfytCal.calendarDayOfWeekTemplate({ dayOfWeekAbbr: ['S', 'M'] }).includes('<div class="calendar-item day">S</div><div class="calendar-item day">M</div>'));
  });

  uitest.it('should render the date grid template', function () {
    let props = {
      daysOfCalendarMonth: [
        { date: 30, month: 'prev' },
        { date: 1, month: 'current' },
        { date: 2, month: 'next' },
      ],
      monthDigit: 0,
      year: 2020,
    };
    uitest.assert(ironfytCal.dateGridTemplate(props).includes('<div id="dt2020030"'));
    uitest.assert(ironfytCal.dateGridTemplate(props).includes('<div id="dt202011"'));
    uitest.assert(ironfytCal.dateGridTemplate(props).includes('<div id="dt202022"'));
  });

  uitest.it('should render calendar component', function () {
    let selector = document.getElementById('selector');
    selector.innerHTML = '<div data-app="calendar"></div>';
    ironfytCal.calendarComponent.setData({ monthDigit: 0, month: 'January', year: 2020, dayOfWeekAbbr: ['S', 'M'], daysOfCalendarMonth: ironfytCal.createDaysArray(2020, 0) });
    let data = ironfytCal.calendarComponent.getData();
    uitest.assert(data.monthDigit === 0);
    uitest.assert(data.month === 'January');
    uitest.assert(data.year === 2020);
    uitest.assert(data.daysOfCalendarMonth.length === 42);
    uitest.assert(data.dayOfWeekAbbr.length === 2);

    uitest.assert(selector.innerHTML.includes('calendar-container'));

    // Cleanup
    selector.innerHTML = '';
  });

  console.groupEnd('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');
})();
