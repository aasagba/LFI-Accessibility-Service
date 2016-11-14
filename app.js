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


app.get('/client/:site/:crawlid', function (req, res) {

    var site = req.params.site;
    var crawlid = req.params.crawlid;
    var existingTasks = [];

    // get LFI client html
    getClientData(crawlid, function (response) {

        var collectionName = "tasks";
        var collection = db.collection(collectionName);


        // loop tasks
        if (response !== null && response.length > 0) {

            async.mapLimit(response, 1, processTasks, function (error, results) {
            //async.map(response, processTasks, function (error, results) {
                if (error) {
                    console.log("Error in processTasks!");
                } else {
                    console.log("\nProcessing tasks...\n");
                    console.log('results: ', results);
                    console.log("\nProcessing existing Tasks..\n");
                    //console.log("Existing count: " + existingTasks.length);

                    async.map(existingTasks, ProcessExistingTasks, function (err, res) {
                        if (err) {
                            console.log("Error in ProcessExistingTasks!");
                        }
                        if(res) {
                            console.log('Existing task results: ', res);
                            console.log("\nProcessing existing tasks complete.");
                        }
                    });
                }
            });

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
                            //console.log("Error");
                            return done("Error in find existing task\n" + err);
                        } else {

                            if (docs.length >= 1) {

                                //console.log(docs[0].name + ": " + JSON.stringify(docs));
                                client.task(docs[0]._id).results({}, function (err, results) {

                                    if (err) {
                                        //console.log("Error in task.results for " + task._id);
                                        //console.log(err);
                                        return done("Error in task.results for " + task._id + "\n" + err);
                                    } else {
                                        if (results.length < 1) {

                                            console.log("**** Running task " + docs[0].name + " as no results exist. ****");

                                            client.task(docs[0]._id).run(function (err) {

                                                if (err) {
                                                    //console.log("error in task.run");
                                                    return done("error in task.run\n" + err);

                                                } else {
                                                    //console.log(docs[0].url + " successfully ran.");
                                                    return done(null, docs[0].url + ' successfully ran.');
                                                }
                                            });
                                        } else {
                                            //console.log(docs[0].url + " has already been run");
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

                    if(exist == 0) {
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
                                //console.log("error in task.create: \n" + err);
                                return done("error in task.create: \n" + err);

                            } else {
                                console.log("task created: " + task.name);

                                // run task
                                client.task(task.id).run(function (err) {

                                    if (err) {
                                        //console.log("error in task.run");
                                        return done("error in task.run\n" + err);

                                    } else {
                                        //console.log("task successfully run");
                                        return done(null, task.url + ' successfully ran');
                                    }

                                });
                            }

                        })

                    } else {
                        //console.log("Task " + task.pageUrl + " already exists");
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