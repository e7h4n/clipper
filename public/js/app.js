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
    controller: lemon.ctrls.articles,
    templateUrl: '../../views/articles.html'
  }).
  when('/clipper', {
    controller: lemon.ctrls.clipper,
    templateUrl: '../../views/clipper.html'
  }).
  when('/article', {
    controller: lemon.ctrls.article,
    templateUrl: '../../views/article.html'
  }).
  otherwise({
    redirectTo: '/clipper'
  });
});
