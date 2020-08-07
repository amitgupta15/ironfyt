(function () {
  'use strict';

  /**
   * TEST METHODS
   */

  /**
   * test function
   * @param {string} desc
   * @param {function} fn
   */
  function it(desc, fn) {
    try {
      fn();
      console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
    } catch (error) {
      console.log('\n');
      console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
      console.error(error);
    }
  }
  /** END TEST METHODS */

  console.group('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');

  it('should show a slide up modal dialog', function () {
    const div = `
      <div id="dt200629" class="calendar-item date-last-month for-time-border">
        29
        <div class="modality-indicator-container">
          <div class="modality-indicator m"></div>
        </div>
      </div>
      <div id='activity-detail-modal' class="hide-modal">
        <div id='modal-content'></div>
      </div>
    `;
    const selector = document.querySelector('#selector');
    selector.innerHTML = div;

    const ev = document.createEvent('HTMLEvents');
    ev.initEvent('click', true, true);
    //Dispatching event from the inner most div of the parent div (id=dt200629) which contains the date
    const eventDispatcherDiv = document.querySelector('.modality-indicator');
    eventDispatcherDiv.dispatchEvent(ev);

    const modal = document.querySelector('#activity-detail-modal');
    //If click is captured successfully, modal window is showed.
    uitest.assert(modal.classList.contains('show-modal'));
    uitest.assert(!modal.classList.contains('hide-modal'));

    const modalContent = document.querySelector('#modal-content');
    //Modal will display the parent's id
    uitest.assert(modalContent.innerHTML === '<p>dt200629</p>');
    selector.innerHTML = '';
  });
  console.groupEnd('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');
})();
