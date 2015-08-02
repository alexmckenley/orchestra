(function() {
    'use strict';

    angular
        .module('orchestra.channel.controller', [
            'firebase',
            'orchestra.auth.service',
            'orchestra.firebase.service',
            'orchestra.player.service',
            'orchestra.spotify.service',
            'ui.router'
        ])
        .controller('ChannelController', ChannelController);

    function ChannelController($interval, $scope, $stateParams, auth, firebase, player, spotify) {
        var ctrl = this,
            isAdmin;

        ctrl.channelId = $stateParams.channelId;

        isAdmin = auth.getUser().uid === $stateParams.channelId;
        $scope.currentStatus = {
            playing: false,
            song: {}
        };

        // Using scope for Firebase's 3way binding, no controller as :(
        firebase.getChannel($stateParams.channelId).$bindTo($scope, 'currentStatus');

        if (isAdmin) {
            pollSpotifyStatus();
        } else {
            subscribeToUpdates();
        }

        function pollSpotifyStatus() {
            $interval(function pollInterval() {
                spotify.status()
                    .then(function pollIntervalSuccess(data) {
                        player.setCurrentStatus(data);
                        $scope.currentStatus = player.getCurrentStatus();
                    });
            }, 2000);
        }

        function subscribeToUpdates() {
            $scope.$watch(function playingStatus() {
                return $scope.currentStatus.playing;
            }, function playingStatusChanged(newValue) {
                if (!newValue) {
                    player.pause();
                }
            });

            $scope.$watch(function songStatus() {
                return $scope.currentStatus.song.url;
            }, function songStatusChanged() {
                player.play($scope.currentStatus.song);
            });
        }

    }
})();
