// We’ll declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const thgController = require('./controllers/thgController');
const OktaJwtVerifier = require('@okta/jwt-verifier');

//Connect mongoose to our database
mongoose.connect(config.database);

//Declaring Port
const port = 3001;

//Initialize our app variable
const app = express();

//Middleware for CORS
app.use(cors());

//Middlewares for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files

*/
app.use(express.static(path.join(__dirname, 'public')));


/*app.get('/', (req,res) => {
    res.send("Invalid page");
});*/


//Routing all HTTP requests to /bucketlist to bucketlist controller
app.use('/thg',thgController);


//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});

//-----------------------------------------------------
// okta auth
//-----------------------------------------------------

function authenticationRequired(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
        return res.status(401).end();
    }

    const accessToken = match[1];

    return oktaJwtVerifier.verifyAccessToken(accessToken)
        .then((jwt) => {
            req.jwt = jwt;
            next();
        }).catch((err) => {
            res.status(401).send(err.message);
    });
}

/**
 * An example route that requires a valid access token for authentication, it
 * will echo the contents of the access token if the middleware successfully
 * validated the token.
 */
app.get('/secure', authenticationRequired, (req, res) => {
    res.json(req.jwt);
});

/**
 * Another example route that requires a valid access token for authentication, and
 * print some messages for the user if they are authenticated
 */
app.get('/api/messages', authenticationRequired, (req, res) => {
    res.json([{
        message: 'Hello, word!'
    }]);
});