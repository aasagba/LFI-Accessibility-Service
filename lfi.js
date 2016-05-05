// modules
var mongojs = require('mongojs');
var dbURL = "mydb";
var db = mongojs(dbURL);

db.on('error', function () {
    console.log('There was an error with the Database');
})


getClientData = function (id, callback) {
    var clientDocs = [];
    var crawlid = parseInt(id);
    console.log("Getting client data for crawlid: " + crawlid);

    var collectionName = "PageHtml_" + crawlid;
    var collection = db.collection(collectionName);
    console.log("PageHtml_" + crawlid);

    collection.find({"crawlId":crawlid}, {"pageUrl":1, "title":1}).toArray(
        function (err, docs) {

            if (err) {
                console.trace("There was a problem whilst getting data from the DB.");
                console.error(error.stack);
                return;
            }

            console.log(JSON.stringify(docs));
            callback(docs);
        }
    );

}