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

    function HomeController($firebaseObject, auth, firebase, player, spotify) {
        var ctrl = this,
            ref = firebase.getReference();

        ctrl.currentStatus = {};
        ctrl.randyPlay = randyPlay;

        auth.login()
            .then(function authSuccess(authData) {
                console.log('Logged in as:', authData);
                setCurrentStatus(authData);
            })
            .catch(function authCatch(error) {
                console.log('Authentication failed:', error);
            });

        function setCurrentStatus(authData) {
            ctrl.currentStatus = $firebaseObject(ref.child('channels').child(authData.uid));
            ctrl.currentStatus.dream = 'DREAM2';
            ctrl.currentStatus.$save();
            console.log('SAVED?');
        }

        function randyPlay() {
            spotify.initialize()
                .then(function() {
                    console.log('SUCCESS INIT');
                    player.play({ url: 'spotify:track:4VPpZXXeZHfpzvHNaPjLcF' });
                })
                .catch(function() {
                    console.log('CATCH INIT');
                });
        }
    }
})();
