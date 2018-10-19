const MongoClient = require('mongodb').MongoClient;

module.exports =function(){
    return new DB();
};
function DB() {
    this.db = null;
    this.client = null;
}
DB.prototype.connect = function (uri, dbName) {
    return new Promise((resolve, reject) => {
        if (this.db) {
            resolve();
        } else {
            this.client = new MongoClient(uri);
            this.client.connect((err) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve();
                this.db = this.client.db(dbName);
            });
        }
    });
}
DB.prototype.close = function () {
    if (this.db) {
        this.db.close().then(() => { }, function (err) {
            console.log("Failed to close db instance");
        })
    }
}