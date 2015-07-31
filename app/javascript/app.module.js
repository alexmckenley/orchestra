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
            'orchestra.pubsub.service',

            // Directives

            // Third party modules
            'firebase'
        ])
        .constant(_, window._);
})();
