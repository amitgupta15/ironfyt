(function () {
  'use strict';

  // Create a global variable and expose it the world.
  var ironfytCal = {};
  self.ironfytCal = ironfytCal;

  document.addEventListener('click', function (ev) {
    if (ev.target.className === 'calendar-item') {
      showModal(ev.target.id);
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
