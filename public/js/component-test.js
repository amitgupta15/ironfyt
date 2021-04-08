(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'Testing component.js library');

  uitest.it('should create a new component - no selector or options provided', function () {
    var someComponent = new Component();
    uitest.assert(someComponent instanceof Component);
    // Object comparison as shown in StackOverflow https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    uitest.assert(JSON.stringify(someComponent.data) === JSON.stringify({}));
    uitest.assert(typeof someComponent.template === 'function');
    uitest.assert(someComponent.selector === '');
  });

  uitest.it('should create a new component', function () {
    var selector = '#list';
    var options = {
      data: { workouts: [] },
      template: function () {
        return '<h1>Hello</h1>';
      },
      props: 'hi',
    };
    var someComponent = new Component('#list', options);
    uitest.assert(someComponent instanceof Component);
    uitest.assert(someComponent.data === options.data);
    uitest.assert(someComponent.template === options.template);
    uitest.assert(someComponent.selector === selector);
  });

  uitest.it('should handle setData', function () {
    var aComponent = new Component('#selector', { data: { msg: 'hello' } });
    uitest.assert(aComponent.data.msg === 'hello');
    aComponent.setData({ msg: 'world' });
    uitest.assert(aComponent.data.msg === 'world');
  });

  uitest.it('should render a template', function () {
    var aComponent = Component('#selector', {
      data: { msg: 'world' },
      template: function (props) {
        return '<h1>' + props.msg + '</h1>';
      },
    });
    aComponent.render();
    var element = document.querySelector('#selector');
    uitest.assert(element.innerHTML === '<h1>world</h1>');
  });

  uitest.it('should get a copy of the data object', function () {
    var aComponent = Component('', { data: ['hello', 'world'] });
    var _data1 = aComponent.getData();
    // Such assignment is by reference. So anytime _data1 changes, _data2 will also change.
    var _data2 = _data1;
    uitest.assert(_data1.length === 2);
    uitest.assert(_data2.length === 2);
    _data1.push('amit');
    uitest.assert(_data2.length === 3);

    // Using getData provides copy of the original data object.
    _data1 = aComponent.getData();
    uitest.assert(_data1.length === 2);
    _data2 = aComponent.getData();
    uitest.assert(_data2.length === 2);

    // This time around, changing _data1 has no effect on _data2
    _data1.push('amit');
    uitest.assert(_data1.length === 3);
    uitest.assert(_data2.length === 2);
  });
  console.groupEnd();
})();
