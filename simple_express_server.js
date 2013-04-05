/**
 * Author: tuna
 * Date: 4/5/13
 * Time: 9:25 AM
 */
var http    = require('http'),
    express = require('express'),
    fs      = require('fs'),
    request = require('request'),
    redis   = require('redis');

var app = express();
var redisClient = redis.createClient();

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
    var _username = req.params.username;

    var _options = {
        url      : "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + _username,
        method   : "GET"
    };

    /* request from our redis database first - username as the key */
    redisClient.lrange(_username, 0, -1, function (err, reply) {
        var tweets = reply;

        if (tweets.length == 0) {
            console.log("no index");

            /* request the content from the url
             *   whenever the content is available, execute the callback
             *     pass in err, response stream object and body of the response
             * */
            request(_options.url, function (err, response, body) {
                tweets = JSON.parse(body);

                /* pushing onto redis */
                tweets.forEach(function (tweet) {
                    redisClient.lpush(_username, tweet);
                });

                res.render('tweets.ejs', { tweets : tweets, name : _username });
            });
        }
        else {
            console.log("content available");

            res.render('tweets.ejs', { tweets : tweets, name : _username });
        }
    });

});

app.listen(8888);

/* our custom modules */
require("./custom_module.js").listening();
