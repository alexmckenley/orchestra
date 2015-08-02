(function() {
    'use strict';

    angular
        .module('orchestra.home.controller', [
            'orchestra.auth.service'
        ])
        .controller('HomeController', HomeController);

    function HomeController($state, auth) {
        var ctrl = this;

        ctrl.createChannel = createChannel;

        function createChannel() {
            $state.go('orchestra.channel', { channelId: auth.getUser().uid });
        }
    }
})();
