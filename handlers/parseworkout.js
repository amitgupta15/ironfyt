'use strict';
let { parseWorkout } = require('../helpers/parse-workout-desc');
let parseworkout = {};

parseworkout.post = (req, res) => {
  let { buffer, options } = req;
  let db = options.database;
  let workout;
  try {
    workout = JSON.parse(buffer);
  } catch (error) {
    console.error(error);
    res(400, 'Invalid workout data, cannot parse');
  }
  let workoutDescription = workout.description ? workout.description : '';
  db.collection('movements')
    .find({})
    .toArray((error, movements) => {
      if (error) {
        console.log(error);
        res(400, 'Could not retrieve movements to parse the workout, try again');
        return;
      }
      let parsedworkout = parseWorkout(workoutDescription, movements);
      res(200, parsedworkout);
    });
};

module.exports = parseworkout;
