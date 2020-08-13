(function () {
  'use strict';

  /**
   * Provides methods for Front End Test.
   */
  let uitest = {};
  self.uitest = uitest;

  /**
   * TEST METHODS
   */
  /**
   * it method
   * @param {string} desc
   * @param {function} fn
   */
  uitest.it = (desc, fn) => {
    try {
      fn();
      console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
    } catch (error) {
      console.log('\n');
      console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
      console.error(error);
    }
  };

  /**
   * assert method
   * @param {boolean} condition
   */
  uitest.assert = (condition) => {
    if (!condition) {
      throw new Error();
    }
  };

  /**
   *
   * @param {string} eventType specify the event type such as 'click', 'submit'
   * @param {string} selector specify the selector such as .class or #id
   */
  uitest.dispatchHTMLEvent = (eventType, selector) => {
    const ev = document.createEvent('HTMLEvents');
    ev.initEvent(eventType, true, true);

    const dispatcher = document.querySelector(selector);
    dispatcher.dispatchEvent(ev);
  };

  /** END TEST METHODS */
})();
