(function() {
    'use strict';

    angular
        .module('orchestra.channel.state', [
            'orchestra.channel.controller',
            'orchestra.templates',
            'ui.router'
        ])
        .config(channelState);

    function channelState($stateProvider) {
        console.log('channel state');
        $stateProvider
            .state('orchestra.channel', {
                url: 'channel',
                views: {
                    'main@': {
                        templateUrl: 'channel/channel.tpl.html',
                        controller: 'ChannelController as channelController'
                    }
                }
            });
    }
})();