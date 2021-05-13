(function () {
  'use strict';

  let newWorkout = {
    name: null,
    type: null,
    timecap: null,
    rounds: null,
    reps: null,
    description: null,
    modality: [],
  };

  let workoutFormTemplate = function (props) {
    let workout = props && props.workout ? props.workout : {};
    let validationError = props && props.validationError ? props.validationError : {};
    return `
    <div class="container">
      <h1>Workout</h1>
      <form id="workout-form">
        <div>
          <label for="workout-name">Name *</label>
          <input type="text" id="workout-name" name="workout-name" value="${workout.name ? workout.name : ''}" placeholder="Chest & Back">
          ${validationError.name ? `<div id="error-workout-name">${validationError.name}</div>` : ''}
        </div>
        <div>
          <label for="workout-type">Type</label>
          <select id="workout-type" name="workout-type">
            <option value=""></option>
            <option value="For Time" ${workout.type && workout.type.toLowerCase() === 'for time' ? 'selected' : ''}>For Time</option>
            <option value="AMRAP"${workout.type && workout.type.toLowerCase() === 'amrap' ? 'selected' : ''}>AMRAP</option>
            <option value="For Load"${workout.type && workout.type.toLowerCase() === 'for load' ? 'selected' : ''}>For Load</option>
            <option value="For Reps"${workout.type && workout.type.toLowerCase() === 'for reps' ? 'selected' : ''}>For Reps</option>
          </select>
        </div>
        <div>
          <label for="workout-timecap">Time Cap</label>
          <input type="text" id="workout-timecap" name="workout-timecap" value="${workout.timecap ? workout.timecap : ''}" placeholder="20 minutes">
        </div>
        <div>
          <label for="workout-rounds">Rounds</label>
          <input type="number" id="workout-rounds" name="workout-rounds" value="${workout.rounds ? workout.rounds : ''}" placeholder="5">
        </div>
        <div>
          <label for="workout-reps">Reps</label>
          <input type="text" id="workout-reps" name="workout-reps" value="${workout.reps ? workout.reps : ''}" placeholder="21-15-9">
        </div>
        <div>
        <fieldset>
          <legend>Modality</legend>
          <label for="workout-modality-m">Metabolic Conditioning</label>
          <input type="checkbox" id="modality-m" name="workout-modality" value="m" ${workout.modality && workout.modality.indexOf('m') > -1 ? 'checked' : ''}>
          <label for="workout-modality-g">Gymnastics</label>
          <input type="checkbox" id="modality-g" name="workout-modality" value="g" ${workout.modality && workout.modality.indexOf('g') > -1 ? 'checked' : ''}>
          <label for="workout-modality-w">Weight Lifting</label>
          <input type="checkbox" id="modality-w" name="workout-modality" value="w" ${workout.modality && workout.modality.indexOf('w') > -1 ? 'checked' : ''}>
        </fieldset>
        </div>
        <div>
          <label for="workout-description">Description *</label>
          <textarea id="workout-description" name="workout-description" rows=10 cols=20 placeholder="Pull-ups\nPush-ups">${workout.description ? workout.description : ''}</textarea>
          ${validationError.description ? `<div id="error-workout-description">${validationError.description}</div>` : ''}
        </div>
        <div>
          <button type="submit" id="submit-workout" >Save</button>
          <button type="button" id="cancel-submit-workout" onclick="window.history.back()">Cancel</button>
        </div>
      </form>
    </div>`;
  };
  let component = ($ironfyt.workoutFormComponent = Component('[data-app=workout-form]', {
    state: {
      user: {},
      error: '',
      validationError: {},
      workout: newWorkout,
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormTemplate);
    },
  }));

  let validateFormInput = function () {
    let validationError = {};
    let form = document.querySelector('#workout-form');
    if (form.elements['workout-name'].value.trim() === '') validationError.name = 'Please enter a workout name';
    if (form.elements['workout-description'].value.trim() === '') validationError.description = 'Please enter a workout description';
    return validationError;
  };

  let createWorkoutObjectFromFormElements = function () {
    let state = component.getState();
    let workout = state.workout ? state.workout : newWorkout;
    let form = document.querySelector('#workout-form');
    workout.name = form.elements['workout-name'].value.trim();
    workout.type = form.elements['workout-type'].value.trim();
    workout.timecap = form.elements['workout-timecap'].value.trim();
    workout.rounds = parseInt(form.elements['workout-rounds'].value.trim());
    workout.reps = form.elements['workout-reps'].value.trim();
    workout.description = form.elements['workout-description'].value.trim();
    workout.user_id = state.user._id;
    workout.modality = [];
    for (var i = 0; i < form.elements['workout-modality'].length; i++) {
      if (form.elements['workout-modality'][i].checked) workout.modality.push(form.elements['workout-modality'][i].value);
    }
    return workout;
  };

  let handleSubmitWorkoutFormEvent = function (event) {
    event.preventDefault();

    let validationError = validateFormInput();
    let workout = createWorkoutObjectFromFormElements();
    component.setState({ validationError, workout });
    if (JSON.stringify(validationError) === '{}') {
      $ironfyt.saveWorkout(workout, function (error, response) {
        if (!error) {
          let savedWorkout = response && response.workout ? response.workout : false;
          if (savedWorkout) {
            $ironfyt.navigateToUrl(`workout-detail.html?_id=${savedWorkout._id}`);
          } else {
            component.setState({ error: { message: 'Looks like some error occurred while saving the workout. Try again.' } });
          }
        } else {
          console.error(error);
        }
      });
    }
  };

  ($ironfyt.workoutFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth && auth.user ? auth.user : {};
        let params = $hl.getParams();
        let _id = params && params._id ? params._id : false;
        if (_id) {
          if (_id.length === 24) {
            $ironfyt.getWorkouts({ _id }, function (error, response) {
              if (!error) {
                let workout = response && response.workouts ? response.workouts[0] : {};
                component.setState({ user, workout });
              } else {
                component.setState({ error });
              }
            });
          } else {
            component.setState({ error: { message: 'Invalid Workout ID' }, user });
          }
        } else {
          component.setState({ user });
        }
      } else {
        component.setState({ error });
      }
    });
  })();

  $hl.eventListener('submit', 'workout-form', handleSubmitWorkoutFormEvent);
})();
