(function() {
    'use strict';

    angular
        .module('orchestra.player.service', [
            'orchestra.constants',
            'orchestra.spotify.service'
        ])
        .factory('player', function playerService(spotify) {
            var service = {
                    getCurrentStatus: getCurrentStatus,
                    pause: pause,
                    play: play,
                    setCurrentStatus: setCurrentStatus,
                    status: status
                },
                currentStatus = {
                    playing: false,
                    playingPosition: 0,
                    song: {
                        name: null,
                        artist: null,
                        url: null
                    }
                };

            function getCurrentStatus() {
                return currentStatus;
            }

            function pause() {
                spotify.pause()
                    .then(function pauseSuccess(data) {
                        setCurrentStatus(data);
                    });
            }

            function play(song) {
                spotify.play(song)
                    .then(function playSuccess(data) {
                        setCurrentStatus(data);
                    });
            }

            function status() {
                spotify.status()
                    .then(function statusSuccesss(data) {
                        setCurrentStatus(data);
                    });
            }

            function setCurrentStatus(data) {
                var song = data.track;

                currentStatus.playing = data.playing;

                if (currentStatus.playing) {
                    currentStatus.song.name = song.track_resource.name;
                    currentStatus.song.url = song.track_resource.uri;
                    currentStatus.song.artist = song.artist_resource.name;
                    currentStatus.playingPosition = data.playing_position;
                }
            }

            return service;
        });
})();
