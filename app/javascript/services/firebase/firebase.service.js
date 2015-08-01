(function() {
    'use strict';

    angular
        .module('orchestra.firebase.service', [
            'firebase'
        ])
        .factory('firebase', function firebaseService() {
            var reference = new Firebase('https://ammo-sync.firebaseio.com/'),
                service = {
                    getReference: getReference
                };

            function getReference() {
                return reference;
            }

            return service;
        });
})();
