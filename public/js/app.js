//app.js

var clipper = angular.module('clipper', []).config(function($routeProvider) {
  $routeProvider.
  when('/articles', {
    controller: lemon.ctrls.new,
    templateUrl: '../../views/articles.html'
  }).
  when('/clipper', {
    controller: lemon.ctrls.list,
    templateUrl: '../../views/clipper.html'
  }).
  when('/article', {
    controller: lemon.ctrls.list,
    templateUrl: '../../views/list.html'
  }).
  otherwise({
    redirectTo: '/clipper'
  });
});