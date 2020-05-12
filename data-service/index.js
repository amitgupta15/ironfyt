const fs = require('fs');
const path = require('path');

const baseDataDir = path.join(__dirname, '../.data');

const service = {};

// Read data from file
service.read = (dir, file, callback) => {
  fs.readFile(`${baseDataDir}/${dir}/${file}.json`, 'utf-8', (error, data) => {
    if (!error) {
      callback(false, JSON.parse(data));
    } else {
      callback(error);
    }
  });
};

// Create data in a file
service.create = (dir, file, data, callback) => {
  // Convert data to string
  const stringData = JSON.stringify(data);

  fs.writeFile(`${baseDataDir}/${dir}/${file}.json`, stringData, { flag: 'wx' }, (error) => {
    if (!error) {
      callback(false);
    } else {
      callback(error);
    }
  });
};

// Update data in a file
service.update = (dir, file, data, callback) => {
  // Convert data to string
  const stringData = JSON.stringify(data);
  fs.open(`${baseDataDir}/${dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
    if (!error && fileDescriptor) {
      fs.ftruncate(fileDescriptor, (error) => {
        if (!error) {
          fs.write(fileDescriptor, stringData, (error) => {
            if (!error) {
              fs.close(fileDescriptor, (error) => {
                if (!error) {
                  callback(false);
                } else {
                  callback(error);
                }
              });
            } else {
              callback(error);
            }
          });
        } else {
          callback(error);
        }
      });
    } else {
      callback(error);
    }
  });
};

// Delete a file
service.delete = (dir, file, callback) => {
  fs.unlink(`${baseDataDir}/${dir}/${file}.json`, (error) => {
    if (!error) {
      callback(false);
    } else {
      callback(error);
    }
  });
};

// Get directory listing
service.list = (dir) => {
  let ids = fs.readdirSync(`${baseDataDir}/${dir}`);
  ids = ids.map((id) => id.replace('.json', ''));
  return ids;
};

// Read files synchronously
service.readSync = (dir, file) => {
  let data = fs.readFileSync(`${baseDataDir}/${dir}/${file}.json`);
  try {
    data = JSON.parse(data);
  } catch (error) {
    data = false;
    console.log(error);
  }
  return data;
};
module.exports = service;
