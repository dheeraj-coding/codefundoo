const admin = require("firebase-admin");
const serviceAccount = require("../serviceAcountKey.json");
const constants = require('./constants');
const DB = require('./db');

module.exports = function () {
    return new PushNotifier();
}

function PushNotifier() {
    this.db = new DB();
    this.db.connect(constants.uri, 'HeatMap').then(() => console.log('Push Notify DB connection successful'), () => console.log("DB connection unsuccessful"));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://codefundo-1540582424753.firebaseio.com",
        projectId: 'codefundo-1540582424753'
    });
    this.admin = admin;
}

PushNotifier.prototype.notify = function (regtoken) {
    var message = {
        data: {
            'heatwave': 'A Heatwave has been detected in your surrounding, please stay indoors and always remember to stay in a cool place',
        },
        token: regtoken,
    };
    this.admin.messaging().send(message).then((response) => {
        console.log('Message Sent succefully:' + response);
    }, (err) => {
        console.log("Message Failed:" + err);
    });
}

PushNotifier.prototype.alertLocality = function (postalcode) {
    const collection = this.db.db.collection('users');
    return new Promise((resolve, reject) => {
        collection.find({ 'postcode': postalcode }).toArray().then((results) => {
            results.forEach((elemt) => {
                this.notify(elemt['regtoken']);
            })
        });
    });
}

PushNotifier.prototype.notificationServiceWorker = function () {
    const collection = this.db.db.collection('locations');
    collection.find().toArray().then((results) => {
        results.forEach((element) => {
            if (element['affected_user'].length >= constants.minUserThreshold) {
                this.alertLocality(element['postcode']);
            }
        })
    });
}
