(function() {
    'use strict';

    angular
        .module('orchestra.player.service', [
            'orchestra.constants'
        ])
        .factory('player', function playerService() {
            var service = {
                    pause: pause,
                    play: play,
                    seek: seek,
                    status: status
                },
                currentStatus = {};

            function pause() {

            }

            function play(song) {

            }

            function status() {

            }

            function seek() {

            }

            return service;
        });
})();
