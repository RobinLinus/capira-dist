console.log('extern capira-api loaded');

var allowedOrigins = ['http://socrates.cloudnode.de', 'http://www.socrates.cloudnode.de', 'https://www.socrates.cloudnode.de', 'https://socrates.cloudnode.de','http://fh-luebeck.cloudnode.de', 'http://www.fh-luebeck.cloudnode.de', 'https://www.fh-luebeck.cloudnode.de', 'https://fh-luebeck.cloudnode.de']

window.capiraAPI = new(function() {
    var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
    var listener = window[eventMethod];
    var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

    listener(messageEvent, function(e) {
        if (allowedOrigins.indexOf(e.origin) !== -1) {
            var m = JSON.parse(e.data);
            if (!m.layer && _onUnitFinished)
                return _onUnitFinished(m.unit);
            if (m.score > 0 && _onQuizSuccess)
                return _onQuizSuccess(m.unit, m.layer, m.time, m.score, m.totalQuizzes);
            if (m.score == 0 && _onQuizFailure)
                return _onQuizFailure(m.unit, m.layer, m.time, m.totalQuizzes);
            if (m.score < 0 && _onQuizSkipped)
                return _onQuizSkipped(m.unit, m.layer, m.time, m.totalQuizzes);
            return;
        }
        console.log('Received illegal Capira Event: ', e);
    }, false);

    var _onQuizSkipped;
    this.onQuizSkipped = function(f) {
        _onQuizSkipped = f;
    }
    var _onQuizSuccess;
    this.onQuizSuccess = function(f) {
        _onQuizSuccess = f;
    }
    var _onQuizFailure;
    this.onQuizFailure = function(f) {
        _onQuizFailure = f;
    }
    var _onUnitFinished;
    this.onUnitFinished = function(f) {
        _onUnitFinished = f;
    }
})();
