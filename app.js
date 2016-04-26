// My client for pa11y-webservice

var createClient = require('pa11y-webservice-client-node');
var lfi = require('./lfi');
var client = createClient('http://localhost:3000/');


/*client.tasks.get({}, function (err, tasks) {
    console.log(JSON.stringify(tasks));
})*/

lfi();
