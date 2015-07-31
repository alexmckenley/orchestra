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