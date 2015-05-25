/**
 * NodeJS app for testing using Express and Jade templating engine
 *
 * @author Alejandro Perez Martin
 * @autor_url http://linkedin.com/in/aleperez92
 * @repository https://github.com/AlejandroPerezMartin/nodejs-test.git
 */

/**
 * MODULES
 */
var express = require("express"),
    expressValidator = require('express-validator'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    fs = require('fs'),
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
app.use(multer({
    dest: root + "/tmp/"
}));

app.set("views", root + "/views");
app.set("view engine", "jade");
app.locals.pretty = true; // pretty html output

/**
 * ROUTES
 */
app.get("/profile", function profileCb(req, res) {

    fs.readFile('data.json', function (err, data) {
        if (err) throw err;

        var profileData = JSON.parse(data);

        res.render("view", profileData);
    });

});

app.get("/settings/profile", function editProfileCb(req, res) {
    res.render("edit");
});

app.post("/settings/profile", function postEditProfileCb(req, res) {

    req.assert('name', 'Name field is required').notEmpty();
    req.assert('surname', 'Surname field is required').notEmpty();
    req.assert('bio', 'Biography field is required').notEmpty();

    var errors = req.validationErrors(),
        picture = req.files.picture;

    if (picture == undefined) {
        errors.unshift({
            param: 'picture',
            msg: 'Picture field is required',
            value: undefined
        });
    }
    else {
        fs.renameSync(picture.path, root + "/public/images/" + picture.name);
        req.body.picture = "/images/" + picture.name;
    }

    if (!errors) {
        fs.writeFile('data.json', JSON.stringify(req.body, null, 2), function (err) {

            if (err) throw err;

            res.redirect("/profile");
        });
    }
    else {
        res.render("edit", {
            fieldErrors: errors,
            fieldsData: req.body,
        });
    }

});

/* Start server on port 3000 */
app.listen(port, function listenCallback() {
    console.log("Express server is listening to port " + port);
    console.log("Browse to http://localhost:" + port);
});
