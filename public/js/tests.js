(function () {
  'use strict';

  /**
   * TEST METHODS
   */
  /**
   * test function
   * @param {string} desc
   * @param {function} fn
   */
  function it(desc, fn) {
    try {
      fn();
      console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
    } catch (error) {
      console.log('\n');
      console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
      console.error(error);
    }
  }

  /**
   * assert function
   * @param {boolean} condition
   */
  function assert(condition) {
    if (!condition) {
      throw new Error();
    }
  }
  /** END TEST METHODS */

  console.group('\x1b[34m%s\x1b[0m', 'Testing component.js library');

  it('should create a new component - no selector or options provided', function () {
    var someComponent = new Component();
    assert(someComponent instanceof Component);
    // Object comparison as shown in StackOverflow https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    assert(JSON.stringify(someComponent.data) === JSON.stringify({}));
    assert(typeof someComponent.template === 'function');
    assert(someComponent.selector === '');
  });

  it('should create a new component', function () {
    var selector = '#list';
    var options = {
      data: { workouts: [] },
      template: function () {
        return '<h1>Hello</h1>';
      },
      props: 'hi',
    };
    var someComponent = new Component('#list', options);
    assert(someComponent instanceof Component);
    assert(someComponent.data === options.data);
    assert(someComponent.template === options.template);
    assert(someComponent.selector === selector);
  });

  it('should handle setData', function () {
    var aComponent = new Component('#selector', { data: { msg: 'hello' } });
    assert(aComponent.data.msg === 'hello');
    aComponent.setData({ msg: 'world' });
    assert(aComponent.data.msg === 'world');
  });

  it('should render a template', function () {
    var aComponent = Component('#selector', {
      data: { msg: 'world' },
      template: function (props) {
        return '<h1>' + props.msg + '</h1>';
      },
    });
    aComponent.render();
    var element = document.querySelector('#selector');
    assert(element.innerHTML === '<h1>world</h1>');
  });

  it('should get a copy of the data object', function () {
    var aComponent = Component('', { data: ['hello', 'world'] });
    var _data1 = aComponent.getData();
    // Such assignment is by reference. So anytime _data1 changes, _data2 will also change.
    var _data2 = _data1;
    assert(_data1.length === 2);
    assert(_data2.length === 2);
    _data1.push('amit');
    assert(_data2.length === 3);

    // Using getData provides copy of the original data object.
    _data1 = aComponent.getData();
    assert(_data1.length === 2);
    _data2 = aComponent.getData();
    assert(_data2.length === 2);

    // This time around, changing _data1 has no effect on _data2
    _data1.push('amit');
    assert(_data1.length === 3);
    assert(_data2.length === 2);
  });
  console.groupEnd();
  /**
   * TEST helper-library.js
   */
  console.group('\x1b[34m%s\x1b[0m', 'Testing helper-library.js');

  it('should sort an array of objects given a property and order', function () {
    var unsortedArray = [{ id: 5 }, { id: 7 }, { id: 9 }];
    var sortedArray = hl.sortArray(unsortedArray, 'id', 'desc');
    assert(sortedArray.length === unsortedArray.length);
    assert(sortedArray[0].id === 9);
    assert(sortedArray[2].id === 5);
  });

  it('should validate a date string', function () {
    // Valid Date
    var valid = hl.isValidDate('11/01/2020');
    assert(valid);

    // Invalid Date
    valid = hl.isValidDate('13/01/2020');
    assert(!valid);

    valid = hl.isValidDate('12/32/2020');
    assert(!valid);

    valid = hl.isValidDate('12/31/2020');
    assert(valid);
  });

  it('should format the date string to mm/dd/yyyy', function () {
    assert(hl.formatDateString('3/6/20') === '03/06/2020');
    assert(hl.formatDateString('3/6/7') === '03/06/2007');
    assert(hl.formatDateString('03/6/7') === '03/06/2007');
    assert(hl.formatDateString('03/06/7') === '03/06/2007');
    assert(hl.formatDateString('03/06/07') === '03/06/2007');
    assert(hl.formatDateString('03/06/2020') === '03/06/2020');
  });
  console.groupEnd();
  /**
   * TEST app.js
   */
  console.group('\x1b[34m%s\x1b[0m', 'Testing app.js');

  it('should create userListComponent successfully', function () {
    assert(ironfyt.userListComponent.selector === '[data-app=user-list]');
    assert('users' in ironfyt.userListComponent.data);
    assert(Object.keys(ironfyt.userListComponent.data).length === 1);
    var noUsersFoundString = ironfyt.userListComponent.template({ users: [] });
    assert(noUsersFoundString.toLowerCase().includes('no user') === true);
    var usersHTMLString = ironfyt.userListComponent.template({
      users: [
        { id: -1, fname: 'amit' },
        { id: -2, fname: 'pooja' },
      ],
    });
    assert(
      usersHTMLString ===
        '<ul class="user-list"><li><a href="workout-list.html?user=-1">amit</a></li><li><a href="workout-list.html?user=-2">pooja</a></li></ul>',
    );
    assert(ironfyt.routes['user-list'].name === 'userListPage');
  });

  it('should have user-list route populate userListComponent data object successfully', function () {
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?filter=all') {
        callback({ users: [{ id: -1, fname: 'amit', logs: [{ log_id: -1, workout_id: -1 }] }] });
      }
    };
    // Call the function associated with the route
    ironfyt.routes['user-list']();
    var _data = ironfyt.userListComponent.getData();
    assert(_data.users.length === 1);
    assert(_data.users[0].id === -1);
  });

  it('should create workoutListComponent successfully', function () {
    assert((ironfyt.workoutListComponent.selector = '[data-app=workout-list]'));
    assert(Object.keys(ironfyt.workoutListComponent.data).length === 4);
    assert(typeof ironfyt.workoutListComponent.data['user'] === 'object');
    assert(ironfyt.workoutListComponent.data['workouts'] instanceof Array);
    assert(ironfyt.workoutListComponent.data['unfilteredList'] instanceof Array);
    assert(typeof ironfyt.workoutListComponent.data['search'] === 'string');
    var notLoggedInHTMLString = ironfyt.workoutListComponent.template({ workouts: [], user: {}, search: '' });
    assert(notLoggedInHTMLString.toLowerCase().includes('please select a user'));
    var workoutListHTMLString = ironfyt.workoutListComponent.template({ workouts: [], user: { id: -1, fname: 'amit' }, search: '' });
    assert(workoutListHTMLString.toLowerCase().includes('<ul class="top-bar"'));
    assert(workoutListHTMLString.toLowerCase().includes('<form id="search-workout">'));
    assert(workoutListHTMLString.toLowerCase().includes('no workouts found'));
    workoutListHTMLString = ironfyt.workoutListComponent.template({
      workouts: [{ id: -1, name: 'workout', description: 'hello' }],
      user: { id: -1, fname: 'amit' },
      search: '',
    });
    assert(workoutListHTMLString.toLowerCase().includes('<div class="workout-item">'));
    assert(ironfyt.routes['workout-list'].name === 'workoutListPage');
  });

  it('should have workout-list route populate workoutListComponent data object successfully', function () {
    /** setup */
    // Stub hl.fetch()
    hl.fetch.get = function (str, callback) {
      if (str === '/api/workouts?filter=all') {
        callback({
          workouts: [
            { id: -2, name: 'workout1' },
            { id: -1, name: 'workout2' },
          ],
        });
      }
      if (str === '/api/users?id=-1') {
        callback({
          id: -1,
          fname: 'amit',
          logs: [
            { log_id: '1', workout_id: '-1' },
            { log_id: '2', workout_id: '-2' },
            { log_id: '3', workout_id: '-1' },
          ],
        });
      }
      if (str === '/api/logs?filter=all') {
        callback({
          logs: [
            { id: '1', workout_id: '-1' },
            { id: '2', workout_id: '-1' },
            { id: '3', workout_id: '-1' },
            { id: '3', workout_id: '-2' },
          ],
        });
      }
    };
    // Stub hl.getParams()
    hl.getParams = function () {
      return { user: -1 };
    };
    /** end setup */

    /** test block */
    ironfyt.routes['workout-list']();
    var _data = ironfyt.workoutListComponent.getData();
    assert(_data.user.id === -1);
    assert(_data.workouts.length === 2);
    assert(_data.unfilteredList.length === 2);
    // Make sure workouts are sorted in desc order
    assert(_data.workouts[0].id === -1);
    assert(_data.workouts[0].userlogcount === 2);
    assert(_data.workouts[0].totallogcount === 3);
    /** End Test block */

    /** teardown */
    hl.fetch.get = undefined;
    hl.getParams = undefined;
    /** end teardown */
  });

  it('should reset the search result of workout list on clicking the reset button', function () {
    var selector = document.getElementById('selector');
    selector.innerHTML = '<form id="search-workout"><button type="reset">Reset</button></form>';
    ironfyt.workoutListComponent.setData({ unfilteredList: [{ id: -1, name: 'workout' }], workouts: [] });
    var _data = ironfyt.workoutListComponent.getData();

    assert(_data.workouts.length === 0);
    document.querySelector('form').reset();
    _data = ironfyt.workoutListComponent.getData();

    assert(_data.workouts.length === 1);
    selector.innerHTML = '';
  });

  it('should search workouts based on search criteria', function () {
    var selector = document.getElementById('selector');
    selector.innerHTML = '<form id="search-workout"><input type="text" name="search"/><button type="submit">Submit</button></form>';
    var searchInputField = document.querySelector('form[id="search-workout"]').elements['search'];
    searchInputField.value = 'thruster';
    var workouts = [
      { id: -1, name: 'bench-press', description: '20 bench-press' },
      { id: -2, name: 'Fran', description: '21-15-9 Thrusters and pull-ups' },
      { id: -3, name: 'Cindy', description: '20 pull-ups, 30 push-ups, 40 sit-ups and 50 squats' },
    ];
    ironfyt.workoutListComponent.setData({ unfilteredList: workouts, workouts: workouts });
    var _data = ironfyt.workoutListComponent.getData();
    assert(_data.workouts.length === 3);
    assert(_data.search === '');

    var fm = document.querySelector('form[id="search-workout"]');
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('submit', true, true);
    fm.dispatchEvent(ev);

    _data = ironfyt.workoutListComponent.getData();
    assert(_data.workouts.length === 1);
    assert(_data.workouts[0].id === -2);
    assert(_data.search === 'thruster');

    selector.innerHTML = '';
  });

  it('should create logComponent successfully', function () {
    assert(ironfyt.logComponent.selector === '[data-app=log]');
    var _data = ironfyt.logComponent.getData();
    assert(Object.keys(_data).length === 3);
    assert('workout' in _data);
    assert('user' in _data);
    assert('logs' in _data);
    assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));
    var _template = ironfyt.logComponent.template({
      workout: { id: -2, name: 'fran', description: '21-15-9 thursters & pull-ups' },
      user: { id: -1, fname: 'amit' },
      logs: [{ duration: '20 minutes', rounds: null, load: '95 lbs', notes: 'finished well' }],
    });
    assert(_template.includes('fran'));
    assert(_template.includes('finished well'));
    assert(ironfyt.routes['log'].name === 'logPage');
  });

  it('should have log route populate logComponent data object successfully', function () {
    /** setup block */
    var _workout = { id: -2, name: 'fran', description: '21-15-9 thursters & pull-ups' };
    var _user = {
      id: -1,
      fname: 'amit',
      logs: [
        { workout_id: -2, log_id: -1 },
        { workout_id: -2, log_id: -2 },
        { workout_id: -1, log_id: -3 },
      ],
    };
    // Stub hl.fetch.get()
    hl.fetch.get = function (str, callback) {
      if (str === '/api/workouts?id=-2') {
        callback(_workout);
      }
      if (str === '/api/users?id=-1') {
        callback(_user);
      }
      if (str === '/api/logs?filter=all') {
        callback({
          logs: [
            { id: -1, date: new Date('01/02/2020'), user_id: -1, workout_id: -2 },
            { id: -2, date: new Date('01/03/2020'), user_id: -1, workout_id: -2 },
            { id: -3, date: new Date('01/04/2020'), user_id: -1, workout_id: -1 },
          ],
        });
      }
    };

    /** end setup block */

    /** Test Block */
    // Stub hl.getParams() without any url parameters - should ask to select a user
    hl.getParams = function () {};

    ironfyt.routes['log']();
    var _data = ironfyt.logComponent.getData();
    assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));

    // Stub hl.getParams() without any url parameters
    hl.getParams = function () {
      return { workout: -1 };
    };

    ironfyt.routes['log']();
    var _data = ironfyt.logComponent.getData();
    assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));

    // Stub hl.getParams() with url parameters
    hl.getParams = function () {
      return { user: -1 };
    };
    ironfyt.routes['log']();
    _data = ironfyt.logComponent.getData();
    assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));

    // Stub hl.getParams() with url parameters
    hl.getParams = function () {
      return { user: -1, workout: -2 };
    };
    ironfyt.routes['log']();
    _data = ironfyt.logComponent.getData();
    assert(_data.workout.id === _workout.id);
    assert(_data.logs.length === 2);
    // logs should be sorted by date in desc order
    assert(_data.logs[0].id === -2);
    /** End Test Block */

    /** teardown Block */
    hl.fetch.get = undefined;
    hl.getParams = undefined;
    /** End teardown Block */
  });

  it('should create newWorkoutComponent successfully', function () {
    assert(ironfyt.newWorkoutComponent.selector === '[data-app=new-workout]');
    var _data = ironfyt.newWorkoutComponent.getData();
    assert(Object.keys(_data).length === 0);
    assert(ironfyt.newWorkoutComponent.template().toLowerCase().includes('please select a user'));
    assert(
      ironfyt.newWorkoutComponent
        .template({ user: { id: -1, fname: 'amit' } })
        .toLowerCase()
        .includes('<form id="new-workout-form">'),
    );
    assert(ironfyt.routes['new-workout'].name === 'newWorkoutPage');
  });

  it('should render new workout page successfully', function () {
    /** setup block */
    // Stub hl.fetch.get()
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?id=-1') {
        callback({ id: -1, fname: 'amit' });
      }
    };
    // Stub hl.getParams()
    hl.getParams = function () {
      return { user_id: -1 };
    };
    /** end setup block */

    /** test block */
    ironfyt.routes['new-workout']();
    var _data = ironfyt.newWorkoutComponent.getData();
    assert('user' in _data);
    /** end test block */

    /** teardown block */
    hl.getParams = undefined;
    hl.fetch.get = undefined;
    /** end teardown block */
  });

  it('should successfully submit a new workout form', function () {
    var alertCalledCount = 0;

    /** setup block */
    var _user = { id: -1, fname: 'amit' };
    // Stub hl.fetch.post() method
    hl.fetch.post = function (str, data, callback) {
      if (str === '/api/workouts') {
        callback(data);
      }
    };
    // Stub hl.fetch.get() method
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?id=-1') {
        callback(_user);
      }
    };
    // Stub hl.fetch.put() method
    hl.fetch.put = function (str, data, callback) {
      if (str === '/api/users') {
        // do nothing. Don't call the callback here, otherwise it will trigger the location.assign() call
      }
    };
    // Stub hl.getParams() method
    hl.getParams = function () {
      return { user_id: -1 };
    };
    /** end setup block */

    /** test block */
    var selector = document.querySelector('#selector');
    selector.innerHTML = '<form id="new-workout-form"></form>';
    var form = document.querySelector('#new-workout-form');
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('submit', true, true);
    window.alert = function (str) {
      alertCalledCount++;
    };
    form.dispatchEvent(ev);
    assert(alertCalledCount === 1);
    alertCalledCount = 0;
    form.innerHTML = '<input type="text" name="workout_name"><textarea name="workout_description"></textarea>';
    form.dispatchEvent(ev);
    assert(alertCalledCount === 1);
    alertCalledCount = 0;
    form.elements['workout_name'].value = 'New Workout';
    form.elements['workout_description'].value = 'workout description';
    form.dispatchEvent(ev);
    assert(alertCalledCount === 0);
    selector.innerHTML = '';
    assert('workouts' in _user);
    /** end test block */

    /** teardown block */
    hl.fetch.get = undefined;
    hl.fetch.post = undefined;
    hl.fetch.put = undefined;
    hl.getParams = undefined;
    /** end teardown block */
  });

  it('should create newLogComponent successfully', function () {
    assert(ironfyt.newLogComponent.selector === '[data-app=new-log]');
    var _data = ironfyt.newLogComponent.getData();
    assert(Object.keys(_data).length === 0);
    assert(ironfyt.newLogComponent.template(_data) === '');
    assert(ironfyt.routes['new-log'].name === 'newLogPage');
  });

  it('should render new log page successfully', function () {
    /** setup block */
    hl.getParams = function () {
      return { workout_name: 'a workout' };
    };
    /** end setup block */

    /** test block */
    var selector = document.querySelector('#selector');
    selector.innerHTML =
      '<div data-app="new-log"></div><form id="new-log-form"><input type="text" name="log_date"><input type="text" name="log_duration"></form>';
    ironfyt.routes['new-log']();
    var form = document.querySelector('#new-log-form');
    assert(selector.innerHTML.toLowerCase().includes('<p><strong>workout: a workout'));
    assert(document.activeElement.name === 'log_duration');
    // date field is not empty - it is populated with today's date
    assert(form.elements['log_date'].value !== '');
    /** end test block */

    /** teardown block */
    selector.innerHTML = '';
    hl.getParams = undefined;
    /** end teardown block */
  });

  it('should successfully submit a new log form', function () {
    var alertCount = 0;
    /** setup block */
    var _user = { id: -1, fname: 'amit' };
    //Stub the post method
    hl.fetch.post = function (str, data, callback) {
      if (str === '/api/logs') {
        data.id = -1;
        callback(data);
      }
    };
    // Stub the get method
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?id=-1') {
        callback(_user);
      }
    };
    // Stub the put method
    hl.fetch.put = function (str, data, callback) {
      if (str === '/api/users') {
        // Do nothing to avoid location.assign() call
      }
    };
    // Stub hl.getParams() method
    hl.getParams = function () {
      return { workout_id: -1, user_id: -1 };
    };
    /** end setup block */

    /** test block */
    var selector = document.querySelector('#selector');
    //Add a form with proper id to the DOM. This form will be dispatching the submit event
    selector.innerHTML = '<form id="new-log-form"><input type="text" class="input-textfield" name="log_date" placeholder="Date: mm/dd/yyyy"></form>';
    var form = document.querySelector('#new-log-form');
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('submit', true, true);

    form.dispatchEvent(ev);

    assert(selector.innerHTML.toLowerCase().includes('<div id="date-error-div" class="error-div">please enter a valid date mm/dd/yyyy</div>'));
    // Make sure field-has-error class is added to the required field
    assert(form.elements['log_date'].classList.contains('field-has-error'));

    // Populate a required field on the DOM with invalid Date
    form.elements['log_date'].value = '13/01/2020';
    form.dispatchEvent(ev);
    assert(selector.innerHTML.toLowerCase().includes('<div id="date-error-div" class="error-div">please enter a valid date mm/dd/yyyy</div>'));
    // Make sure field-has-error class is added to the required field
    assert(form.elements['log_date'].classList.contains('field-has-error'));

    // Populate a required field on the DOM with valid Date
    form.elements['log_date'].value = '12/01/2020';
    //Submit the form
    form.dispatchEvent(ev);
    assert(!form.elements['log_date'].classList.contains('field-has-error'));
    assert(_user.logs.length === 1);
    /** end test block */

    /** teardown block */
    hl.fetch.get = undefined;
    hl.fetch.post = undefined;
    hl.fetch.put = undefined;
    hl.getParams = undefined;
    //Reset the innerHTML for selector
    selector.innerHTML = '';
    /** end teardown block */
  });

  it('should successfully create logListComponent', function () {
    assert(ironfyt.logListComponent.selector === '[data-app=log-list]');
    var _data = ironfyt.logListComponent.getData();
    assert(Object.keys(_data).length === 5);
    assert('search' in _data);
    assert('logs' in _data);
    assert('unfilteredList' in _data);
    assert('alllogs' in _data);
    assert('user' in _data);
    _data.logs = [{ id: 1, date: null, notes: 'hello' }];
    assert(ironfyt.logListComponent.template(_data).includes('hello'));
    assert(ironfyt.routes['log-list'].name === 'logListPage');

    /** teardown block */
    _data.logs = [];
    /** end teardown block */
  });

  it('should have log-list route populate logListComponent data object successfully', function () {
    /** setup block */
    //Stub the get method for all possible queries for this page
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?filter=all') {
        callback({ users: [{ id: -1, fname: 'amit' }] });
      }
      if (str === '/api/logs?filter=all') {
        callback({
          logs: [
            { id: -1, date: new Date('01/01/2020'), notes: 'log 1', user_id: -1, workout_id: -1 },
            { id: -2, date: new Date('01/02/2020'), notes: 'log 2', user_id: -1, workout_id: -1 },
            { id: -3, date: new Date('01/01/2020'), notes: 'log 3', user_id: -2 },
          ],
        });
      }
      if (str === '/api/workouts?filter=all') {
        callback({ workouts: [{ id: -1, name: 'some workout' }] });
      }
    };
    /** end setup block */

    /** test block */

    // Stub hl.getParams() method
    hl.getParams = function () {
      return { all: false, user: -1 };
    };
    // Call the route
    ironfyt.routes['log-list']();

    var _data = ironfyt.logListComponent.getData();
    assert(_data.user.id === -1);
    assert(_data.alllogs === false);
    assert(_data.logs.length === 2);
    assert(_data.logs[0].id === -2);
    assert('workout' in _data.logs[0]);

    // Stub hl.getParams() method
    hl.getParams = function () {
      return { all: 'true' };
    };
    ironfyt.routes['log-list']();
    _data = ironfyt.logListComponent.getData();
    assert(_data.logs.length === 3);
    assert(_data.alllogs === true);
    /** end test block */

    /** teardown block */
    hl.fetch.get = undefined;
    hl.getParams = undefined;
    /** end teardown block */
  });

  it('should reset the search result of log list on clicking the reset button', function () {
    var unfilteredLogs = [
      { id: -1, date: new Date('01/01/2020'), notes: 'log 1', user_id: -1 },
      { id: -2, date: new Date('01/02/2020'), notes: 'log 2', user_id: -1, workout_id: -1 },
      { id: -3, date: new Date('01/01/2020'), notes: 'log 3', user_id: -2 },
    ];
    var filteredLogs = [{ id: -2, date: new Date('01/02/2020'), notes: 'log 2', user_id: -1, workout_id: -1 }];
    ironfyt.logListComponent.setData({ logs: filteredLogs, unfilteredList: unfilteredLogs, search: 'testing' });

    var _data = ironfyt.logListComponent.getData();
    assert(_data.logs.length === 1);
    assert(_data.unfilteredList.length === 3);
    assert(_data.search === 'testing');

    var selector = document.querySelector('#selector');
    selector.innerHTML = '<form id="search-logs"></form>';
    var form = document.querySelector('#search-logs');
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('reset', true, true);
    form.dispatchEvent(ev);

    _data = ironfyt.logListComponent.getData();
    assert(_data.logs.length === 3);
    assert(_data.unfilteredList.length === 3);
    assert(_data.search === '');
  });

  it('should search logs based on search criteria', function () {
    var logs = [
      { id: -1, notes: 'thrusters' },
      { id: -2, notes: 'bench press' },
      { id: -3, notes: 'bench sit-ups' },
    ];
    ironfyt.logListComponent.setData({ logs: logs, unfilteredList: logs });
    var _data = ironfyt.logListComponent.getData();
    assert(_data.logs.length === 3);
    assert(_data.unfilteredList.length === 3);

    // Get the div with id= selector from test.html file
    var selector = document.querySelector('#selector');
    // Attach a form with id=search-logs to selector
    selector.innerHTML = '<form id="search-logs"><input type="text" name="search"></form>';
    var form = document.querySelector('#search-logs');
    // Set the search criteria in the search field
    form.elements['search'].value = 'bench';

    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('submit', true, true);

    form.dispatchEvent(ev);
    _data = ironfyt.logListComponent.getData();
    assert(_data.logs.length === 2);
    assert(_data.unfilteredList.length === 3);
    assert(_data.search === 'bench');
    selector.innerHTML = '';
  });
  console.group('Testing Templates');
  it('should render workoutTempate', function () {
    var workout = {};
    var workoutTemplate = ironfyt.workoutTemplate({ workout: workout });
    assert(workoutTemplate.toLowerCase().includes('<div class="workout-item">'));
  });

  it('should render signInTemplate', function () {
    var signInTemplate = ironfyt.signInTemplate();
    assert(signInTemplate.toLowerCase().includes('please select a user'));
  });

  it('should render topBarTemplate', function () {
    var topBarTemplate = ironfyt.topBarTemplate();
    assert(topBarTemplate.toLowerCase().includes('<ul class="top-bar">'));
  });
  it('should render searchTemplate', function () {
    var searchTemplate = ironfyt.searchTemplate({ search: 'aworkout', id: 'search-workout' });
    assert(searchTemplate.toLowerCase().includes('<form id="search-workout">'));
    assert(searchTemplate.toLowerCase().includes('aworkout'));
  });
  console.groupEnd();
  console.groupEnd();
})();
