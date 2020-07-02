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
        slideUpModal: true,
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
    let { elementId, slideUpModal } = props;
    let dialog = document.querySelector(elementId);
    if (visibleModals.indexOf(elementId) < 0) {
      dialog.style.transform = slideUpModal !== undefined && slideUpModal === true ? 'translateY(-100vh)' : 'translateX(-100vw)';
      visibleModals.push(props);
    }
  }
  function hideModal({ elementId }) {
    let dialog = document.querySelector(elementId);
    let obj = visibleModals.find((item) => item.elementId === elementId);
    if (visibleModals.indexOf(obj) > -1) {
      dialog.style.transform = obj.slideUpModal !== undefined && obj.slideUpModal === true ? 'translateY(100vh)' : 'translateX(100vw)';
      let index = visibleModals.indexOf(obj);
      visibleModals.splice(index, 1);
    }
  }
})();
