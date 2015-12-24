"use strict";
var express = require('express');
var http = require('http');
var path = require('path');
var morgan = require('morgan');
var bodyparser = require('body-parser');
var errorHandler = require('errorhandler');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(app.router);
var stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
if ('development' == app.get('env')) {
    app.use(errorHandler());
}
app.get('/', function (req, res) {
    res.sendfile(path.join(__dirname + '/public/app/index.html'));
});
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//# sourceMappingURL=app.js.map
