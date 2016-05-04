// My client for pa11y-webservice

var createClient = require('pa11y-webservice-client-node');
var lfi = require('./lfi');
var client = createClient('http://localhost:3000/');
var clientDocs = [];
var mongojs = require('mongojs');
var dbURL = "pa11y-webservice-dev";
var db = mongojs(dbURL);
express = require('express');
app = express();

/*client.tasks.get({}, function (err, tasks) {
    console.log(JSON.stringify(tasks));
})*/

app.get('/', function (req, res) {
    res.send('Hello World!');
});



app.get('/client/:site/:crawlid', function (req, res) {

    var site = req.params.site;
    var crawlid = req.params.crawlid;


    // get LFI client html
    getClientData2(crawlid, function (response) {

        createTasks(response, site,
            function (callback) {
                return;
            }
        );

    });

    // loop through tasks and post each one to dashboard db
    createTasks = function (docs, site, callback) {
        console.log("creating tasks..");

        var collectionName = "tasks";
        var collection = db.collection(collectionName);

        docs.forEach( function (task) {

            var getCount = function (task, cb) {
                collection.find({"url": task.pageUrl}).count(function (e, count) {
                    return cb(e, count);
                });
            };

            getCount(task, function (err, exist) {

                if(!exist) {
                    console.log("creating new task: " + task.pageUrl);
                    /*
                     client.tasks.create({
                     name: task.title,
                     url: task.pageUrl,
                     client: site,
                     standard: "WCAG2AA",
                     ignore: [],
                     timeout: "",
                     username: "",
                     password: ""
                     }, function (err, task) {
                     if (err) {
                     return console.error(err.message);
                     } else {
                     console.log("task created: " + task.name);

                     // run task
                     client.task(task.id).run(function (err, task) {
                     if (err) {

                     return console.error(err.message);
                     //callback(err.message);
                     } else {

                     return;
                     }
                     });
                     }
                     })
                     */
                } else {
                    console.log("Task " + task.pageUrl + " already exists");

                }

            });

        });

        callback("All tasks successfully created");

    }

    res.send("Request made to add tasks for " + site);
});



app.listen(process.env.PORT || 8000);
console.log('Accessibility on port 8000');
exports = module.exports = app;

/*
 client.tasks.create({
 name: task.name,
 url: task.url,
 client: task.client,
 standard: task.standard,
 ignore: task.ignore,
 timeout: task.timeout,
 username: task.username,
 password: task.password
 }, function (err, task) {
 if (err) {
 return console.error(err.message);
 } else {
 console.log("task created: " + task.name);

 // run task
 client.task(task.id).run(function (err, task) {
 if (err) {

 return console.error(err.message);
 //callback(err.message);
 } else {

 return;
 }
 });
 }
 })
 */