'use strict';
var LTIStrategy = require('passport-lti');
var config = require('./config').lti;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        user.isAuthorized = function(resource) {
            if (this.instanceId !== resource.instanceId) {
                return false;
            }
            if (this.contextId !== resource.contextId) {
                return false;
            }
            return this.isAdmin;
        };
        done(null, user);
    });
    var strategy = new LTIStrategy(config, function(lti, done) {
        //console.log(lti);

        //rough dummy implementation
        this._createProvider(null, function(a, provider) {
            //console.log('provider:', provider);
            provider.outcome_service.send_replace_result(0.48, function(err, result) {
               // console.log(err,result); 
            });
        });

        var resource = {
            resourceId: lti.resource_link_id,
            contextId: lti.context_id,
            instanceId: lti.tool_consumer_instance_guid,
            title: lti.resource_link_title,
        };

        var user = {
            id: lti.user_id,
            contextId: lti.context_id,
            instanceId: lti.tool_consumer_instance_guid,
            isAdmin: (lti.roles.indexOf('Instructor') > -1)
        };
        return done(null, user, resource);
    });
    return strategy;
};
