angular.module("orchestra.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("home/home.tpl.html","<div class=\"main-wrapper\">\n  <section class=\"header-links\">\n    <ul class=\"header-rows\">\n      <li class=\"main-header\">\n        <i class=\"glyph material-icons\">queue_music</i>\n        <h2 class=\"info-header\">Orchestra for Spotify</h1>\n      </li>\n      <li class=\"room-info\">\n        <i class=\"glyph material-icons\">people</i>\n        <h2 class=\"info-header\">Room name</h2>\n      </li>\n      <li class=\"dj-info\">\n        <i class=\"glyph material-icons\">equalizer</i>\n        <h2 class=\"info-header\">Current dj: deini</h2>\n      </li>\n      <li class=\"playing-info\">\n        <i class=\"glyph material-icons\">radio</i>\n        <h2 class=\"info-header\">Now playing: Song</h2>\n      </li>\n    </ul>\n  </section>\n\n  <section class=\"player-controls\">\n    <form name=\"channelForm\" ng-submit=\"homeController.joinChannel(channelForm.$valid)\">\n        <md-input-container>\n          <label class=\"channel-name\" for=\"channel\">Channel Name:</label>\n          <input type=\"text\" id=\"channel\" ng-model=\"homeController.channel\" ng-minlength=\"3\" required/>\n        </md-input-container>\n        <md-button class=\"join-channel md-raised\" type=\"submit\">Join Channel</md-button>\n    </form>\n  </section>\n\n\n  <md-button class=\"become-dj md-raised\" ng-click=\"homeController.becomeDj()\">Be the DJ</md-button>\n  <md-button class=\"become-listener md-raised\" ng-click=\"homeController.becomeListener()\">Become a listener</md-button>\n</div>\n");}]);