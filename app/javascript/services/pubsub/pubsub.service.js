/* global Faye */
(function() {
    'use strict';

    angular
        .module('orchestra.pubsub.service', [
            'orchestra.constants'
        ])
        .factory('pubsub', function pubsubService(SERVER_URL) {
            var service = {
                    getClient: getClient
                },
                client;

            function getClient() {
                if (!client) {
                    client = new Faye.Client(SERVER_URL);
                }

                return client;
            }

            return service;
        });
})();