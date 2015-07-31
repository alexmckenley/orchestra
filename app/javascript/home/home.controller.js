(function() {
    'use strict';

    angular
        .module('orchestra.home.controller', [
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
