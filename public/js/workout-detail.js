(function () {
  'use strict';

  let workoutDetailTemplate = function (props) {
    return `<h1>Workout Detail</h1>`;
  };

  let component = ($ironfyt.workoutDetailComponent = Component('[data-app=workout-detail]', {
    state: {
      user: {},
      workout: {},
      logs: [],
      error: '',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutDetailTemplate);
    },
  }));

  ($ironfyt.workoutDetailPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        if (JSON.stringify(user) === '{}') {
          component.setState({ error: { message: 'Some error occurred while authenticating the user' } });
        } else {
          let params = $hl.getParams();
          let _id = params && params._id ? params._id : false;
          if (_id && _id.length === 24) {
            $ironfyt.getWorkouts({ _id }, function (error, response) {
              if (!error) {
                let workout = response && response.workouts && response.workouts.length > 0 ? response.workouts[0] : {};
                component.setState({ user, workout });
                console.log(workout);
              }
            });
          } else {
            component.setState({ error: { message: 'Invalid ID' }, user });
          }
        }
      } else {
        component.setState({ error });
      }
    });
  })();
})();
