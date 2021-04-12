(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'Testing component.js library');

  let test = new Uitest();

  test.it('should create a new component - no selector or options provided', function () {
    var someComponent = new Component();
    test.assert(someComponent instanceof Component);
    // Object comparison as shown in StackOverflow https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    test.assert(JSON.stringify(someComponent.state) === JSON.stringify({}));
    test.assert(typeof someComponent.template === 'function');
    test.assert(someComponent.selector === '');
  });

  test.it('should create a new component', function () {
    var options = {
      state: { workouts: [] },
      template: function () {
        return '<h1>Hello</h1>';
      },
      props: 'hi',
    };
    var someComponent = new Component('#list', options);
    test.assert(someComponent instanceof Component);
    test.assert(someComponent.state === options.state);
    test.assert(someComponent.template === options.template);
    test.assert(someComponent.selector === '#list');
  });

  test.it('should handle setState', function () {
    var aComponent = new Component('#selector', { state: { msg: 'hello' } });
    test.assert(aComponent.state.msg === 'hello');
    aComponent.setState({ msg: 'world' });
    test.assert(aComponent.state.msg === 'world');
  });

  test.it('should render a template', function () {
    var aComponent = Component('#selector', {
      state: { msg: 'world' },
      template: function (props) {
        return '<h1>' + props.msg + '</h1>';
      },
    });
    aComponent.render();
    var element = document.querySelector('#selector');
    test.assert(element.innerHTML === '<h1>world</h1>');

    element.innerHTML = '';
  });

  test.it('should handle afterRender() when provided', function () {
    let afterRenderCalled = false;
    var aComponent = Component('#selector', {
      template: function (props) {
        return '<h1>Hello</h1>';
      },
      afterRender: function (props) {
        afterRenderCalled = true;
      },
    });

    aComponent.render();
    test.assert(afterRenderCalled === true);
  });
  test.it('should get a copy of the data object', function () {
    var aComponent = Component('', { state: ['hello', 'world'] });
    var _data1 = aComponent.getState();
    // Such assignment is by reference. So anytime _data1 changes, _data2 will also change.
    var _data2 = _data1;
    test.assert(_data1.length === 2);
    test.assert(_data2.length === 2);
    _data1.push('amit');
    test.assert(_data2.length === 3);

    // Using getState provides copy of the original data object.
    _data1 = aComponent.getState();
    test.assert(_data1.length === 2);
    _data2 = aComponent.getState();
    test.assert(_data2.length === 2);

    // This time around, changing _data1 has no effect on _data2
    _data1.push('amit');
    test.assert(_data1.length === 3);
    test.assert(_data2.length === 2);
  });
  console.groupEnd();
})();
