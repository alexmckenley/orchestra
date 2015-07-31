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