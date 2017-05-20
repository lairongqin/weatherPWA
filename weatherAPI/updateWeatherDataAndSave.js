var http = require('http');
var weatherData = require('../mongoDB/weatherData');
var appcode = require('../certification/appcode');

function updateWeatherDataAndSave(citycode, cb) {

    // query from API
    var option = {
        host: "jisutqybmf.market.alicloudapi.com",
        path: "/weather/query?citycode=" + citycode,
        headers: {
            Accept: 'application/json',
            Authorization: 'APPCODE ' + appcode
        }
    }

    http.get(option, (res) => {
        var rawData = '';
        var parsedData;
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk });
        res.on('end', () => {

            if (rawData) {
                let parsedData = JSON.parse(rawData);
                if (parsedData) {
                    let updateOption = {
                        date: String(parsedData.result.updatetime),
                        result: JSON.stringify(parsedData.result)
                    }

                    // save in DATA base
                    weatherData.update({ citycode: citycode }, updateOption, function (err) {
                        if (err) {
                            console.error('update data fail', err);
                        }
                    });

                    cb(parsedData.result);
                } else {
                    console.error('JSON parsed failed');
                }

            } else {
                console.error('updateWeatherData http get no data');
            }
        })
    })
}

module.exports = updateWeatherDataAndSave;

// var weatherSchema = new Schema({
//     citycode: String,
//     city: String,
//     date: String,
//     result: String,
// })
