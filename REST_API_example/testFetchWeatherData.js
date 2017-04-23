var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var fetch = require('../weatherAPI/fetchWeatherDataAndSave');

fetch('101190101', function (db) {
    console.log(db)
})