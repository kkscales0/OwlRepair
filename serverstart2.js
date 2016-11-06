var express = require('express');
var app = express();
var session = require("client-sessions");
var bodyParser = require("body-parser");
app.use(session({
    cookieName: 'OwlRepair',
    secret: 'jakdoweidkafjn',
    duration: 30 * 60 * 1000,
    activeDuration: 3 * 60 * 1000,
    ephemeral: true
}))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public_node'));



app.get('/', function(req, res){
    res.redirect('/login');
})

app.post('/loginfunc', function(req, res){
    var ldap = require('ldapjs');
    
    var url = "ldap://ad.fau.edu";
    
    var ldapusername = req.body.username + "@fau.edu";
    var password = req.body.password;
    
    if(password === "")
        {
            res.send("No");
            return;
        }
    var adClient = ldap.createClient({ url: url });
    adClient.bind(ldapusername, password, function(err){
        if (err != null)
            {
                if (err.name === "InvalidCredentialsError")
                    {
                        res.send("Sorry thats an incorrect login.");
                    }
            }
        else
            {
                req.OwlRepair.username = req.body.username;
                delete password;
                res.redirect('/hw1');
            }
    })
})

var server = app.listen(14555, function() {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:$s", host, port)
})