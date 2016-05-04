// modules
var mongojs = require('mongojs');
var dbURL = "mydb";
var db = mongojs(dbURL);
//var clientDocs = [];

//module.exports = getClientData;

db.on('error', function () {
    console.log('There was an error with the Database');
})

getClientData = function (callback) {
    var clientDocs = [];

    console.log("Getting client data..");
    /* Test collection */
    var collectionName = "html";
    var collection = db.collection(collectionName);
    /* Test collection */

    collection.find().toArray(
        function (err, docs) {
            if(err)  throw err;

            //console.log(JSON.stringify(docs));
            callback(docs);
        }
    );

}

getClientData2 = function (id, callback) {
    var clientDocs = [];
    var crawlid = id;
    console.log("Getting client data for crawlid: " + crawlid);
    /* Test collection */
    var collectionName = "pageHtml_" + crawlid;
    var collection = db.collection(collectionName);
    /* Test collection */

    collection.find({"crawlId":crawlid}, {"pageUrl":1, "title":1}).toArray(
        function (err, docs) {
            if(err)  throw err;

            //console.log(JSON.stringify(docs));
            callback(docs);
        }
    );

}


/*
db.html.insert(
    [
        { "name" : "BSI Countries-zh-CN/", "url" : "http://www.bsigroup.com/zh-CN/", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
        { "name" : "BSI Countries-en-CA/", "url" : "http://www.bsigroup.com/en-CA/", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
        { "name" : "BSI Countries-fr-FR/", "url" : "http://www.bsigroup.com/fr-FR/", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
         { "name" : "BSI Countries-de-DE", "url" : "http://www.bsigroup.com/de-DE", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
         { "name" : "BSI Countries-en-HK", "url" : "http://www.bsigroup.com/en-HK", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
         { "name" : "BSI Countries-is", "url" : "http://bsiaislandi.is", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
         { "name" : "BSI Countries-en-IN", "url" : "http://www.bsigroup.com/en-IN", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
         { "name" : "BSI Countries-it-IT", "url" : "http://www.bsigroup.com/it-IT", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
         { "name" : "BSI Countries-ja-JP", "url" : "http://www.bsigroup.com/ja-JP", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" }
     ]
 )

db.html.insert(
    [
        { "name" : "BSI Countries-ko-KR", "url" : "http://www.bsigroup.com/ko-KR", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
        { "name" : "BSI Countries-en-MY", "url" : "http://www.bsigroup.com/en-MY", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
        { "name" : "BSI Countries-es-MX", "url" : "http://www.bsigroup.com/es-MX", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" }
    ]
)


 db.html.insert(
     [
         { "name" : "BSI Countries-nl-NL", "url" : "http://www.bsigroup.com/nl-NL", "client" : "bsi", "standard" : "WCAG2AA", "ignore" : [ ], "timeout" : "", "username" : "", "password" : "" },
     ]
 )

 db.pageHtml_0000.insert(
    [
        {
            "siteId" : 499,
            "crawlId" : "0000",
            "pageId" : 0,
            "pageUrl" : "http://littleforest.co.uk/",
            "title" : "Standards, Training ....",
            "statusCode" : 200,
            "contentType" : "text/html; charset=utf-8",
            "metaDescription" : "description",
            "metaKeywords" : "keyword1, keyword2",
            "h1" : "Welcome to Littleforest",
            "h2" : "Littleforest title 2",
            "html" : ""
        }
    ]
 )

 db.pageHtml_0000.insert(
     [
         {
             "siteId" : 499,
             "crawlId" : "0000",
             "pageId" : 0,
             "pageUrl" : "http://www.littleforest.co.uk/changes-to-the-law-around-0845-and-0870-telephone-numbers/",
             "title" : "Standards, Training ....",
             "statusCode" : 200,
             "contentType" : "text/html; charset=utf-8",
             "metaDescription" : "description",
             "metaKeywords" : "keyword1, keyword2",
             "h1" : "Welcome to Littleforest",
             "h2" : "Littleforest title 2",
             "html" : ""
         }
     ]
 )

 db.pageHtml_0000.insert(
     [
         {
             "siteId" : 499,
             "crawlId" : "0000",
             "pageId" : 0,
             "pageUrl" : "	http://www.littleforest.co.uk/cookie-policy-what-happens-if-i-say-no/",
             "title" : "Standards, Training ....",
             "statusCode" : 200,
             "contentType" : "text/html; charset=utf-8",
             "metaDescription" : "description",
             "metaKeywords" : "keyword1, keyword2",
             "h1" : "Welcome to Littleforest",
             "h2" : "Littleforest title 2",
             "html" : ""
         }
     ]
 )

 */