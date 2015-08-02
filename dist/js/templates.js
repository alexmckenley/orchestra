angular.module("orchestra.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("channel/channel.tpl.html","<h1>Now Playing</h1>\n<!-- <h5>Channel: {{ channelController.channelId }}</h5> -->\n<h5>Share this page to invite friends to your channel. <img class=\"channel-shareArrow\" src=\"http://www2.psd100.com/ppp/2013/09/2601/Up-arrow-symbol-icon-0926015328.png\"></img></h5>\n<table class=\"u-full-width\">\n  <thead>\n    <tr>\n      <th>Title</th>\n      <th>Artist</th>\n      <th>Spotify URL</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>{{ channel.currentStatus.song.name }}</td>\n      <td>{{ channel.currentStatus.song.artist }}</td>\n      <td><a ng-href=\"{{ channel.currentStatus.song.url}}\"/>Spotify URL</td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("home/home.tpl.html","<h1>Listen with me</h1>\n<h4>Create or join a channel to sync up with a DJ.</h4>\n\n<p>To get started, you\'ll need to <a href=\"https://chrome.google.com/webstore/detail/ammo-inteceptor/opejcnahjldejgcoegkepenfbomiejic\">download</a> our chrome extension and open the spotify desktop app.</p>\n\n<button ng-click=\"homeController.createChannel()\">Host a Channel</button>\n");}]);