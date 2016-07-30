var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../server-assets/usermodel');

module.exports = function(passport) {

    // used to serialize the user for the session

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP

    passport.use('local', new LocalStrategy(
            function(username, password, done) {
                User.findOne({ username: username }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (!user.password) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user, { message: 'correct response' });
                });
            })

    );

};
