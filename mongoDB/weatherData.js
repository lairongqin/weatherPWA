var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weatherSchema = new Schema({
    citycode: String,
    city: String,
    date: String,
    result: String,
})

var WeatherData = mongoose.model('weather',weatherSchema);

module.exports = WeatherData;