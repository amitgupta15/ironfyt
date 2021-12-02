(function () {
  'use strict';

  // let movements = [
  //   { movement: 'Thrusters', reps: [45, 35, 25, 15, 5] },
  //   { movement: 'Pull-ups', reps: 45 },
  // ];
  let repsRowTemplate = (attr, index, repsIndex) => {
    let { reps } = attr;
    return `
    <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
      <div class="${repsIndex === 0 ? `margin-top-10px` : ``} flex-basis-80px">
        ${repsIndex === 0 ? `<label for="wolog-movement-reps-${index}-${repsIndex}" class="form-label-classic">Reps</label>` : ``}
        <input type="number" class="form-input-classic" name="wolog-movement-reps-${index}-${repsIndex}" id="wolog-movement-reps-${index}-${repsIndex}" value="${reps ? reps : ''}" placeholder="Reps">    
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

  let workoutFormReviewTemplate = function (props) {
    let workout = props && props.workout ? props.workout : {};
    let timecap = workout.timecap ? workout.timecap : {};
    let movements = workout.movements ? workout.movements : [];
    return `
    <div class="container">
      <div class="text-align-center bold-text">Review & Add Details</div>
      <div class="text-align-center text-color-secondary">Step 2 of 2</div>
      <div class="text-color-highlight margin-top-20px">Name</div>
      <div>${workout.name ? workout.name : ''}</div>
      <div class="text-color-highlight margin-top-10px">Description</div>
      <div>
      ${workout.description ? $hl.replaceNewLineWithBR(workout.description) : ''}
      </div>
      <form id="workout-form-review">
        <div class="margin-top-10px">
          <label for="workout-type" class="form-label-classic">Type</label>
          <select class="form-input-classic" name="workout-type" id="workout-type">
            <option></option>
            <option ${workout.type && workout.type.toLowerCase() === 'for time' ? 'selected' : workout.type === null || workout.type === undefined ? 'selected' : ''}>For Time</option>
            <option ${workout.type && workout.type.toLowerCase() === 'for load' ? 'selected' : ''}>For Load</option>
            <option ${workout.type && workout.type.toLowerCase() === 'amrap' ? 'selected' : ''}>AMRAP</option>
            <option ${workout.type && workout.type.toLowerCase() === 'for reps' ? 'selected' : ''}>For Reps</option>
            <option ${workout.type && workout.type.toLowerCase() === 'tabata' ? 'selected' : ''}>Tabata</option>
          </select>
        </div>
        <div class="flex margin-top-10px">
          <div class="flex-auto">
            <div class="form-label-classic">Time Cap</div>
            <div class="form-flex-group margin-top-5px">
              <div class="form-input-group show-time-separator-right-3px">
                <input type="number" class="form-input-classic duration-input margin-right-10px" name="workout-time-cap-hours" id="workout-time-cap-hours" min="0" max="240" placeholder="H" value="${timecap.hours ? timecap.hours : ''}" />
              </div>
              <div class="form-input-group show-time-separator-right-3px">
                <input type="number" class="form-input-classic duration-input margin-right-10px" name="workout-time-cap-minutes" id="workout-time-cap-minutes" min="0" max="59" placeholder="M" value="${timecap.minutes ? timecap.minutes : ''}"  />
              </div>
              <div class="form-input-group">
                <input type="number" class="form-input-classic duration-input margin-right-0" name="workout-time-cap-seconds" id="workout-time-cap-seconds" min="0" max="59" placeholder="S" value="${timecap.seconds ? timecap.seconds : ''}"  />
              </div>
            </div>
          </div>
          <div class="margin-left-20px">
            <label for="workout-rounds" class="form-label-classic">Total Rounds</label>
            <input type="number" class="form-input-classic" name="workout-rounds" id="workout-rounds" placeholder="" value="${workout.rounds ? workout.rounds : ''}" >    
          </div>      
        </div>
        <div class="margin-top-10px">
          <div class="form-label-classic">Modality</div>
          <div class="form-flex-group margin-top-5px">
            <label class="switch small">
              <input type="checkbox" id="workout-modality-m" name="workout-modality" value="m" ${workout.modality && workout.modality.indexOf('m') > -1 ? 'checked' : ''}/>
              <span class="slider small round"></span>
            </label>
            <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-cardio"><span class="modality-m"></span>Cardio</div>
            <label class="switch small">
              <input type="checkbox" id="workout-modality-g" name="workout-modality" value="g" ${workout.modality && workout.modality.indexOf('g') > -1 ? 'checked' : ''}/>
              <span class="slider small round"></span>
            </label>
            <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-body-weight"><span class="modality-g"></span>Body Weight</div>
            <label class="switch small">
              <input type="checkbox" id="workout-modality-w" name="workout-modality" value="w" ${workout.modality && workout.modality.indexOf('w') > -1 ? 'checked' : ''}/>
              <span class="slider small round"></span>
            </label>
            <div class="flex flex-direction-column flex-align-items-center text-align-center text-color-weights"><span class="modality-w flex-align-self-center"></span>Weights</div>
          </div>
        </div>
        <div class="margin-top-10px">
          <label for="wolog-add-movement" class="form-label-classic">Movements</label>
          <input class="form-input-classic" name="wolog-add-movement" id="wolog-add-movement" placeholder="Find movement to add..."/>
        </div>
        ${movements
          .map((movement, index) => {
            return `
            <div class="rounded-corner-box margin-top-5px">
              <div class="form-flex-group">
                <div id="wolog-movement-data-${index}" data-id="">${movement.movement.movement}</div>
                <button type="button" class="remove-btn margin-left-5px" id="delete-movement-${index}"></button>
              </div>
              ${Array.isArray(movement.reps) ? movement.reps.map((reps, repsIndex) => repsRowTemplate({ reps }, index, repsIndex)).join('') : repsRowTemplate({ reps: movement.reps }, index, 0)}
            </div>
            `;
          })
          .join('')}
        <div class="submit-btn-bar margin-top-5px">
          <button type="button" id="new-workout-next-step-btn" class="submit-btn">Create Workout</button>
        </div>
      </form>
    </div>
    `;
  };

  let component = ($ironfyt.workoutFormReviewComponent = Component('[data-app=workout-form-review]', {
    state: {
      user: {},
      error: '',
      validationError: {},
      workout: $ironfyt.newWorkout,
      pageTitle: 'New Workout',
      leftButtonTitle: 'Back',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutFormReviewTemplate);
    },
  }));

  ($ironfyt.workoutFormReviewPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (!error) {
        let user = auth.user;
        let workout = localStorage.getItem('newworkout');
        if (workout === null) {
          //If no workout is found in the localstorage, then send the user back to the workout form page
          $ironfyt.navigateToUrl(`workout-form.html`);
        } else {
          workout = JSON.parse(workout);
        }
        component.setState({ user });
        $ironfyt.getMovements({}, function (error, response) {
          if (error) {
            component.setState({ error });
          } else {
            let movements = response && response.movements ? response.movements : [];
            let parsedWorkout = $ironfyt.parseWorkout(workout.description, movements);
            console.log(parsedWorkout);
            workout.description = parsedWorkout.workoutDesc;
            workout.movements = parsedWorkout.parsedMovements;
            component.setState({ movements, workout });
          }
        });
      } else {
        component.setState({ error });
      }
    });
  })();
})();
