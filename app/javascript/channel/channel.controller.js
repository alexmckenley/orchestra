(function() {
    'use strict';

    angular
        .module('orchestra.channel.controller', [])
        .controller('ChannelController', ChannelController);

    function ChannelController() {
        var ctrl = this;

        ctrl.hello = 'Hello World';
        console.log('CHANNEL CONTROLLER');
    }
})();
