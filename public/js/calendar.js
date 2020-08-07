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
    }
  });

  function showModal(id) {
    let dialog = document.querySelector(`#activity-detail-modal`);
    dialog.classList.add('show-modal');
    dialog.classList.remove('hide-modal');

    let modalContent = document.querySelector('#modal-content');
    modalContent.innerHTML = `<p>${id}</p>`;
  }
})();
