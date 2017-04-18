const http = require('http');
const fs = require('fs');
const cityCode = 101110101;
const appcode = 'bb519eb898474860af5c656dcde42459';


function getWeatherFromRestAPI(cityCode) {

    var option = {
        host: "jisutianqi.market.alicloudapi.com",
        path: "/weather/query?citycode=" + cityCode,
        headers: {
            Accept: 'application/json',
            Authorization: 'APPCODE ' + appcode
        }

    }
    var req = http.get(option, (res) => {
        var rawData = '';
        var parsedData;
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk });
        res.on('end', () => {
            try {
                // parsedData = JSON.parse(rawData);
                console.log(rawData);
            } catch (e) {
                console.error(e.message);
            }
            if (rawData) {
                fs.writeFile('weatherExample.js', rawData, (err) => {
                    if (err) {
                        throw err
                    }
                    console.log('the file has been saved');
                })
            }
        })
    })

    console.log(req);
}

getWeatherFromRestAPI(cityCode);