var weatherData = require('../mongoDB/weatherData.js')

// var weatherSchema = new Schema({
//     citycode: String,
//     city: String,
//     date: String,
//     result: String,
// })

function getWeatherFromRestAPI(city, callback) {
    // search the city on date
    console.log()
    weatherData.findOne({ citycode: city }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        callback(JSON.parse(docs.result));
    })

}


module.exports = getWeatherFromRestAPI;