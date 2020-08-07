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

  /** END TEST METHODS */
})();
