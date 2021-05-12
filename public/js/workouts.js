(function () {
  'use strict';

  let workoutsTemplate = function (props) {
    let workouts = props && props.workouts ? props.workouts : [];
    return `<div class="container">
        <h1>Workouts</h1>
        <hr/>
        ${workouts
          .map(
            (workout) => `<br/>
        <p><strong>${workout.name}</strong> <a href="workout-form.html?_id=${workout._id}">Edit</a> <button type="button" id="delete-workout-${workout._id}">Delete</button></p>
        ${workout.type ? `<strong>Type:</strong> ${workout.type}<br/>` : ''}
        ${workout.timecap ? `<strong>Timecap:</strong> ${workout.timecap}<br/>` : ''}
        ${workout.reps ? `<strong>Reps:</strong> ${workout.reps}<br/>` : ''}
        ${workout.rounds ? `<strong>Rounds:</strong> ${workout.rounds}<br/>` : ''}
        ${workout.modality && workout.modality.length ? `<strong>Modality:</strong> ${workout.modality.map((modality) => modality)}<br/>` : ''}
        ${workout.description ? `${$hl.replaceNewLineWithBR(workout.description)}` : ''}
        <br/><br/><hr/>`
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

  let deleteWorkout = function (targetId) {
    let prefix = 'delete-workout-';
    let _id = targetId.substring(prefix.length, targetId.length);
    if (_id.length === 24) {
      $ironfyt.deleteWorkout(_id, function (error, response) {
        if (!error) {
          $ironfyt.navigateToUrl('workouts.html');
        }
      });
    } else {
      component.setState({ error: { message: 'Invalid ID' } });
    }
  };
  document.addEventListener('click', function (event) {
    let idregex = new RegExp(/^delete-workout-([a-zA-Z]|\d){24}/gm);
    if (idregex.test(event.target.id)) {
      deleteWorkout(event.target.id);
    }
  });

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
