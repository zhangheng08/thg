// We’ll declare all our dependencies here
var express = require('express');//-------------------------------modify
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var config = require('./config/database');
var thgController = require('./controllers/thgController');
var OktaJwtVerifier = require('@okta/jwt-verifier');//-------------------------------modify

//Connect mongoose to our database
mongoose.connect(config.database);

//Declaring Port
var port = 3001;//-------------------------------modify

//Initialize our app variable
var app = express();//-------------------------------modify

//Middleware for CORS
app.use(cors());

//Middlewares for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files

*/
// app.use(express.static(path.join(__dirname, '/public')));
app.use('/upload_files', express.static(__dirname + '/public/upload_files'));//-------------------------------modify


app.get('/',  function(req,res) {//-------------------------------modify
    res.send("Invalid page");
});


//Routing all HTTP requests to /bucketlist to bucketlist controller
app.use('/thg',thgController);


//-----------------------------------------------------
// okta auth
//-----------------------------------------------------

function authenticationRequired(req, res, next) {
    var authHeader = req.headers.authorization || '';//-------------------------------modify
    var match = authHeader.match(/Bearer (.+)/);

    if (!match) {
        return res.status(401).end();
    }

    var accessToken = match[1];

    return oktaJwtVerifier.verifyAccessToken(accessToken)
        .then(function(jwt) {//-------------------------------modify
            req.jwt = jwt;
            next();
        }).catch( function (err) {
            res.status(401).send(err.message);
    });
}

/**
 * An example route that requires a valid access token for authentication, it
 * will echo the contents of the access token if the middleware successfully
 * validated the token.
 */
app.get('/secure', authenticationRequired, function(req, res) {//-------------------------------modify
    res.json(req.jwt);
});

/**
 * Another example route that requires a valid access token for authentication, and
 * print some messages for the user if they are authenticated
 */
app.get('/api/messages', authenticationRequired, function (req,res) {
    res.json([{
        message: 'Hello, word!'
    }]);
});

//-------------------------------modify
//-------------------------------------------------------------------------------------
// upload
//----------------------------------------------------------------------------------------

var upload = require('./controllers/uploadController');

// 允许跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/upload', upload);

//Listen to port 3000
app.listen(port, function() {
    console.log(port);
});