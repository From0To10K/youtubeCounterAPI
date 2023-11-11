// Load libs
const express = require('express');
const https = require("https");
var cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// CONSTANTS
const APP_PORT = 1337;

// Express app
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// The number of followers actually
let followersCounter = 0;

// The date where followers counter was updated
let followersDate = 0;

// Check if server working correctly
app.get('/', (req, res) => {
    res.status(200).send("Pong")
});

// Check if server working correctly
app.get('/getFollowersCount', (req, res) => {

    // Check if we get private key
    if (!req.query || !req.query.KEY || req.query.KEY !== "PWDCounterKEY") {
        return res.status(500).send({ result: false, msg: "INVALID_PVT_KEY" });
    }

    // Get back followers counter
    return res.status(200).send({
        result: true,
        followersCounter: followersCounter,
        followersDate: followersDate
    });
});

// Update followers
app.post('/updateFollowers', (req, res) => {

    // Check if we get private key
    if (!req.body || !req.body.PVT_KEY || req.body.PVT_KEY !== "YoutubeLiveCounterKEY") {
        return res.status(500).send({ result: false, msg: "INVALID_PVT_KEY" });
    }

    // Check if we get followers number correctly
    if (!req.body || !req.body.PVT_KEY || req.body.followers <= 0) {
        return res.status(500).send({ result: false, msg: "INVALID_FOLLOWERS_COUNT" });
    }

    // Get followers as number & update date count
    followersCounter = parseInt(req.body.followers);
    followersDate = Date.now();

    // console.log('Followers updated with success : ', followersCounter);

    // Send success
    return res.status(200).send({ result: true});
});

// When server started, try to load data saved
try {
    const jsonString = fs.readFileSync("./config.json");
    const data = JSON.parse(jsonString);

    // Update values
    followersCounter = data.followersCounter;
    followersDate = data.followersDate;
} catch (err) {

    // Get error only when file is created
    if (err.code !== "ENOENT") {
        console.log(err);
        return;
    }
}

// Launch server
https.createServer(
    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
    {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
    },
    app
).listen(APP_PORT, () => console.log(`Started server at http://localhost:`+APP_PORT));