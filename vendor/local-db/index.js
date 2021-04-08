/**
 * A lightweight in-memory database mimicking mongodb behavior
 */
'use strict';
let localdb = {};
let collections = {};

//Keeping the methods simple. No error handling is introduced yet. Just returning data
let db = {
  collection: (collectionName) => {
    let collection = collections[collectionName];
    return {
      find: (props, callback) => {
        callback(false, {
          toArray: (callback) => {
            callback(false, collection);
          },
        });
      },
      findOne: (props, callback) => {
        let _id = props && props._id ? props._id : false;
        if (_id) {
          let doc = collection.find((doc) => doc._id === _id);
          callback(false, doc);
        } else {
          callback('Invalid Request');
        }
      },
      countDocuments: (callback) => {
        callback(false, collection.length);
      },
      insertOne: (doc, callback) => {
        collection.push(doc);
        let result = {
          ops: [doc],
        };
        callback(false, result);
      },
      replaceOne: (props, doc, callback) => {
        let _id = props._id ? props._id : false;
        if (_id) {
          let _doc = collection.find((adoc) => adoc._id === _id);
          if (_doc) {
            _doc = doc;
            callback(false, _doc);
          } else {
            callback('Document not found');
          }
        } else {
          callback('Please provide an _id to be updated');
        }
      },
    };
  },
};

let database = {
  db: (dbname) => {
    //Ignore the dbname passed. In local environment, we are only using one default database
    return db;
  },
};

// Call this method to set the collections
localdb.setCollections = (_collections) => {
  collections = _collections;
};

localdb.MongoClient = {
  connect: (url, config, callback) => {
    console.log('Running in-memory database. Data will be wiped out when you shut down the server');
    //Ignore url and config parameters for now
    callback(false, database);
  },
};
module.exports = localdb;
