(function() {
    'use strict';

    angular
        .module('orchestra.auth.service', [
            'firebase',
            'orchestra.firebase.service'
        ])
        .factory('auth', function authService($firebaseAuth, $q, firebase) {
            var auth,
                reference = firebase.getReference(),
                service = {
                    getUser: getUser,
                    login: login
                };

            auth = $firebaseAuth(reference);

            function getUser() {
                return reference.getAuth();
            }

            function login() {
                if (service.getUser()) {
                    return $q.when(service.getUser());
                }

                return auth.$authAnonymously();
            }

            return service;
        });
})();
