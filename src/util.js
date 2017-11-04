// Dependencies
var Promise = require('bluebird'),             // For using promises
    fs = Promise.promisifyAll(require('fs')),	 // file system API using promises
    exec = require('child_process').exec;           // for running external process (i.e. a shell command)

/**
 *
 * Method Namespace
 *
 */
    
module.exports = {
  
  // Returns promise for if directory exists:
  ifDirExists: function (dirpath) {
     return new Promise((resolve, reject) => {
     fs.stat(dirpath, (err, stat) => {
       err !== null || !stat.isDirectory()
        ? reject(dirpath)
        : resolve(dirpath);
     });
   });
  },
  
  // Returns promise for if file exists:
  ifFileExists: function (filepath) {
   return new Promise((resolve, reject) => {
     fs.stat(filepath, (err, stat) => {
       err !== null || !stat.isFile()
        ? reject("404")
        : resolve(filepath);
     });
   });
  },
  
  // Returns time stamp:
  timestamp: function () {
    var date = new Date();
    return date;
  },
  
  // Runs shell command and returns result as promise:
  execAsync: function (command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }
};