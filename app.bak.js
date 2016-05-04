// My client for pa11y-webservice

var createClient = require('pa11y-webservice-client-node');
var lfi = require('./lfi');
var client = createClient('http://localhost:3000/');
var clientDocs = [];
var mongojs = require('mongojs');
var dbURL = "pa11y-webservice-dev";
var db = mongojs(dbURL);


/*client.tasks.get({}, function (err, tasks) {
    console.log(JSON.stringify(tasks));
})*/

// get LFI client html
getClientData(function (response) {
   //createTasks(response);

    createTasks(response, function (callback) {
        console.log(callback);
        //runTasks(response);
    });

    // CREATE CALLBACK SO CAN CALL RUNTASKS AFTER CREATETASKS
});

// loop through tasks and post each one to dashboard db
createTasks = function (docs, callback) {
    console.log("in createTasks() ");
    //console.log(JSON.stringify(docs));

    docs.forEach( function (task) {

        //console.log("task: " + task.name);
        //client.tasks.post()

        // check if task already exists if not create it
        checkTaskExists(task, function (exist) {
            console.log("Does task" + task.name + " already exist: " + exist);

            if(exist) {
                console.log("creating new task: " + task.name);
                //runTask(task);

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
                        runTask(task, function (callback) {
                            console.log(callback);
                        });
                    }
                })

            } else {
                console.log("Task already exists");
            }

        });


    });

    callback("All tasks successfully created");

}

// need to test running task
function runTasks(tasks) {
    console.log("in runTasks() ");

    tasks.forEach( function (task) {

        client.task(task.id).run(function (err, task) {
            if (err) {
                //return next();
                return console.error(err.message);
            } else {
                console.log("pa11y successfully ran for task with id: " + task.name);
            }
        });

    });

}

runTask = function (task, callback) {
    console.log("Running task for: " + task.url);

    client.task(task.id).run(function (err, task) {
        if (err) {

            //return console.error(err.message);
            callback(err.message);
        } else {

            //console.log("pa11y successfully ran for task with id: " + task.name);
            //return;
            callback("pa11y successfully ran for task with id: " + task.name);
        }
    });
    callback();

}


checkTaskExists = function (task, callback) {

    var collectionName = "tasks";
    var collection = db.collection(collectionName);
    var exists = collection.find({"url": task.url}).count() > 0;

    callback(exists);

}