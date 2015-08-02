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
        $scope.channel = {
            currentStatus: {
                playing: false,
                song: {}
            }
        };

        // Using scope for Firebase's 3way binding, no controller as :(
        //firebase.getChannel($stateParams.channelId).$bindTo($scope, 'currentStatus');
        firebase.getChannel($stateParams.channelId).$bindTo($scope, 'channel');

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
                        $scope.channel.currentStatus = player.getCurrentStatus();
                    });
            }, 2000);
        }

        function subscribeToUpdates() {
            $scope.$watch(function playingStatus() {
                return $scope.channel.currentStatus.playing;
            }, function playingStatusChanged(newValue) {
                if (!newValue) {
                    player.pause();
                }
            });

            $scope.$watch(function songStatus() {
                return $scope.channel.currentStatus.song.url;
            }, function songStatusChanged() {
                player.play($scope.channel.currentStatus.song, $scope.channel.currentStatus.playingPosition);
            });

            $scope.$watch(function playingPosition() {
                return $scope.channel.currentStatus.playingPosition;
            }, function playingPositionChanged(newValue, oldValue) {
                if (seekDetected(newValue, oldValue) && isSameSong()) {
                    player.play($scope.channel.currentStatus.song, newValue);
                }
            });
        }

        function seekDetected(newValue, oldValue) {
            return Math.abs(newValue - oldValue) > 10;
        }

        function isSameSong() {
            return $scope.channel.currentStatus.song.url === player.getCurrentStatus().song.url;
        }
    }
})();
