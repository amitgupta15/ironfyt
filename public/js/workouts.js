(function () {
  'use strict';

  let workoutsTemplate = function (props) {
    let workouts = props && props.workouts ? props.workouts : [];
    return `<div class="container">
        <h1>Workouts</h1>
        <hr/>
        ${workouts
          .map(
            (workout) => `
        <h4>${workout.name}</h4>
        ${workout.type ? `<strong>Type:</strong> ${workout.type}<br/>` : ''}
        ${workout.timecap ? `<strong>Timecap:</strong> ${workout.timecap}<br/>` : ''}
        ${workout.reps ? `${workout.reps}<br/>` : ''}
        ${workout.rounds ? `${workout.rounds}<br/>` : ''}
        ${workout.description ? `${$hl.replaceNewLineWithBR(workout.description)}` : ''}
        <br/><hr/>`
          )
          .join('')}`;
  };

  let component = ($ironfyt.workoutsComponent = Component('[data-app=workouts]', {
    state: {
      user: {},
      error: '',
      workouts: [],
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutsTemplate);
    },
  }));

  ($ironfyt.workoutsPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        $ironfyt.getWorkouts({}, function (error, response) {
          if (!error) {
            let workouts = response && response.workouts ? response.workouts : [];
            component.setState({ user, workouts });
          } else {
            component.setState({ error });
          }
        });
      } else {
        component.setState({ error });
      }
    });
  })();
})();
