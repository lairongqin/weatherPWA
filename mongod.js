var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WeatherData = require('./mongoDB/weatherData.js');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', (err) => {
    console.error('connection error: ', err);
})

db.once('open', () => {
    console.log('connect db successfully');
})

var weatherSchema = new Schema({
    citycode: String,
    city: String,
    date: String,
    result: String,
})

var WeatherData = mongoose.model('weather', weatherSchema);

var tempData = '{"status":"0","msg":"ok","result":{"city":"西安","cityid":"310","citycode":"101110101","date":"2017-04-18","week":"星期二","weather":"晴","temp":"22","temphigh":"29","templow":"13","img":"0","humidity":"41","pressure":"1004","windspeed":"11.0","winddirect":"西南风","windpower":"1级","updatetime":"2017-04-18 21:25:02","index":[{"iname":"空调指数","ivalue":"较少开启","detail":"您将感到很舒适，一般不需要开启空调。"},{"iname":"运动指数","ivalue":"较不宜","detail":"天气较好，无雨水困扰，但考虑气温很高，请注意适当减少运动时间并降低运动强度，运动后及时补充水分。"},{"iname":"紫外线指数","ivalue":"强","detail":"紫外线辐射强，建议涂擦SPF20左右、PA++的防晒护肤品。避免在10点至14点暴露于日光下。"},{"iname":"感冒指数","ivalue":"较易发","detail":"昼夜温差较大，较易发生感冒，请适当增减衣服。体质较弱的朋友请注意防护。"},{"iname":"洗车指数","ivalue":"较适宜","detail":"较适宜洗车，未来一天无雨，风力较小，擦洗一新的汽车至少能保持一天。"},{"iname":"空气污染扩散指数","index":"中","detail":"气象条件对空气污染物稀释、扩散和清除无明显影响，易感人群应适当减少室外活动时间。"},{"iname":"穿衣指数","ivalue":"热","detail":"天气热，建议着短裙、短裤、短薄外套、T恤等夏季服装。"}],"aqi":{"so2":"12","so224":"14","no2":"72","no224":"53","co":"1.350","co24":"1.150","o3":"43","o38":"98","o324":"109","pm10":"414","pm1024":"401","pm2_5":"118","pm2_524":"94","iso2":"5","ino2":"36","ico":"14","io3":"14","io38":"51","ipm10":"291","ipm2_5":"154","aqi":"291","primarypollutant":"PM10","quality":"重度污染","timepoint":"2017-04-18 21:00:00","aqiinfo":{"level":"五级","color":"#800080","affect":"心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状","measure":"儿童、老年人及心脏病、肺病患者应停留在室内，停止户外运动，一般人群减少户外运动"}},"daily":[{"date":"2017-04-18","week":"星期二","sunrise":"06:10","sunset":"19:19","night":{"weather":"多云","templow":"13","img":"1","winddirect":"东北风","windpower":"微风"},"day":{"weather":"晴","temphigh":"29","img":"0","winddirect":"东北风","windpower":"微风"}},{"date":"2017-04-19","week":"星期三","sunrise":"06:09","sunset":"19:20","night":{"weather":"阴","templow":"10","img":"2","winddirect":"东北风","windpower":"微风"},"day":{"weather":"阴","temphigh":"25","img":"2","winddirect":"东北风","windpower":"微风"}},{"date":"2017-04-20","week":"星期四","sunrise":"06:08","sunset":"19:21","night":{"weather":"多云","templow":"10","img":"1","winddirect":"东北风","windpower":"微风"},"day":{"weather":"阴","temphigh":"22","img":"2","winddirect":"东北风","windpower":"微风"}},{"date":"2017-04-21","week":"星期五","sunrise":"06:07","sunset":"19:21","night":{"weather":"多云","templow":"7","img":"1","winddirect":"东北风","windpower":"微风"},"day":{"weather":"多云","temphigh":"18","img":"1","winddirect":"东北风","windpower":"微风"}},{"date":"2017-04-22","week":"星期六","sunrise":"06:05","sunset":"19:22","night":{"weather":"晴","templow":"11","img":"0","winddirect":"东北风","windpower":"微风"},"day":{"weather":"晴","temphigh":"26","img":"0","winddirect":"东北风","windpower":"微风"}},{"date":"2017-04-23","week":"星期日","sunrise":"07:30","sunset":"19:30","night":{"weather":"晴","templow":"12","img":"0","winddirect":"西南风","windpower":"微风"},"day":{"weather":"晴","temphigh":"28","img":"0","winddirect":"西南风","windpower":"微风"}},{"date":"2017-04-24","week":"星期一","sunrise":"07:30","sunset":"19:30","night":{"weather":"多云","templow":"13","img":"1","winddirect":"","windpower":"微风"},"day":{"weather":"多云","temphigh":"26","img":"1","winddirect":"","windpower":"微风"}}],"hourly":[{"time":"22:00","weather":"晴","temp":"20","img":"0"},{"time":"23:00","weather":"晴","temp":"19","img":"0"},{"time":"0:00","weather":"晴","temp":"17","img":"0"},{"time":"1:00","weather":"晴","temp":"16","img":"0"},{"time":"2:00","weather":"晴","temp":"14","img":"0"},{"time":"3:00","weather":"晴","temp":"14","img":"0"},{"time":"4:00","weather":"晴","temp":"13","img":"0"},{"time":"5:00","weather":"晴","temp":"13","img":"0"},{"time":"6:00","weather":"晴","temp":"14","img":"0"},{"time":"7:00","weather":"多云","temp":"16","img":"1"},{"time":"8:00","weather":"多云","temp":"17","img":"1"},{"time":"9:00","weather":"多云","temp":"18","img":"1"},{"time":"10:00","weather":"阴","temp":"18","img":"2"},{"time":"11:00","weather":"阴","temp":"18","img":"2"},{"time":"12:00","weather":"阴","temp":"17","img":"2"},{"time":"13:00","weather":"阴","temp":"17","img":"2"},{"time":"14:00","weather":"阴","temp":"16","img":"2"},{"time":"15:00","weather":"多云","temp":"16","img":"1"},{"time":"16:00","weather":"多云","temp":"16","img":"1"},{"time":"17:00","weather":"多云","temp":"17","img":"1"},{"time":"18:00","weather":"多云","temp":"16","img":"1"},{"time":"19:00","weather":"多云","temp":"15","img":"1"},{"time":"20:00","weather":"晴","temp":"14","img":"0"},{"time":"21:00","weather":"晴","temp":"13","img":"0"}]}}';

