// My client for pa11y-webservice

var createClient = require('pa11y-webservice-client-node');
var lfi = require('./lfi');
var client = createClient('http://localhost:3000/');
var clientDocs = [];
var mongojs = require('mongojs');
//var dbURL = "pa11y-webservice-dev";
var dbURL = "188.166.146.12/pa11y-webservice";
var db = mongojs(dbURL);
var async = require('async');
express = require('express');
app = express();


app.get('/client/:site/:crawlid', function (req, res) {

    var site = req.params.site;
    var crawlid = req.params.crawlid;


    // get LFI client html
    getClientData(crawlid, function (response) {

        var collectionName = "tasks";
        var collection = db.collection(collectionName);

        // loop tasks
        if (response !== null && response.length > 0) {

            //async.mapLimit(response, 1, processTasks, function (error, results) {
            async.map(response, processTasks, function (error, results) {
                if (error) {
                    console.log("error!");
                } else {

                    console.log('results: %j', results);
                }
            });

            function processTasks (task, done) {

                // see if url exists
                collection.find({"url": task.pageUrl}).count(function (e, exist) {

                    if(!exist) {
                        console.log("creating new task: " + task.pageUrl);

                        // create task
                        client.tasks.create({
                            name: task.title,
                            url: task.pageUrl,
                            client: site,
                            standard: "WCAG2AA",
                            ignore: [],
                            timeout: "1200000",
                            username: "",
                            password: ""
                        }, function (err, task) {

                            if (err) {
                                //console.log("error in task.create: " + task.id);
                                return done(err);

                            } else {
                                console.log("task created: " + task.name);

                                // run task
                                client.task(task.id).run(function (err) {

                                    if (err) {
                                        //console.log("error in task.run");
                                        return done(err);

                                    } else {
                                        //console.log("task successfully run");
                                        return done(null, task.url + ' ran');
                                    }

                                });
                            }

                        })

                    } else {
                        //console.log("Task " + task.pageUrl + " already exists");
                        return done(null, task.pageUrl + ' already exists');
                    }

                });

            }

        } else console.log("There was a problem retrieving data from the PageHtml collection");
    });
    res.send("Request made to add tasks for site id: " + site);
});

process.on('error', function(err)
{
    console.log("process.on error: " + err);
});

app.listen(process.env.PORT || 5000);
console.log('LFI Accessibility Service on port 5000');
exports = module.exports = app;