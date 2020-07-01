(function () {
  'use strict';

  // Global Variables
  let visibleModals = [];
  /**
   * Event Listeners
   */
  let eventHandlers = {
    'new-task-btn': {
      fn: showModal,
      props: {
        elementId: '#select-task-modal',
        modalType: 'slideUp',
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
        modalType: 'slideLeft',
      },
    },
    'close-new-workout-modal-btn': {
      fn: hideModal,
      props: {
        elementId: '#new-workout-form-modal',
      },
    },
  };
  document.addEventListener('click', function (event) {
    event.preventDefault();
    if (eventHandlers[event.target.id] !== undefined) {
      let handler = eventHandlers[event.target.id];
      handler.fn(handler.props);
    }
  });

  /**
   * Handlers
   */
  function showModal(props) {
    let { elementId, modalType } = props;
    let dialog = document.querySelector(elementId);
    if (visibleModals.indexOf(elementId) < 0) {
      dialog.style.transform = modalType === 'slideUp' ? 'translateY(-100vh)' : 'translateX(-100vw)';
      visibleModals.push(props);
    }
  }
  function hideModal({ elementId }) {
    let dialog = document.querySelector(elementId);
    let obj = visibleModals.find((item) => item.elementId === elementId);
    if (visibleModals.indexOf(obj) > -1) {
      dialog.style.transform = obj.modalType === 'slideUp' ? 'translateY(100vh)' : 'translateX(100vw)';
      let index = visibleModals.indexOf(obj);
      visibleModals.splice(index, 1);
    }
  }
})();
