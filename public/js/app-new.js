(function () {
  'use strict';

  // Global Variables
  let visibleModals = [];
  /**
   * Event Listeners
   */

  let eventTarget = {
    'new-task-btn': {
      fn: showModal,
      props: {
        elementId: '#select-task-modal',
        isSlideUpModal: true,
      },
    },
    'close-select-task-modal': {
      fn: hideModal,
      props: {
        elementId: '#select-task-modal',
      },
    },
    'new-workout-modal-btn': {
      fn: showModal,
      props: {
        elementId: '#new-workout-form-modal',
      },
    },
    'close-new-workout-modal-btn': {
      fn: hideModal,
      props: {
        elementId: '#new-workout-form-modal',
      },
    },
    'new-log-modal-btn': {
      fn: showModal,
      props: {
        elementId: '#log-workout-modal',
      },
    },
    'close-log-workout-modal-btn': {
      fn: hideModal,
      props: {
        elementId: '#log-workout-modal',
      },
    },
    'log-activity-modal-btn': {
      fn: showModal,
      props: {
        elementId: '#log-activity-modal',
      },
    },
    'close-log-activity-modal-btn': {
      fn: hideModal,
      props: {
        elementId: '#log-activity-modal',
      },
    },
    'save-log-activity-modal-btn': {
      fn: saveAndCloseModal,
      props: {
        elementId: '#log-activity-modal',
      },
    },
  };
  document.addEventListener('click', function (event) {
    event.preventDefault();
    if (eventTarget[event.target.id] !== undefined) {
      let handler = eventTarget[event.target.id];
      handler.fn(handler.props);
    }
  });

  /**
   * Handlers
   */
  function showModal(props) {
    let { elementId, isSlideUpModal } = props;
    let dialog = document.querySelector(elementId);
    if (visibleModals.indexOf(elementId) < 0) {
      dialog.style.transform = isSlideUpModal !== undefined && isSlideUpModal === true ? 'translateY(-100%)' : 'translateX(-100%)';
      visibleModals.push(props);
    }
  }
  function hideModal({ elementId }) {
    let dialog = document.querySelector(elementId);
    let obj = visibleModals.find((item) => item.elementId === elementId);
    if (visibleModals.indexOf(obj) > -1) {
      dialog.style.transform = obj.isSlideUpModal !== undefined && obj.isSlideUpModal === true ? 'translateY(100%)' : 'translateX(100%)';
      let index = visibleModals.indexOf(obj);
      visibleModals.splice(index, 1);
    }
  }

  function saveAndCloseModal(props) {
    visibleModals.forEach((modal) => {
      // Get the modal dialog
      let dialog = document.querySelector(modal.elementId);
      dialog.style.transitionDuration = '0s';
      if (modal.isSlideUpModal) {
        dialog.style.transform = 'translateY(100%)';
      } else {
        dialog.style.transform = 'translateX(100%)';
      }
    });

    // Resetting all styles after a short delay to avoid interference with above transitions
    window.setTimeout(function () {
      visibleModals.forEach((modal) => {
        let dialog = document.querySelector(modal.elementId);
        dialog.style = '';
      });
      visibleModals = [];
    }, 100);
  }
})();
