(function (global) {
  ('use strict');

  /**
   *
   * @param {object} options
   * Example options:
   * {
   *   tearDown: function() {} // Include all the teardown code here
   * }
   */
  var Uitest = function (options) {
    return new Uitest.init(options);
  };

  Uitest.prototype = {};

  /**
   * it method
   * @param {string} desc
   * @param {function} fn
   */
  Uitest.prototype.it = function (desc, fn) {
    try {
      fn();
      console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
      this.tearDown();
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
  Uitest.prototype.assert = function (condition) {
    if (!condition) {
      throw new Error();
    }
  };

  /**
   *
   * @param {string} eventType specify the event type such as 'click', 'submit'
   * @param {string} selector specify the selector such as .class or #id
   */
  Uitest.prototype.dispatchHTMLEvent = function (eventType, selector) {
    const ev = document.createEvent('HTMLEvents');
    ev.initEvent(eventType, true, true);

    const dispatcher = document.querySelector(selector);
    dispatcher.dispatchEvent(ev);
  };

  Uitest.init = function (options) {
    var self = this;
    self.tearDown = options !== undefined && options.tearDown !== undefined && typeof options.tearDown === 'function' ? options.tearDown : function () {};
  };

  Uitest.init.prototype = Uitest.prototype;

  global.Uitest = Uitest;
})(window);
