(function () {
  ('use strict');

  let landingPageTemplate = function (props) {
    let groupwods = props && props.groupwods ? props.groupwods : [];
    return `
    <div class="container">
      <div>
        <button class="log-this-workout-btn" id="new-log-btn">New Log</button>
        <button class="activity-btn" id="activity-btn">Activity</button>        
      </div>
      ${groupwods
        .map((groupwod) => {
          // console.log(groupwod);
          let workout = groupwod && groupwod.workout !== undefined ? groupwod.workout : {};
          let groupName = groupwod && groupwod.group && groupwod.group.name ? groupwod.group.name : '';
          return `
            <div class="rounded-border-primary margin-top-10px">
              <div class="flex margin-bottom-5px">
                <div class="text-color-primary flex-align-self-center flex-auto"><h3>${groupName}</h3></div>
                <div class="flex-auto text-align-right">
                  <button class="group-home-btn-w-new-message-indicator" id="group-home-btn" data-new-messages="5"></button>
                </div>
              </div>
              <p class="margin-bottom-5px">
                <span class="text-color-secondary">${new Date(groupwod.date).toLocaleDateString()}</span>
              </p>
              ${$ironfyt.displayWorkoutDetail(workout)}
              ${logInfoBlock(groupwod)}
              <div class="margin-top-10px small-text">
                <p class="muted-text">${prString(groupwod)}</p>
                <div class="margin-top-10px"><a href="workout-activity.html?workout_id=${groupwod.workout._id}&ref=index.html" class="workout-history-link">Workout Activity</a></div>
              </div>
            </div>`;
        })
        .join('')}
    </div>`;
  };

  /** Sample code shows the video links next to the movements */
  /*
  Description:<br/>
  100 Battle Rope Slams <a href=""><img class="movie-icon" src="images/smart_display_black_24dp.svg"></a><br/>
  100 Battle Rope Side-to-Side <a href=""><img class="movie-icon" src="images/smart_display_black_24dp.svg"></a>
  */

  let prString = function (groupwod) {
    let pr = groupwod && groupwod.pr && groupwod.pr.log ? groupwod.pr.log : {};
    let prDate = pr && pr.date ? pr.date : null;
    let prstring = buildLogString(pr, groupwod, 'text-color-secondary');
    if (prstring.trim()) {
      prstring = `Your PR is ${prstring} on <span class="text-color-secondary">${prDate ? new Date(prDate).toLocaleDateString() : ''}</span>`;
    }
    return prstring;
  };
  let logInfoBlock = function (groupwod) {
    let log = groupwod && groupwod.log ? groupwod.log : false;
    return `
    <div class="margin-top-10px">
      ${log ? `<p class="groupwod-log-text small-text"><span class="workout-done"></span>${new Date(log.date).toLocaleDateString()}${buildLogString(log, groupwod, 'groupwod-log-text')}</p>` : `<button class="log-this-workout-btn" id="log-this-wod-btn-${groupwod._id}">Log This WOD</button>`}   
    </div>`;
  };

  let buildLogString = function (log, groupwod, cssClass) {
    let workout = groupwod && groupwod.workout !== undefined ? groupwod.workout : {};
    let workoutType = workout.type ? workout.type.toLowerCase() : null;
    let logstring = '';
    if (workoutType === 'for time') {
      let duration = log && log.duration ? log.duration : {};
      if (duration.hours || duration.minutes || duration.seconds) {
        logstring = `<span class="${cssClass}">${duration.hours ? `${duration.hours} hrs ` : ''} ${duration.minutes ? `${duration.minutes} mins ` : ''} ${duration.seconds ? `${duration.seconds} secs ` : ''}</span>`;
      }
    }
    if (workoutType === 'amrap' || workoutType === 'tabata' || workoutType === 'for reps') {
      let roundinfo = log && log.roundinfo ? log.roundinfo : [];
      let roundString = roundinfo
        .map(function (round) {
          return `${round.rounds ? round.rounds : ''} ${round.load ? ` X ${round.load} ${round.unit}` : ''}`;
        })
        .join(' , ');
      let totalreps = log && log.totalreps ? log.totalreps : null;
      if (roundString.trim() || totalreps) {
        logstring = `<span class="${cssClass}">${roundString.trim() ? `Rounds: ${roundString.trim()}` : ``} ${totalreps ? `Total Reps: ${totalreps}` : ``}</span>`;
      }
    }
    if (workoutType === 'for load') {
      let movements = log && log.movements ? log.movements : [];
      let movementString = movements
        .map(function (movement) {
          return `${movement.movement}: ${movement.reps} X ${movement.load} ${movement.unit}`;
        })
        .join('<br/>');
      if (movementString.trim()) {
        logstring = `<br/><span class="${cssClass}">${movementString}</span><br/>`;
      }
    }
    return logstring;
  };
  let component = ($ironfyt.landingPageComponent = Component('[data-app=landing]', {
    state: {
      user: {},
      error: '',
      groupwods: [],
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, landingPageTemplate);
    },
  }));

  let navToURL = {
    'group-home-btn': 'group.html',
    'new-log-btn': 'workoutlog-form.html',
    'activity-btn': 'workoutlog-calendar.html',
  };

  let navigateEvent = function (event) {
    let targetId = event.target.id;
    $ironfyt.navigateToUrl(navToURL[targetId]);
  };

  $hl.eventListener('click', 'group-home-btn', navigateEvent);
  $hl.eventListener('click', 'new-log-btn', navigateEvent);
  $hl.eventListener('click', 'activity-btn', navigateEvent);

  document.addEventListener('click', function (event) {
    let logthiswodbtnRegex = new RegExp(/^log-this-wod-btn-([a-zA-Z]|\d){24}/gm);
    if (logthiswodbtnRegex.test(event.target.id)) {
      let prefix = 'log-this-wod-btn-';
      let groupwodId = event.target.id.substr(prefix.length);
      let groupwods = component.getState().groupwods;
      let groupwod = groupwods.filter(function (groupwod) {
        return groupwod._id === groupwodId;
      })[0];
      $ironfyt.navigateToUrl(`workoutlog-form.html?workout_id=${groupwod.workout._id}&date=${groupwod.date}&ref=index.html`);
    }
  });

  ($ironfyt.landingPage = function () {
    let { token, user } = $ironfyt.getCredentials();
    if (token && user) {
      component.setState({ user });
      $ironfyt.getGroupWod({}, function (error, groupwods) {
        if (error) {
          component.setState({ error });
          return;
        }
        groupwods = sortByDateDesc(groupwods);
        component.setState({ groupwods });
      });
    } else {
      $ironfyt.navigateToUrl('login.html');
    }
  })();

  let sortByDateDesc = function (arr) {
    return arr.sort(function (a, b) {
      return new Date(b['date']) - new Date(a['date']);
    });
  };
})();
