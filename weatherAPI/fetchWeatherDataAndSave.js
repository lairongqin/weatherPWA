var http = require('http');
var appcode = require('../certification/appcode');
var WeatherData = require('../mongoDB/weatherData');

function fetchWeatherDataAndSave(citycode, cb) {
    console.log('fetchWeatherDataAndSave')
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
                console.log('fetchWeatherDataAndSave: ',parsedData);
                if (parsedData) {

                    // save in DATA base
                    let data = new WeatherData({
                        citycode: String(parsedData.result.citycode),
                        city: String(parsedData.result.city),
                        date: String(parsedData.result.updatetime),
                        result: JSON.stringify(parsedData.result)
                    })

                    data.save(function (err) {
                        if (err) {
                            console.error('fetchData and Saved err: ', err)
                            return;
                        }
                        console.log('data has been saved');
                    });

                    cb(parsedData.result);
                } else {
                    console.error('fetch weather data JSON parsed failed');
                }

            } else {
                console.error('fetchdata http get no data');
            }
        })
    })
}

module.exports = fetchWeatherDataAndSave;
