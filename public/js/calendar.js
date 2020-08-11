(function () {
  'use strict';

  // Create a global variable and expose it the world.
  let ironfytCal = {};
  self.ironfytCal = ironfytCal;

  function showModal(id) {
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.add('show-slide-up-3_4-modal');

    // let modalContent = document.querySelector('.activity-detail');
    // modalContent.innerHTML = `<p>${id}</p>`;
  }

  function hideModal() {
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.remove('show-slide-up-3_4-modal');
  }

  /**
   * Returns number of days in a month
   * @param {*} year //year is required to return proper number of days for Feb
   * @param {*} month //month is 1-indexed
   * @param {*} date //date field is optional and has no effect on the final result. It is used for recursion
   */
  ironfytCal.daysInMonth = function (year, month, date = 1) {
    let aDate = new Date(year, month - 1, date);
    if (aDate.getDate() !== date) {
      return new Date(year, month - 1, date - 1).getDate();
    }
    return ironfytCal.daysInMonth(year, month, date + 1);
  };

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let daysofWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentDay = today.getDate();
  let currentYear = today.getFullYear();

  let month = currentMonth;
  let year = currentYear;

  ironfytCal.calendarComponent = new Component('[data-app=calendar]', {
    data: {
      month: '',
      year: '',
    },
    template: function (props) {
      return `
      <div class="calendar-container">
        <div class="calendar-month-bar">
        <button id="prev-month-btn">Previous</button>
           <h2>${props.month} ${props.year}</h2>
           <button id="next-month-btn">Next</button>
        </div>
      </div>
      `;
    },
  });

  ironfytCal.calendarComponent.setData({ month: months[month], year: year });
  // let calendarComponent = new Component('[data-app=calendar]', {
  //   data: {
  //     month: '',
  //     year: '',
  //   },
  //   template: function (props) {
  //     return `
  // <div class="calendar-container">
  //       <div class="calendar-month-bar">
  //         <button id="prev-month-btn">Previous</button>
  //         <h2>${months[month]} ${year}</h2>
  //         <button id="next-month-btn">Next</button>
  //       </div>
  //       <div class="calendar">
  //         <div class="calendar-item day">S</div>
  //         <div class="calendar-item day">M</div>
  //         <div class="calendar-item day">T</div>
  //         <div class="calendar-item day">W</div>
  //         <div class="calendar-item day">TH</div>
  //         <div class="calendar-item day">F</div>
  //         <div class="calendar-item day">SA</div>
  //         <div id="dt200628" class="calendar-item date-last-month">28</div>
  //         <div id="dt200629" class="calendar-item date-last-month for-time-border">
  //           29
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator m"></div>
  //           </div>
  //         </div>
  //         <div id="dt200630" class="calendar-item date-last-month for-load-border">
  //           30
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator w"></div>
  //           </div>
  //         </div>
  //         <div id="dt200701" class="calendar-item date for-time-border">
  //           1
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200702" class="calendar-item date">2</div>
  //         <div id="dt200703" class="calendar-item date for-time-border">
  //           <span class="selected-date">3</span>
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator m"></div>
  //             <div class="modality-indicator w"></div>
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200704" class="calendar-item date amrap-border">
  //           4
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator w"></div>
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200705" class="calendar-item date amrap-border">
  //           5
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200706" class="calendar-item date for-load-border">
  //           6
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator w"></div>
  //           </div>
  //         </div>
  //         <div id="dt200707" class="calendar-item date for-time-border">
  //           7
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator m"></div>
  //             <div class="modality-indicator w"></div>
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200708" class="calendar-item date amrap-border">
  //           8
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200709" class="calendar-item date">9</div>
  //         <div id="dt200710" class="calendar-item date">10</div>
  //         <div id="dt200711" class="calendar-item date for-load-border">
  //           11
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator w"></div>
  //           </div>
  //         </div>
  //         <div id="dt200712" class="calendar-item date amrap-border">
  //           12
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200713" class="calendar-item date for-time-border">
  //           13
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator m"></div>
  //           </div>
  //         </div>
  //         <div id="dt200714" class="calendar-item date for-time-border">
  //           14
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator w"></div>
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200715" class="calendar-item date for-load-border">
  //           15
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator w"></div>
  //           </div>
  //         </div>
  //         <div id="dt200716" class="calendar-item date">16</div>
  //         <div id="dt200717" class="calendar-item date for-time-border">
  //           17
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator m"></div>
  //             <div class="modality-indicator w"></div>
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200718" class="calendar-item date for-time-border">
  //           18
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator w"></div>
  //           </div>
  //         </div>
  //         <div id="dt200719" class="calendar-item date">19</div>
  //         <div id="dt200720" class="calendar-item date for-time-border">
  //           20
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator m"></div>
  //           </div>
  //         </div>
  //         <div id="dt200721" class="calendar-item date for-time-border">
  //           21
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200722" class="calendar-item date current-date for-time-border">
  //           22
  //           <div class="modality-indicator-container">
  //             <div class="modality-indicator m"></div>
  //             <div class="modality-indicator w"></div>
  //             <div class="modality-indicator g"></div>
  //           </div>
  //         </div>
  //         <div id="dt200723" class="calendar-item date">23</div>
  //         <div id="dt200724" class="calendar-item date">24</div>
  //         <div id="dt200725" class="calendar-item date">25</div>
  //         <div id="dt200726" class="calendar-item date">26</div>
  //         <div id="dt200727" class="calendar-item date">27</div>
  //         <div id="dt200728" class="calendar-item date">28</div>
  //         <div id="dt200729" class="calendar-item date">29</div>
  //         <div id="dt200730" class="calendar-item date">30</div>
  //         <div id="dt200731" class="calendar-item date">31</div>
  //         <div id="dt200801" class="calendar-item date-next-month">1</div>
  //       </div>
  //     </div>
  // `;
  //   },
  // });
  // let calendarContainer = document.getElementById('calendar-container');
  // calendarContainer.innerHTML = ;

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
