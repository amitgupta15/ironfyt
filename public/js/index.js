(function () {
  'use strict';

  let landingPageTemplate = function (props) {
    let groupwods = props && props.groupwods ? props.groupwods : [];
    return `
    <div class="container">
      <div>
        <button class="log-this-workout-btn" id="new-log-btn">New Log</button>
        <button class="activity-btn" id="activity-btn">Activity</button>        
      </div>
      ${groupwods.map((groupwod) => {
        let workout = groupwod && groupwod.workout !== undefined ? groupwod.workout : {};
        return `
        <div class="rounded-border-primary margin-top-10px">
          <div class="flex margin-bottom-5px">
            <div class="text-color-primary flex-align-self-center flex-auto"><h3>${groupwod.group.name}</h3></div>
            <div class="flex-auto text-align-right">
              <button class="group-home-btn-w-new-message-indicator" id="group-home-btn" data-new-messages="5"></button>
            </div>
          </div>
          <p class="margin-bottom-5px">
            <span class="text-color-secondary">${new Date(groupwod.date).toLocaleDateString()}</span>
          </p>
          <details open>
            <summary>${workout.name} <span class="workout-done">7/15/2021</span></summary>
            <div class="workout-detail-view">
              ${workout.modality && workout.modality.length ? `<p><strong>Modality: </strong>${workout.modality.map((m) => $ironfyt.formatModality(m.toLowerCase())).join(', ')}</p>` : ``}
              ${workout.type ? `<p><strong>Type:</strong> ${workout.type}</p>` : ''}
              ${workout.timecap ? `<p><strong>Time Cap:</strong> ${$ironfyt.formatTimecap(workout.timecap)}</p>` : ''}
              ${workout.rounds ? `<p><strong>Rounds:</strong> ${workout.rounds}</p>` : ''}
              ${workout.reps ? `<p><strong>Reps:</strong> ${workout.reps}</p>` : ''}
              ${workout.description ? `<p>${$hl.replaceNewLineWithBR(workout.description)}` : ''}
            </div>
          </details>
          <div class="margin-top-10px small-text">
            <p class="muted-text">Your PR is <span class="text-color-secondary">30 mins 24 secs</span> on <span class="text-color-secondary">5/11/2020</span></p>
            <p><a href="" class="workout-history-link">Workout Activity</a></p>
          </div>
        </div>
        `;
      })}
      <div class="rounded-border-primary margin-top-10px">
        <div class="flex margin-bottom-5px">
          <div class="text-color-primary flex-align-self-center flex-auto"><h3>Kids @ Home</h3></div>
          <div class="flex-auto text-align-right"><button class="group-home-btn"></button></div>
        </div>
        <p class="margin-bottom-5px text-color-secondary">
          <span class="text-color-secondary">07/13/2021</span>
          <button class="log-this-workout-btn">Log This WOD</button>
        </p>
        <details open>
          <summary>Battle Rope Buffet</summary>
          <div>
            Type: For Time<br/>
            Rounds: 5<br/>
            Description:<br/>
            100 Battle Rope Slams <a href=""><img class="movie-icon" src="images/smart_display_black_24dp.svg"></a><br/>
            100 Battle Rope Side-to-Side <a href=""><img class="movie-icon" src="images/smart_display_black_24dp.svg"></a>
          </div>
        </details>
      </div>
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

  ($ironfyt.landingPage = function () {
    let { token, user } = $ironfyt.getCredentials();
    if (token && user) {
      component.setState({ user });
      $ironfyt.getGroupWod({}, function (error, groupwods) {
        if (error) {
          component.setState({ error });
          return;
        }
        component.setState({ groupwods });
      });
    } else {
      $ironfyt.navigateToUrl('login.html');
    }
    // console.log(component.getState());
  })();
})();
