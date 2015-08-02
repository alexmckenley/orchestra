(function() {
    'use strict';

    angular
        .module('orchestra.firebase.service', [
            'firebase'
        ])
        .factory('firebase', function firebaseService($firebaseObject) {
            var reference = new Firebase('https://ammo-sync.firebaseio.com/'),
                service = {
                    getReference: getReference,
                    getChannel: getChannel
                };

            function getChannel(id) {
                return $firebaseObject(reference.child('channels').child(id));
            }

            function getReference() {
                return reference;
            }

            return service;
        });
})();
