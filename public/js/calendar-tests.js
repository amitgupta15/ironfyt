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
    // const modalContent = document.querySelector('.activity-detail');
    // //Modal will display the parent's id
    // uitest.assert(modalContent.innerHTML === '<p>dt200629</p>');
    selector.innerHTML = '';
  });

  console.groupEnd('\x1b[34m%s\x1b[0m', 'Testing calendar.js library');
})();
