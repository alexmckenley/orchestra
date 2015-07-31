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
    .constant('SERVER_URL', '/faye');
(function() {
    'use strict';

    angular
        .module('orchestra', [
            // Config
            'orchestra.config',

            // App state
            'orchestra.app.state',

            // Modules
            'orchestra.home'

            // Services

            // Directives

            // Third party modules
        ]);
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
            'ngMaterial',
            'orchestra.pubsub.service'
        ])
        .controller('HomeController', HomeController);

    function HomeController(pubsub) {
        var ctrl = this;

        ctrl.joinChannel = joinChannel;
        ctrl.becomeDj = becomeDj;
        ctrl.becomeListener = becomeListener;

        function joinChannel(valid) {
            if (!valid) {
                alert('Channel Name should be 3+ Characters');

                return;
            }

            pubsub.getClient().publish('/joinChannel', {
                channel: ctrl.channel
            });
        }

        function becomeDj() {
            pubsub.getClient().publish('/becomeDj', {});
        }

        function becomeListener() {
            pubsub.getClient().publish('/becomeListener', {});
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
/* global Faye */
(function() {
    'use strict';

    angular
        .module('orchestra.pubsub.service', [
            'orchestra.constants'
        ])
        .factory('pubsub', function pubsubService(SERVER_URL) {
            var service = {
                    getClient: getClient
                },
                client;

            function getClient() {
                if (!client) {
                    client = new Faye.Client(SERVER_URL);
                }

                return client;
            }

            return service;
        });
})();