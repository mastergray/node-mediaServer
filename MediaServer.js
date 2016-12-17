
module.exports = {

	/**Required Modules**/
	_http: require('http'),	 // Built-in module for HTTP server and client functionality
	_fs: require('fs'),	 	 // Built-in module for filesystem-related functionality
	_path: require('path'),	 // Built-in module for filesystem path-related functionality
	_mime:require('mime'),	 // Add-on module for determining a MIME type based on a file name extension

retrieveFile: function (filePath, req, res) {

	(function (MediaServer) {

		MediaServer._fs.exists(filePath, function (exists) {
		
			exists 
			 ? MediaServer.sendFile(filePath, req, res) 
                         : MediaServer.httpCode['404'](res); 
				
		});	
	
	})(this);

},

sendFile: function (filePath, req, res) {

	req.headers.range 
	? this.sendFileRange(filePath, req, res)
	 : this.httpCode['200'](filePath, res, this);
}, 

sendFileRange: function (filePath, req, res) {

	(function (size, range, MediaServer) {
		
		if (isNaN(range.end)) {

			MediaServer.httpCode['206'](range.start, size - 1, filePath, res,  MediaServer);
			return;

		}

		if (isNaN(range.start)) {
	
			MediaServer.httpCode['206'](0, range.end, filePath, res,  MediaServer);
			return;
		
		}

		if (range.start >= size || range.end >= size || range.start < 0 || range.end < 0 || range.start > range.end) {
			
			MediaServer.httpCode['416'](filePath, res, MediaServer);
			return;				
		}

		MediaServer.httpCode['206'](range.start, range.end, filePath, res, MediaServer);

	})(this._fs.statSync(filePath).size, this.getContentRange(req), this);

},

getContentRange:function (req) {

	return (function (range) {

		return{
			'start':parseInt(range[0]),
			'end':parseInt(range[1] )		
		}

	})(req.headers.range.replace('bytes=','').split('-'));

},

httpCode : {
	'404': function (res) {
		
		res.writeHead('404', {'Content-Type':'text/plain'});
		res.end('Error 404: File Not Found');
	},
	'500': function (res) {
		res.writeHead('500', {'Content-Type':'text/plain'});
		res.end('Error 500: Internal Server Error');
	},
	'200': function (filePath, res, MediaServer) {
		res.writeHead('200', {
			'Content-Type' : MediaServer._mime.lookup(MediaServer._path.basename(filePath)),
			'Content-Length': MediaServer._fs.statSync(filePath).size,
			'Cache-Control': 'max-age=86383',
			'Keep-Alive':'timeout=10, max=100'
		});	
		
		var readStream = MediaServer._fs.createReadStream(filePath);
		
		try {

			readStream.pipe(res);

		} catch (e) {
		
			this['500'](res);

		}	
		
	},
	'206': function (start, end, filePath, res, MediaServer) {
			
		res.writeHead('206', {
			'Content-Type' : MediaServer._mime.lookup(MediaServer._path.basename(filePath)),
			'Content-Range':'bytes ' + start + '-' + end + '/' + MediaServer._fs.statSync(filePath).size,
			'Accept-Ranges':'bytes',
			'Cache-Control': 'max-age=86383',
			'Keep-Alive':'timeout=10, max=100',
			'Content-Length':Math.abs(end - start) + 1
		});
	
		var readStream = MediaServer._fs.createReadStream(filePath, { start : start, end: end});
		
		try {

			readStream.pipe(res);

		} catch (e) {
		
			this['500'](res);

		}

		
	},
	'416': function (filePath, res, MediaServer) {
		
		res.write('416', {
			'Content-Range':'bytes */' + MediaServer._fs.statSync(filePath).size
		});
		
		res.end('Requested Range Not Satisfiable');	
	}
},

	//	Sets options for server and starts it running:
	start: function (options) {
	
		(function (MediaServer) {
			
			var server = MediaServer._http.createServer(function (req, res) {
			
				//	Responds with file for a valid request:
				(function (filePath) {
		
					MediaServer.retrieveFile(filePath, req, res);
				
				})(req.url == '/' ? options.dir + '/index.html' : options.dir + '/' + decodeURI(req.url));
				
				// Updates console with client request info:
				console.log('Request for ' + decodeURI(req.url) + ' from ' + req.connection.remoteAddress + "...");
			
			}).listen(options.port , options.ip, function () {
			
				console.log("File Server running from " + options.ip + ":" + options.port + "...\n"); // Banner message when server starts
			
			});
	
//			process.stdout.write('\033c'); // Clears console;
			
	
		})(this);	
	}

}
