(function () {
  'use strict';
  let movements = [{ movement: 'Hang Power Clean', reps: [10, 8, 6, 4, 2] }];

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

  let reviewMovementsDialogTemplate = function (props) {
    return `
      <div class="container">
      ${movements.map((movement) => {
        console.log(movement.reps);
        return `
            <!--===== Movement Name =====-->
            <div id="wolog-movement-data-$index" data-id="">${movement.movement}</div>`;
      })}
        
        <!--===== First row with labels =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="margin-top-10px flex-basis-80px">
            <label for="wolog-movement-reps-$index" class="form-label-classic">Reps</label>
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="5" placeholder="Reps">    
          </div>      
          <div class="margin-top-10px flex-basis-80px">  
            <label for="wolog-movement-load-$index" class="form-label-classic">Load</label>
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="margin-top-10px flex-basis-80px">
            <label for="wolog-movement-unit-$index" class="form-label-classic">Unit</label>
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div class="margin-top-30px">
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="5" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="3" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="3" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="3" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="1" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="1" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="1" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
        <!--===== No labels after first row =====-->
        <div class="form-flex-group flex-column-gap-5px margin-bottom-5px">
          <div class="flex-basis-80px">
            <input type="number" class="form-input-classic" name="wolog-movement-reps-$index" id="wolog-movement-reps-$index" value="1" placeholder="Reps">    
          </div>      
          <div class="flex-basis-80px">  
            <input type="number" class="form-input-classic" name="wolog-movement-load-$index" id="wolog-movement-load-$index" value="135" placeholder="Load">
          </div>
          <div class="flex-basis-80px">
            <select class="form-input-classic" name="wolog-movement-unit-$index" id="wolog-movement-unit-$index">
              <option value=""></option>
              <option value="lb" selected>lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div>
            <button type="button" class="copy-btn" id="copy-movement-$index"></button>
            <button type="button" class="remove-btn" id="delete-movement-$index"></button>
          </div>
        </div>
      </div>`;
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
