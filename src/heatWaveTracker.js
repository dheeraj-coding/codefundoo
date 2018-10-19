const DB = require('./db');
const constants = require('./constants');
const request = require('request');
module.exports = function () {
    return new HeatMap();
}
function HeatMap() {
    this.db = new DB();
    this.db.connect(constants.uri, 'HeatMap').then(() => console.log("DB Connection Successful:"), () => console.log("DB Connection Failed"));

}
HeatMap.prototype.insert = function (lat, lon) {
    const collection = this.db.db.collection('locations');
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://eu1.locationiq.com/v1/reverse.php?key=' + constants.apiKey + '&lat=' + lat + '&lon=' + lon + '&format=json',
            method: "GET",
            followRedirect: true,
        }, (error, response, body) => {
            if (error) {
                console.log('Error in Reverse Geocoder');
                reject();
            }
            parsed = JSON.parse(body);
            collection.find({ 'postcode': parsed['address']['postcode'] }).toArray((err, docs) => {
                if (docs.length == 0) {
                    collection.insertOne({ 'postcode': parsed['address']['postcode'], 'heatwave': true }, (err, result) => {
                        resolve(result.ops);
                    });
                    return;
                }
                collection.updateOne({ 'postcode': parsed['address']['postcode'] }, { $set: { 'heatwave': true } }).then((result) => {
                    resolve(result);
                });
            });
        });
    });
}

