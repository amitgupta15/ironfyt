(function () {
  'use strict';

  // Global Variables
  var isModalDialogVisible = false;
  /**
   * Event Listeners
   */
  document.addEventListener('click', function (event) {
    event.preventDefault();
    switch (event.target.id) {
      case 'new-item-btn':
        toggleModalDialogDisplay();
        break;
      case 'search-btn':
        console.log('search button clicked');
        break;
      case 'close-dialog':
        toggleModalDialogDisplay();
        break;
      default:
        if (event.target.className === 'modal-dialog-container') {
          toggleModalDialogDisplay();
        }
        break;
    }
  });

  function toggleModalDialogDisplay() {
    var dialog = document.querySelector('.modal-dialog-container');
    if (!isModalDialogVisible) {
      dialog.style.transform = 'translateY(-100vh)';
      isModalDialogVisible = true;
    } else if (isModalDialogVisible) {
      dialog.style.transform = 'translateY(100vh)';
      isModalDialogVisible = false;
    }
  }
})();
