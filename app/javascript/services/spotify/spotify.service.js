(function() {
    'use strict';

    angular
        .module('orchestra.spotify.service', [
            'orchestra.constants'
        ])
        .factory('spotify', function spotifyService(_, $q, $timeout, SPOTIFY) {
            var service = {
                    initialize: initialize
                },
                port = SPOTIFY.STARTING_PORT,
                tokens = {};

            function initialize() {
                var deferred = $q.deferred();

                rejectAfterTimer(deferred);

                findPort(SPOTIFY.STARTING_PORT)
                    .then(function initializeSucces() {
                        deferred.resolve();
                    });

                return deferred.promise;
            }

            function findPort(portToTry, deferred, options) {
                deferred = deferred || $q.deferred();
                options = options || _.merge({}, SPOTIFY.DEFAULT_AJAX_OPTIONS, {
                    uri: SPOTIFY.HOST + port + SPOTIFY.TOKEN_PATH
                });

                makeRequest(options)
                    .then(function findPortSuccess() {
                        port = portToTry;
                        deferred.resolve(port);
                    })
                    .catch(function findPortCatch() {
                        findPort(portToTry + 1, deferred, options);
                    });

                return deferred.promise;
            }

            function makeRequest(options) {
                var deferred = $q.deferred;

                options = _.merge(options, {
                    qs: tokens
                });

                // Call Chrome Extension and Return promise
                return deferred.promise;
            }

            function rejectAfterTimer(deferred) {
                $timeout(function cancelFindClient() {
                    deferred.reject('Spotify Client not Found');
                }, 500);
            }

            return service;
        });
})();

//_.times(5, function findPortTimes() {
//    setTokens(port);
//    port++;
//});
//
//
//function setTokens(port) {
//    var options = _.merge({}, constants.defaultAjaxOptions, {
//        uri: constants.HOST + port + constants.TOKEN_PATH
//    });
//
//    request(options)
//        .then(function csrfSuccess(data) {
//            constants.port        = port;
//            constants.tokens.csrf = JSON.parse(data).token;
//
//            options.uri = constants.OAUTH_URI;
//            return request(options);
//        })
//        .then(function oauthSuccess(data) {
//            constants.tokens.oauth = JSON.parse(data).t;
//        })
//        // Here just to avoid warnings, we don't care if it fails.
//        .catch(_.noop);
//}