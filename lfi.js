// modules
var mongojs = require('mongojs');
var dbURL = "mydb";
var db = mongojs(dbURL);
var clientDocs = {};

module.exports = getClientData;

db.on('error', function () {
    console.log('There was an error with the Database');
})

function getClientData() {

    console.log("In getClientData()");
    var collectionName = "";
    var collection = db.collection(collectionName);

    collection.find(function (err, docs) {
        if(err){
            throw err;
        } else{
            console.log(JSON.stringify(docs));
            clientDocs = docs;

        }
    });

    return clientDocs;
}

