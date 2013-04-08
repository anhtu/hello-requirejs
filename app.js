/**
 * User: anhtu
 * Date: 4/6/13
 * Time: 8:44 AM
 */

/**
 *
 * app.js is the main entry for Express application
 * it contains:
 *
 * - config of express
 *
 */

/*=== MODULE IMPORT ===*/
var http    = require('http')
  , express = require('express')
  , fs      = require('fs')
  , request = require('request')
  , app = express();


/*=== SETTING ===*/

/* set directory to look for views */
app.set("views", __dirname + "/views");

/* set rendering engine */
//app.set("view engine", "jade");

/*=== MIDDLEWARE ===*/

/* 1 - logging */
app.use(function (req, res, next) {
    console.log(" a request arrives on " + req.url);
    next();
});

/* 2 - print out the header */
app.use(function (req, res, next) {
    console.log("====== header ======= \n" + JSON.stringify(req.headers));
    next();
});

var COUCHDB_HOST = "http://localhost:5984/",
    DB_NAME      = "tweets";

/* serving a static file */
app.get("/:fileName", function (req, res) {
    var _fileName = req.params.fileName;
    console.log("a request arrives on : " + _fileName);
    res.sendfile(__dirname + "/" + _fileName);
});

// simple post using cUrl:
// curl -X POST http://localhost:8888 --header "Content-Type:text/xml"
// upload file using POST :
// curl -F filedata=@2012-06-10-49.zip http://localhost:8888

/* doing the progress bar indication */
app.post("/", function (req, res) {

    var _totalLength = req.headers["content-length"],
        _length      = 0,
        newFile      = fs.createWriteStream("file");

    req.pipe(newFile);

    req.on('data', function (chunk) {
        _length += chunk.length;
        console.log("length : " + _length);

        var _percentage = (_length / _totalLength ) * 100;
        res.write("progress: " + parseInt(_percentage, 10) + "%\n");
    });

    req.on('end', function () {
        res.end("uploaded ok!!!!");
    });
});

app.get("/tweets/:username", function (req, res) {
    console.log("a request for tweets");
    var _username = req.params.username,
        tweets;

    request.get(COUCHDB_HOST + DB_NAME + "/" + _username, function (err, response, body) {

        console.log("getting content from couchdb");
        var _tweets = JSON.parse(body).tweets;
        if (_tweets) {
            console.log("ok");
            res.render('tweets.ejs', { tweets : JSON.parse(_tweets), name : _username });
        }

    });

    var _options = {
        url      : "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + _username,
        method   : "GET"
    };

    /* request the content from the url
     *   whenever the content is available, execute the callback
     *     pass in err, response stream object and body of the response
     * */
    request(_options.url, function (err, response, body) {
        var tweets = JSON.parse(body);

        console.log("request content from twitter");
        request({
                method    : "PUT",
                uri       : COUCHDB_HOST + DB_NAME + "/" + _username,
                multipart : [ { 'content-type' : 'application/json',
                    body : JSON.stringify({ "tweets" : body })
                } ]
            },

            function (err, response, body) {
                console.log(body);
            }
        );

        res.render('tweets.ejs', { tweets : tweets, name : _username });
        res.end();
    });

});

app.listen(8888);

/* our custom modules */
require("./custom_module.js").listening();
