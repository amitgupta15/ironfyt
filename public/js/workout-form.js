(function () {
  'use strict';

  let newPlaceholderWorkout = {
    name: null,
    description: null,
  };
  let workoutFormTemplate = function (props) {
    let workout = props && props.workout ? props.workout : newPlaceholderWorkout;
    //Added to handle legacy code, which did not have origdescription field. Needed especially while editing.
    if (workout.origdescription === undefined) {
      workout.origdescription = workout.description;
    }
    return `
    <div class="container">
      <div class="text-align-center bold-text">Name & Description</div>
      <div class="text-align-center text-color-secondary">Step 1 of 2</div>
      <form id="workout-form">
        <div class="margin-top-20px">
          <label for="workout-name-1" class="form-label-classic">Name</label>
          <input type="text" class="form-input-classic" name="workout-name-1" maxlength="30" id="workout-name-1" placeholder="" value="${workout.name ? workout.name : ''}" required autofocus>
        </div>
        <div class="margin-top-10px">
          <label for="workout-description-1" class="form-label-classic">Description</label>
          <textarea class="form-input-classic workout-description" name="workout-description-1" id="workout-description-1" placeholder="" required>${workout.origdescription ? workout.origdescription : ''}</textarea>
        </div>
        <div class="submit-btn-bar margin-top-5px">
          <button type="button" id="new-workout-next-step-btn" class="submit-btn" ${workout.name != null && workout.origdescription != null ? '' : 'disabled'}>Next</button>
        </div>
      </form>
    </div>
    `;
  };

  let component = ($ironfyt.workoutFormComponent = Component('[data-app=workout-form]', {
    state: {
      user: {},
      error: '',
      validationError: {},
      workout: newPlaceholderWorkout,
      pageTitle: 'New Workout',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormTemplate);
    },
  }));

  let enableSaveWorkoutBtn = function (event) {
    let workoutName = document.getElementById('workout-name-1');
    let workoutDesc = document.getElementById('workout-description-1');
    let nextStepButton = document.getElementById('new-workout-next-step-btn');
    nextStepButton.disabled = workoutName.value !== '' && workoutDesc.value !== '' ? false : true;
  };

  let handleNextStepButton = function () {
    let name = document.getElementById('workout-name-1').value;
    let description = document.getElementById('workout-description-1').value;
    let state = component.getState();
    let workout = state.workout;
    workout.name = name;
    workout.description = description;
    workout.origdescription = description;
    localStorage.setItem('newworkout', JSON.stringify(workout));
    $ironfyt.navigateToUrl(`workout-form-review.html`);
  };

  ($ironfyt.workoutFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : null;
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
        } else {
          let workout = localStorage.getItem('newworkout');
          if (workout === null) {
            workout = newPlaceholderWorkout;
          } else {
            workout = workout && typeof workout === 'string' ? JSON.parse(workout) : {};
          }
          component.setState({ workout });
        }
      } else {
        component.setState({ error });
      }
    });
  })();

  $hl.eventListener('input', 'workout-name-1', enableSaveWorkoutBtn);
  $hl.eventListener('input', 'workout-description-1', enableSaveWorkoutBtn);
  $hl.eventListener('click', 'new-workout-next-step-btn', handleNextStepButton);
})();
