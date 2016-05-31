var lti = require('ims-lti');
var config = require('../config');
var atob = require('atob');
module.exports = function(app) {
    app.disable('etag');
    app.get('/progress/:id/:score', function(req, res, next) {
        app.lti._createProvider(null, function(err1, provider) {
            if (err1) {
                return res.send('error1');
            }
            provider.valid_request(req, function(err, is_valid) {
                // if (err) {
                //     console.log(err);
                //     return res.send('error2');
                // }

                var id = atob(req.params.id);
                var score = Number(atob(req.params.score));
                //console.log(id, score);
                var outcomeConfig = {
                    consumer_key: config.lti.consumerKey,
                    consumer_secret: config.lti.consumerSecret,
                    service_url: provider.body.lis_outcome_service_url,
                    source_did: id,
                    result_data_types: [],
                };
                // console.log(outcomeConfig); 
                var outcome = new lti.OutcomeService(outcomeConfig);

                //console.log(outcomeConfig)
                outcome.send_read_result(function(err2, result) {
                    if (err2) {
                        console.log('readError', err2);
                        return res.send('error');
                    }
                    console.log('Debug Score:',result,score);
                    if (!result || result < score) {
                        outcome.send_replace_result(score, function(err3, result1) {
                            if (err3) {
                                res.send('error1');
                                return console.log('writeError', err3);
                            }
                            res.send('grade: '+ result1)
                        });
                    } else {
                        res.send('up to date');
                    }
                });
            });
        });
    });
}
