(function() {
    'use strict';

    angular
        .module('orchestra.home.controller', [
            'firebase',
            'orchestra.auth.service',
            'orchestra.firebase.service',
            'orchestra.player.service',
            'orchestra.spotify.service'
        ])
        .controller('HomeController', HomeController);

    function HomeController($firebaseObject, $scope, $state, auth, firebase, player, spotify) {
        var ctrl = this,
            ref = firebase.getReference();

        ctrl.spotifyIsReady = spotify.isReady;

        spotify.initialize();

        auth.login()
            .then(function authSuccess(authData) {
                console.log('Logged in as:', authData);
                setCurrentStatus(authData);
            })
            .catch(function authCatch(error) {
                console.log('Authentication failed:', error);
            });

        function setCurrentStatus(authData) {
            $firebaseObject(ref.child('channels').child(authData.uid)).$bindTo($scope, 'currentStatus');
        }

        ctrl.randyPlay = randyPlay;

        function randyPlay() {
            $state.go('orchestra.channel');
            //player.play({ url: 'spotify:track:4VPpZXXeZHfpzvHNaPjLcF' });
        }
    }
})();
