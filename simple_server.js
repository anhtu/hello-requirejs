
/* this will be simple application that connects nodejs with couchdb */
var http = require('http'),
    fs   = require('fs'),   // it's for file system
    q    = require('q');    // used q for promise

var handleEventRequest = function (req, res) {

    console.log("a request arrives");
    console.log("request headers: " + req.headers); // object
    console.log("request url: " + req.url); // /

    /**
     * TODO: move domain object onto the server
     * TODO: introduce domain driven design
     * TODO: introduce event-sourcing
     *
     * @type {Object}
     * @private
     */

    /* now we share common data between function since we do not use nesting callback but promise
     * so we use an object fileRequest instead of filePath - configuration object pattern
     * */
    var _file = {
        path : req.url.slice(1)
    };
    console.log("filePath : " + _file.path);

    /* return a content not found response */
    var _return404 = function (message) {
        res.writeHead(404, { "Content-Type" : "text/html"});
        res.end(message);
    };

    /* return ok with the data */
    var _return200 = function (contentType, data) {
        res.writeHead(200, { "Content-Type" : contentType});
        res.write(data);
        res.end();
    };




    /* check if file.path exists */
    var _fileExists = function (file) {

        if (!file.path) return ;

        var _deferred = q.defer();
        fs.exists(file.path, function (exists) {
            if (!exists) {
                _deferred.reject("content not found\n");
            }
            else {
                _deferred.resolve();
            }
        });

        return _deferred.promise;
    };


    /* wrapper of fs.readFile */
    var _readFile = function (file) {

        if (!file.path) return ;

        var _deferred = q.defer();

        fs.readFile(file.path, function (err, data) {

            if (err) {
                console.log(err);
                _deferred.reject();
            }

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
                dot       = file.path.lastIndexOf('.');
            if (dot > -1) {
                extension = file.path.substr(dot + 1);
            }

            console.log("extension : " + extension);
            console.log(" content - type : " + mimeType[extension]);

            _deferred.resolve();
            file.contentType = mimeType[extension];
            file.data        = data;
        });

        return _deferred.promise;
    };

    var _getHandler = function (fileName) {
        return _handlersFileMapping[fileName];
    };

    /* check if request is GET or POST
     * now we just assume that it's all GET
     *
     * we also to mapping from controller / handler to file
     *
     * */
    var _handlersFileMapping = {
        "handler.html" : "./handlers/listPersonHandler.js"
    };

    /* check if file is associated with a handler or not */
    var _hasHandler = function (fileName) {
        if (!_handlersFileMapping[fileName]) return false;
        return true;
    };


    /* main entry point
     *
     **/
    if (_hasHandler(_file.path)) {
        /* load the handler */
        var handler = require(_getHandler(_file.path));
        res.writeHead(200, { "Content-Type" : "text/html"});
        res.write('<html>');
        handler.handle(req, res);
        res.write('</html>');
        res.end();
    }
    else {
        /* static file serving */
        _fileExists(_file)
            .then(function () { return _readFile(_file);  }, function (promise) { console.log(promise); _return404(promise); })
            .then(function () { _return200(_file.contentType, _file.data); }, function (promise) { _return404(promise); } );
    }
};

var server = http.createServer( handleEventRequest );
server.listen(8888);
