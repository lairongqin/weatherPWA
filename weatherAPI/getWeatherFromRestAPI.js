var weatherData = require('../mongoDB/weatherData.js')

// var weatherSchema = new Schema({
//     citycode: String,
//     city: String,
//     date: String,
//     result: String,
// })

function getWeatherFromRestAPI(citycode, callback) {
    if (typeof citycode == "number") {
        citycode = String(citycode);
    }
    // search the citycode on date
    weatherData.findOne({ citycode: citycode }, function (err, docs) {
        if (err) {
            console.log(err)
        }

        // if there is one result in DateBase
        if (docs) {
            var now = Date.now();
            var lastUpdateTime = Date.parse(docs.date);

            // if the time is larger than 1 houre , update the data;
            if ((now - lastUpdateTime) > 3600000) {

                // update data
                updateWeatherDataAndSave(citycode, function (refreshData) {

                    // call back
                    callback(refreshData);
                })
            } else {

                // the data can be used , just call back
                callback(JSON.parse(docs.result));
            }
        } else {

            // no data in DB , get new Data
            fetchWeatherDataAndSave(citycode, function (newData) {

                // run callback function with data 
                callback(JSON.parse(newData.result));
            })
        }

    })

}


module.exports = getWeatherFromRestAPI;