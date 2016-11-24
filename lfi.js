// modules
var mongojs = require('mongojs');
//var dbURL = "188.166.146.12/mydb";
var dbURL = "localhost/mydb";
var db = mongojs(dbURL);

db.on('error', function () {
    console.log('There was an error with the Database');
})


getClientData = function (id, done) {
    var clientDocs = [];
    //var crawlid = parseInt(id);
    var crawlid = id;
    console.log("Getting client data for crawlid: " + crawlid);

    var collectionName = "PageHtml_" + crawlid;
    var collection = db.collection(collectionName);
    console.log("PageHtml_" + crawlid);

    // if id contains _ the strip
    if(crawlid.indexOf('_') != -1) {
        crawlid = parseInt(crawlid.substring(0, crawlid.indexOf('_')));
        console.log("crawlid after substring: " + crawlid);
    }

    crawlid = parseInt(id);

    collection.find({"crawlId":crawlid}, {"siteId":1,"pageUrl":1, "title":1}).toArray(
        function (err, docs) {

            if (err) {
                console.trace("There was a problem whilst getting data from the DB.");
                console.error(err.stack);
                console.log(err);
                return done(null);
            }

           // console.log(JSON.stringify(docs));
            return done(docs);
        }
    );

}