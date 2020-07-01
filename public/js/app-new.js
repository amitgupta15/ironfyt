(function () {
  'use strict';

  // Global Variables
  var isSlideUpModalVisible = false;
  var isRTLModalVisible = false;

  /**
   * Event Listeners
   */
  var handlers = {
    'new-item-btn': showSlideUpModal,
    'close-dialog': hideSlideUpModal,
    'new-workout-modal-btn': showRTLModal,
    'close-rtl-dialog': hideRTLModal,
  };
  document.addEventListener('click', function (event) {
    event.preventDefault();
    if (handlers[event.target.id] !== undefined) {
      handlers[event.target.id]();
    }
  });

  /**
   * Handlers
   */
  function showSlideUpModal() {
    var dialog = document.querySelector('.modal-dialog-container');
    if (!isSlideUpModalVisible) {
      dialog.style.transform = 'translateY(-100vh)';
      isSlideUpModalVisible = true;
    }
  }

  function hideSlideUpModal() {
    var dialog = document.querySelector('.modal-dialog-container');
    if (isSlideUpModalVisible) {
      dialog.style.transform = 'translateY(100vh)';
      isSlideUpModalVisible = false;
    }
  }

  function showRTLModal() {
    var dialog = document.querySelector('.rtl-modal-dialog-container');
    if (!isRTLModalVisible) {
      dialog.style.transform = 'translateX(-100vw)';
      isRTLModalVisible = true;
    }
  }

  function hideRTLModal() {
    var dialog = document.querySelector('.rtl-modal-dialog-container');
    if (isRTLModalVisible) {
      dialog.style.transform = 'translateX(100vw)';
      isRTLModalVisible = false;
    }
  }
})();
