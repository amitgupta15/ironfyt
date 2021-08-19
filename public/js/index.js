(function () {
  ('use strict');

  let landingPageTemplate = function (props) {
    let groupwods = props && props.groupwods ? props.groupwods : [];
    return `
    <div class="container">
      <div>
        <button class="log-this-workout-btn" id="new-log-btn">New Log</button>
        <button class="activity-btn" id="activity-btn">Logs</button>        
      </div>
      ${groupwods
        .map((groupwod) => {
          let workout = groupwod && groupwod.workout !== undefined ? groupwod.workout : {};
          let groupName = groupwod && groupwod.group && groupwod.group.name ? groupwod.group.name : '';
          let groupid = groupwod && groupwod.group && groupwod.group._id ? groupwod.group._id : '';
          return `
            <div class="rounded-border-primary margin-top-10px">
              <div class="flex margin-bottom-5px">
                <div class="text-color-primary flex-align-self-center flex-auto"><h3>${groupName}</h3></div>
                <div class="flex-auto text-align-right">
                  <button class="group-home-btn" id="group-home-btn-${groupid}" data-new-messages="5"></button>
                </div>
              </div>
              <p class="margin-bottom-5px">
                <span class="text-color-secondary">${new Date(groupwod.date).toLocaleDateString()}</span>
              </p>
              ${$ironfyt.displayWorkoutDetail(workout)}
              ${logInfoBlock(groupwod)}
              <div class="margin-top-10px small-text">
                <div class="muted-text">${prString(groupwod)}</div>
                <div class="margin-top-10px"><a href="workout-activity.html?workout_id=${groupwod.workout._id}&ref=index.html" class="workout-history-link">Workout Log</a></div>
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
    return JSON.stringify(pr) === '{}' ? '' : `Your PR is ${$ironfyt.displayWorkoutLogDetail(pr, 'text-color-secondary', true)} on <span class="text-color-secondary">${prDate ? new Date(prDate).toLocaleDateString() : ''}</span>`;
  };
  let logInfoBlock = function (groupwod) {
    let log = groupwod && groupwod.log ? groupwod.log : false;
    return `
    <div class="margin-top-10px">
      ${
        log
          ? `<div class="groupwod-log-text small-text">
              <span class="workout-done"></span>${new Date(log.date).toLocaleDateString()}
              ${$ironfyt.displayWorkoutLogDetail(log, 'groupwod-log-text', true)}
            </div>`
          : `<button class="log-this-workout-btn" id="log-this-wod-btn-${groupwod._id}">Log This WOD</button>`
      }   
    </div>`;
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
    'new-log-btn': 'workoutlog-form.html',
    'activity-btn': 'workoutlog-calendar.html',
  };

  let navigateEvent = function (event) {
    let targetId = event.target.id;
    $ironfyt.navigateToUrl(navToURL[targetId]);
  };

  $hl.eventListener('click', 'new-log-btn', navigateEvent);
  $hl.eventListener('click', 'activity-btn', navigateEvent);

  document.addEventListener('click', function (event) {
    let groupIdRegex = new RegExp(/^group-home-btn-([a-zA-Z]|\d){24}/gm);
    if (groupIdRegex.test(event.target.id)) {
      let prefix = 'group-home-btn-';
      let groupId = event.target.id.substr(prefix.length);
      $ironfyt.navigateToUrl(`group.html?group_id=${groupId}`);
    }

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
