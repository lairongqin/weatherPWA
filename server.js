var express = require('express');
var path = require('path');
var fs = require('fs');
var https = require('https');
var http = require('http');

var handlebars = require('express-handlebars');

var app = express();

var privateKey = fs.readFileSync(path.join(__dirname, './certification/server.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certification/server.crt'), 'utf8');
var credentials = { key: privateKey, cert: certificate };

var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);

handlebars.create({ extname: '.hbs' });

app.engine('handlebars',handlebars);

app.set('view engine', 'handlebars');

app.set('port', 4000);

app.use(express.static(__dirname + '/public'));

app.get('/*', function (req, res) {
    if (req.protocol !== 'https') {
        res.redirect(301, 'https://localhost:4000');
        return;
    }
    res.render('index');
})

httpServer.listen(3000, function () {
    console.log('http server on 3000');
})

httpsServer.listen(app.get('port'), function () {
    console.log('server listen on:' + app.get('port'));
})
