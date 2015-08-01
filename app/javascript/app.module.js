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
            'orchestra.channel',

            // Services
            'orchestra.auth.service',
            'orchestra.firebase.service',
            'orchestra.player.service',
            'orchestra.spotify.service',
            'orchestra.time.service',

            // Directives

            // Third party modules
            'firebase'
        ])

        .constant(_, window._)

        .run(function appRun($log, $rootScope) {
            $rootScope
                .$on('$stateChangeError', function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
                    $log.error('Error in state transistion: ', error);
                });
        });
})();
