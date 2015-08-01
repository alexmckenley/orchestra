(function() {
    'use strict';

    angular
        .module('orchestra.spotify.service', [
            'orchestra.constants',
            'orchestra.time.service'
        ])
        .factory('spotify', function spotifyService($q, $timeout, SPOTIFY, time) {
            var initialized = false,
                service = {
                    initialize: initialize,
                    isReady: isReady,
                    pause: pause,
                    play: play,
                    status: status
                },
                port = SPOTIFY.STARTING_PORT,
                tokens = {};

            function initialize() {
                var deferred = $q.defer();

                rejectAfterTimer(deferred);

                findPort(SPOTIFY.STARTING_PORT)
                    .then(function initializeSucces() {
                        return getCsrfToken();
                    })
                    .then(function findCsrfTokenSucces(data) {
                        tokens.csrf = data.token;

                        return getOauthToken();
                    })
                    .then(function findOauthTokenSuccess(data) {
                        tokens.oauth = data.t;
                        initialized = true;

                        deferred.resolve();
                    });

                return deferred.promise;
            }

            function findPort(portToTry, deferred, options) {
                deferred = deferred || $q.defer();
                options = options || _.merge({}, SPOTIFY.DEFAULT_AJAX_OPTIONS, {
                    url: SPOTIFY.HOST + port + SPOTIFY.TOKEN_PATH
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

            function getCsrfToken() {
                return makeRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.TOKEN_PATH
                });
            }

            function getOauthToken() {
                return makeRequest({
                    url: SPOTIFY.OAUTH_URI
                });
            }

            function play(song, timeInSeconds) {
                return makeRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/play.json',
                    params: { uri: song.url + '#' + time.convertTime(timeInSeconds) }
                });
            }

            function pause() {
                return makeRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/pause.json',
                    params: { pause: true }
                });
            }

            function status() {
                return makeRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/status.json'
                });
            }

            function isReady() {
                return initialized;
            }

            function makeRequest(options) {
                var deferred = $q.defer(),
                    extensionId = 'clfgcnmgjjgnebpcmhpnlomeodloinin';

                options = _.merge(options, SPOTIFY.DEFAULT_AJAX_OPTIONS, {
                    params: tokens
                });

                console.log(options);

                chrome.runtime.sendMessage(extensionId, options, function(response) {
                    // .error .data
                    if (response.error) {
                        console.log(response.error);
                        deferred.reject(response.error);
                    }

                    console.log(response.data);
                    deferred.resolve(response.data);
                });

                // Call Chrome Extension and Return promise
                return deferred.promise;
            }

            function rejectAfterTimer(deferred) {
                $timeout(function cancelFindClient() {
                    deferred.reject('Spotify Client not Found');
                }, 2000);
            }

            return service;
        });
})();
