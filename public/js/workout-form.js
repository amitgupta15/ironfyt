(function () {
  'use strict';

  let workoutFormTemplate = function (props) {
    let workout = props && props.workout ? props.workout : {};
    return `
    <div class="container">
      <div class="text-align-center bold-text">Name & Description</div>
      <div class="text-align-center text-color-secondary">Step 1 of 2</div>
      <form id="workout-form">
        <div class="margin-top-20px">
          <label for="workout-name" class="form-label-classic">Name</label>
          <input type="text" class="form-input-classic" name="workout-name" maxlength="30" id="workout-name" placeholder="" value="" required autofocus>
        </div>
        <div class="margin-top-10px">
          <label for="workout-description" class="form-label-classic">Description</label>
          <textarea class="form-input-classic" name="workout-description" id="workout-description" placeholder="" required></textarea>
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
      workout: $ironfyt.newWorkout,
      pageTitle: 'New Workout',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormTemplate);
    },
  }));

  let handleNextStepButton = function () {
    $ironfyt.navigateToUrl(`workout-form-review.html`);
  };

  ($ironfyt.workoutFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth.user;
        component.setState({ user });
      } else {
        component.setState({ error });
      }
    });
  })();

  $hl.eventListener('click', 'new-workout-next-step-btn', handleNextStepButton);
})();
