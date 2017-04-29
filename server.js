var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var https = require('https');
var http = require('http');
var getWeatherFromRestAPI = require('./weatherAPI/getWeatherFromRestAPI.js')

var handlebars = require('express-handlebars');

var app = express();

var privateKey = fs.readFileSync(path.join(__dirname, './certification/server.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certification/server.crt'), 'utf8');
var credentials = { key: privateKey, cert: certificate };

var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);


app.engine('handlebars', handlebars());

app.set('view engine', 'handlebars');

app.set('port', 4000);

app.use(express.static(__dirname + '/public'));

app.use('/*', function (req, res, next) {
    if (req.protocol !== 'https') {
        res.redirect(301, 'https://localhost:4000');
        return;
    }
    function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    }
    next();
})

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/weather/city/:city', function (req, res) {
    let citycode = req.params.city;

    // get the param to the getWeather function
    getWeatherFromRestAPI(citycode, function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(500);
        }
    })
})

httpServer.listen(3000, function () {
    console.log('http server on 3000');
})

httpsServer.listen(app.get('port'), function () {
    console.log('server listen on:' + app.get('port'));
})

mongoose.connect('mongodb://localhost/test');