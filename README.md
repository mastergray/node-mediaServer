# node-mediaServer
A _really_ simple Node.js server that can "stream" media - i.e. process 206 partial content requests.
## What This Is Not
This is **not** a [DLNA](https://www.dlna.org/) or [UPnP](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) server solution - it's orignal use case was so that I could stream movies from
my computer to a ChromeCast. And to that end - it works (ar least when running from Ubuntu 12.04.5 LTS). I had envisioned using this as the basis for a more rhobust application - but [Plex](https://www.plex.tv/) exists so this is what it is.
## Setup
To use this, you will need [Node.js](https://nodejs.org/en/download/). With Node.js installed, download and unzip dist.zip (which is essentially just all of the project files compressed for your convience). In the unzipped folder, run `npm install` to download the depedencies needed to run - nothing crazy mainly bluebird and a couple of minor utility things - and you should be good to go.
## How To Use This Thing
Running `node init.js` will start up the server. This script can take three optional arguments (no prefixes so order counts):
- Directory path - what files should be served (defaults to directory _init.sj_ is running from)
- Port Number - what port number to listen to (defaults to **8080**)
- IP - What IP address to try and serve files from (defaults to local IP)

As an example:
  
`node init.js ~/videos 3000 192.168.1.25`

Will start the server up, serving up all files located in _~/videos_ accepting requests from _http:// 192.168.1.25:3000_.
Files can be loaded from **http:// your.ip.address:port/filename**. Going to **http:// your.ip.address:port** will load a list of links to
all the files in the directory being served. It's not pretty but it works.
## Project Files
- |- src (_source files for everything_)
  - |- httpCode.js (_Defines all the supported HTTP status codes_)
  - |- server.js (_...the server_)
  - |- util.js (_random methods that didn't seem to belong anywhere else_)
- |- dist (_how this thing gets distributed..._)
  - |- dist.zip (_...as a .zip file. Fancy._)
- |- .gitignore (_ignores what isn't needed. Right?_)
- |- README.md (_Really?_)
- |- init.js (_The thing you run from command line to start the stuff it probably does_)
- |- package.json (_Module dependencies for the project_)
- |- LICENSE.md (_Becasue that's what you're apparently suppose to do now_)
## Acknowledgments
This thing hasn't been well tested outside of my personal use - though for the year or so I used it to stream videos in my house it seemed to work pretty well.
## License
This project is licensed under the MIT License - see the [LICENSE.md] (https://github.com/mastergray/node-mediaServer/blob/master/LICENSE) file for details
