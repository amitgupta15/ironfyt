(function (global) {
  'use strict';

  var Component = function (selector, options) {
    return new Component.init(selector, options);
  };

  Component.prototype = {};
  Component.prototype.setData = function (obj, shallRender = true) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.data[key] = obj[key];
      }
    }
    if (shallRender) {
      this.render();
    }
  };

  Component.prototype.render = function () {
    var element = document.querySelector(this.selector);
    if (!element) return;
    element.innerHTML = this.template(this.data);
  };

  Component.prototype.getData = function () {
    // Return a copy of data object
    return JSON.parse(JSON.stringify(this.data));
  };

  Component.init = function (selector, options) {
    var self = this;
    self.selector = selector || '';
    self.data = options !== undefined && options.data !== undefined ? options.data : {};
    self.template = options !== undefined && options.template !== undefined && typeof options.template === 'function' ? options.template : function () {};
  };

  Component.init.prototype = Component.prototype;

  global.Component = Component;
})(window);
