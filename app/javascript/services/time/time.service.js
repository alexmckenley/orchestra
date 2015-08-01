(function() {
'use strict';

angular
    .module('orchestra.time.service', [])
    .factory('time', function timeService() {
        var service = {
                convertTime: convertTime
            };

        // Converts seconds (number) to #M:SS string format
        // Eg: 61 => 1:01
        function convertTime(totalSeconds) {
            var minutes,
                seconds;

            if (isNaN(totalSeconds)) {
                return '';
            }

            minutes = Math.floor(totalSeconds / 60);
            seconds = Math.floor(totalSeconds - minutes * 60);

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        }

        return service;
    });
})();
