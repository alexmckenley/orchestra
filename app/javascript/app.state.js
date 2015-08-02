(function() {
    'use strict';

    angular
        .module('orchestra.app.state', [
            'orchestra.spotify.service',
            'orchestra.templates',
            'ui.router'
        ])
        .config(orchestraState);

    function orchestraState($stateProvider) {
        $stateProvider
            .state('orchestra', {
                abstract: true
            });
    }
})();