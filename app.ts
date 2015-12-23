/// <reference path="./typings/tsd.d.ts"/>

"use strict"; 
import express = require('express');
import http = require('http');
import path = require('path');
import favicon = require('serve-favicon');
import morgan = require('morgan');
import bodyparser = require('body-parser');
import errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
//app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.get('/', function (req, res) {
    res.sendfile(path.join(__dirname + '/public/app/index.html'));
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
