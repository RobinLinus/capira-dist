module.exports = function(app) {
    app.get('/progress', function(req, res, next) {
        app.lti._createProvider(null, function(a, provider) {
            provider.valid_request(req, function(err, is_valid) {
                provider.outcome_service.send_replace_result(0.18, function(err, result) {
                    res.send('grade', result)
                });
            });
        });
    });
}
