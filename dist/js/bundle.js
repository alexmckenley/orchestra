(function() {
    'use strict';

    angular
        .module('orchestra.config', [])
        .config(appConfig);

    function appConfig($locationProvider) {
        // Enabling html5 pushstate
        $locationProvider.html5Mode(true);
    }
})();
angular.module('orchestra.constants', [])
    .constant('SPOTIFY', {
        DEFAULT_AJAX_OPTIONS: {
            headers: {
                Origin: 'https://embed.spotify.com'
            },
            method: 'GET'
        },
        HOST: 'https://tpcaahshvs.spotilocal.com:',
        OAUTH_URI: 'http://open.spotify.com/token',
        REMOTE_PATH: '/remote',
        STARTING_PORT: 4370,
        TOKEN_PATH: '/simplecsrf/token.json?&ref=&cors='
    });

(function() {
    'use strict';

    angular
        .module('orchestra', [
            // Config
            'orchestra.config',

            // App state
            'orchestra.app.state',

            // Modules
            'orchestra.home',

            // Services
            'orchestra.player.service',
            'orchestra.spotify.service',
            'orchestra.time.service',

            // Directives

            // Third party modules
            'firebase'
        ])
        .constant(_, window._);
})();

(function() {
    'use strict';

    angular
        .module('orchestra.app.state', [
            'orchestra.home.controller',
            'orchestra.templates',
            'ui.router'
        ])
        .config(orchestraState);

    function orchestraState($stateProvider) {
        $stateProvider
            .state('orchestra', {
                abstract: true,
                views: {
                    main: {
                        templateUrl: 'home/home.tpl.html',
                        controller: 'HomeController as homeController'
                    }
                }
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('orchestra.home.controller', [
            'firebase',
            'orchestra.auth.service',
            'orchestra.firebase.service',
            'orchestra.player.service',
            'orchestra.spotify.service'
        ])
        .controller('HomeController', HomeController);

    function HomeController($firebaseObject, auth, firebase, player, spotify) {
        var ctrl = this,
            ref = firebase.getReference();

        ctrl.currentStatus = {};
        ctrl.randyPlay = randyPlay;

        auth.login()
            .then(function authSuccess(authData) {
                console.log('Logged in as:', authData);
                setCurrentStatus(authData);
            })
            .catch(function authCatch(error) {
                console.log('Authentication failed:', error);
            });

        function setCurrentStatus(authData) {
            ctrl.currentStatus = $firebaseObject(ref.child('channels').child(authData.uid));
            ctrl.currentStatus.dream = 'DREAM2';
            ctrl.currentStatus.$save();
            console.log('SAVED?');
        }

        function randyPlay() {
            spotify.initialize()
                .then(function() {
                    console.log('SUCCESS INIT');
                    player.play({ url: 'spotify:track:4VPpZXXeZHfpzvHNaPjLcF' });
                })
                .catch(function() {
                    console.log('CATCH INIT');
                });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('orchestra.home', [
            'orchestra.home.state'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('orchestra.home.state', [
            'orchestra.home.controller',
            'orchestra.templates',
            'ui.router'
        ])
        .config(homeState);

    function homeState($stateProvider) {
        $stateProvider
            .state('orchestra.home', {
                url: '/'
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('orchestra.auth.service', [
            'firebase',
            'orchestra.firebase.service'
        ])
        .factory('auth', function authService($firebaseAuth, $q, firebase) {
            var auth,
                reference = firebase.getReference(),
                service = {
                    getUser: getUser,
                    login: login
                };

            auth = $firebaseAuth(reference);

            function getUser() {
                return reference.getAuth();
            }

            function login() {
                if (service.getUser()) {
                    return $q.when(service.getUser());
                }

                return auth.$authAnonymously();
            }

            return service;
        });
})();

(function() {
    'use strict';

    angular
        .module('orchestra.player.service', [
            'orchestra.constants',
            'orchestra.spotify.service'
        ])
        .factory('player', function playerService(spotify) {
            var service = {
                    pause: pause,
                    play: play,
                    seek: seek,
                    status: status
                },
                currentStatus = {
                    playing: false,
                    playingPosition: 0,
                    song: {
                        name: null,
                        artist: null,
                        url: null
                    }
                };

            function pause() {
                spotify.pause()
                    .then(function pauseSuccess(data) {
                        setCurrentStatus(data);
                    });
            }

            function play(song) {
                spotify.play(song)
                    .then(function playSuccess(data) {
                        setCurrentStatus(data);
                    });
            }

            function status() {
                spotify.status()
                    .then(function statusSuccesss(data) {
                        setCurrentStatus(data);
                    });
            }

            function seek(song, time) {
                spotify.play(song, time)
                    .then(function seekSuccess(data) {
                        setCurrentStatus(data);
                    });
            }

            function setCurrentStatus(data) {
                var song = data.track;

                currentStatus.playing = data.playing;

                if (currentStatus.playing) {
                    currentStatus.song.name = song.track_resource.name;
                    currentStatus.song.url = song.track_resource.uri;
                    currentStatus.song.artist = song.artist_resource.name;
                    currentStatus.playingPosition = data.playing_position;
                }
            }

            return service;
        });
})();

(function() {
    'use strict';

    angular
        .module('orchestra.firebase.service', [
            'firebase'
        ])
        .factory('firebase', function firebaseService() {
            var reference = new Firebase('https://ammo-sync.firebaseio.com/'),
                service = {
                    getReference: getReference
                };

            function getReference() {
                return reference;
            }

            return service;
        });
})();

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

(function() {
'use strict';

angular
    .module('orchestra.time.service', [])
    .factory('time', function timeService() {
        var service = {
                convertTime: convertTime
            };

        // Converts seconds (number) to #M:SS string format
        // Eg: 61 => 1:01
        function convertTime(totalSeconds) {
            var minutes,
                seconds;

            if (isNaN(totalSeconds)) {
                return '';
            }

            minutes = Math.floor(totalSeconds / 60);
            seconds = Math.floor(totalSeconds - minutes * 60);

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        }

        return service;
    });
})();
