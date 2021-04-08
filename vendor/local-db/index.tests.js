'use strict';
const { assert, it } = require('./vendor/nodejs-unit-test-library');
const localdb = require('./index');
localdb.setCollections({
  users: [
    {
      _id: 1,
      username: 'amitgupta15@gmail.com',
      password: '',
      fname: 'Amit',
      lname: 'Gupta',
      workouts: [1, 2, 3, 4],
      logs: [],
    },
  ],
});

localdb.MongoClient.connect(null, null, function (error, database) {
  let db = database.db();
  it('should find records', () => {
    db.collection('users').find({}, (error, result) => {
      result.toArray((error, docs) => {
        assert.strictEqual(docs.length, 1);
      });
    });
  });
  it('should findOne record', () => {
    db.collection('users').findOne({ _id: 1 }, (error, result) => {
      assert.strictEqual(result._id, 1);
      assert.strictEqual(result.username, 'amitgupta15@gmail.com');
    });
  });
  it('should countDocuments', () => {
    db.collection('users').countDocuments((error, count) => {
      assert.strictEqual(count, 1);
    });
  });
  it('should insertOne doc', () => {
    db.collection('users').insertOne({ _id: 2, username: 'pooja' }, (error, result) => {
      assert.strictEqual(result.ops[0]._id, 2);
    });
    db.collection('users').find({}, (error, result) => {
      result.toArray((error, docs) => {
        assert.strictEqual(docs.length, 2);
      });
    });
  });
  it('should replaceOne doc', () => {
    db.collection('users').findOne({ _id: 1 }, (error, result) => {
      let doc = result;
      doc.username = 'amit.gupta@arrowts.com';
      db.collection('users').replaceOne({ _id: 1 }, doc, (error, result) => {
        db.collection('users').findOne({ _id: 1 }, (error, result) => {
          assert.strictEqual(result.username, 'amit.gupta@arrowts.com');
        });
      });
    });
  });
});
