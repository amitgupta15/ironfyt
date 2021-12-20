const dotenv = require('dotenv');
const ObjectId = require('mongodb').ObjectID;
const mongodb = require('mongodb');
dotenv.config();

mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, database) {
  let db = database.db('ironfyt-dev');

  // Version 3.0 Tests and data massaging
  // Test the parse workout code
  /*
  let { parseWorkout } = require('./helpers/parse-workout-desc');
  db.collection('workouts')
    .find({})
    .toArray((error, workouts) => {
      if (error) {
        console.log(error);
        return;
      }
      db.collection('movements')
        .find({})
        .toArray((error, movements) => {
          if (error) {
            console.log(error);
            return;
          }
          let workout = workouts[210];
          parsedWorkout = parseWorkout(workout.description, movements);
          workout.formatteddescription = parsedWorkout.workoutDesc;
          workout.loadinfo = parsedWorkout.parsedLoadInfo;
          workout.movements = parsedWorkout.parsedMovements;
          console.log(workout);
          console.log(workout.movements);
        });
    });
    */
  // db.collection('users').updateMany({}, [{ $set: { gender: 'm' } }]);
  db.collection('logs')
    .find({ movements: { $exists: true, $gt: { $size: 0 } } })
    .toArray((error, response) => response.forEach((res) => console.log(`_id: ${res._id} movements: ${JSON.stringify(res.movements)}`)));
});
