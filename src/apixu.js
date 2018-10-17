const request = require('request');
exports.getForecastData = function (lat, long, callback) {
    var location = lat + "," + long;
    const requestUri = "http://api.apixu.com/v1/forecast.json?key=a587248a962148a184b125410181610&q=" + location + "&days=5";
    var parsed = {};
    request({
        uri: requestUri,
        method: "GET",
        followRedirect: true,
    }, function (error, response, body) {
        parsed = JSON.parse(body);
        forecastday = parsed.forecast.forecastday;
        data = {data:[]};
        for(let i =0;i<forecastday.length;i++){
            data.data.push({'max_temp':forecastday[i]['day']['maxtemp_c'],'min_temp':forecastday[i]['day']['mintemp_c']})
        }
        callback(data);
    });
}