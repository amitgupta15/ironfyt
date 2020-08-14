(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');

  uitest.it('should show a slide up modal dialog', function () {
    const div = `
      <div id="dt-2020-11-29" class="calendar-item date-last-month for-time-border">
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
    uitest.assert(ironfytCal.calendarMonthBarTemplate({ month: 7, year: 2020 }).includes('<h2>August 2020</h2>'));
    uitest.assert(ironfytCal.calendarMonthBarTemplate({ month: -1, year: 2020 }).includes('Invalid Month'));
    uitest.assert(ironfytCal.calendarMonthBarTemplate({ month: 12, year: 2020 }).includes('Invalid Month'));
  });

  uitest.it('should render days of the week titles template', function () {
    uitest.assert(ironfytCal.calendarDayOfWeekTemplate({ dayOfWeekAbbr: ['S', 'M'] }).includes('<div class="calendar-item day">S</div><div class="calendar-item day">M</div>'));
  });

  uitest.it('should render the date grid template', function () {
    let props = {
      month: 0,
      year: 2020,
    };
    uitest.assert(ironfytCal.calendarDateGridTemplate(props).includes('<div id="dt-2020-0-30"'));
    uitest.assert(ironfytCal.calendarDateGridTemplate(props).includes('<div id="dt-2020-1-1"'));
    uitest.assert(ironfytCal.calendarDateGridTemplate(props).includes('<div id="dt-2020-2-2"'));
  });

  uitest.it('should create a days array with 42 entries for a 7x6 grid given a year and a month', function () {
    let daysArray = ironfytCal.createDaysArray(2020, 0); //January 2020;

    uitest.assert(daysArray.length === 42);

    let janData = daysArray.filter((day) => day.month === 'current');
    uitest.assert(janData.length === 31);
  });

  uitest.it('should render calendar component on page load', function () {
    let selector = document.getElementById('selector');
    selector.innerHTML = '<div data-app="calendar"></div>';
    ironfytCal.setState({ year: 2021, month: 0 });
    ironfytCal.routes['calendar']();
    let data = ironfytCal.calendarComponent.getData();
    uitest.assert(data.month === 0);
    uitest.assert(data.year === 2021);
    uitest.assert(selector.innerHTML.includes('calendar-container'));
    uitest.assert(selector.innerHTML.includes('January'));

    // Cleanup
    selector.innerHTML = '';
  });

  uitest.it('should render previous month when prev button is clicked', function () {
    let selector = document.getElementById('selector');
    selector.innerHTML = '<div data-app="calendar"><button id="prev-month-btn">Prev</div></div>';
    ironfytCal.setState({ month: 0, year: 2020 });

    uitest.dispatchHTMLEvent('click', '#prev-month-btn');
    uitest.assert(selector.innerHTML.includes('December 2019'));

    uitest.dispatchHTMLEvent('click', '#prev-month-btn');
    uitest.assert(selector.innerHTML.includes('November 2019'));

    uitest.dispatchHTMLEvent('click', '#prev-month-btn');
    uitest.assert(selector.innerHTML.includes('October 2019'));

    // Cleanup
    selector.innerHTML = '';
  });

  uitest.it('should render next month when next button is clicked', function () {
    let selector = document.getElementById('selector');
    selector.innerHTML = '<div data-app="calendar"><button id="next-month-btn">Next</div></div>';
    ironfytCal.setState({ month: 11, year: 2020 });
    uitest.dispatchHTMLEvent('click', '#next-month-btn');
    uitest.assert(selector.innerHTML.includes('January 2021'));

    uitest.dispatchHTMLEvent('click', '#next-month-btn');
    uitest.assert(selector.innerHTML.includes('February 2021'));

    uitest.dispatchHTMLEvent('click', '#next-month-btn');
    uitest.assert(selector.innerHTML.includes('March 2021'));

    // Cleanup
    selector.innerHTML = '';
  });

  uitest.it('should find an activity for a given date', function () {
    let id = 'dt-2020-7-7';
    let dateComponentsFromId = id.split('-');
    let dateFromId = new Date(dateComponentsFromId[1], dateComponentsFromId[2], dateComponentsFromId[3]);
    let activityDate = new Date('2020-08-07T07:00:00.000Z');
    uitest.assert(dateFromId.getFullYear() === activityDate.getFullYear() && dateFromId.getMonth() === activityDate.getMonth() && dateFromId.getDate() === activityDate.getDate());
  });
  console.groupEnd('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');
})();
