(function () {
  'use strict';

  let workoutFormTemplate = function (props) {
    return `
    <div class="container">
      <form id="workout-form">
        ${$ironfyt.newWorkoutFormTemplate(props)}
      </form>
    </div>`;
  };

  let component = ($ironfyt.workoutFormComponent = Component('[data-app=workout-form]', {
    state: {
      user: {},
      error: '',
      validationError: {},
      workout: $ironfyt.newWorkout,
      pageTitle: 'New Workout',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormTemplate);
    },
  }));

  /**
   * Delegated function from workout-form-helper when the save workout button is clicked. Implement
   * this function to call $ironfyt.validateAndSaveWorkout() function
   */
  $ironfyt.handleSaveWorkoutEvent = function (event) {
    let state = component.getState();
    let user = state.user;
    $ironfyt.validateAndSaveWorkout(user, event, function (error, response) {
      if (error) {
        component.setState({ error });
        return;
      }
      $ironfyt.navigateToUrl('workouts.html');
    });
  };

  ($ironfyt.workoutFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user });
      let params = $hl.getParams();
      let _id = params && params._id ? params._id : false;
      if (_id) {
        if (_id.length === 24) {
          $ironfyt.getWorkouts({ _id }, function (error, response) {
            if (!error) {
              let workout = response && response.workouts ? response.workouts[0] : {};
              component.setState({ workout, pageTitle: 'Edit Workout' });
            } else {
              component.setState({ error });
            }
          });
        } else {
          component.setState({ error: { message: 'Invalid Workout ID' } });
        }
      }
    });
  })();
})();
