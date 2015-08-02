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
                url: '/',
                views: {
                    'main@': {
                        templateUrl: 'home/home.tpl.html',
                        controller: 'HomeController as homeController'
                    }
                }
            });
    }
})();