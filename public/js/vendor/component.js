/**
 * Component constructor function.
 * Example:
 * let aComponent = Component('#selector', {
 *   state: { greetings: 'Hello World' }, // Holds the state for the component
 *   template: function(props) { return `<h1>props.greetings</h1>` }, // Template function provides the template for to be rendered
 *   afterRender: function(props) {} //This function gets executed after the page is rendered. Any additional code that needs to be executed everytime a page is rendered goes here. Setting the styles is a perfect example or rendering google charts upon each render is a good example.
 * });
 *
 * //Rendering the component
 * aComponent.render() - will render the component on a page. Rarely does this method gets called exclusively. Generally a page is rendered via setState() method.
 *
 * //Setting/updating the state of the component
 * aComponent.setState({greetings: 'Greetings from Mars' }); - will update the state of the component and render the page
 *
 * //Getting the state of the component
 * let state = aComponent.getState() - will retrieve a non-mutable copy of the current state of the component
 */
(function (global) {
  'use strict';

  var Component = function (selector, options) {
    return new Component.init(selector, options);
  };

  Component.prototype = {};

  Component.prototype.setState = function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.state[key] = obj[key];
      }
    }
    this.render();
  };

  /**
   *
   * @param {function} callback //Optional callback to execute any additional code upon rendering
   */
  Component.prototype.render = function () {
    var element = document.querySelector(this.selector);
    if (!element) return;
    element.innerHTML = this.template(this.state);
    this.afterRender(this.state);
  };

  Component.prototype.getState = function () {
    // Return a copy of state object
    return JSON.parse(JSON.stringify(this.state));
  };
  Component.init = function (selector, options) {
    var self = this;
    self.selector = selector || '';
    self.state = options !== undefined && options.state !== undefined ? options.state : {};
    self.template = options !== undefined && options.template !== undefined && typeof options.template === 'function' ? options.template : function () {};
    // This function if provided is called from the render() function after it renders the template.
    self.afterRender = options !== undefined && options.afterRender !== undefined && typeof options.afterRender === 'function' ? options.afterRender : function () {};
  };

  Component.init.prototype = Component.prototype;

  global.Component = Component;
})(window);
