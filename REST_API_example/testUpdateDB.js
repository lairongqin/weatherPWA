var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var update = require('../weatherAPI/updateWeatherDataAndSave.js')

update('101110101', function (data) {
    console.log(data);
})
