
/* this will be simple application that connects nodejs with couchdb */
var http = require('http'),
    fs   = require('fs');   // it's for file system

var handleEventRequest = function (req, res) {
    console.log("a request arrives");
    console.log("request headers: " + req.headers); // object
    console.log("request url: " + req.url); // /

    var filePath = req.url.slice(1);
    console.log("filePath : " + filePath);

    /* once we got the file path we can start to read file */
    fs.readFile(filePath, function (err, html) {

        if (err) { console.log(err); return ; }

        var mimeType = {
            "html"  : "text/html",
            "css"   : "text/css",
            "js"    : "text/javascript",
            "xml"   : "text/xml",

            /* image type */
            "png"   : "image/png",
            "gif"   : "image/gif",
            "jpeg"  : "image/jpeg",

            /* application */
            "json"  : "application/json",
            "default" : "text/html"
        };

        /* detect the file extension */
        var extension = "default",
            dot       = filePath.lastIndexOf('.');
        if (dot > -1) {
            extension = filePath.substr(dot + 1);
        }

        console.log("extension : " + extension);
        console.log(" content - type : " + mimeType[extension]);
        /* now we have to customize our header */
        res.writeHead(200, { "Content-Type": mimeType[extension] }); // 200 means OK - content is there
        res.write(html);
        res.end();
    });

};

var server = http.createServer( handleEventRequest );
server.listen(8888);
