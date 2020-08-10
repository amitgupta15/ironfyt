(function () {
  'use strict';

  // Create a global variable and expose it the world.
  let ironfytCal = {};
  self.ironfytCal = ironfytCal;

  document.addEventListener('click', function (ev) {
    let matchedId = false;
    let calendarItemIdRegEx = new RegExp(/dt\d{6}/);
    matchedId = hl.matchClosestSelector(ev.target, calendarItemIdRegEx);
    if (matchedId) {
      showModal(matchedId);
    } else if (ev.target.className !== undefined && ev.target.className === 'cancel-slide-up-3_4-modal-btn') {
      hideModal();
    }
  });

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
})();
