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
      <div id='dt200701' class="calendar-item">1</div>
      <div id='activity-detail-modal' class="hide-modal">
        <div id='modal-content'></div>
      </div>
    `;
    const selector = document.querySelector('#selector');
    selector.innerHTML = div;

    const ev = document.createEvent('HTMLEvents');
    ev.initEvent('click', true, true);

    const eventDispatcherDiv = document.querySelector('#dt200701');
    eventDispatcherDiv.dispatchEvent(ev);

    const modal = document.querySelector('#activity-detail-modal');
    console.assert(modal.classList.contains('show-modal'));
    console.assert(!modal.classList.contains('hide-modal'));

    const modalContent = document.querySelector('#modal-content');
    console.assert(modalContent.innerHTML === '<p>dt200701</p>');
  });
  console.groupEnd('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');
})();
