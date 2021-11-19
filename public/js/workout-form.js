(function () {
  'use strict';
  let movements = [
    { movement: 'Hang Power Clean', reps: [10, 8, 6, 4, 2] },
    { movement: 'Shoulder Press', reps: [10, 8, 6, 4, 2] },
    { movement: 'Deadlift', reps: [10, 8, 6, 4, 2] },
    { movement: 'Double-Unders', reps: 20 },
  ];

  let workoutFormTemplate = function (props) {
    if (props.showReviewMovementsDialog) {
      return reviewMovementsDialogTemplate(props);
    } else {
      return `
      <div class="container">
        <form id="workout-form">
          ${$ironfyt.newWorkoutFormTemplate(props)}
        </form>
      </div>`;
    }
  };

  let repsRowTemplate = (attr, index, repsIndex) => {
    let { reps } = attr;
    return `
    <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
      <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
        ${repsIndex === 0 ? `<label for="wolog-movement-reps-${index}-${repsIndex}" class="form-label-classic">Reps</label>` : ``}
        <input type="number" class="form-input-classic" name="wolog-movement-reps-${index}-${repsIndex}" id="wolog-movement-reps-${index}-${repsIndex}" value="${reps}" placeholder="Reps">    
      </div>      
      <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
        ${repsIndex === 0 ? `<label for="wolog-movement-load-${index}-${repsIndex}" class="form-label-classic">Load</label>` : ``}  
        <input type="number" class="form-input-classic" name="wolog-movement-load-${index}-${repsIndex}" id="wolog-movement-load-${index}-${repsIndex}" value="135" placeholder="Load">
      </div>
      <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
        ${repsIndex === 0 ? `<label for="wolog-movement-unit-${index}-${repsIndex}" class="form-label-classic">Unit</label>` : ``}  
        <select class="form-input-classic" name="wolog-movement-unit-${index}-${repsIndex}" id="wolog-movement-unit-${index}-${repsIndex}">
          <option value=""></option>
          <option value="lb" selected>lb</option>
          <option value="kg">kg</option>
        </select>
      </div>
      <div class="margin-top-30px">
        <button type="button" class="copy-btn" id="copy-movement-${index}-${repsIndex}"></button>
        <button type="button" class="remove-btn" id="delete-movement-${index}-${repsIndex}"></button>
      </div>
    </div>`;
  };
  let reviewMovementsDialogTemplate = function (props) {
    return `
      <div class="container">
      ${movements
        .map((movement, index) => {
          return `
            <!--===== Movement Name =====-->
            <div id="wolog-movement-data-${index}" class="${index > 0 ? 'margin-top-10px' : ''}" data-id="">${movement.movement}</div>
            ${Array.isArray(movement.reps) ? movement.reps.map((reps, repsIndex) => repsRowTemplate({ reps }, index, repsIndex)).join('') : repsRowTemplate({ reps: movement.reps }, index, 0)}`;
        })
        .join('')}`;
  };

  let component = ($ironfyt.workoutFormComponent = Component('[data-app=workout-form]', {
    state: {
      user: {},
      error: '',
      validationError: {},
      workout: $ironfyt.newWorkout,
      pageTitle: 'New Workout',
      showReviewMovementsDialog: true,
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
      let workout = response.workout;
      workout.parsedMovements = response.parsedMovements;
      if (response.parsedMovements.length) {
        component.setState({ workout, showReviewMovementsDialog: true });
      }
      console.log(response);
      // $ironfyt.navigateToUrl('workouts.html');
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