tempData = JSON.parse(tempData);

var data = new WeatherData({
    citycode: String(tempData.result.citycode),
    // city: String(tempData.result.city),
    city: '1',
    date: String(tempData.result.updatetime),
    result: JSON.stringify(tempData.result)
})


// data.save(function (err) {
//     if (err) {
//         console.err(err);
//         return;
//     }
//     console.log('data has been saved');
// })

var b = WeatherData.find({citycode:'101110101'}).;
console.log(b);

// mongoDB 数据样例
// JSON返回的对象示例
/*
var json = {
    msg: "ok",
    result: {
        aqi: {
            aqi: "291",
            aqiinfo: {
                affect: "心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状",
                level: "五级",
                measure: "儿童、老年人及心脏病、肺病患者应停留在室内，停止户外运动，一般人群减少户外运动"
            },
            quality: "重度污染",
            timepoint: "2017-04-18 21:00:00"
        },
        city: "西安",
        citycode: "101110101",
        cityid: "310",
        daily: [{
            date: "2017-04-18",
            day: {
                img: "0",
                temphigh: "29",
                weather: "晴",
                winddirect: "东北风",
                windpower: "微风",
            },
            night: {
                img: "1",
                templow: "13",
                weather: "多云",
                winddirect: "东北风",
                windpower: "微风"
            },
            sunrise: "06:10",
            sunset: "19:19",
            week: "星期二",
        }, {
            date: "2017-04-19",
        }],
        date: "2017-04-18",
        hourly: [{
            img: "0",
            temp: "20",
            time: "22:00",
            weather: "晴"
        }, {
            img: "0",
            temp: "19",
            time: "23:00",
            weather: "晴"
        }],
        humidity: "41",
        img: 0,
        index: [{
            detail: "您将感觉很舒适，一般不需要开空调。",
            iname: "空调指数",
            ivalue: "较少开启"
        }, {
            detail: "",
            iname: "运动指数",
            ivalue: ""
        }, {
            detail: "",
            iname: "紫外线指数",
            ivalue: "",
        }, {
            detail: "",
            iname: "感冒指数",
            ivalue: "",
        }, {
            detail: "",
            iname: "洗车指数",
            ivalue: "",
        }, {
            detail: "",
            iname: "空气污染扩散指数",
            ivalue: "",
        }, {
            detail: "",
            iname: "穿衣指数",
            ivalue: "",
        }],
        pressure: "1004",
        temp: "22",
        temphigh: "29",
        templow: "13",
        updatetime: "2017-04-18 21:25:02",
        weather: "晴",
        week: "星期二",
        winddirect: "西南风",
        windpower: "1级",
        windspeed: "11.0"
    },
    status: "0"
}
*/