'use strict';
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var lti = require('./app-auth-lti');
var config = require('./config');
var Lesson = require('./models/lesson');

/* passport lti */
var passport = require('passport');
passport.use(lti(passport));

var mongoose = require('mongoose');
mongoose.connect(config.mongoDB);

var express = require('express');
var app = express();
app.enable('trust proxy');
app.use(express.static(config.webRoot));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: config.cookieSecret,
    proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());


// Create our Express router
var router = express.Router();
var Lesson = Lesson(router);

app.post('/', function(req, res, next) {
    passport.authenticate('lti', function(err, user, requestedResource) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send('error: no user');
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            console.log('user', user);
            console.log('requestedResource', requestedResource);

            // Find requested resource in capira-db
            Lesson.find({
                'resource.resourceId': requestedResource.resourceId,
                'resource.instanceId': requestedResource.instanceId
            }, {
                _id: 1,
                notInitialized: 1
            }, function(err, results) {
                //if lesson not exists yet
                if (results.length === 0) {
                    //check if user is admin
                    if (!user.isAdmin) {
                        return res.send('unauthorized request');
                    }
                    // create new lesson in capira-db 
                    var newLesson = new Lesson();
                    newLesson.resource = requestedResource;
                    newLesson.title = requestedResource.title;
                    newLesson.notInitialized = true;
                    newLesson.save(function(err, lesson) {
                        // redirect user to /player/create/:lessonId
                        return res.redirect(config.createEndpoint + lesson._id);
                    });
                } else {
                    var lesson = results[0];
                    if (lesson.notInitialized) {
                        if (!user.isAdmin) {
                            return res.send('unauthorized request');
                        }
                        // redirect user to the editor to create a unit
                        return res.redirect(config.createEndpoint + lesson._id);
                    }
                    // redirect user to the requested lesson
                    return res.redirect(config.playerEndpoint + lesson._id);
                }
            });
        });
    })(req, res, next);
});






app.get('/pustekuc', function(req, res, next) {
    passport.authenticate('lti', function(err, user, requestedResource, provider) {
        if (err) {
            return next(err);
        }


        req.logIn(req.user, function(err) {
            if (err) {
                return next(err);
            }
            console.log('user', user);
            console.log('requestedResource', requestedResource);

            user.provider.outcome_service.send_replace_result(0.48, function(err, result) {
                console.log('grade', result)
            });

        });
    })(req, res, next);
});



app.use('/api', router);
module.exports = app;
