'use strict';

const ObjectId = require('mongodb').ObjectID;

const pr = {};

pr.get = function (req, res) {
  let { query, options } = req;
  let database = options.database;
  let workout_id = query.workout_id && query.workout_id.length === 24 ? new ObjectId(query.workout_id) : null;
  let user_id = query.user_id && query.user_id.length === 24 ? new ObjectId(query.user_id) : null;
  if (workout_id && user_id) {
    database
      .collection('personalrecords')
      .aggregate([
        { $match: { workout_id, user_id } },
        {
          $lookup: {
            from: 'logs',
            foreignField: '_id',
            localField: 'workoutlog_id',
            as: 'logs',
          },
        },
        {
          $lookup: {
            from: 'workouts',
            foreignField: '_id',
            localField: 'workout_id',
            as: 'workouts',
          },
        },
        {
          $project: { _id: 0, log: { $arrayElemAt: ['$logs', 0] }, workout: { $arrayElemAt: ['$workouts', 0] } },
        },
      ])
      .toArray((error, response) => {
        if (error) {
          console.error(error);
        } else {
          let result = response && response.length ? response[0] : {};
          res(200, result);
        }
      });
  } else {
    res(400, { error: 'Invalid workout_id or user_id' });
  }
};

pr.post = function (req, res) {
  let { buffer, options } = req;
  let workoutlog;
  let database = options.database;
  try {
    workoutlog = JSON.parse(buffer);
    let workout_id = workoutlog.workout_id ? workoutlog.workout_id : null;
    let user_id = workoutlog.user_id;
    if (workout_id) {
      database.collection('personalrecords').findOne({ workout_id: new ObjectId(workout_id), user_id: new ObjectId(user_id) }, (error, personalRecordDoc) => {
        if (error) {
          console.error(error);
          res(400, { error: 'Error occurred while fetching personal record ' });
          return;
        }
        //If no PR record found then insert a new PR record
        if (personalRecordDoc === null) {
          replacePrRecord(workoutlog._id, workout_id, user_id, database, res);
        } else {
          database.collection('logs').findOne({ _id: new ObjectId(personalRecordDoc.workoutlog_id) }, function (error, currentPrLog) {
            if (error) {
              console.error(error);
              res(400, { error: 'Error occurred while retrieving workoutlog to compare PR' });
              return;
            }
            database.collection('workouts').findOne({ _id: new ObjectId(personalRecordDoc.workout_id) }, function (error, workout) {
              if (error) {
                console.error(error);
                res(400, { error: 'Error occurred while retrieving workout to compare' });
                return;
              }
              let newPR = workout.type.toLowerCase() === 'for time' ? pr.isNewForTimePR(currentPrLog, workoutlog) : workout.type.toLowerCase() === 'for load' ? pr.isNewForLoadPR(currentPrLog, workoutlog) : pr.isNewRepsAndRoundsPR(currentPrLog, workoutlog);
              if (newPR) replacePrRecord(workoutlog._id, workout_id, user_id, database, res);
            });
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    res(400, { error: 'Invalid Workout Log data' });
  }
};

let replacePrRecord = (workoutlog_id, workout_id, user_id, database, res) => {
  let prObject = { workoutlog_id: new ObjectId(workoutlog_id), workout_id: new ObjectId(workout_id), user_id: new ObjectId(user_id) };
  database.collection('personalrecords').replaceOne({ workout_id: new ObjectId(workout_id), user_id: new ObjectId(user_id) }, prObject, { upsert: true }, function (error, response) {
    if (error) {
      res(400, { error: 'Error occurred while creating a new personal record' });
      return;
    }
    res(200, response.ops[0]);
    return;
  });
};
pr.isNewForLoadPR = (prLog, newLog) => {
  let prMovements = prLog && prLog.movements ? prLog.movements : [];
  let newLogMovements = newLog && newLog.movements ? newLog.movements : [];
  function calculateTotalLoad(movementsArray) {
    return movementsArray
      .map((movement) => {
        let reps = movement.reps !== null ? movement.reps : 1;
        let load = movement.load !== null ? movement.load : 1;
        return reps * load;
      })
      .reduce((acc, curr) => acc + curr, 0);
  }
  let totalPrLoad = calculateTotalLoad(prMovements);
  let totalNewLoad = calculateTotalLoad(newLogMovements);
  return totalNewLoad > totalPrLoad;
};

pr.isNewForTimePR = (prLog, newLog) => {
  let prDuration = prLog && prLog.duration ? prLog.duration.hours * 60 * 60 + prLog.duration.minutes * 60 + prLog.duration.seconds : 0; //convert everything to seconds
  let newDuration = newLog && newLog.duration ? newLog.duration.hours * 60 * 60 + newLog.duration.minutes * 60 + newLog.duration.seconds : 0; //convert everything to seconds
  if (newDuration < prDuration || (prDuration === 0 && newDuration > 0)) {
    return true;
  } else {
    return false;
  }
};

pr.isNewRepsAndRoundsPR = (prLog, newLog) => {
  let prRoundinfo = prLog && prLog.roundinfo ? prLog.roundinfo : [];
  let newLogRoundinfo = newLog && newLog.roundinfo ? newLog.roundinfo : [];

  function calculateRounds(roundInfoArray) {
    return roundInfoArray
      .map((roundObj) => {
        let rounds = roundObj.rounds !== null ? roundObj.rounds : 1;
        let load = roundObj.load !== null ? roundObj.load : 1;
        return rounds * load;
      })
      .reduce((acc, curr) => acc + curr, 0);
  }
  let totalPrRounds = calculateRounds(prRoundinfo);
  let totalNewRounds = calculateRounds(newLogRoundinfo);
  if (totalNewRounds > totalPrRounds) {
    return true;
  } else if (totalNewRounds === totalPrRounds) {
    //Check for totalreps
    let totalPRReps = prLog.totalreps !== null ? prLog.totalreps : 0;
    let totalNewReps = newLog.totalreps !== null ? newLog.totalreps : 0;
    if (totalNewReps > totalPRReps) {
      return true;
    }
  }
  return false;
};
module.exports = pr;
