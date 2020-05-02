(function () {
  'use strict';

  // Create a global variable and expose it the world.
  var ironfyt = {};
  self.ironfyt = ironfyt;

  /**
   * Globals
   */

  ironfyt.topBarTemplate = function (props) {
    var page = props && props.page ? props.page : '';
    var user = props && props.user ? props.user : {};
    return (
      '<ul class="top-bar">' +
      '<li><a href="index.html">Home</a></li>' +
      '<li>' +
      (page === 'workout-list' ? 'Workouts' : '<a href="workout-list.html?user=' + user.id + '">Workouts</a>') +
      '</li>' +
      '<li>' +
      (page === 'log-list' && props.alllogs === false ? 'My Logs' : '<a href="log-list.html?user=' + user.id + '">My Logs</a>') +
      '</li>' +
      '<li>' +
      (page === 'log-list' && props.alllogs === true ? 'All Logs' : '<a href="log-list.html?user=' + user.id + '&all=true">All Logs</a>') +
      '</li>' +
      '<li>' +
      (page === 'new-workout' ? 'New Workout' : '<a href="new-workout.html?user_id=' + user.id + '">New Workout</a>') +
      '</li>' +
      '<li style="float:right;color:blue">' +
      user.fname +
      '</ul>'
    );
  };

  ironfyt.signInTemplate = function () {
    return '<a href="index.html">Please select a user</a>';
  };

  ironfyt.workoutTemplate = function (props) {
    var workout = props && props.workout ? props.workout : false;
    var page = props && props.page ? props.page : false;
    var user = props && props.user ? props.user : false;
    if (workout) {
      return (
        '<div class="workout-item">' +
        '<h3>' +
        (page === 'log' ? workout.name : '<a href="log.html?workout=' + workout.id + '&user=' + user.id + '">' + workout.name + '</a>') +
        ' <span class="logcount">(' +
        workout.userlogcount +
        '/' +
        workout.totallogcount +
        ')</span>' +
        '</h3>' +
        '<p><strong>Type: </strong>' +
        workout.type +
        '</p>' +
        (workout.timecap !== null ? '<p><strong>Time Cap: </strong>' + workout.timecap + '</p>' : '') +
        '' +
        (workout.reps !== null && workout.reps !== undefined ? '<p><strong>Reps: </strong>' + workout.reps + '</p>' : '') +
        '' +
        (workout.rounds !== undefined && workout.rounds !== null ? '<p><strong>Rounds: </strong>' + workout.rounds + '</p>' : '') +
        '' +
        (workout.description !== undefined && workout.description !== null ? '<p>' + hl.replaceNewLineWithBR(workout.description) + '</p>' : '') +
        '</div>'
      );
    }
    return '';
  };

  ironfyt.searchTemplate = function (props) {
    var search = props && props.search ? props.search : '';
    var id = props && props.id ? props.id : 'search';
    return (
      '<form id="' +
      id +
      '">' +
      '    <label for="search" hidden>Search: </label>' +
      '    <input type="text" name="search" class="search-box" placeholder="Search" value="' +
      search +
      '"/>' +
      '    <button name="search_btn" id="search-btn">Search</button>&nbsp;&nbsp;<button type="reset" id="reset-btn" name="reset_workoutlist_btn">Reset</button>' +
      '</form>'
    );
  };
  /**
   * index.html page
   * At this point, index.html populates the user list of all the users in the system.
   *
   */
  ironfyt.userListComponent = new Component('[data-app=user-list]', {
    data: {
      users: [],
    },
    template: function (props) {
      var users = props.users;
      if (users.length === 0) return '<em>No Users Founds</em>';
      return (
        '<ul class="user-list">' +
        users
          .map(function (user) {
            return (
              '<li><a href="workout-list.html?user=' +
              user.id +
              '">' +
              user.fname +
              '</a>' +
              (user.logs ? ' (<a href="log-list.html?user=' + user.id + '">' + user.logs.length + '</a>)' : '') +
              '</li>'
            );
          })
          .join('') +
        '</ul>'
      );
    },
  });

  var userListPage = function () {
    hl.fetch.get('/api/users?filter=all', function (response) {
      ironfyt.userListComponent.setData({ users: response.users });
    });
  };

  /**
   * workout-list.html - Workout list page
   */
  ironfyt.workoutListComponent = new Component('[data-app=workout-list]', {
    data: {
      unfilteredList: [],
      workouts: [],
      user: {},
      search: '',
    },
    template: function (props) {
      var workouts = props.workouts;
      var user = props.user;
      var search = props.search;
      return !user.id
        ? ironfyt.signInTemplate()
        : ironfyt.topBarTemplate({ user, page: 'workout-list' }) +
        '<p>' +
        ironfyt.searchTemplate({ search: search, id: 'search-workout' }) +
        '</p>' +
        (workouts.length === 0
          ? '<em>No Workouts Found</em>'
          : workouts
            .map(function (workout) {
              return ironfyt.workoutTemplate({ page: 'workout-list', workout: workout, user: user });
            })
            .join(''));
    },
  });

  var workoutListPage = function () {
    var user_id = hl.getParams().user;
    if (user_id) {
      hl.fetch.get('/api/users?id=' + user_id, function (user) {
        hl.fetch.get('/api/workouts?filter=all', function (workoutsResponse) {
          hl.fetch.get('/api/logs?filter=all', function (logsResponse) {
            var workouts = workoutsResponse.workouts;
            var logs = logsResponse.logs;
            workouts.forEach(function (workout) {
              workout.userlogcount = user.logs.filter(function (log) {
                return parseInt(log.workout_id) === parseInt(workout.id);
              }).length;
              workout.totallogcount = logs.filter(function (log) {
                return parseInt(log.workout_id) === parseInt(workout.id);
              }).length;
            });
            workouts = hl.sortArray(workoutsResponse.workouts, 'totallogcount', 'desc');
            ironfyt.workoutListComponent.setData({ user: user, workouts: workouts, unfilteredList: workouts });
          });
        });
      });
    } else {
      ironfyt.workoutListComponent.render();
    }
  };

  /**
   * Search Workouts
   */

  var handleSearchWorkout = function (event) {
    event.preventDefault();
    // Get the search terms from the input field
    var searchTerm = event.target.elements['search'].value;
    // Tokenize the search terms
    var tokens = searchTerm.toLowerCase().split(' ');
    // Remove empty spaces
    tokens = tokens.filter(function (token) {
      return token.trim() !== '';
    });
    if (tokens.length) {
      // Create regular expression of all the search terms
      var searchTermRegex = new RegExp(tokens.join('|'), 'gim');
      var _data = ironfyt.workoutListComponent.getData();
      // Always search with an unfiltered list.
      _data.workouts = _data.unfilteredList;
      var workouts = _data.workouts
        .map(function (workout) {
          var logString = hl.concatObjValuesAsString(workout);
          // Remove any <br> | <br/> tags from the string. Remove any new line \n symbol from the string.
          logString = logString.replace(/<br\/?>|\n/gim, ' ');
          // .match() method returns an array of terms matching.
          return { workout: workout, match: logString.match(searchTermRegex) };
        }) // Filter out the non matching results
        .filter(function (wo) {
          return wo.match && wo.match.length > 0;
        }) // Sort by most number of terms matching
        .sort(function (a, b) {
          return b.match.length - a.match.length;
        })
        .map(function (wo) {
          return wo.workout;
        });
      ironfyt.workoutListComponent.setData({ workouts: workouts, search: searchTerm });
    }
  };

  var handleResetWorkoutSearch = function (event) {
    event.preventDefault();
    var _data = ironfyt.workoutListComponent.getData();
    ironfyt.workoutListComponent.setData({ workouts: _data.unfilteredList, search: '' });
  };

  /**
   * log.html page
   *
   */
  ironfyt.logComponent = new Component('[data-app=log]', {
    data: { workout: {}, logs: [], user: {} },
    template: function (props) {
      var workout = props.workout;
      var logs = props.logs;
      var user = props.user;
      if (!user.id) return ironfyt.signInTemplate();
      if (!workout.id) return ironfyt.topBarTemplate({ user }) + '<br/><p><em>Not a valid workout id</em></p>';
      return (
        ironfyt.topBarTemplate({ user }) +
        ironfyt.workoutTemplate({ page: 'log', workout: workout, user: user }) +
        '<p>' +
        '<a href="new-log.html?workout_id=' + workout.id + '&workout_name=' + workout.name + '&user_id=' + user.id + '" class="btn">+</a>' +
        '<a class="show-all-logs" href="#">All Logs</a>' +
        '</p>' +
        '<br/>' +
        (function () {
          var htmlString = '';
          logs.forEach(function (log) {
            var durationString = log.duration ? '<p><strong>Duration: </strong>' + log.duration + '</p>' : '';
            var loadString = log.load ? '<p><strong>Load: </strong>' + log.load + ' </p>' : '';
            var roundsString = log.rounds ? '<p><strong>Rounds: </strong>' + log.rounds + ' </p>' : '';
            var notesString = log.notes ? '<p><strong>Notes: </strong><br/>' + hl.replaceNewLineWithBR(log.notes) + ' </p>' : '';
            htmlString +=
              '<div class="log-item">' +
              ' <p class="date">' + new Date(log.date).toLocaleDateString() + '</p>' +
              durationString +
              loadString +
              roundsString +
              notesString +
              '</div>';
          });
          return htmlString;
        })()
      );
    },
  });

  var logPage = function () {
    var params = hl.getParams();
    var workout_id = params && params.workout ? parseInt(params.workout) : false;
    var user_id = params && params.user ? parseInt(params.user) : false;
    hl.fetch.get('/api/workouts?id=' + workout_id, function (workout) {
      hl.fetch.get('/api/users?id=' + user_id, function (user) {
        hl.fetch.get('/api/logs?filter=all', function (logsResponse) {
          var logs = logsResponse.logs
            .filter(function (log) {
              return parseInt(user.id) === parseInt(log.user_id) && parseInt(workout.id) === parseInt(log.workout_id);
            })
            .sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            });
          var allLogs = logsResponse.logs.filter(function (log) {
            return parseInt(workout.id) === parseInt(log.workout_id);
          });
          workout.userlogcount = logs.length;
          workout.totallogcount = allLogs.length;
          ironfyt.logComponent.setData({ workout: workout, user: user, logs: logs });
        });
      });
    });
    ironfyt.logComponent.render();
  };

  /**
   * new-workout.html page
   */
  ironfyt.newWorkoutComponent = new Component('[data-app=new-workout]', {
    template: function (props) {
      return props && props.user
        ? (function () {
          return (
            ironfyt.topBarTemplate({ page: 'new-workout', user: props.user }) +
            '<br/>' +
            '<form id="new-workout-form">' +
            '<div>' +
            '<label for="workout_name">Name: </label>' +
            '<input type="text" name="workout_name" autofocus/>' +
            '</div>' +
            '<div>' +
            '<label for="workout_type">Type: </label>' +
            '<select name="workout_type">' +
            '<option value=""></option>' +
            '<option value="AMRAP">AMRAP</option>' +
            '<option value="For Time">For Time</option>' +
            '<option value="For Load">For Load</option>' +
            '<option value="For Reps">For Reps</option>' +
            '</select>' +
            '</div>' +
            '<div>' +
            '<label for="workout_timecap">Time Cap: </label>' +
            '<input type="text" name="workout_timecap"/>' +
            '</div>' +
            '<div>' +
            '<label for="workout_rounds">Rounds: </label>' +
            '<input type="text" name="workout_rounds"/>' +
            '</div>' +
            '<div>' +
            '<label for="workout_reps">Reps: </label>' +
            '<input type="text" name="workout_reps"/>' +
            '</div>' +
            '<div>' +
            '<label for="workout_description">Description: </label>' +
            '<textarea name="workout_description" cols="50" rows="10"></textarea>' +
            '</div>' +
            '<div>' +
            '<button>Submit</button>' +
            '</div>'
          );
        })()
        : ironfyt.signInTemplate();
    },
  });

  var newWorkoutPage = function () {
    var user_id = hl.getParams().user_id;
    hl.fetch.get('/api/users?id=' + user_id, function (response) {
      ironfyt.newWorkoutComponent.setData({ user: response });
    });
    ironfyt.newWorkoutComponent.render();
  };

  var handleNewWorkoutForm = function (event) {
    event.preventDefault();
    var params = hl.getParams();
    var elements = document.querySelector('#new-workout-form').elements;
    if (
      elements['workout_name'] === undefined ||
      elements['workout_name'].value.trim() === '' ||
      elements['workout_description'] === undefined ||
      elements['workout_description'].value.trim() === ''
    ) {
      alert('Please provide a workout name');
      return false;
    }
    var data = {
      user_id: params.user_id !== undefined ? parseInt(params.user_id) : null,
      name: elements['workout_name'] && elements['workout_name'].value !== '' ? elements['workout_name'].value : null,
      type: elements['workout_type'] && elements['workout_type'].value !== '' ? elements['workout_type'].value : null,
      timecap: elements['workout_timecap'] && elements['workout_timecap'].value !== '' ? elements['workout_timecap'].value : null,
      rounds: elements['workout_rounds'] && elements['workout_rounds'].value !== '' ? elements['workout_rounds'].value : null,
      reps: elements['workout_reps'] && elements['workout_reps'].value !== '' ? elements['workout_reps'].value : null,
      description: elements['workout_description'] && elements['workout_description'].value !== '' ? elements['workout_description'].value : null,
    };
    hl.fetch.post('/api/workouts', data, function (newWorkout) {
      if (newWorkout) {
        if (params.user_id) {
          hl.fetch.get('/api/users?id=' + params.user_id, function (user) {
            if (!user.workouts) {
              user.workouts = [];
            }
            user.workouts.push(parseInt(newWorkout.id));
            hl.fetch.put('/api/users', user, function (response) {
              location.assign('workout-list.html?user=' + params.user_id);
            });
          });
        }
      } else {
        alert('Something went wrong. Check console for further details.');
      }
    });
  };

  /**
   *
   * new-log.html page
   */
  ironfyt.newLogComponent = new Component('[data-app=new-log]', {
    template: function (props) {
      return props.workout_name !== undefined ? '<p><strong>Workout: ' + props.workout_name + '</strong></p>' : '';
    },
  });

  var newLogPage = function () {
    var params = hl.getParams();
    if (params.workout_name) {
      ironfyt.newLogComponent.setData({ workout_name: window.decodeURIComponent(params.workout_name) });
    } else {
      ironfyt.newLogComponent.render();
    }

    var today = new Date().toLocaleDateString();

    var elements = document.querySelector('#new-log-form').elements;

    var logDateField = elements['log_date'];
    logDateField.value = hl.formatDateString(today);

    var durationField = elements['log_duration'];
    durationField.focus();
  };

  var handleNewLogForm = function (event) {
    event.preventDefault();

    var params = hl.getParams();
    var workout_id = params.workout_id !== undefined ? parseInt(params.workout_id) : null;
    var user_id = params.user_id;
    var elements = document.querySelector('#new-log-form').elements;
    var date = elements['log_date'] && elements['log_date'].value !== '' ? new Date(elements['log_date'].value) : null;
    var duration = elements['log_duration'] && elements['log_duration'].value !== '' ? elements['log_duration'].value : null;
    var load = elements['log_load'] && elements['log_load'].value !== '' ? elements['log_load'].value : null;
    var rounds = elements['log_rounds'] && elements['log_rounds'].value !== '' ? elements['log_rounds'].value : null;
    var notes = elements['log_notes'] && elements['log_notes'].value !== '' ? elements['log_notes'].value : null;

    // Clean up error fields before validating
    var logDateField = elements['log_date'];
    if (logDateField.classList.contains('field-has-error')) {
      logDateField.classList.remove('field-has-error');
    }
    var dateErrorDiv = document.getElementById('date-error-div');
    if (dateErrorDiv !== null) dateErrorDiv.remove();

    //Validate values
    if (logDateField.value === null || !hl.isValidDate(logDateField.value)) {
      logDateField.focus();

      // Add an error css class and error message only if one doesn't already exists.
      if (!logDateField.classList.contains('field-has-error')) {
        logDateField.classList.add('field-has-error');

        var errorDiv = document.createElement('div');
        errorDiv.id = 'date-error-div';
        errorDiv.classList.add('error-div');
        errorDiv.innerHTML = 'Please enter a valid date mm/dd/yyyy';
        logDateField.after(errorDiv);
      }
      return false;
    }

    var data = {
      user_id: user_id,
      workout_id: workout_id,
      date: date,
      duration: duration,
      load: load,
      rounds: rounds,
      notes: notes,
    };
    hl.fetch.post('/api/logs', data, function (newLog) {
      if (newLog) {
        hl.fetch.get('/api/users?id=' + user_id, function (user) {
          if (user.logs === undefined) {
            user.logs = [];
          }
          user.logs.push({ log_id: newLog.id, workout_id: workout_id });
          hl.fetch.put('/api/users', user, function (response) {
            if (workout_id) {
              location.assign('log.html?user=' + user_id + '&workout=' + workout_id);
            } else {
              location.assign('log-list.html?user=' + user_id);
            }
          });
        });
      } else {
        throw new Error('Error occurred while creating a new workout log');
      }
    });
  };

  /**
   * log-list.html
   */
  ironfyt.logListComponent = new Component('[data-app=log-list]', {
    data: {
      user: {},
      logs: [],
      unfilteredList: [],
      alllogs: false,
      search: '',
    },
    template: function (props) {
      return props && props.user
        ? ironfyt.topBarTemplate({ user: props.user, page: 'log-list', alllogs: props.alllogs }) +
        ironfyt.searchTemplate({ search: props.search, id: 'search-logs' }) +
        '<p><a href="new-log.html?user_id=' +
        props.user.id +
        '" class="btn">+</a></p><br/><br/>' +
        props.logs
          .map(function (log) {
            return (
              '<div class="workout-item">' +
              '<p><strong>User: </strong>' +
              (log.user !== {} && log.user !== undefined ? log.user.fname : '') +
              '</p>' +
              '<p><strong>Date: </strong>' +
              new Date(log.date).toLocaleDateString() +
              '</p>' +
              (log.workout !== {} && log.workout !== undefined
                ? '<p><strong>Workout: </strong><a href="log.html?workout=' +
                log.workout.id +
                '&user=' +
                props.user.id +
                '">' +
                log.workout.name +
                '</a></p>'
                : '') +
              '' +
              (log.duration !== null && log.duration !== undefined ? '<p><strong>Duration: </strong>' + log.duration + '</p>' : '') +
              '' +
              (log.load !== undefined && log.load !== null ? '<p><strong>Load: </strong>' + log.load + '</p>' : '') +
              '' +
              (log.rounds !== null && log.rounds !== undefined ? '<p><strong>Rounds: </strong>' + log.rounds + '</p>' : '') +
              '' +
              (log.notes !== null && log.notes !== undefined ? '<p>' + hl.replaceNewLineWithBR(log.notes) + '</p>' : '') +
              '</div>'
            );
          })
          .join('') +
        ''
        : ironfyt.signInTemplate();
    },
  });

  var logListPage = function () {
    var params = hl.getParams();
    var user_id = params && params.user ? params.user : false;
    var alllogs = params && (params.all === 'true' || params.all === true) ? true : false;
    hl.fetch.get('/api/logs?filter=all', function (logsResponse) {
      hl.fetch.get('/api/workouts?filter=all', function (workoutsResponse) {
        hl.fetch.get('/api/users?filter=all', function (usersResponse) {
          // Populate the user object
          var user = usersResponse.users.filter(function (user) {
            return parseInt(user.id) === parseInt(user_id);
          })[0];

          var logs = logsResponse.logs;
          var workouts = workoutsResponse.workouts;
          var users = usersResponse.users;

          // Filter based on alllogs URL Parameter
          if (!alllogs) {
            logs = logs.filter(function (log) {
              return parseInt(log.user_id) === parseInt(user_id);
            });
          }

          // Populate the workout and user fields for each log
          logs.forEach(function (log) {
            workouts.forEach(function (workout) {
              if (parseInt(workout.id) === parseInt(log.workout_id)) {
                log.workout = workout;
              }
            });
            users.forEach(function (user) {
              if (parseInt(user.id) === parseInt(log.user_id)) {
                log.user = user;
              }
            });
          });

          // Sort the logs in desc order by date
          logs = logs.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
          });

          ironfyt.logListComponent.setData({ user: user, logs: logs, unfilteredList: logs, alllogs: alllogs });
        });
      });
    });
  };

  var handleSearchLogs = function (event) {
    event.preventDefault();
    // Get the search terms from the input field
    var searchTerm = event.target.elements['search'].value;
    // Tokenize the search terms
    var tokens = searchTerm.toLowerCase().split(' ');
    // Remove empty spaces
    tokens = tokens.filter(function (token) {
      return token.trim() !== '';
    });
    if (tokens.length) {
      // Create regular expression of all the search terms
      var searchTermRegex = new RegExp(tokens.join('|'), 'gim');
      var _data = ironfyt.logListComponent.getData();
      // Always search with an unfiltered list.
      _data.logs = _data.unfilteredList;
      var logs = _data.logs
        .map(function (log) {
          var logString = '';
          for (var key in log) {
            if (log.hasOwnProperty(key) && key !== 'id' && key !== 'user_id' && key !== 'workout_id' && log[key] !== null) {
              if (key === 'workout') {
                logString += log[key].name.toString().toLowerCase().trim() + ' ';
              } else if (key === 'user') {
                logString += log[key].fname.toString().toLowerCase().trim() + ' ';
              } else if (key === 'date') {
                logString += new Date(log[key]).toLocaleDateString() + ' ';
              } else {
                logString += log[key].toString().toLowerCase().trim() + ' ';
              }
            }
          }
          // Remove any <br> | <br/> tags from the string. Remove any new line \n symbol from the string.
          logString = logString.replace(/<br\/?>|\n/gim, ' ');
          // .match() method returns an array of terms matching.
          return { log: log, match: logString.match(searchTermRegex) };
        }) // Filter out the non matching results
        .filter(function (log) {
          return log.match && log.match.length > 0;
        }) // Sort by most number of terms matching
        .sort(function (a, b) {
          return b.match.length - a.match.length;
        })
        .map(function (item) {
          return item.log;
        });
      ironfyt.logListComponent.setData({ logs: logs, search: searchTerm });
    }
  };

  var handleResetLogSearch = function (event) {
    event.preventDefault();
    var _data = ironfyt.logListComponent.getData();
    ironfyt.logListComponent.setData({ logs: _data.unfilteredList, search: '' });
  };

  /**
   * Register event handlers
   */
  hl.eventListener('submit', 'search-workout', handleSearchWorkout);
  hl.eventListener('submit', 'new-workout-form', handleNewWorkoutForm);
  hl.eventListener('submit', 'new-log-form', handleNewLogForm);
  hl.eventListener('submit', 'search-logs', handleSearchLogs);

  hl.eventListener('reset', 'search-workout', handleResetWorkoutSearch);
  hl.eventListener('reset', 'search-logs', handleResetLogSearch);

  /**
   * Register routes
   */
  ironfyt.routes = {
    'user-list': userListPage,
    'workout-list': workoutListPage,
    log: logPage,
    'new-workout': newWorkoutPage,
    'new-log': newLogPage,
    'log-list': logListPage,
  };

  hl.router(ironfyt.routes);
})();
