angular.module("orchestra.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("channel/channel.tpl.html","<h1>Now Playing</h1>\n<h5>Channel: {{ channelController.channelId }}</h5>\n<table class=\"u-full-width\">\n  <thead>\n    <tr>\n      <th>Title</th>\n      <th>Artist</th>\n      <th>Spotify URL</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>{{ currentStatus.song.name }}</td>\n      <td>{{ currentStatus.song.artist }}</td>\n      <td><a ng-href=\"{{ currentStatus.song.url}}\">Spotify URL</td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("home/home.tpl.html","<h1>Listen with me</h1>\n<h4>Create or join a channel to sync up with a DJ</h4>\n<button ng-click=\"homeController.createChannel()\">Create new channel</button>\n");}]);