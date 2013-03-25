
/* this will be simple application that connects nodejs with couchdb */
var http = require('http'),
    fs   = require('fs');   // it's for file system

var handleEventRequest = function (req, res) {
  console.log("a request arrives");
  console.log("request headers: " + req.headers); // object 
  console.log("request url: " + req.url); // /

  /* request for ajax.html */
  if (req.url.indexOf('ajax.html') > -1) {
    console.log("request for ajax.html");

    fs.readFile('ajax.html', function (err, html) {
    
      if (err) { console.log(err); return ; }

      res.writeHead(200, { "Content-Type": "text/html" }); // 200 means OK - content is there
      res.write(html);
      res.end();
    });
  
  }
  else if (req.url.indexOf('index.html') > -1) {
    console.log("request for index.html");

    fs.readFile('index.html', function (err, html) {
    
      if (err) { console.log(err); return ; }

      res.writeHead(200, { "Content-Type": "text/html" }); // 200 means OK - content is there
      res.write(html);
      res.end();
    });
  }
};

var server = http.createServer( handleEventRequest );
server.listen(8888);
