'use strict';
module.exports = {
    mongoDB: process.env.mongodb || 'mongodb://127.0.0.1:27017/capira',
    cookieSecret: 'cookieSecret',
    lti: {
        consumerKey: 'test',
        consumerSecret: 'test',
    },
    port: process.env.PORT ||process.env.app_port || 9898,
    webRoot: './client',
    playerEndpoint: '/player/#/',
    editorEndpoint: '/editor/#/',
    createEndpoint: '/create/#' + '/editor/#/',
    debug: true,
    // Path to your public SSL key and certificate (if you want to use the Capira Server without a reverse proxy like nginx)
    // ssl: {
    //     key: '',
    //     cert: ''
    // }
};


// var configPath = process.argv[2];
// if (configPath) {
//     console.log('config', configPath);
//     var config2 = require(configPath);
//     module.exports.lti.consumerKey = config2.lti.consumerKey;
//     module.exports.lti.consumerSecret = config2.lti.consumerSecret;
//     module.exports.port = config2.port;
//     module.exports.mongoDB += '_'+config2.database;
// }
