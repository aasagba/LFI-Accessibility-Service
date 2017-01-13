/*
 My client for pa11y-webservice
*/

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
var Pool = require('phantomjs-pool').Pool;


app.get('/client/:site/:crawlid', function (req, res) {

    var site = req.params.site;
    var crawlid = req.params.crawlid;
    var existingTasks = [];

    // get LFI client html
    getClientData(crawlid, function (response) {

        var collectionName = "tasks";
        var collection = db.collection(collectionName);
        var CONCURRENCY = 1;

        if (response !== null && response.length > 0) {

            var queue = async.queue(function(task, done) {

                processTasks(task, function (error, results) {
                    if (error) {
                        console.log("Error in processTasks!");
                    } else {
                        console.log("Processing task: " + task.title + ', result: ', results);
                    }
                    done();
                });
            }, CONCURRENCY);

            var existingTaskQueue = async.queue(function (task, done) {
                ProcessExistingTasks(task, function (err, res) {
                    if (err) {
                        console.log("Error in ProcessExistingTasks!");
                    }
                    if(res) {
                        console.log('Existing task ', res);
                    }
                    done();
                });
            }, CONCURRENCY);

            var i = 0, length = response.length;  
            for (;i < length; i++) { 
                queue.push(response[i], (function (error) { 
                    /*if (response[i] != undefined) {
                        console.log("Finished Processing " + response[i].pageUrl);
                    }*/
                })());
             }

            queue.drain = function () {
                console.log("\nAll New tasks have been processed, processing exiting Tasks...\n");
                length2 = existingTasks.length;

                for (j=0; j < length2; j++) {
                    existingTaskQueue.push(existingTasks[j], (function (error) {
                            //console.log("Finished Processing task " + j + ": " + existingTasks[j].pageUrl);
                    })());
                };
            }

            existingTaskQueue.drain = function () {
                console.log("All exisitng tasks have been run");
            }

            /*
             ProcessExistingTasks(task, done)

            This function loops the array of tasks from the LFI crawler collection which already exist in
            the task collection. For each one gets the corresponding task from the task collection and checks
            if it has results, if not re-runs the task.
             */
            function ProcessExistingTasks(task, done) {

                collection.find({"client":task.siteId.toString(),"url": task.pageUrl}).toArray(

                    function (err, docs) {

                        if (err) {
                            return done("Error in find existing task\n" + err);
                        } else {

                            if (docs.length >= 1) {
                                client.task(docs[0]._id).results({}, function (err, results) {

                                    if (err) {
                                        return done("Error in task.results for " + task._id + "\n" + err);
                                    } else {
                                        if (results.length < 1) {

                                            console.log("**** Running task " + docs[0].name + " as no results exist. ****");

                                            client.task(docs[0]._id).run(function (err) {

                                                if (err) {
                                                    return done("error in task.run\n" + err);

                                                } else {
                                                    return done(null, docs[0].url + ' successfully ran.');
                                                }
                                            });
                                        } else {
                                            return done(null, docs[0].url + ' has already been run');
                                        }
                                    }
                                });
                            } else {
                                //console.log("Task does not exist");
                                return done(null, ' Task does not exist');
                            }
                        }
                    }
                );
                return;
            }

            function processTasks (task, done) {

                // see if url exists
                collection.find({"client":task.siteId.toString(),"url": task.pageUrl}).count(function (e, exist) {

                    if(exist === 0) {
                        console.log("creating new task: " + task.pageUrl);

                        // create task
                        client.tasks.create({
                            name: task.title || task.pageUrl,
                            url: task.pageUrl,
                            client: site,
                            standard: "WCAG2AA",
                            ignore: [],
                            timeout: "1200000",
                            username: "",
                            password: ""
                        }, function (err, task) {

                            if (err) {
                                return done("error in task.create: \n" + err);

                            } else {
                                console.log("task created: " + task.name);

                                // run task
                                client.task(task.id).run(function (err) {

                                    if (err) {
                                        return done("error in task.run\n" + err);

                                    } else {
                                        return done(null, task.url + ' successfully ran');
                                    }
                                });
                            }
                        })
                    } else {
                        existingTasks.push(task);
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
    console.log("Process Error: \n" + err);
});

app.listen(process.env.PORT || 5000);
console.log('LFI Accessibility Service running on port 5000');
exports = module.exports = app;