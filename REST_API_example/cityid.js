var fs = require('fs');
var http = require('http');

var url = 'http://jisutianqi.market.alicloudapi.com/weather/city';
var appcode = 'bb519eb898474860af5c656dcde42459';

var option = {
    host: 'jisutianqi.market.alicloudapi.com',
    path: '/weather/city',
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
        try {
            parsedData = JSON.parse(rawData);
            console.log(parsedData);
        } catch (e) {
            console.error(e.message);
        }
        if (parsedData) {
            fs.writeFile('city2.js', parsedData, (err) => {
                if (err) {
                    throw err
                }
                console.log('the file has been saved');
            })
        }
    })
})

/*
D:\bishe\weatherPWA>node cityid.js
{ status: '0',
  msg: 'ok',
  result:
   [ { cityid: '1', parentid: '0', citycode: '101010100', city: '北京' },
     { cityid: '2', parentid: '0', citycode: '', city: '安徽' },
     { cityid: '3', parentid: '0', citycode: '', city: '福建' },
     { cityid: '4', parentid: '0', citycode: '', city: '甘肃' },
     { cityid: '5', parentid: '0', citycode: '', city: '广东' },
     { cityid: '6', parentid: '0', citycode: '', city: '广西' },
     { cityid: '7', parentid: '0', citycode: '', city: '贵州' },
     { cityid: '8', parentid: '0', citycode: '', city: '海南' },
     { cityid: '9', parentid: '0', citycode: '', city: '河北' },
     { cityid: '10', parentid: '0', citycode: '', city: '河南' },
     { cityid: '11', parentid: '0', citycode: '', city: '黑龙江' },
     { cityid: '12', parentid: '0', citycode: '', city: '湖北' },
     { cityid: '13', parentid: '0', citycode: '', city: '湖南' },
     { cityid: '14', parentid: '0', citycode: '', city: '吉林' },
     { cityid: '15', parentid: '0', citycode: '', city: '江苏' },
     { cityid: '16', parentid: '0', citycode: '', city: '江西' },
     { cityid: '17', parentid: '0', citycode: '', city: '辽宁' },
     { cityid: '18', parentid: '0', citycode: '', city: '内蒙古' },
     { cityid: '19', parentid: '0', citycode: '', city: '宁夏' },
     { cityid: '20', parentid: '0', citycode: '', city: '青海' },
     { cityid: '21', parentid: '0', citycode: '', city: '山东' },
     { cityid: '22', parentid: '0', citycode: '', city: '山西' },
     { cityid: '23', parentid: '0', citycode: '', city: '陕西' },
     { cityid: '24', parentid: '0', citycode: '101020100', city: '上海' },
     { cityid: '25', parentid: '0', citycode: '', city: '四川' },
     { cityid: '26', parentid: '0', citycode: '101030100', city: '天津' },
     { cityid: '27', parentid: '0', citycode: '', city: '西藏' },
     { cityid: '28', parentid: '0', citycode: '', city: '新疆' },
     { cityid: '29', parentid: '0', citycode: '', city: '云南' },
     { cityid: '30', parentid: '0', citycode: '', city: '浙江' },
     { cityid: '31', parentid: '0', citycode: '101040100', city: '重庆' },
     { cityid: '32', parentid: '0', citycode: '101320101', city: '香港' },
     { cityid: '33', parentid: '0', citycode: '101330101', city: '澳门' },
     { cityid: '34', parentid: '0', citycode: '', city: '台湾' },
     { cityid: '35', parentid: '2', citycode: '101220601', city: '安庆' },
     { cityid: '36', parentid: '2', citycode: '101220201', city: '蚌埠' },
*/