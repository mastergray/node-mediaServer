var mediaServer = require('./src/server.js'),
    util = require('./src/util.js');

// Get arguments from command line:
((argv) =>  {
  
    var _dir = argv[0],  // Directory
        _port = argv[1], // Port
        _ip = argv[2];   // ip
        
    if (_dir !== undefined) {
      // Check f directory exists (if given)
      util.ifDirExists(_dir)
        .then((dirPath) => {
          //	Start Server:
	        mediaServer(_dir, _port, _ip);
        }).catch((dirpath) => {
          console.log("Could not find directory " + dirpath);
        })
    } else {
      //	Start Server:
	    mediaServer(_dir, _port, _ip);
    }
  
})(process.argv.slice(2));

