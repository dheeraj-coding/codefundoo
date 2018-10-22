const request = require('request');
const constants = require('./constants');
const moment = require('moment');
const DB = require('./db');
const fs = require('fs');
function WeatherFetch(config) {
    this.db = new DB();
    this.db.connect(constants.uri, 'HeatMap').then(() => console.log("APIXU DB Connection Successful:"), () => console.log("DB Connection Failed"));
    this.config = config;
    this.data = { forecast: [], prior: [] };
    this.forecastFlag = false;
    this.priorFlag = false;
}

WeatherFetch.prototype.getForecastData = function (lat, long, callback, ) {
    const location = lat + "," + long;
    const requestUri = "http://api.apixu.com/v1/forecast.json?key=a587248a962148a184b125410181610&q=" + location + "&days=5";
    var parsed = {};
    request({
        uri: requestUri,
        method: "GET",
        followRedirect: true,
    }, (error, response, body) => {
        if (error) {
            console.log('Error in api');
        }
        parsed = JSON.parse(body);
        var forecastday = parsed.forecast.forecastday;

        for (var i = 0; i < forecastday.length; i++) {
            this.data.forecast.push({ 'max_temp': forecastday[i]['day']['maxtemp_c'], 'min_temp': forecastday[i]['day']['mintemp_c'] });
        }
        // callback(data);
        this.forecastFlag = true;
        if (this.forecastFlag && this.priorFlag) {
            callback(this.data);
        }
    });
}

WeatherFetch.prototype.getPriorData = function (lat, long, postcode, callback) {
    const location = lat + "," + long;
    const requestUri = "http://api.apixu.com/v1/history.json?key=a587248a962148a184b125410181610&q=" + location + "&dt=";
    var counter = 0;
    var priorNumDays = 8;
    const collection = this.db.db.collection('weather');
    for (var i = 0; i < priorNumDays; i++) {
        request({
            uri: requestUri + moment().subtract(i, 'days').format('YYYY-MM-DD'),
            method: "GET",
            followRedirect: true,
        }, (error, response, body) => {
            if (error) {
                console.log('Error in api');
            }
            var parsed = JSON.parse(body);
            var forecastday = parsed.forecast.forecastday;
            collection.updateOne({ 'postcode': postcode }, { $addToSet: { 'weather': Object.assign(forecastday[0]['day'], { 'date': forecastday[0]['date'] }) } }, { upsert: true, safe: false }).then((result) => {
                console.log("Add to DB");
            }, (err) => {
                console.log("Couldn't Add to DB:" + err);
            });
            this.data.prior.push({ 'max_temp': forecastday[0]['day']['maxtemp_c'], 'min_temp': forecastday[0]['day']['mintemp_c'] });
            counter = counter + 1;
            if (counter == priorNumDays) {
                this.priorFlag = true;
            }
            if (this.forecastFlag && this.priorFlag) {
                callback(this.data);
            }
        });
    }
}

function weather(config) {
    return new WeatherFetch(config);
}

module.exports = weather;