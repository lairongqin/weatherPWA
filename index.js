var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/work'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/work/index.html');
})

app.listen(app.get('port'), function () {
    console.log('server listen at :' + app.get('port'));
})
