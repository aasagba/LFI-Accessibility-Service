// modules
var mongojs = require('mongojs');
var dbURL = "mydb";
var db = mongojs(dbURL,['accessibility']);
var pa11y = require('pa11y');
var phantom = require('phantom');

db.on('error', function () {
    console.log('There was an error with the Database');
})

var test = pa11y({
    Log: {
        debug: console.log.bind(console),
        error: console.log.bind(console),
        info: console.log.bind(console)
    }
});

var myDoc;

test.run('http://www.littleforest.co.uk', function (error, results) {
    if (error) {
        return console.error(error.message);
    }

    myDoc = results;

    db.accessibility.insert(myDoc, function (err, result) {
        console.log("Insert into Database");
        console.log(myDoc);
    })
});