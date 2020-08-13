(function () {
  'use strict';

  /**
   * TEST app.js
   */
  console.group('\x1b[34m%s\x1b[0m', 'Testing app.js');

  uitest.it('should create userListComponent successfully', function () {
    uitest.assert(ironfyt.userListComponent.selector === '[data-app=user-list]');
    uitest.assert('users' in ironfyt.userListComponent.data);
    uitest.assert(Object.keys(ironfyt.userListComponent.data).length === 1);
    var noUsersFoundString = ironfyt.userListComponent.template({ users: [] });
    uitest.assert(noUsersFoundString.toLowerCase().includes('no user') === true);
    var usersHTMLString = ironfyt.userListComponent.template({
      users: [
        { _id: -1, fname: 'amit' },
        { _id: -2, fname: 'pooja' },
      ],
    });
    uitest.assert(usersHTMLString === '<ul class="user-list"><li><a href="workout-list.html?user=-1">amit</a></li><li><a href="workout-list.html?user=-2">pooja</a></li></ul>');
    uitest.assert(ironfyt.routes['user-list'].name === 'userListPage');
  });

  uitest.it('should have user-list route populate userListComponent data object successfully', function () {
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users') {
        callback([{ id: -1, fname: 'amit', logs: [{ log_id: -1, workout_id: -1 }] }]);
      }
    };
    // Call the function associated with the route
    ironfyt.routes['user-list']();
    var _data = ironfyt.userListComponent.getData();
    uitest.assert(_data.users.length === 1);
    uitest.assert(_data.users[0].id === -1);
  });

  uitest.it('should create workoutListComponent successfully', function () {
    uitest.assert((ironfyt.workoutListComponent.selector = '[data-app=workout-list]'));
    uitest.assert(Object.keys(ironfyt.workoutListComponent.data).length === 4);
    uitest.assert(typeof ironfyt.workoutListComponent.data['user'] === 'object');
    uitest.assert(ironfyt.workoutListComponent.data['workouts'] instanceof Array);
    uitest.assert(ironfyt.workoutListComponent.data['unfilteredList'] instanceof Array);
    uitest.assert(typeof ironfyt.workoutListComponent.data['search'] === 'string');
    var notLoggedInHTMLString = ironfyt.workoutListComponent.template({
      workouts: [],
      user: {},
      search: '',
    });
    uitest.assert(notLoggedInHTMLString.toLowerCase().includes('please select a user'));
    var workoutListHTMLString = ironfyt.workoutListComponent.template({
      workouts: [],
      user: { _id: -1, fname: 'amit' },
      search: '',
    });
    uitest.assert(workoutListHTMLString.toLowerCase().includes('<ul class="top-bar"'));
    uitest.assert(workoutListHTMLString.toLowerCase().includes('<form id="search-workout">'));
    uitest.assert(workoutListHTMLString.toLowerCase().includes('no workouts found'));
    workoutListHTMLString = ironfyt.workoutListComponent.template({
      workouts: [{ _id: -1, name: 'workout', description: 'hello' }],
      user: { _id: -1, fname: 'amit' },
      search: '',
    });
    uitest.assert(workoutListHTMLString.toLowerCase().includes('<div class="workout-item">'));
    uitest.assert(ironfyt.routes['workout-list'].name === 'workoutListPage');
  });

  uitest.it('should have workout-list route populate workoutListComponent data object successfully', function () {
    /** setup */
    // Stub hl.fetch()
    hl.fetch.get = function (str, callback) {
      if (str === '/api/workouts') {
        callback([
          { _id: -2, name: 'workout1' },
          { _id: -1, name: 'workout2' },
        ]);
      }
      if (str === '/api/users?_id=-1') {
        callback({
          _id: -1,
          fname: 'amit',
          logs: [
            { log_id: '1', workout_id: '-1' },
            { log_id: '2', workout_id: '-2' },
            { log_id: '3', workout_id: '-1' },
          ],
        });
      }
      if (str === '/api/logs') {
        callback([
          { _id: '1', workout_id: '-1' },
          { _id: '2', workout_id: '-1' },
          { _id: '3', workout_id: '-1' },
          { _id: '3', workout_id: '-2' },
        ]);
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
    uitest.assert(_data.user._id === -1);
    uitest.assert(_data.workouts.length === 2);
    uitest.assert(_data.unfilteredList.length === 2);
    // Make sure workouts are sorted in desc order
    uitest.assert(_data.workouts[0]._id === -1);
    uitest.assert(_data.workouts[0].userlogcount === 2);
    uitest.assert(_data.workouts[0].totallogcount === 3);
    /** End Test block */

    /** teardown */
    hl.fetch.get = undefined;
    hl.getParams = undefined;
    /** end teardown */
  });

  uitest.it('should reset the search result of workout list on clicking the reset button', function () {
    var selector = document.getElementById('selector');
    selector.innerHTML = '<form id="search-workout"><button type="reset">Reset</button></form>';
    ironfyt.workoutListComponent.setData({
      unfilteredList: [{ _id: -1, name: 'workout' }],
      workouts: [],
    });
    var _data = ironfyt.workoutListComponent.getData();

    uitest.assert(_data.workouts.length === 0);
    document.querySelector('form').reset();
    _data = ironfyt.workoutListComponent.getData();

    uitest.assert(_data.workouts.length === 1);
    selector.innerHTML = '';
  });

  uitest.it('should search workouts based on search criteria', function () {
    var selector = document.getElementById('selector');
    selector.innerHTML = '<form id="search-workout"><input type="text" name="search"/><button type="submit">Submit</button></form>';
    var searchInputField = document.querySelector('form[id="search-workout"]').elements['search'];
    searchInputField.value = 'thruster';
    var workouts = [
      { _id: -1, name: 'bench-press', description: '20 bench-press' },
      { _id: -2, name: 'Fran', description: '21-15-9 Thrusters and pull-ups' },
      {
        _id: -3,
        name: 'Cindy',
        description: '20 pull-ups, 30 push-ups, 40 sit-ups and 50 squats',
      },
    ];
    ironfyt.workoutListComponent.setData({
      unfilteredList: workouts,
      workouts: workouts,
    });
    var _data = ironfyt.workoutListComponent.getData();
    uitest.assert(_data.workouts.length === 3);
    uitest.assert(_data.search === '');

    uitest.dispatchHTMLEvent('submit', 'form[id="search-workout"]');

    _data = ironfyt.workoutListComponent.getData();
    uitest.assert(_data.workouts.length === 1);
    uitest.assert(_data.workouts[0]._id === -2);
    uitest.assert(_data.search === 'thruster');

    selector.innerHTML = '';
  });

  uitest.it('should create logComponent successfully', function () {
    uitest.assert(ironfyt.logComponent.selector === '[data-app=log]');
    var _data = ironfyt.logComponent.getData();
    uitest.assert(Object.keys(_data).length === 3);
    uitest.assert('workout' in _data);
    uitest.assert('user' in _data);
    uitest.assert('logs' in _data);
    uitest.assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));
    var _template = ironfyt.logComponent.template({
      workout: {
        _id: -2,
        name: 'fran',
        description: '21-15-9 thursters & pull-ups',
      },
      user: { _id: -1, fname: 'amit' },
      logs: [
        {
          duration: '20 minutes',
          rounds: null,
          load: '95 lbs',
          notes: 'finished well',
        },
      ],
    });
    uitest.assert(_template.includes('fran'));
    uitest.assert(_template.includes('finished well'));
    uitest.assert(ironfyt.routes['log'].name === 'logPage');
  });

  uitest.it('should have log route populate logComponent data object successfully', function () {
    /** setup block */
    var _workout = {
      _id: -2,
      name: 'fran',
      description: '21-15-9 thursters & pull-ups',
    };
    var _user = {
      _id: -1,
      fname: 'amit',
      logs: [
        { workout_id: -2, log_id: -1 },
        { workout_id: -2, log_id: -2 },
        { workout_id: -1, log_id: -3 },
      ],
    };
    // Stub hl.fetch.get()
    hl.fetch.get = function (str, callback) {
      if (str === '/api/workouts?_id=-2') {
        callback(_workout);
      }
      if (str === '/api/users?_id=-1') {
        callback(_user);
      }
      if (str === '/api/logs') {
        callback([
          {
            _id: -1,
            date: new Date('01/02/2020'),
            user_id: -1,
            workout_id: -2,
          },
          {
            _id: -2,
            date: new Date('01/03/2020'),
            user_id: -1,
            workout_id: -2,
          },
          {
            _id: -3,
            date: new Date('01/04/2020'),
            user_id: -1,
            workout_id: -1,
          },
        ]);
      }
    };

    /** end setup block */

    /** Test Block */
    // Stub hl.getParams() without any url parameters - should ask to select a user
    hl.getParams = function () {};

    ironfyt.routes['log']();
    var _data = ironfyt.logComponent.getData();
    uitest.assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));

    // Stub hl.getParams() without any url parameters
    hl.getParams = function () {
      return { workout: -1 };
    };

    ironfyt.routes['log']();
    var _data = ironfyt.logComponent.getData();
    uitest.assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));

    // Stub hl.getParams() with url parameters
    hl.getParams = function () {
      return { user: -1 };
    };
    ironfyt.routes['log']();
    _data = ironfyt.logComponent.getData();
    uitest.assert(ironfyt.logComponent.template(_data).toLowerCase().includes('please select a user'));

    // Stub hl.getParams() with url parameters
    hl.getParams = function () {
      return { user: -1, workout: -2 };
    };
    ironfyt.routes['log']();
    _data = ironfyt.logComponent.getData();
    uitest.assert(_data.workout._id === _workout._id);
    uitest.assert(_data.logs.length === 2);
    // logs should be sorted by date in desc order
    uitest.assert(_data.logs[0]._id === -2);
    /** End Test Block */

    /** teardown Block */
    hl.fetch.get = undefined;
    hl.getParams = undefined;
    /** End teardown Block */
  });

  uitest.it('should create newWorkoutComponent successfully', function () {
    uitest.assert(ironfyt.newWorkoutComponent.selector === '[data-app=new-workout]');
    var _data = ironfyt.newWorkoutComponent.getData();
    uitest.assert(Object.keys(_data).length === 0);
    uitest.assert(ironfyt.newWorkoutComponent.template().toLowerCase().includes('please select a user'));
    uitest.assert(
      ironfyt.newWorkoutComponent
        .template({ user: { _id: -1, fname: 'amit' } })
        .toLowerCase()
        .includes('<form id="new-workout-form">')
    );
    uitest.assert(ironfyt.routes['new-workout'].name === 'newWorkoutPage');
  });

  uitest.it('should render new workout page successfully', function () {
    /** setup block */
    // Stub hl.fetch.get()
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?_id=-1') {
        callback({ _id: -1, fname: 'amit' });
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
    uitest.assert('user' in _data);
    /** end test block */

    /** teardown block */
    hl.getParams = undefined;
    hl.fetch.get = undefined;
    /** end teardown block */
  });

  uitest.it('should successfully submit a new workout form', function () {
    var alertCalledCount = 0;

    /** setup block */
    var _user = { _id: -1, fname: 'amit' };
    // Stub hl.fetch.post() method
    hl.fetch.post = function (str, data, callback) {
      if (str === '/api/workouts') {
        callback(data);
      }
    };
    // Stub hl.fetch.get() method
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?_id=-1') {
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

    window.alert = function (str) {
      alertCalledCount++;
    };

    uitest.dispatchHTMLEvent('submit', '#new-workout-form');

    uitest.assert(alertCalledCount === 1);

    alertCalledCount = 0;
    form.innerHTML = '<input type="text" name="workout_name"><textarea name="workout_description"></textarea>';

    uitest.dispatchHTMLEvent('submit', '#new-workout-form');

    uitest.assert(alertCalledCount === 1);

    alertCalledCount = 0;
    form.elements['workout_name'].value = 'New Workout';
    form.elements['workout_description'].value = 'workout description';

    uitest.dispatchHTMLEvent('submit', '#new-workout-form');

    uitest.assert(alertCalledCount === 0);

    selector.innerHTML = '';
    uitest.assert('workouts' in _user);
    /** end test block */

    /** teardown block */
    hl.fetch.get = undefined;
    hl.fetch.post = undefined;
    hl.fetch.put = undefined;
    hl.getParams = undefined;
    /** end teardown block */
  });

  uitest.it('should create newLogComponent successfully', function () {
    uitest.assert(ironfyt.newLogComponent.selector === '[data-app=new-log]');
    var _data = ironfyt.newLogComponent.getData();
    uitest.assert(Object.keys(_data).length === 0);
    uitest.assert(ironfyt.newLogComponent.template(_data) === '');
    uitest.assert(ironfyt.routes['new-log'].name === 'newLogPage');
  });

  uitest.it('should render new log page successfully', function () {
    /** setup block */
    hl.getParams = function () {
      return { workout_name: 'a workout' };
    };
    /** end setup block */

    /** test block */
    var selector = document.querySelector('#selector');
    selector.innerHTML = '<div data-app="new-log"></div><form id="new-log-form"><input type="text" name="log_date"><input type="text" name="log_duration"></form>';
    ironfyt.routes['new-log']();
    var form = document.querySelector('#new-log-form');
    uitest.assert(selector.innerHTML.toLowerCase().includes('<p><strong>workout: a workout'));
    uitest.assert(document.activeElement.name === 'log_duration');
    // date field is not empty - it is populated with today's date
    uitest.assert(form.elements['log_date'].value !== '');
    /** end test block */

    /** teardown block */
    selector.innerHTML = '';
    hl.getParams = undefined;
    /** end teardown block */
  });

  uitest.it('should successfully submit a new log form', function () {
    var alertCount = 0;
    /** setup block */
    var _user = { _id: -1, fname: 'amit' };
    //Stub the post method
    hl.fetch.post = function (str, data, callback) {
      if (str === '/api/logs') {
        data._id = -1;
        callback(data);
      }
    };
    // Stub the get method
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users?_id=-1') {
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

    uitest.assert(selector.innerHTML.toLowerCase().includes('<div id="date-error-div" class="error-div">please enter a valid date mm/dd/yyyy</div>'));
    // Make sure field-has-error class is added to the required field
    uitest.assert(form.elements['log_date'].classList.contains('field-has-error'));

    // Populate a required field on the DOM with invalid Date
    form.elements['log_date'].value = '13/01/2020';
    form.dispatchEvent(ev);
    uitest.assert(selector.innerHTML.toLowerCase().includes('<div id="date-error-div" class="error-div">please enter a valid date mm/dd/yyyy</div>'));
    // Make sure field-has-error class is added to the required field
    uitest.assert(form.elements['log_date'].classList.contains('field-has-error'));

    // Populate a required field on the DOM with valid Date
    form.elements['log_date'].value = '12/01/2020';
    //Submit the form
    form.dispatchEvent(ev);
    uitest.assert(!form.elements['log_date'].classList.contains('field-has-error'));
    uitest.assert(_user.logs.length === 1);
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

  uitest.it('should successfully create logListComponent', function () {
    uitest.assert(ironfyt.logListComponent.selector === '[data-app=log-list]');
    var _data = ironfyt.logListComponent.getData();
    uitest.assert(Object.keys(_data).length === 5);
    uitest.assert('search' in _data);
    uitest.assert('logs' in _data);
    uitest.assert('unfilteredList' in _data);
    uitest.assert('alllogs' in _data);
    uitest.assert('user' in _data);
    _data.logs = [{ _id: 1, date: null, notes: 'hello' }];
    uitest.assert(ironfyt.logListComponent.template(_data).includes('hello'));
    uitest.assert(ironfyt.routes['log-list'].name === 'logListPage');

    /** teardown block */
    _data.logs = [];
    /** end teardown block */
  });

  uitest.it('should have log-list route populate logListComponent data object successfully', function () {
    /** setup block */
    //Stub the get method for all possible queries for this page
    hl.fetch.get = function (str, callback) {
      if (str === '/api/users') {
        callback([{ _id: -1, fname: 'amit' }]);
      }
      if (str === '/api/logs') {
        callback([
          {
            _id: -1,
            date: new Date('01/01/2020'),
            notes: 'log 1',
            user_id: -1,
            workout_id: -1,
          },
          {
            _id: -2,
            date: new Date('01/02/2020'),
            notes: 'log 2',
            user_id: -1,
            workout_id: -1,
          },
          {
            _id: -3,
            date: new Date('01/01/2020'),
            notes: 'log 3',
            user_id: -2,
          },
        ]);
      }
      if (str === '/api/workouts') {
        callback([{ _id: -1, name: 'some workout' }]);
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
    uitest.assert(_data.user._id === -1);
    uitest.assert(_data.alllogs === false);
    uitest.assert(_data.logs.length === 2);
    uitest.assert(_data.logs[0]._id === -2);
    uitest.assert('workout' in _data.logs[0]);

    // Stub hl.getParams() method
    hl.getParams = function () {
      return { all: 'true' };
    };
    ironfyt.routes['log-list']();
    _data = ironfyt.logListComponent.getData();
    uitest.assert(_data.logs.length === 3);
    uitest.assert(_data.alllogs === true);
    /** end test block */

    /** teardown block */
    hl.fetch.get = undefined;
    hl.getParams = undefined;
    /** end teardown block */
  });

  uitest.it('should reset the search result of log list on clicking the reset button', function () {
    var unfilteredLogs = [
      { _id: -1, date: new Date('01/01/2020'), notes: 'log 1', user_id: -1 },
      {
        _id: -2,
        date: new Date('01/02/2020'),
        notes: 'log 2',
        user_id: -1,
        workout_id: -1,
      },
      { _id: -3, date: new Date('01/01/2020'), notes: 'log 3', user_id: -2 },
    ];
    var filteredLogs = [
      {
        _id: -2,
        date: new Date('01/02/2020'),
        notes: 'log 2',
        user_id: -1,
        workout_id: -1,
      },
    ];
    ironfyt.logListComponent.setData({
      logs: filteredLogs,
      unfilteredList: unfilteredLogs,
      search: 'testing',
    });

    var _data = ironfyt.logListComponent.getData();
    uitest.assert(_data.logs.length === 1);
    uitest.assert(_data.unfilteredList.length === 3);
    uitest.assert(_data.search === 'testing');

    var selector = document.querySelector('#selector');
    selector.innerHTML = '<form id="search-logs"></form>';

    uitest.dispatchHTMLEvent('reset', '#search-logs');

    _data = ironfyt.logListComponent.getData();
    uitest.assert(_data.logs.length === 3);
    uitest.assert(_data.unfilteredList.length === 3);
    uitest.assert(_data.search === '');
  });

  uitest.it('should search logs based on search criteria', function () {
    var logs = [
      { _id: -1, notes: 'thrusters' },
      { _id: -2, notes: 'bench press' },
      { _id: -3, notes: 'bench sit-ups' },
    ];
    ironfyt.logListComponent.setData({ logs: logs, unfilteredList: logs });
    var _data = ironfyt.logListComponent.getData();
    uitest.assert(_data.logs.length === 3);
    uitest.assert(_data.unfilteredList.length === 3);

    // Get the div with id= selector from test.html file
    var selector = document.querySelector('#selector');
    // Attach a form with id=search-logs to selector
    selector.innerHTML = '<form id="search-logs"><input type="text" name="search"></form>';
    var form = document.querySelector('#search-logs');
    // Set the search criteria in the search field
    form.elements['search'].value = 'bench';

    uitest.dispatchHTMLEvent('submit', '#search-logs');

    _data = ironfyt.logListComponent.getData();
    uitest.assert(_data.logs.length === 2);
    uitest.assert(_data.unfilteredList.length === 3);
    uitest.assert(_data.search === 'bench');
    selector.innerHTML = '';
  });
  console.group('Testing Templates');
  uitest.it('should render workoutTempate', function () {
    var workout = {};
    var workoutTemplate = ironfyt.workoutTemplate({ workout: workout });
    uitest.assert(workoutTemplate.toLowerCase().includes('<div class="workout-item">'));
  });

  uitest.it('should render signInTemplate', function () {
    var signInTemplate = ironfyt.signInTemplate();
    uitest.assert(signInTemplate.toLowerCase().includes('please select a user'));
  });

  uitest.it('should render topBarTemplate', function () {
    var topBarTemplate = ironfyt.topBarTemplate({
      page: 'log-list',
      user: { _id: 1 },
    });
    uitest.assert(topBarTemplate.toLowerCase().includes('<ul class="top-bar">'));
    uitest.assert(topBarTemplate.toLowerCase().includes('user=1'));
  });
  uitest.it('should render searchTemplate', function () {
    var searchTemplate = ironfyt.searchTemplate({
      search: 'aworkout',
      id: 'search-workout',
    });
    uitest.assert(searchTemplate.toLowerCase().includes('<form id="search-workout">'));
    uitest.assert(searchTemplate.toLowerCase().includes('aworkout'));
  });
  console.groupEnd();
  console.groupEnd();
})();
