(function () {
  'use strict';

  /**
   * Event Listeners
   */
  document.addEventListener('click', function (event) {
    event.preventDefault();
    switch (event.target.id) {
      case 'new-item-btn':
        console.log('new item button clicked');
        break;
      case 'search-btn':
        console.log('search button clicked');
        break;
      default:
        console.log('unhandled event');
    }
  });
})();
