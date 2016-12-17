var fileServer = require('./MediaServer.js');

//	Set server options from command line (e.g. node init.js {ip} {port} {dir}:
(function (argv) {
	
	//	Start Server:
	fileServer.start({
		'ip':argv[0],
		'port':argv[1],
		'dir':argv[2]
	});

})(process.argv.slice(2));

// node init.js 192.168.1.111 8080 /home/mastergray/Videos

