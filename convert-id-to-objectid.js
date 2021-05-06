const dotenv = require('dotenv');
const ObjectId = require('mongodb').ObjectID;
const mongodb = require('mongodb');
dotenv.config();

mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, database) {
  let db = database.db('ironfyt-dev');
  /**
   * Update the workouts collection and store the old and new id mappings in a temp collection
   **/

  // db.collection('workouts')
  //   .find({})
  //   .toArray(function (error, docs) {
  //     docs.forEach((doc) => {
  //       let id = doc._id;
  //       if (typeof id === 'number') {
  //         doc._id = new ObjectId();
  //         db.collection('workouts').insertOne(doc, function (error, result) {
  //           db.collection('workouts').deleteOne({ _id: id }, function (error, result) {
  //             db.collection('workout_id').insertOne({ old_id: id, new_id: doc._id }, function (error, result) {
  //               console.log('completed');
  //             });
  //           });
  //         });
  //       }
  //     });
  //     console.log('done');
  //   });

  /**
   * Update the logs collection and store the old and new id mappings in a temp collection
   **/

  // db.collection('logs')
  //   .find({})
  //   .toArray(function (error, docs) {
  //     docs.forEach((doc) => {
  //       let id = doc._id;
  //       if (typeof id === 'number') {
  //         doc._id = new ObjectId();
  //         db.collection('logs').insertOne(doc, function (error, result) {
  //           db.collection('logs').deleteOne({ _id: id }, function (error, result) {
  //             db.collection('log_id').insertOne({ old_id: id, new_id: doc._id }, function (error, result) {
  //               console.log('completed');
  //             });
  //           });
  //         });
  //       }
  //     });
  //     console.log('done');
  //   });

  /**
   * Update the users collection and store the old and new id mappings in a temp collection
   **/

  // db.collection('users')
  //   .find({})
  //   .toArray(function (error, docs) {
  //     docs.forEach((doc) => {
  //       let id = doc._id;
  //       if (typeof id === 'number') {
  //         doc._id = new ObjectId();
  //         db.collection('users').insertOne(doc);
  //         db.collection('users').deleteOne({ _id: id });
  //         db.collection('user_id').insertOne({ old_id: id, new_id: doc._id });
  //       }
  //     });
  //     console.log('done');
  //   });

  /**
   * Update the user_id reference field in workouts collection
   */

  // db.collection('user_id')
  //   .find({})
  //   .toArray(function (error, ids) {
  //     ids.forEach((id) => {
  //       db.collection('workouts').updateMany({ user_id: id.old_id }, { $set: { user_id: id.new_id } }, function (error, result) {
  //         console.log(result);
  //       });
  //     });
  //   });

  /**
   * Update user_id reference field in the logs collection
   * Run it twice. Once to check against numbers, then once to check against strings
   */
  // db.collection('user_id')
  //   .find({})
  //   .toArray(function (error, ids) {
  //     ids.forEach((id) => {
  //       db.collection('logs').updateMany({ user_id: id.old_id }, { $set: { user_id: id.new_id } }, function (error, result) {
  //         console.log(result);
  //       });
  //     });
  //   });
  // db.collection('user_id')
  //   .find({})
  //   .toArray(function (error, ids) {
  //     ids.forEach((id) => {
  //       db.collection('logs').updateMany({ user_id: id.old_id.toString() }, { $set: { user_id: id.new_id } }, function (error, result) {
  //         console.log(result);
  //       });
  //     });
  //   });

  /**
   * Update workout_id reference field in the logs collection
   * Run it twice. Once to check against numbers, then once to check against strings
   */
  // db.collection('workout_id')
  //   .find({})
  //   .toArray(function (error, ids) {
  //     ids.forEach((id) => {
  //       db.collection('logs').updateMany({ workout_id: id.old_id }, { $set: { workout_id: id.new_id } }, function (error, result) {
  //         console.log(result);
  //       });
  //     });
  //   });

  // db.collection('workout_id')
  //   .find({})
  //   .toArray(function (error, ids) {
  //     ids.forEach((id) => {
  //       db.collection('logs').updateMany({ workout_id: id.old_id.toString() }, { $set: { workout_id: id.new_id } }, function (error, result) {
  //         console.log(result);
  //       });
  //     });
  //   });

  // Add email to user collection
  // db.collection('users')
  //   .find({})
  //   .toArray(function (error, users) {
  //     users.forEach(function (user) {
  //       db.collection('users').updateOne({ username: user.username }, { $set: { email: user.username } }, function (error, result) {
  //         console.log(result);
  //       });
  //     });
  //   });

  //Remove logs and workouts from users collection
  // db.collection('users').updateMany({}, { $unset: { logs: '', workouts: '' } });

  //Duration field
  // db.collection('logs')
  //   .find({})
  //   .toArray(function (error, result) {
  //     let durationArray = result.map((item) => {
  //       return { _id: item._id, duration: item.duration ? item.duration.trim().split(' ') : null };
  //     });
  //     let finalArray = [];
  //     console.log('================================');
  //     console.log(`Total: ${durationArray.length}`);
  //     let nullDurationArray = durationArray.filter((item) => item.duration === null);
  //     console.log(`-- Null Duration: ${nullDurationArray.length}`);
  //     let nonNullDurationArray = durationArray.filter((item) => item.duration !== null);
  //     console.log(`-- Not Null Duration: ${nonNullDurationArray.length}`);
  //     let noUnitDuration = nonNullDurationArray.filter((item) => item.duration.length === 1);
  //     console.log(`---- No Unit Duration: ${noUnitDuration.length} ---> Done`);
  //     noUnitDuration = noUnitDuration
  //       .map((item) => {
  //         return { ...item, time: item.duration[0].split(':') };
  //       })
  //       .map((item) => {
  //         if (item.time[0].includes('h')) {
  //           return { ...item, hours: parseInt(item.time[0].substring(0, item.time[0].indexOf('h'))), minutes: null, seconds: null };
  //         } else {
  //           return { ...item, hours: null, minutes: parseInt(item.time[0]), seconds: item.time.length > 1 ? parseInt(item.time[1]) : null };
  //         }
  //       });
  //     finalArray.push.apply(finalArray, noUnitDuration);
  //     // ==== Hour duration ===
  //     let hrUnitDuration = nonNullDurationArray.filter((item) => {
  //       if (item.duration.length > 1) {
  //         return item.duration[1].charAt(0) === 'h' || item.duration[1].charAt(0) === 'H';
  //       }
  //     });
  //     console.log(`---- Hour Unit Duration: ${hrUnitDuration.length} ---> Done`);

  //     // hour duration with 2 fields
  //     let hrDurationTwoFields = hrUnitDuration.filter((item) => item.duration.length === 2);
  //     console.log(`-------- 2 Fields ['1', 'hr']: ${hrDurationTwoFields.length} ---> Done`);
  //     hrDurationTwoFields = hrDurationTwoFields
  //       .map((item) => {
  //         return { ...item, time: item.duration[0].split(':') };
  //       })
  //       .map((item) => {
  //         return { ...item, hours: parseInt(item.time[0]), minutes: item.time.length > 1 ? parseInt(item.time[1]) : null, seconds: null };
  //       });

  //     finalArray.push.apply(finalArray, hrDurationTwoFields);

  //     //Hour duration more than 2 fields
  //     let hrDurationMoreThanTwoFields = hrUnitDuration.filter((item) => item.duration.length > 2);
  //     console.log(`-------- >2 Fields ['1', 'hr', '10', 'minutes]: ${hrDurationMoreThanTwoFields.length} ---> Done`);
  //     hrDurationMoreThanTwoFields = hrDurationMoreThanTwoFields.map((item) => {
  //       return { ...item, hours: parseInt(item.duration[0]), minutes: parseInt(item.duration[2]), seconds: null };
  //     });
  //     finalArray.push.apply(finalArray, hrDurationMoreThanTwoFields);

  //     let minUnitDuration = nonNullDurationArray.filter((item) => {
  //       if (item.duration.length > 1) {
  //         return item.duration[1].charAt(0) === 'm' || item.duration[1].charAt(0) === 'M';
  //       }
  //     });
  //     console.log(`---- Minute Unit Duration: ${minUnitDuration.length}`);

  //     let minDurationTwoFields = minUnitDuration.filter((item) => item.duration.length === 2);
  //     console.log(`-------- 2 Fields ['1:15' 'minute']: ${minDurationTwoFields.length} ---> Done`);
  //     minDurationTwoFields = minDurationTwoFields
  //       .map((item) => {
  //         return { ...item, time: item.duration[0].split(':') };
  //       })
  //       .map((item) => {
  //         return { ...item, hours: null, minutes: parseInt(item.time[0]), seconds: item.time.length > 1 ? parseInt(item.time[1]) : null };
  //       });

  //     finalArray.push.apply(finalArray, minDurationTwoFields);

  //     let minDurationMoreThanTwoFields = minUnitDuration.filter((item) => item.duration.length > 2);
  //     console.log(`-------- >2 Fields ['1' 'minute', '5', 'seconds']: ${minDurationMoreThanTwoFields.length} ---> Done`);
  //     minDurationMoreThanTwoFields = minDurationMoreThanTwoFields.map((item) => {
  //       return { ...item, hours: null, minutes: parseInt(item.duration[0]), seconds: parseInt(item.duration[2]) };
  //     });

  //     finalArray.push.apply(finalArray, minDurationMoreThanTwoFields);

  //     let randomUnitDuration = nonNullDurationArray.filter((item) => {
  //       if (item.duration.length > 1) {
  //         return item.duration[1].charAt(0) !== 'h' && item.duration[1].charAt(0) !== 'H' && item.duration[1].charAt(0) !== 'M' && item.duration[1].charAt(0) !== 'm';
  //       }
  //     });
  //     console.log(`---- Random Unit Duration: ${randomUnitDuration.length} -- handle this manually`);
  //     console.log(randomUnitDuration);
  //     console.log(`Final Array: ${finalArray.length}`);
  // console.log(finalArray);

  //*** CAUTION *** -- Following code block will update the database
  // finalArray.forEach((item) => {
  //   db.collection('logs').findOne({ _id: ObjectId(item._id) }, function (error, log) {
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       log.duration = {
  //         desc: log.duration,
  //         hours: item.hours,
  //         minutes: item.minutes,
  //         seconds: item.seconds,
  //       };
  //       db.collection('logs').replaceOne({ _id: ObjectId(log._id) }, log, function (error, result) {
  //         if (error) {
  //           console.error(error);
  //         } else {
  //           console.log(`_id: ${result.ops[0]._id}, modifiedCount: ${result.modifiedCount}`);
  //         }
  //       });
  //     }
  //   });
  // });
  // *** CAUTION *** - Above code block will update the database
  // });

  // Load field
  db.collection('logs')
    .find({})
    .toArray(function (error, docs) {
      let loads = docs.map((item) => {
        return { _id: item._id, load: item.load };
      });
      let finalArray = [];
      console.log(`Total docs: ${loads.length}`);
      let nullLoads = loads.filter((item) => item.load === null || item.load === undefined);
      console.log(`-- Null Load: ${nullLoads.length}`);
      let notNullLoads = loads.filter((item) => item.load !== null && item.load !== undefined);
      console.log(`-- Non Null Load: ${notNullLoads.length}`);
      notNullLoads = notNullLoads.map((item) => {
        return { ...item, load: item.load.trim().split(' ') };
      });
      let oneTwoFieldLoads = notNullLoads
        .filter((item) => item.load.length === 1 || item.load.length === 2)
        .map((item) => {
          return { ...item, load: item.load[0].includes('l') ? item.load[0].substring(0, item.load[0].indexOf('l')) : item.load[0] };
        })
        .map((item) => {
          return { ...item, load: item.load.includes('/') ? item.load.split('/') : [item.load] };
        });
      console.log(`---- One Field Load: ${oneTwoFieldLoads.length}`);
      oneTwoFieldLoads.forEach((item) => {
        finalArray.push({ _id: item._id, load: item.load, unit: 'lbs' });
      });
      let moreThanTwoFieldLoads = notNullLoads.filter((item) => item.load.length > 2);
      console.log(`---- More than Two fields loads: ${moreThanTwoFieldLoads.length} --> Handle Manually`);
      console.log(moreThanTwoFieldLoads);
      console.log(`Final Array Length: ${finalArray.length}`);

      // finalArray.forEach((item) => console.log(item));

      // *** CAUTION: FOLLOWING CODE UPDATES THE TABLE - BE CAREFUL ***
      // finalArray.forEach((item) => {
      //   db.collection('logs').findOne({ _id: ObjectId(item._id) }, function (error, doc) {
      //     let roundinfo = [];
      //     item.load.forEach((load) => {
      //       roundinfo.push({ rounds: null, reps: null, load: load, unit: 'lbs' });
      //     });
      //     doc.roundinfo = roundinfo;
      //     db.collection('logs').replaceOne({ _id: doc._id }, doc, function (error, result) {
      //       if (error) {
      //         console.error(error);
      //       } else {
      //         console.log(`_id: ${result.ops[0]._id}, modifiedCount: ${result.modifiedCount}`);
      //       }
      //     });
      //   });
      // });
      // *** CAUTION: ABOVE CODE UPDATES THE TABLE - BE CAREFUL ***
    });
});
