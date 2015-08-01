(function() {
    'use strict';

    angular
        .module('orchestra.spotify.service', [
            'orchestra.constants',
            'orchestra.time.service'
        ])
        .factory('spotify', function spotifyService($q, $timeout, SPOTIFY, time) {
            var service = {
                    initialize: initialize,
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
                        console.log(tokens);

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
                    //url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/play.json#' + time.convertTime(timeInSeconds),
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/play.json',
                    params: { uri: song.url }
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


            //curl 'https://tpcaahshvs.spotilocal.com:4370/remote/play.json?uri=spotify%3Atrack%3A4VPpZXXeZHfpzvHNaPjLcF&csrf=32290511c330bf2dc573310222808761&oauth=NAowChgKB1Nwb3RpZnkSABoGmAEByAEBJSOwvVUSFKH0QE_T1LlF0AAMEg8HAc3elmPd' -H 'Pragma: no-cache' -H 'Origin: https://embed.spotify.com' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,es-419;q=0.6,es;q=0.4' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36' -H 'Accept: application/json' -H 'Cache-Control: no-cache' -H 'Connection: keep-alive' --compressed

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
