(function () {
  'use strict';

  let newPlaceholderWorkout = {
    name: null,
    description: null,
  };
  let workoutFormTemplate = function (props) {
    let workout = props && props.workout ? props.workout : newPlaceholderWorkout;
    return `
    <div class="container">
      <div class="text-align-center bold-text">Name & Description</div>
      <div class="text-align-center text-color-secondary">Step 1 of 2</div>
      <form id="workout-form">
        <div class="margin-top-20px">
          <label for="workout-name" class="form-label-classic">Name</label>
          <input type="text" class="form-input-classic" name="workout-name" maxlength="30" id="workout-name" placeholder="" value="${workout.name ? workout.name : ''}" required autofocus>
        </div>
        <div class="margin-top-10px">
          <label for="workout-description" class="form-label-classic">Description</label>
          <textarea class="form-input-classic" name="workout-description" id="workout-description" placeholder="" required>${workout.description ? workout.description : ''}</textarea>
        </div>
        <div class="submit-btn-bar margin-top-5px">
          <button type="button" id="new-workout-next-step-btn" class="submit-btn">Next</button>
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

  let handleNextStepButton = function () {
    let name = document.getElementById('workout-name').value;
    let description = document.getElementById('workout-description').value;
    localStorage.setItem('newworkout', JSON.stringify({ name, description }));
    $ironfyt.navigateToUrl(`workout-form-review.html`);
  };

  ($ironfyt.workoutFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth.user;
        let workout = localStorage.getItem('newworkout');
        if (workout === null) {
          workout = newPlaceholderWorkout;
        } else {
          workout = JSON.parse(workout);
        }
        component.setState({ user, workout });
      } else {
        component.setState({ error });
      }
    });
  })();

  $hl.eventListener('click', 'new-workout-next-step-btn', handleNextStepButton);
})();
