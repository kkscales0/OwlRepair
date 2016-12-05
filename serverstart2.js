var express = require('express');
var app = express();
var multer = require("multer");
var session = require("client-sessions");
var bodyParser = require("body-parser");
var path = require("path");
var https = require("https");
app.use(session({
    cookieName: 'OwlRepair',
    secret: 'jakdoweidkafjn',
    duration: 30 * 60 * 1000,
    activeDuration: 3 * 60 * 1000,
    ephemeral: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public_node'));
app.use(express.static('public_node'));

app.use(express.static(__dirname + '/'));

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, "" + Date.now());
    }
});
var upload = multer({
    storage: storage
});


app.get('/', function (req, res) {
    req.OwlRepair.login = false;
    res.sendFile(path.join(__dirname + '/html/login.html'));
});

app.get('/loginfail', function (req, res) {
    req.OwlRepair.login = false;
    res.sendFile(path.join(__dirname + '/html/loginfail.html'));
});

app.post('/loginfunc', function (req, res) {
    if (req.OwlRepair.login == false) {
        var ldap = require('ldapjs');

        var url = "ldap://ad.fau.edu";

        var ldapusername = req.body.username + "@fau.edu";
        var password = req.body.password;

        if (password === "") {
            res.redirect('/loginfail');
            return;
        } else if (req.body.username == "maintenance") {
            if (req.body.password == "maintenance") {
                //res.send("Thanks for loggin in " + req.body.username + ".  You'll be redirected sometime between now and the heat death of the universe.");
                res.redirect('/openRequests');
            } else {
                res.redirect('/loginfail');
            }
        } else if (req.body.username == "supervisor") {
            if (req.body.password == "supervisor") {
                // res.send("Thanks for loggin in " + req.body.username + ".  You'll be redirected sometime between now and the heat death of the universe.");
                res.redirect('/openRequests');
            } else {
                res.redirect('/loginfail');
            }
        } else {
            var adClient = ldap.createClient({
                url: url
            });
            adClient.bind(ldapusername, password, function (err) {
                if (err != null) {
                    if (err.name === "InvalidCredentialsError") {
                        res.redirect('/loginfail');
                    }
                } else {

                    req.OwlRepair.login = true;
                    req.OwlRepair.user = "student";
                    req.OwlRepair.username = req.body.username;
                    delete password;
                    res.send("Thanks for loggin in " + req.OwlRepair.username + ".  You'll be redirected sometime between now and the heat death of the universe.");
                    res.redirect('/publicRequests');

                }
            })
        }
    } else {
        res.redirect('/');
    }
});
app.get('/publicRequests', function (req, res) {
    res.sendFile(path.join(__dirname + '/html/publicRequests.html'));
});
app.get('/openRequests', function (req, res) {
    res.sendFile(path.join(__dirname + '/html/openRequests.html'));
});

app.get('/submission', function (req, res) {
    res.sendFile(path.join(__dirname + '/html/submission.html'));
});
app.post('/api/submission', upload.single('imageUpload'), function (req, res, next) {
    console.log(req.body);
    var campusid = parseInt(req.body.campusSelect);
    var buildingid = parseInt(req.body.buildingSelect);
    var locDesc = req.body.locDetail;
    var catgoryid = parseInt(req.body.categorySelect);
    var comments = req.body.comments;
    var pubpriv = parseInt(req.body.visibilitySelect);
    var imagepath = req.file.filename;
    var postData = JSON.stringify({
        'campusId': campusid,
        'buildingId': buildingid,
        'locationDesc': locDesc,
        'categoryId': catgoryid,
        'desc': comments,
        'imagePath': imagepath,
        'public': pubpriv
    });
    console.log(postData);
    var owlCookie = "test";
    console.log(req.OwlRepair);
    var options = {
        hostname: 'owlrepair-148215.appspot.com',
        port: 443,
        path: '/api/request/submit',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'OwlRepair= ' + owlCookie,
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var APIreq = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    APIreq.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    // write data to request body
    APIreq.write(postData);
    APIreq.end();


    res.end("File is uploaded");

});

var server = app.listen(14555, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:$s", host, port);
})