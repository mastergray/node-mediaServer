VideoList = {

	_http: require('http'),	 // Built-in module for HTTP server and client functionality
	_process: require('child_process'),

	start:function () {
		
		var server = this._http.createServer(function (req, res) {

			res.writeHead('200', {
				'Content-Type' : 'text/html',
			});	
		
			var cmd = VideoList._process.spawn('ls');			

			cmd.stdout.on('data', function(output) {
				var list = output.toString().split("\n");
					for (var i = 0; i < list.length; i++) {
					
						res.write('<a href="http://192.168.1.111:8080/' + list[i] + '">' + list[i] + '</a><br />');

					}

							
			});
			
			cmd.stdout.on('close', function () {

				res.end();
			
			});
		
		}).listen('8080', function () {

			console.log('Video List running...');
		
		});

	}
}

VideoList.start();
