/**
 * NodeJS app for testing
 * @author Alejandro Perez
 */

/**
 * MODULES
 */
var express = require("express"),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    jade = require("jade");

// Initialize Express object
var app = express();

// Variables
var root = __dirname,
    port = 3000;

/**
 * CONFIGURATION
 */
app.use(express.static(root + "/public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.set("views", root + "/views");
app.set("view engine", "jade");
app.locals.pretty = true; // pretty html output

/**
 * ROUTES
 */
app.get("/settings/profile", function helloCallback(req, res) {
    res.render("edit");
});

app.post("/settings/profile", function postProfileCb(req, res) {
    console.log(req.body);

    return res.json({
        "name"    : req.body.name,
        "surname" : req.body.surname,
        "bio"     : req.body.bio,
    })
});

// Start server on port 3000
app.listen(port, function listenCallback() {
    console.log("Express server is listening to port " + port);
    console.log("Browse to http://localhost:" + port);
});
