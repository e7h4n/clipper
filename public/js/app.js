//app.js
var clipperApp = {
  ctrls: {
    articles: function($scope) {

    },
    article: function($scope) {

    },
    clipper: function($scope) {

    }
  }
};

var clipper = angular.module('clipper', []).config(function($routeProvider) {
  $routeProvider.
  when('/articles', {
    controller: clipperApp.ctrls.articles,
    templateUrl: '../../views/articles.html'
  }).
  when('/clipper', {
    controller: clipperApp.ctrls.clipper,
    templateUrl: '../../views/clipper.html'
  }).
  when('/article', {
    controller: clipperApp.ctrls.article,
    templateUrl: '../../views/article.html'
  }).
  otherwise({
    redirectTo: '/clipper'
  });
});
