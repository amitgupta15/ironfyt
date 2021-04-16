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
});
