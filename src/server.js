// Dependencies
var http = require('http'),	              // HTTP server and client functionality
    Promise = require('bluebird'),        // For using promises
    getMyIP = require('get-my-ip'),       // determines local IP
    util = require('./util.js'),          // Utility methods for MediaServer
    httpCode = require('./httpCode.js'),  // Handles HTTP codes for MediaServer
    fs = require('fs');                   // File system API
  
   /**
    *
    * Support Proceses
    *
    */
   
    // Sends file as response for a request of a given file path:
    sendFile = (req, res) => (filepath) => {
      req.headers.range
        ? sendFileRange(req, res)(filepath) // Send partial content
        : httpCode(res)("200")(filepath);   // All content sent
    },
   
   // Sends partial content as response for a request of given file path:
   sendFileRange = (req, res) => (filepath) => {
    
    var size = fs.statSync(filepath).size,
        range = getContentRange(req);
      
      // If end of range is not a number, use file size to get end of content:
		  if (isNaN(range.end)) {
        httpCode(res)("206")(filepath, range.start, size - 1);
        return;
		  }

      // If start of range is not a number, start content at 0:
		  if (isNaN(range.start)) {
	      httpCode(res)("206")(filepath, 0, range.end );
		    return;
		  }

      // Checks to see if start range is valid:
		  if (range.start >= size || range.start < 0 || range.start > range.end) {
		    httpCode(res)("416")(filepath);
			  return;
		  }
		  
		  // Checks to see if end range is valid:
      if (range.end >= size || range.end <0) {
        httpCode(res)("416")(filepath);
			  return;
      }

    // Sends partial content for given range:
		httpCode(res)("206")(filepath, range.start, range.end);

  },
  
  // Returns content range as an object from a given request:
  getContentRange = (req) => {
	  var range = req.headers.range.replace('bytes=','').split('-');
		  return{
			  "start":parseInt(range[0]),
			  "end":parseInt(range[1])
		  };
  },
  
  // Builds file list to return as a response:
  fileList = (url, dir) => (res) => {
    return util.execAsync("cd " + dir + " && ls")
      .then((files) => {
        // Build file list:
        var fileList = files.split("\n").reduce((result, file) => {
          result += `<a target="_blank" href="${url}/${file}">${file}</a><br />`;
          return result;
        }, "");
        // Send response:
        res.writeHead('200', {'Content-Type' : 'text/html'});
        res.write(fileList);
        res.end();
      })
      .catch((err) => {
        console.log(err);
        throw "500";
      });
  };
   
  /**
   *
   * Main Process
   *
   */
    
  module.exports = (dir, port, ip) => {

    var _dir = dir || __dirname,  // Serves from working directory by default
        _port = port || '8080',   // Set port to 8080 by default
        _ip = ip || getMyIP();    // Tries to find local IP by default
    
    // Initialize server:
    http.createServer((req, res) => {
    
      // Determines if file or file list should be loaded:
      if (req.url === '/') {
        
        // File list is shown when request is to root:
        fileList("http://" + _ip + ":" + _port, _dir)(res);
    
      } else {
        
        // Curried methods:
        send = sendFile(req, res),
        onError = httpCode(res);
   
        // Process request:
        util.ifFileExists(_dir + decodeURI(req.url))
          .then(send)
          .catch(onError);

      }
    
      // Write request to console:
      console.log(`(${util.timestamp()}) ${decodeURI(req.url)} | ${req.connection.remoteAddress}...`);
    
    }).listen(_port, _ip, () => {
      
      // Banner message when server starts
      console.log(`\nStarted ${util.timestamp()} | CRTL+C to close`);
      console.log(`Serving From ${_dir} @ http://${_ip}:${_port}\n`);

    });
  
  };