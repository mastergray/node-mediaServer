// Dependencies
var path = require('path'),	// file system path API
    mime = require('mime'), 	// determines MIME type based on a file name extension
    fs = require('fs');	    	// file system API
 
module.exports = (res) => (code) => {

	switch (code) {
    
    		// File Not Found:
    		case "404":
			res.writeHead('404', {'Content-Type':'text/plain'});
			res.end('Error 404: File Not Found');
    		break;
  
   	 	// Success (Sent entire file):
    		case "200":
      			return (filepath) => {
        			res.writeHead('200', {
        				'Content-Type' : mime.lookup(path.basename(filepath)),
        				'Content-Length': fs.statSync(filepath).size,
        				'Cache-Control': 'max-age=86383',
        				'Keep-Alive':'timeout=10, max=100'
				});
        			
				// Try and write file to response:
				try {
          				fs.createReadStream(filepath).pipe(res);
       				} catch (e) {
					// This should be handled better, but for now just write error to console:
          				console.log(e);
        			}
        
      			};

    		// Success (Sent part of file):
    		case "206":
      			return (filepath, start, end) => {
      				res.writeHead('206', {
			  		'Content-Type' : mime.lookup(path.basename(filepath)),
			  		'Content-Range':'bytes ' + start + '-' + end + '/' + fs.statSync(filepath).size,
			  		'Accept-Ranges':'bytes',
			  		'Cache-Control': 'max-age=86383',
			  		'Keep-Alive':'timeout=10, max=100',
			  		'Content-Length':Math.abs(end - start) + 1
				});
				
				// Try and write file to response:
	    			try {
        				// This should be handled better, but for now just write error to console:
					fs.createReadStream(filepath).pipe(res);
      				} catch (e) {
        				console.log(e)
      				}
			}
    
    		// Invalid range requested:
    		case "416":
      			return (filepath) => {
        			res.write('416', {'Content-Range':'bytes */' + fs.statSync(filepath).size});
		    		res.end('Requested Range Not Satisfiable');
     		 	}
      
    		// Anything else passed as "code" is treated as an internal server error (500):
    		default:
      			// Writes "code" to console to see where the server broke:
			console.log(code);
			res.writeHead('500', {'Content-Type':'text/plain'});
			res.end('Error 500: Internal Server Error');   
	}
}
