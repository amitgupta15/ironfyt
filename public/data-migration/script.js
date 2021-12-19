(function () {
  'use strict';

  $ironfyt.getWorkouts({}, function (error, workoutResponse) {
    $ironfyt.getMovements({}, function (error, movementResponse) {
      let workouts = workoutResponse.workouts;
      let movements = movementResponse.movements;
      let filteredWorkouts = workouts.filter((workout) => workout.movements === undefined);
      console.log(filteredWorkouts.length);
      filteredWorkouts.forEach((workout, index) => {
        let parsedWorkout = $ironfyt.parseWorkout(workout.description, movements);
        let parsedMovements = parsedWorkout && parsedWorkout.parsedMovements ? parsedWorkout.parsedMovements : [];
        //Sanitize the reps information before adding it to the workout. Movement and reps info should be in the format
        // {movementObj: {}, reps:[{reps:1,load:1,unit:lb}]}
        parsedMovements = parsedMovements.map((movement) => {
          let reps = [];
          if (Array.isArray(movement.reps)) {
            movement.reps.forEach((rep) => reps.push({ reps: rep, load: null, unit: null }));
          } else {
            reps = [{ reps: movement.reps, load: null, unit: null }];
          }
          return { movementObj: movement.movementObj, reps };
        });
        workout.origdescription = workout.description;
        workout.description = parsedWorkout && parsedWorkout.workoutDesc ? parsedWorkout.workoutDesc : '';
        workout.movements = workout.movements ? workout.movements : [];
        workout.movements = workout.movements.concat(parsedMovements);

        $ironfyt.saveWorkout(workout, function (error, response) {
          console.log(index);
          console.log(error);
          console.log(response);
        });
      });
    });
  });
})();
