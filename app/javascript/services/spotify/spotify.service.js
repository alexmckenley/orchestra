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
                    isReady: isReady,
                    pause: pause,
                    play: play,
                    status: status
                },
                port = SPOTIFY.STARTING_PORT,
                tokens = {};

            function makeSpotifyReady() {
                var deferred = $q.defer();

                if (service.isReady()) {
                    return $q.when();
                }

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

            function findPort(portToTry, deferred) {
                var options;

                deferred = deferred || $q.defer();
                options = _.merge({}, SPOTIFY.DEFAULT_AJAX_OPTIONS, {
                    url: SPOTIFY.HOST + portToTry + SPOTIFY.TOKEN_PATH
                });

                makeRequest(options)
                    .then(function findPortSuccess() {
                        port = portToTry;
                        deferred.resolve(port);
                    })
                    .catch(function findPortCatch() {
                        findPort(portToTry + 1, deferred);
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
                return makeAuthorizedRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/play.json',
                    params: { uri: song.url + '#' + time.convertTime(timeInSeconds) }
                });
            }

            function pause() {
                return makeAuthorizedRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/pause.json',
                    params: { pause: true }
                });
            }

            function status() {
                return makeAuthorizedRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/status.json'
                });
            }

            function isReady() {
                return initialized;
            }

            function makeAuthorizedRequest(options) {
                return makeSpotifyReady()
                    .then(function makeSpotifyReadySuccess() {
                        return makeRequest(options);
                    });
            }

            function makeRequest(options) {
                var deferred = $q.defer(),
                    extensionId = SPOTIFY.EXTENSION_ID;

                options = _.merge(options, SPOTIFY.DEFAULT_AJAX_OPTIONS, {
                    params: tokens
                });

                console.log(options);

                chrome.runtime.sendMessage(extensionId, options, function(response) {
                    // .error .data
                    if (response.error) {
                        deferred.reject(response.error);
                    }

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
